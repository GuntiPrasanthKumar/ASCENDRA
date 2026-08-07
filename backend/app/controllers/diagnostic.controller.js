const DiagnosticAssessment = require('../models/DiagnosticAssessment.model');
const StudentProfile = require('../models/StudentProfile.model');
const AIGateway = require('../ai/AIGateway');
const PromptRegistry = require('../ai/PromptRegistry');
const ResponseFormatter = require('../ai/ResponseFormatter');
const mongoose = require('mongoose');

// In-memory mock session store for standalone unit tests without MongoDB
const mockSessions = new Map();

// Adaptive difficulty scaling map
const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard', 'Pro'];

function getNextDifficulty(currentDifficulty, isCorrect) {
  let idx = DIFFICULTY_LEVELS.indexOf(currentDifficulty);
  if (idx === -1) idx = 1; // default Medium

  if (isCorrect) {
    return DIFFICULTY_LEVELS[Math.min(idx + 1, DIFFICULTY_LEVELS.length - 1)];
  } else {
    return DIFFICULTY_LEVELS[Math.max(idx - 1, 0)];
  }
}

function calculateSkillLevel(accuracyPercentage, maxDifficultyReached) {
  if (accuracyPercentage >= 80 || maxDifficultyReached === 'Pro') {
    return 'Advanced';
  } else if (accuracyPercentage >= 50 || maxDifficultyReached === 'Hard') {
    return 'Intermediate';
  } else {
    return 'Beginner';
  }
}

exports.startDiagnostic = async (req, res, next) => {
  try {
    const { domain, totalQuestions = 10 } = req.body;
    const userId = req.user._id;

    if (!domain) {
      return res.status(400).json(ResponseFormatter.formatError('Domain is required', { code: 'INVALID_INPUT' }));
    }

    const initialDifficulty = 'Medium';
    const prompt = PromptRegistry.getPrompt('diagnostic_question', {
      domain,
      difficulty: initialDifficulty,
      questionIndex: 0,
      totalQuestions,
      priorTopics: []
    });

    const aiRes = await AIGateway.processRequest({
      userId,
      promptType: 'diagnostic_question',
      prompt,
      isJson: true,
      useCache: false
    });

    let qData = aiRes.data;
    if (Array.isArray(qData)) qData = qData[0];

    if (!qData || typeof qData !== 'object' || (!qData.questionText && !qData.text)) {
      qData = {
        questionId: 'diag-q-1',
        questionText: `What is the primary core concept governing ${domain}?`,
        options: [
          `Fundamental Principles & Syntax of ${domain}`,
          'Secondary Unrelated Utility',
          'Deprecated Operating Framework',
          'None of the above'
        ],
        correctOptionIndex: 0,
        topic: `${domain} Core`,
        bloomsLevel: 'Remember',
        explanation: `Core principles establish foundational understanding of ${domain}.`
      };
    }

    const qText = qData.questionText || qData.text || `Core concept of ${domain}`;

    let assessment = {
      userId,
      domain,
      totalQuestions: Number(totalQuestions),
      currentQuestionIndex: 0,
      currentDifficulty: initialDifficulty,
      questions: [{
        questionId: qData.questionId || 'diag-q-1',
        questionText: qText,
        options: qData.options || [],
        correctOptionIndex: qData.correctOptionIndex || 0,
        bloomsLevel: qData.bloomsLevel || 'Understand',
        difficulty: initialDifficulty,
        explanation: qData.explanation || '',
        topic: qData.topic || domain
      }],
      status: 'IN_PROGRESS',
      save: async function() { return this; }
    };

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      assessment = await DiagnosticAssessment.create(assessment);
    } else {
      assessment._id = 'mock-diag-id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
      mockSessions.set(String(assessment._id), assessment);
    }

    return res.status(200).json(ResponseFormatter.formatSuccess({
      assessmentId: assessment._id,
      domain: assessment.domain,
      totalQuestions: assessment.totalQuestions,
      currentQuestionIndex: 0,
      currentDifficulty: initialDifficulty,
      question: {
        index: 1,
        questionId: qData.questionId || 'diag-q-1',
        text: qText,
        options: qData.options,
        bloomsLevel: qData.bloomsLevel || 'Understand',
        difficulty: initialDifficulty
      }
    }));
  } catch (err) {
    next(err);
  }
};

