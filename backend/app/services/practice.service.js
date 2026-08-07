const mongoose = require('mongoose');
const AssessmentResult = require('../models/AssessmentResult.model');
const PracticeRetryQueue = require('../models/PracticeRetryQueue.model');
const PracticeQuestionAttempt = require('../models/PracticeQuestionAttempt.model');
const { profileService } = require('./profile.service');
const logger = require('../core/logger/logger');
const { eventBus, DOMAIN_EVENTS } = require('../core/events/event.bus');
const { ValidationError, NotFoundError } = require('../core/errors/app.error');

class PracticeService {

  // 1. Difficulty Scaling Engine
  getAdaptiveNextDifficulty(consecutiveCorrectCount = 0, currentDifficulty = 'Medium') {
    if (consecutiveCorrectCount >= 5) return 'Pro';
    if (consecutiveCorrectCount >= 3) return 'Hard';
    if (consecutiveCorrectCount >= 1) return 'Medium';
    return 'Easy';
  }

  // 2. Spaced Repetition Retry Engine (1d, 3d, 7d intervals)
  calculateSpacedRetryDate(attemptCount = 1) {
    const intervalsInDays = {
      1: 1, // 1 day
      2: 3, // 3 days
      3: 7  // 7 days
    };
    const daysToAdd = intervalsInDays[attemptCount] || 7;
    return new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
  }

  async scheduleSpacedRetry(userId, questionData, attemptCount = 1) {
    const nextRetryDate = this.calculateSpacedRetryDate(attemptCount);

    if (mongoose.connection.readyState === 1) {
      await PracticeRetryQueue.findOneAndUpdate(
        { userId, questionText: questionData.question },
        {
          userId,
          questionText: questionData.question,
          subject: questionData.subject || 'General Practice',
          topic: questionData.topic || 'General Practice',
          options: questionData.options || [],
          userAnswer: questionData.userAnswer || '',
          correctAnswer: questionData.correctAnswer || '',
          explanation: questionData.explanation || '',
          attemptCount,
          nextRetryDate,
          status: 'PENDING_RETRY'
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    
    logger.info(`[SPACED REPETITION] Queued question for retry for user ${userId} on ${nextRetryDate.toISOString()}`);
  }

  async getPendingRetries(userId) {
    if (mongoose.connection.readyState === 1) {
      return await PracticeRetryQueue.find({
        userId,
        status: 'PENDING_RETRY',
        nextRetryDate: { $lte: new Date() }
      }).sort({ nextRetryDate: 1 });
    }
    return [];
  }

  // 3. Weak Topic Engine
  async calculateWeakTopics(userId) {
    if (mongoose.connection.readyState !== 1) return [];

    const results = await AssessmentResult.find({ user: userId });
    const topicStats = {};

    results.forEach(r => {
      const topic = r.topic || 'General';
      if (!topicStats[topic]) {
        topicStats[topic] = { totalAcc: 0, count: 0 };
      }
      topicStats[topic].totalAcc += r.accuracy;
      topicStats[topic].count += 1;
    });

    const weakTopics = [];
    const strongTopics = [];

    for (const [topic, stat] of Object.entries(topicStats)) {
      const avgAcc = Math.round(stat.totalAcc / stat.count);
      if (avgAcc < 60) {
        weakTopics.push({ topic, score: avgAcc, count: stat.count });
      } else if (avgAcc >= 85) {
        strongTopics.push({ topic, score: avgAcc, count: stat.count });
      }
    }

    // Sync weak topics to StudentProfile AI Memory
    const profile = await profileService.getOrCreateProfile(userId);
    profile.aiMemory.weakTopics = weakTopics.map(w => ({ topic: w.topic, score: w.score, lastAssessedAt: new Date() }));
    profile.aiMemory.strongTopics = strongTopics.map(s => ({ topic: s.topic, score: s.score }));
    await profile.save();

    return { weakTopics, strongTopics };
  }

  // 4. Assessment Submission & Scoring Integrity
  async processAssessmentSubmission(userId, submissionData) {
    const { subject, topic, level, score, totalQuestions, strikes = 0, details = [] } = submissionData;

    if (!subject || !topic || score === undefined || !totalQuestions) {
      throw new ValidationError('Subject, topic, score, and totalQuestions are required');
    }

    const accuracy = Math.round((score / totalQuestions) * 100);
    let result = null;

    if (mongoose.connection.readyState === 1) {
      result = await AssessmentResult.create({
        user: userId,
        subject,
        topic,
        level: level || 'Medium',
        score,
        totalQuestions,
        accuracy,
        strikes,
        details
      });

      // Record individual question attempts & queue retries for incorrect/low confidence items
      for (const item of details) {
        try {
          await PracticeQuestionAttempt.create({
            userId,
            assessmentId: result._id,
            subject,
            topic,
            questionText: item.question,
            userAnswer: item.userAnswer || '',
            correctAnswer: item.correctAnswer || '',
            isCorrect: Boolean(item.isCorrect),
            confidence: item.confidence || 'MEDIUM',
            difficulty: level || 'Medium'
          });
        } catch (attemptErr) {
          // Ignore duplicate attempts if re-submitted
        }

        // Spaced Repetition Queueing for incorrect answers or LOW confidence
        if (!item.isCorrect || item.confidence === 'LOW') {
          await this.scheduleSpacedRetry(userId, { ...item, subject, topic }, 1);
        }
      }

      // Recalculate Weak Topics automatically
      await this.calculateWeakTopics(userId);
    }

    // Single Source of Truth Profile Update & Event Publishing
    const xpEarned = Math.round(score * 10);

    await profileService.recordPracticeActivity(userId, {
      subject,
      topic,
      score,
      accuracy,
      totalQuestions
    });

    eventBus.publish(DOMAIN_EVENTS.ASSESSMENT_COMPLETED, {
      userId,
      subject,
      topic,
      score,
      accuracy
    });

    return {
      result,
      accuracy,
      xpEarned,
      message: 'Assessment completed and adaptive metrics updated successfully'
    };
  }

  // 5. AI Step-by-Step Explanation Generator
  generateAiExplanation(questionText, correctAnswer, userAnswer) {
    if (!questionText || !correctAnswer) {
      throw new ValidationError('Question text and correct answer are required');
    }

    const isUserCorrect = String(userAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();

    return {
      questionText,
      correctAnswer,
      userAnswer,
      isUserCorrect,
      stepByStepBreakdown: [
        `Step 1: Identify the underlying core concept embedded in "${questionText.substring(0, 50)}...".`,
        `Step 2: Compare option criteria against problem constraints to isolate the valid answer: ${correctAnswer}.`,
        `Step 3: Evaluate common distractor patterns to avoid future pitfalls.`
      ],
      keyTakeaway: `Mastery of ${correctAnswer} requires recognizing constraint boundaries quickly during placement assessments.`,
      recommendedAction: isUserCorrect ? 'Maintain momentum by advancing to higher difficulty questions.' : 'Review related theory topics in Learning Module.'
    };
  }
}

const practiceService = new PracticeService();
module.exports = {
  practiceService,
  PracticeService
};
