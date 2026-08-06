const mongoose = require('mongoose');
const AssessmentSession = require('../models/AssessmentSession.model');
const AssessmentResult = require('../models/AssessmentResult.model');
const { profileService } = require('./profile.service');
const logger = require('../core/logger/logger');
const { eventBus, DOMAIN_EVENTS } = require('../core/events/event.bus');
const { ValidationError, NotFoundError, ForbiddenError } = require('../core/errors/app.error');

// Seeded Pseudo-Random Number Generator for Candidate Question Shuffling
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function shuffleWithSeed(array, seed) {
  const arr = [...array];
  let m = arr.length, t, i;
  let s = seed;
  while (m) {
    i = Math.floor(seededRandom(s++) * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

class AssessmentEngineService {

  // 1. Start / Initialize Assessment Session Lifecycle
  async startAssessment(userId, data) {
    const { subject, topic, timeLimitMinutes = 20, questions = [] } = data;

    if (!subject || !topic) {
      throw new ValidationError('Subject and topic are required to launch assessment session');
    }

    // Check if there is already an ACTIVE session for this user and topic
    if (mongoose.connection.readyState === 1) {
      const activeSession = await AssessmentSession.findOne({
        userId,
        topic,
        status: 'ACTIVE',
        expiresAt: { $gt: new Date() }
      });

      if (activeSession) {
        return this.formatSessionPayload(activeSession);
      }
    }

    const seed = Math.floor(Math.random() * 1000000);
    const expiresAt = new Date(Date.now() + timeLimitMinutes * 60 * 1000);

    // Randomize Questions using candidate seed
    const rawQuestions = questions.length > 0 ? questions : this.getDefaultQuestions(topic);
    const shuffledQuestions = shuffleWithSeed(rawQuestions, seed).map((q, idx) => ({
      id: q.id || `q-${idx + 1}`,
      text: q.text,
      options: q.options || [],
      correctIdx: q.correctIdx ?? 0,
      explanation: q.explanation || '',
      difficulty: q.difficulty || 'Medium',
      points: q.points || 10
    }));

    const defaultSection = {
      sectionId: 'sec-general',
      title: `${topic} Core Section`,
      timeLimitMinutes,
      questions: shuffledQuestions
    };

    let session = {
      userId,
      subject,
      topic,
      status: 'ACTIVE',
      sections: [defaultSection],
      answers: new Map(),
      seed,
      timeLimitMinutes,
      startedAt: new Date(),
      expiresAt,
      proctoringData: { strikes: 0, gazeStabilityAvg: 100, integrityScore: 100, isFlagged: false }
    };

    if (mongoose.connection.readyState === 1) {
      session = await AssessmentSession.create(session);
    }

    logger.info(`[ASSESSMENT ENGINE] Launched active session ${session._id || 'mock'} for user ${userId}`);
    return this.formatSessionPayload(session);
  }

  // Format session payload hiding correct answer indices during active testing
  formatSessionPayload(session) {
    const now = Date.now();
    const expiresAtMs = new Date(session.expiresAt).getTime();
    const remainingSeconds = Math.max(0, Math.floor((expiresAtMs - now) / 1000));

    const sanitizedSections = (session.sections || []).map(sec => ({
      sectionId: sec.sectionId,
      title: sec.title,
      timeLimitMinutes: sec.timeLimitMinutes,
      questions: (sec.questions || []).map(q => ({
        id: q.id,
        text: q.text,
        options: q.options,
        difficulty: q.difficulty,
        points: q.points
      }))
    }));

    return {
      sessionId: session._id || 'session-temp-1',
      subject: session.subject,
      topic: session.topic,
      status: session.status,
      sections: sanitizedSections,
      answers: session.answers || {},
      remainingSeconds,
      expiresAt: session.expiresAt
    };
  }

  // 2. Auto Save & Recovery Engine
  async autoSaveProgress(userId, sessionId, answersData = {}) {
    if (mongoose.connection.readyState !== 1) {
      return { success: true, autoSavedAt: new Date().toISOString() };
    }

    const session = await AssessmentSession.findOne({ _id: sessionId, userId });
    if (!session) {
      throw new NotFoundError('Assessment session not found');
    }

    if (session.status === 'SUBMITTED' || session.status === 'EVALUATED') {
      throw new ForbiddenError('Cannot auto-save progress for an already submitted assessment');
    }

    // Check if server timer expired
    if (new Date() >= session.expiresAt) {
      session.status = 'EXPIRED';
      await session.save();
      return await this.evaluateAssessment(userId, sessionId);
    }

    // Update answers
    for (const [qId, ans] of Object.entries(answersData)) {
      session.answers.set(qId, {
        userAnswer: ans.userAnswer || '',
        selectedIdx: ans.selectedIdx ?? -1,
        timeSpentSeconds: ans.timeSpentSeconds || 0,
        confidence: ans.confidence || 'MEDIUM',
        autosavedAt: new Date()
      });
    }

    session.autoSavedAt = new Date();
    await session.save();

    return {
      success: true,
      autoSavedAt: session.autoSavedAt.toISOString(),
      remainingSeconds: Math.max(0, Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000))
    };
  }

  async recoverSession(userId, sessionId) {
    if (mongoose.connection.readyState !== 1) {
      return { hasActiveSession: false };
    }

    const session = await AssessmentSession.findOne({ _id: sessionId, userId });
    if (!session) {
      throw new NotFoundError('Session not found');
    }

    if (new Date() >= session.expiresAt && session.status === 'ACTIVE') {
      session.status = 'EXPIRED';
      await session.save();
      await this.evaluateAssessment(userId, sessionId);
    }

    return this.formatSessionPayload(session);
  }

  // 3. Marking & Evaluation Engine
  async evaluateAssessment(userId, sessionId) {
    let session = null;
    if (mongoose.connection.readyState === 1) {
      session = await AssessmentSession.findOne({ _id: sessionId, userId });
    }

    if (!session) {
      return this.getMockEvaluationResult();
    }

    if (session.status === 'EVALUATED') {
      return session.evaluation;
    }

    const allQuestions = [];
    (session.sections || []).forEach(sec => allQuestions.push(...sec.questions));

    let totalQuestions = allQuestions.length;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unanswered = 0;
    let rawScore = 0;
    let details = [];

    allQuestions.forEach(q => {
      const ansObj = session.answers.get(q.id);
      const selectedIdx = ansObj ? ansObj.selectedIdx : -1;

      if (selectedIdx === -1) {
        unanswered++;
        details.push({
          question: q.text,
          userAnswer: 'Unanswered',
          correctAnswer: q.options[q.correctIdx] || '',
          isCorrect: false,
          explanation: q.explanation || 'No answer submitted'
        });
      } else if (selectedIdx === q.correctIdx) {
        correctAnswers++;
        rawScore += q.points || 10;
        details.push({
          question: q.text,
          userAnswer: q.options[selectedIdx] || '',
          correctAnswer: q.options[q.correctIdx] || '',
          isCorrect: true,
          explanation: q.explanation || 'Correct solution'
        });
      } else {
        incorrectAnswers++;
        details.push({
          question: q.text,
          userAnswer: q.options[selectedIdx] || '',
          correctAnswer: q.options[q.correctIdx] || '',
          isCorrect: false,
          explanation: q.explanation || 'Incorrect answer'
        });
      }
    });

    const negativeDeductions = Math.round(incorrectAnswers * 2.5);
    const finalScore = Math.max(0, rawScore - negativeDeductions);
    const accuracyPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Consume Proctoring integrity score from proctoring session
    const strikes = session.proctoringData?.strikes || 0;
    const integrityScore = Math.max(0, 100 - (strikes * 15));

    const evaluation = {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      unanswered,
      rawScore,
      negativeDeductions,
      finalScore,
      accuracyPercentage
    };

    const aiFeedback = {
      summary: `Performance evaluated with ${accuracyPercentage}% accuracy. Integrity score: ${integrityScore}%.`,
      strengths: accuracyPercentage >= 70 ? ['Strong conceptual grasp', 'Time management'] : ['Consistent participation'],
      weaknesses: accuracyPercentage < 70 ? ['Complex multi-step problems', 'Option elimination accuracy'] : [],
      recommendations: ['Review incorrectly answered questions in Review Mode', 'Practice weak topic quizzes in Practice Engine']
    };

    session.status = 'EVALUATED';
    session.completedAt = new Date();
    session.evaluation = evaluation;
    session.aiFeedback = aiFeedback;
    session.proctoringData.integrityScore = integrityScore;
    await session.save();

    // Save Historical AssessmentResult
    await AssessmentResult.create({
      user: userId,
      subject: session.subject,
      topic: session.topic,
      level: 'Medium',
      score: finalScore,
      totalQuestions,
      accuracy: accuracyPercentage,
      strikes,
      details,
      completedAt: new Date()
    });

    // Update Single Source Stats in StudentProfile & Dispatch Event
    await profileService.recordPracticeActivity(userId, {
      subject: session.subject,
      topic: session.topic,
      score: finalScore,
      accuracy: accuracyPercentage,
      totalQuestions
    });

    eventBus.publish(DOMAIN_EVENTS.ASSESSMENT_COMPLETED, {
      userId,
      subject: session.subject,
      topic: session.topic,
      score: finalScore,
      accuracy: accuracyPercentage
    });

    return {
      sessionId: session._id,
      evaluation,
      aiFeedback,
      proctoringData: session.proctoringData
    };
  }

  // 4. Review Workflow
  async getReview(userId, sessionId) {
    if (mongoose.connection.readyState !== 1) {
      return { success: true, message: 'Mock review session' };
    }

    const session = await AssessmentSession.findOne({ _id: sessionId, userId });
    if (!session) {
      throw new NotFoundError('Session not found');
    }

    return {
      sessionId: session._id,
      subject: session.subject,
      topic: session.topic,
      evaluation: session.evaluation,
      aiFeedback: session.aiFeedback,
      proctoringData: session.proctoringData,
      sections: session.sections
    };
  }

  getDefaultQuestions(topic) {
    return [
      {
        id: 'q-1',
        text: `In ${topic}, what is the main optimization criteria?`,
        options: ['Overlapping subproblems', 'Linear search', 'Random allocation', 'None'],
        correctIdx: 0,
        explanation: 'Overlapping subproblems enable caching results to prevent redundant calculations.'
      },
      {
        id: 'q-2',
        text: `Which time complexity represents optimal table lookup in ${topic}?`,
        options: ['O(1)', 'O(N^3)', 'O(2^N)', 'O(N!)'],
        correctIdx: 0,
        explanation: 'Direct index or map key lookup operates in O(1) constant time.'
      }
    ];
  }

  getMockEvaluationResult() {
    return {
      totalQuestions: 10,
      correctAnswers: 8,
      incorrectAnswers: 2,
      unanswered: 0,
      rawScore: 80,
      negativeDeductions: 5,
      finalScore: 75,
      accuracyPercentage: 80
    };
  }
}

const assessmentEngineService = new AssessmentEngineService();
module.exports = {
  assessmentEngineService,
  AssessmentEngineService
};
