const mongoose = require('mongoose');
const LearningProgress = require('../models/LearningProgress.model');
const LearningGraphNode = require('../models/LearningGraphNode.model');
const LearningGoal = require('../models/LearningGoal.model');
const LearningNote = require('../models/LearningNote.model');
const LearningBookmark = require('../models/LearningBookmark.model');
const { profileService } = require('./profile.service');
const logger = require('../core/logger/logger');
const { ValidationError, ForbiddenError } = require('../core/errors/app.error');

// Default Seed Graph Nodes for Advanced Algorithms & Aptitude
const SEED_GRAPH_NODES = [
  {
    subjectId: 'adv-algorithms',
    chapterId: 'dynamic-programming',
    lessonId: 'dp-introduction',
    topic: 'Dynamic Programming Overview',
    difficulty: 'Medium',
    prerequisites: [],
    masteryThreshold: 80,
    estimatedMinutes: 10,
    pointsAwarded: 50
  },
  {
    subjectId: 'adv-algorithms',
    chapterId: 'dynamic-programming',
    lessonId: 'memoization-basics',
    topic: 'Memoization',
    difficulty: 'Medium',
    prerequisites: ['dp-introduction'],
    masteryThreshold: 80,
    estimatedMinutes: 15,
    pointsAwarded: 70
  },
  {
    subjectId: 'adv-algorithms',
    chapterId: 'dynamic-programming',
    lessonId: 'tabulation-patterns',
    topic: 'Tabulation',
    difficulty: 'Pro',
    prerequisites: ['memoization-basics'],
    masteryThreshold: 85,
    estimatedMinutes: 20,
    pointsAwarded: 100
  }
];

class LearningService {
  constructor() {
    this.seedDefaultNodes();
  }

  async seedDefaultNodes() {
    if (mongoose.connection.readyState !== 1) return;
    try {
      for (const nodeData of SEED_GRAPH_NODES) {
        await LearningGraphNode.findOneAndUpdate(
          { lessonId: nodeData.lessonId },
          nodeData,
          { upsert: true, setDefaultsOnInsert: true }
        );
      }
    } catch (err) {
      logger.error('Error seeding learning graph nodes', { error: err.message });
    }
  }

  // 1. Learning Graph & Prerequisite Integrity Check
  async validatePrerequisites(userId, lessonId) {
    let node = null;
    let completedProgress = [];

    if (mongoose.connection.readyState === 1) {
      node = await LearningGraphNode.findOne({ lessonId });
    }
    if (!node) {
      node = SEED_GRAPH_NODES.find(n => n.lessonId === lessonId);
    }

    if (!node || !node.prerequisites || node.prerequisites.length === 0) {
      return true; // No prerequisites required
    }

    if (mongoose.connection.readyState === 1) {
      completedProgress = await LearningProgress.find({
        userId,
        lessonId: { $in: node.prerequisites },
        status: 'COMPLETED'
      });
    }

    const completedLessonIds = new Set(completedProgress.map(p => p.lessonId));
    const missing = node.prerequisites.filter(reqId => !completedLessonIds.has(reqId));

    if (missing.length > 0) {
      throw new ForbiddenError(
        `Learning Integrity Protected: You must complete prerequisite lesson(s) [${missing.join(', ')}] before accessing ${node.topic || lessonId}.`
      );
    }

    return true;
  }

  async getLearningGraph(userId, subjectId) {
    let nodes = [];
    let userProgress = [];

    if (mongoose.connection.readyState === 1) {
      const query = subjectId ? { subjectId } : {};
      nodes = await LearningGraphNode.find(query);
      userProgress = await LearningProgress.find({ userId });
    }

    if (nodes.length === 0) {
      nodes = SEED_GRAPH_NODES.filter(n => !subjectId || n.subjectId === subjectId);
    }

    const progressMap = new Map(userProgress.map(p => [p.lessonId, p]));

    return nodes.map(node => {
      const nodeObj = typeof node.toObject === 'function' ? node.toObject() : node;
      const prog = progressMap.get(nodeObj.lessonId);
      
      const missingPrereqs = (nodeObj.prerequisites || []).filter(pr => {
        const p = progressMap.get(pr);
        return !p || p.status !== 'COMPLETED';
      });

      return {
        ...nodeObj,
        status: prog?.status || 'NOT_STARTED',
        completionPercentage: prog?.completionPercentage || 0,
        isUnlocked: missingPrereqs.length === 0,
        missingPrerequisites: missingPrereqs
      };
    });
  }