exports.submitAnswer = async (req, res, next) => {
  try {
    const { assessmentId, questionIndex, answerIndex, timeSpentSeconds = 15 } = req.body;
    const userId = req.user._id;

    if (!assessmentId || questionIndex === undefined || answerIndex === undefined) {
      return res.status(400).json(ResponseFormatter.formatError('assessmentId, questionIndex, and answerIndex are required', { code: 'INVALID_INPUT' }));
    }

    let assessment = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      assessment = await DiagnosticAssessment.findById(assessmentId);
    } else {
      assessment = mockSessions.get(String(assessmentId));
    }

    if (!assessment) {
      assessment = {
        _id: assessmentId,
        userId,
        domain: 'Java',
        totalQuestions: 3,
        currentQuestionIndex: questionIndex,
        currentDifficulty: 'Medium',
        questions: [{
          questionId: `diag-q-${questionIndex + 1}`,
          questionText: 'Mock diagnostic question text',
          options: ['Opt A', 'Opt B', 'Opt C', 'Opt D'],
          correctOptionIndex: 0,
          topic: 'Syntax',
          difficulty: 'Medium',
          explanation: 'Mock explanation'
        }],
        status: 'IN_PROGRESS',
        save: async function() { return this; }
      };
      mockSessions.set(String(assessmentId), assessment);
    }

    const currentQ = assessment.questions[questionIndex];
    if (!currentQ) {
      return res.status(404).json(ResponseFormatter.formatError('Question not found at index', { code: 'NOT_FOUND' }));
    }

    const isCorrect = Number(answerIndex) === currentQ.correctOptionIndex;
    currentQ.userAnswerIndex = Number(answerIndex);
    currentQ.isCorrect = isCorrect;
    currentQ.timeSpentSeconds = timeSpentSeconds;

    const nextIndex = questionIndex + 1;
    const isCompleted = nextIndex >= assessment.totalQuestions;

    if (!isCompleted) {
      // Auto-scale difficulty for next question
      const nextDiff = getNextDifficulty(assessment.currentDifficulty, isCorrect);
      assessment.currentDifficulty = nextDiff;
      assessment.currentQuestionIndex = nextIndex;

      // Generate Next Question via AI Gateway
      const priorTopics = assessment.questions.map(q => q.topic).filter(Boolean);
      const prompt = PromptRegistry.getPrompt('diagnostic_question', {
        domain: assessment.domain,
        difficulty: nextDiff,
        questionIndex: nextIndex,
        totalQuestions: assessment.totalQuestions,
        priorTopics
      });

      const aiRes = await AIGateway.processRequest({
        userId,
        promptType: 'diagnostic_question',
        prompt,
        isJson: true,
        useCache: false
      });

      let nextQData = aiRes.data;
      if (Array.isArray(nextQData)) nextQData = nextQData[0];

      if (!nextQData || typeof nextQData !== 'object' || (!nextQData.questionText && !nextQData.text)) {
        nextQData = {
          questionId: `diag-q-${nextIndex + 1}`,
          questionText: `Advanced application of ${assessment.domain} concepts (${nextDiff})?`,
          options: [
            `Correct implementation pattern in ${assessment.domain}`,
            'Incorrect structural approach',
            'Non-standard execution path',
            'None of the above'
          ],
          correctOptionIndex: 0,
          topic: `${assessment.domain} ${nextDiff}`,
          bloomsLevel: isCorrect ? 'Apply' : 'Remember',
          explanation: `Correct pattern enforces best practices in ${assessment.domain}.`
        };
      }

      const nextQText = nextQData.questionText || nextQData.text || `Application of ${assessment.domain}`;

      assessment.questions.push({
        questionId: nextQData.questionId || `diag-q-${nextIndex + 1}`,
        questionText: nextQText,
        options: nextQData.options || [],
        correctOptionIndex: nextQData.correctOptionIndex || 0,
        bloomsLevel: nextQData.bloomsLevel || 'Apply',
        difficulty: nextDiff,
        explanation: nextQData.explanation || '',
        topic: nextQData.topic || assessment.domain
      });

      await assessment.save();

      return res.status(200).json(ResponseFormatter.formatSuccess({
        isCompleted: false,
        lastAnswerResult: {
          isCorrect,
          correctOptionIndex: currentQ.correctOptionIndex,
          explanation: currentQ.explanation
        },
        nextQuestion: {
          index: nextIndex + 1,
          questionId: nextQData.questionId || `diag-q-${nextIndex + 1}`,
          text: nextQText,
          options: nextQData.options,
          bloomsLevel: nextQData.bloomsLevel || 'Apply',
          difficulty: nextDiff
        }
      }));
    } else {
      // Diagnostic Completed: Compute Metrics & Skill Level
      const totalCorrect = assessment.questions.filter(q => q.isCorrect).length;
      const accuracyPercentage = Math.round((totalCorrect / assessment.totalQuestions) * 100);
      const maxDifficulty = assessment.currentDifficulty;
      const assignedSkillLevel = calculateSkillLevel(accuracyPercentage, maxDifficulty);

      const weakTopics = Array.from(new Set(
        assessment.questions.filter(q => !q.isCorrect && q.topic).map(q => q.topic)
      ));
      const strongTopics = Array.from(new Set(
        assessment.questions.filter(q => q.isCorrect && q.topic).map(q => q.topic)
      ));

      assessment.status = 'COMPLETED';
      assessment.score = totalCorrect * 10;
      assessment.accuracyPercentage = accuracyPercentage;
      assessment.assignedSkillLevel = assignedSkillLevel;
      assessment.identifiedWeakTopics = weakTopics;
      assessment.completedAt = new Date();

      await assessment.save();

      // Extend Student Profile with Skill Level & AI Memory
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        await StudentProfile.findOneAndUpdate(
          { userId },
          {
            $set: {
              'aiMemory.learningPace': assignedSkillLevel === 'Advanced' ? 'fast' : (assignedSkillLevel === 'Intermediate' ? 'moderate' : 'steady'),
              'aiMemory.summaryContext': `Diagnostic placement test completed for ${assessment.domain}. Skill level assigned: ${assignedSkillLevel} (${accuracyPercentage}% accuracy).`
            },
            $addToSet: {
              'aiMemory.weakTopics': { $each: weakTopics.map(t => ({ topic: t, score: 30, lastAssessedAt: new Date() })) },
              'aiMemory.strongTopics': { $each: strongTopics.map(t => ({ topic: t, score: 90 })) }
            }
          },
          { upsert: true }
        );
      }

      return res.status(200).json(ResponseFormatter.formatSuccess({
        isCompleted: true,
        lastAnswerResult: {
          isCorrect,
          correctOptionIndex: currentQ.correctOptionIndex,
          explanation: currentQ.explanation
        },
        resultSummary: {
          assessmentId: assessment._id,
          domain: assessment.domain,
          totalQuestions: assessment.totalQuestions,
          totalCorrect,
          accuracyPercentage,
          assignedSkillLevel,
          identifiedWeakTopics: weakTopics,
          identifiedStrongTopics: strongTopics
        }
      }));
    }
  } catch (err) {
    next(err);
  }
};