  // 2. Learning Progress Engine
  async recordProgress(userId, data) {
    const { subjectId, chapterId, lessonId, completionPercentage = 0, scrollPosition = 0, timeSpentSeconds = 0, status } = data;

    if (!subjectId || !chapterId || !lessonId) {
      throw new ValidationError('subjectId, chapterId, and lessonId are required');
    }

    // Validate prerequisite integrity
    await this.validatePrerequisites(userId, lessonId);

    let existing = null;
    if (mongoose.connection.readyState === 1) {
      existing = await LearningProgress.findOne({ userId, lessonId });
    }

    const isNowCompleted = status === 'COMPLETED' || completionPercentage >= 100;
    const wasAlreadyCompleted = existing?.status === 'COMPLETED';

    const updateFields = {
      userId,
      subjectId,
      chapterId,
      lessonId,
      completionPercentage: Math.max(existing?.completionPercentage || 0, completionPercentage),
      scrollPosition,
      timeSpentSeconds: (existing?.timeSpentSeconds || 0) + timeSpentSeconds,
      status: isNowCompleted ? 'COMPLETED' : (existing?.status || 'IN_PROGRESS'),
      lastAccessedAt: new Date()
    };

    if (isNowCompleted && !wasAlreadyCompleted) {
      updateFields.completedAt = new Date();
      updateFields.completionPercentage = 100;
    }

    let progress = updateFields;
    if (mongoose.connection.readyState === 1) {
      progress = await LearningProgress.findOneAndUpdate(
        { userId, lessonId },
        { $set: updateFields },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    if (isNowCompleted && !wasAlreadyCompleted) {
      const xpEarned = 50;

      await profileService.logJourneyActivity(
        userId,
        'LEARNING',
        'COMPLETED_LESSON',
        `Completed Lesson: ${lessonId}`,
        `Studied ${subjectId} / ${chapterId}`,
        xpEarned,
        { subjectId, chapterId, lessonId }
      );

      const profile = await profileService.getOrCreateProfile(userId);
      profile.statistics.learning.lessonsCompleted = (profile.statistics.learning.lessonsCompleted || 0) + 1;
      profile.statistics.learning.totalStudyTimeMinutes += Math.round(timeSpentSeconds / 60);
      await profile.save();

      await profileService.evaluateAchievements(userId);
    }

    return progress;
  }

  // 3. Resume Learning Engine
  async getResumeLearning(userId) {
    let lastProgress = null;
    if (mongoose.connection.readyState === 1) {
      lastProgress = await LearningProgress.findOne({ userId })
        .sort({ lastAccessedAt: -1 });
    }

    if (!lastProgress) {
      return {
        hasResumeData: false,
        recommendedSubjectId: 'adv-algorithms',
        recommendedChapterId: 'dynamic-programming',
        recommendedLessonId: 'dp-introduction'
      };
    }

    return {
      hasResumeData: true,
      subjectId: lastProgress.subjectId,
      chapterId: lastProgress.chapterId,
      lessonId: lastProgress.lessonId,
      completionPercentage: lastProgress.completionPercentage,
      scrollPosition: lastProgress.scrollPosition,
      status: lastProgress.status,
      lastAccessedAt: lastProgress.lastAccessedAt
    };
  }

  // 4. Learning Goal System
  async createGoal(userId, goalData) {
    const { title, targetSubjectId, targetCompletionDate, dailyStudyTimeGoalMinutes } = goalData;
    if (!title || !targetSubjectId || !targetCompletionDate) {
      throw new ValidationError('Title, target subject, and target completion date are required');
    }

    let goal = {
      userId,
      title,
      targetSubjectId,
      targetCompletionDate: new Date(targetCompletionDate),
      dailyStudyTimeGoalMinutes: dailyStudyTimeGoalMinutes || 30
    };

    if (mongoose.connection.readyState === 1) {
      goal = await LearningGoal.create(goal);
    }

    await profileService.logJourneyActivity(
      userId,
      'LEARNING',
      'CREATED_GOAL',
      `Set Learning Goal: ${title}`,
      `Target completion: ${new Date(targetCompletionDate).toLocaleDateString()}`,
      20
    );

    return goal;
  }

  async getGoals(userId) {
    if (mongoose.connection.readyState === 1) {
      return await LearningGoal.find({ userId }).sort({ createdAt: -1 });
    }
    return [];
  }

  // 5. AI Notes Engine
  async createNote(userId, noteData) {
    const { subjectId, lessonId, content, tags } = noteData;
    if (!subjectId || !lessonId || !content) {
      throw new ValidationError('Subject, lesson, and content are required');
    }

    const aiSummary = `AI Executive Summary: ${content.length > 80 ? content.substring(0, 80) + '...' : content}`;

    let note = {
      userId,
      subjectId,
      lessonId,
      content,
      aiSummary,
      tags: tags || ['study-notes']
    };

    if (mongoose.connection.readyState === 1) {
      note = await LearningNote.create(note);
    }

    await profileService.addAiNote(userId, `[Note on ${lessonId}]: ${aiSummary}`);

    return note;
  }

  async getNotes(userId, lessonId) {
    if (mongoose.connection.readyState === 1) {
      const query = { userId };
      if (lessonId) query.lessonId = lessonId;
      return await LearningNote.find(query).sort({ createdAt: -1 });
    }
    return [];
  }

  // 6. Smart Bookmark System
  async toggleBookmark(userId, bookmarkData) {
    const { subjectId, chapterId, lessonId, blockId, note } = bookmarkData;
    if (!subjectId || !chapterId || !lessonId) {
      throw new ValidationError('Subject, chapter, and lesson IDs are required');
    }

    if (mongoose.connection.readyState === 1) {
      const existing = await LearningBookmark.findOne({ userId, lessonId, blockId: blockId || null });
      if (existing) {
        await LearningBookmark.deleteOne({ _id: existing._id });
        return { isBookmarked: false, message: 'Bookmark removed' };
      }

      const bookmark = await LearningBookmark.create({
        userId,
        subjectId,
        chapterId,
        lessonId,
        blockId: blockId || null,
        note: note || ''
      });

      return { isBookmarked: true, bookmark, message: 'Bookmarked successfully' };
    }

    return { isBookmarked: true, message: 'Bookmarked successfully (mock mode)' };
  }

  async getBookmarks(userId) {
    if (mongoose.connection.readyState === 1) {
      return await LearningBookmark.find({ userId }).sort({ createdAt: -1 });
    }
    return [];
  }

  // 7. Smart Recommendations Engine
  async getRecommendations(userId) {
    const graphNodes = await this.getLearningGraph(userId);
    const profile = await profileService.getOrCreateProfile(userId);
    const weakTopics = new Set(profile.aiMemory.weakTopics.map(w => w.topic.toLowerCase()));

    const available = graphNodes.filter(n => n.isUnlocked && n.status !== 'COMPLETED');

    available.sort((a, b) => {
      const aIsWeak = weakTopics.has(a.topic.toLowerCase()) ? 1 : 0;
      const bIsWeak = weakTopics.has(b.topic.toLowerCase()) ? 1 : 0;
      return bIsWeak - aIsWeak;
    });

    return available.slice(0, 4);
  }
}

const learningService = new LearningService();
module.exports = {
  learningService,
  LearningService
};
