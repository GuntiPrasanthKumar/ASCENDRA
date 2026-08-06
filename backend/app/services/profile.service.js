const StudentProfile = require('../models/StudentProfile.model');
const JourneyActivity = require('../models/JourneyActivity.model');
const User = require('../models/User.model');
const AssessmentResult = require('../models/AssessmentResult.model');
const logger = require('../core/logger/logger');
const { eventBus, DOMAIN_EVENTS } = require('../core/events/event.bus');
const { NotFoundError, ValidationError } = require('../core/errors/app.error');

// Master Achievement Badges Catalog
const BADGES_CATALOG = [
  {
    badgeId: 'FIRST_STEP',
    name: 'First Checkpoint',
    description: 'Completed your first learning module or assessment on ASCENDRA.',
    icon: '🎯',
    category: 'GENERAL'
  },
  {
    badgeId: 'STREAK_3',
    name: 'Momentum Builder',
    description: 'Maintained a 3-day continuous active learning streak.',
    icon: '⚡',
    category: 'STREAK'
  },
  {
    badgeId: 'STREAK_7',
    name: 'Unstoppable Scholar',
    description: 'Maintained a 7-day continuous active learning streak.',
    icon: '🔥',
    category: 'STREAK'
  },
  {
    badgeId: 'QUIZ_MASTER',
    name: 'Accuracy Champion',
    description: 'Achieved an average quiz score of 80%+ across 3+ practice sets.',
    icon: '🏆',
    category: 'PRACTICE'
  },
  {
    badgeId: 'CODE_NINJA',
    name: 'Monaco Code Master',
    description: 'Successfully solved 5+ coding algorithms in CodeLab.',
    icon: '💻',
    category: 'CODELAB'
  },
  {
    badgeId: 'INTERVIEW_PRO',
    name: 'Placement Ready',
    description: 'Completed a full AI Mock Interview with live proctoring.',
    icon: '🎓',
    category: 'INTERVIEW'
  }
];

class ProfileService {
  constructor() {
    this.registerEventSubscribers();
  }

  // Auto-subscribe to system domain events to update profile & journey timeline asynchronously
  registerEventSubscribers() {
    eventBus.subscribe(DOMAIN_EVENTS.USER_REGISTERED, async ({ userId }) => {
      try {
        await this.getOrCreateProfile(userId);
        await this.logJourneyActivity(userId, 'AUTH', 'ACCOUNT_CREATED', 'Joined ASCENDRA Platform', 'Initialized scholar profile dossier', 50);
      } catch (err) {
        logger.error(`Error initializing profile on USER_REGISTERED for ${userId}`, { error: err.message });
      }
    });

    eventBus.subscribe(DOMAIN_EVENTS.ASSESSMENT_COMPLETED, async ({ userId, subject, topic, score, accuracy }) => {
      try {
        await this.recordPracticeActivity(userId, { subject, topic, score, accuracy });
      } catch (err) {
        logger.error(`Error processing ASSESSMENT_COMPLETED for ${userId}`, { error: err.message });
      }
    });
  }

  // Get or Create Single Source of Truth Student Profile
  async getOrCreateProfile(userId) {
    let profile = await StudentProfile.findOne({ userId });
    if (!profile) {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      profile = await StudentProfile.create({
        userId,
        bio: `${user.department || 'CSE'} Scholar preparing for placement benchmarks`,
        statistics: {
          overallXp: user.total_score || 0,
          learning: { currentStreak: user.streak || 1, longestStreak: user.streak || 1 }
        }
      });

      logger.info(`[StudentProfile] Created new single-source profile for user ${userId}`);
    }
    return profile;
  }

  // Fetch Full Profile with User metadata
  async getProfileByUserId(userId) {
    const profile = await this.getOrCreateProfile(userId);
    const user = await User.findById(userId).select('-password_hash');
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        faceImage: user.faceImage
      },
      profile
    };
  }

  // Update Preferences & Target Role
  async updatePreferences(userId, updateData) {
    const profile = await this.getOrCreateProfile(userId);

    if (updateData.bio !== undefined) profile.bio = updateData.bio;
    if (updateData.targetRole !== undefined) profile.targetRole = updateData.targetRole;
    if (updateData.studyGoals !== undefined) profile.studyGoals = updateData.studyGoals;
    if (updateData.preferredLanguage !== undefined) profile.preferredLanguage = updateData.preferredLanguage;

    if (updateData.preferences) {
      if (updateData.preferences.theme) profile.preferences.theme = updateData.preferences.theme;
      if (updateData.preferences.notificationsEnabled !== undefined) {
        profile.preferences.notificationsEnabled = Boolean(updateData.preferences.notificationsEnabled);
      }
      if (updateData.preferences.proctoringStrictness) {
        profile.preferences.proctoringStrictness = updateData.preferences.proctoringStrictness;
      }
    }

    await profile.save();
    return profile;
  }

  // Unified Journey Activity Timeline Engine
  async logJourneyActivity(userId, module, action, title, description = '', xpEarned = 0, metadata = {}) {
    const activity = await JourneyActivity.create({
      userId,
      module,
      action,
      title,
      description,
      xpEarned,
      metadata
    });

    if (xpEarned > 0) {
      await this.addXpAndRecalculateStats(userId, xpEarned);
    }

    return activity;
  }

  async getJourneyTimeline(userId, options = {}) {
    const { page = 1, limit = 20, module } = options;
    const query = { userId };
    if (module) query.module = module;

    const skip = (page - 1) * limit;
    const [activities, total] = await Promise.all([
      JourneyActivity.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      JourneyActivity.countDocuments(query)
    ]);

    return {
      activities,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Record Practice Assessment Activity
  async recordPracticeActivity(userId, data) {
    const profile = await this.getOrCreateProfile(userId);
    const { subject, topic, score, accuracy } = data;

    // Update practice stats
    const practice = profile.statistics.practice;
    const currentTotal = practice.totalQuizzes || 0;
    const currentAvg = practice.averageAccuracyPercentage || 0;

    const newTotal = currentTotal + 1;
    const newAvg = Math.round(((currentAvg * currentTotal) + accuracy) / newTotal);

    practice.totalQuizzes = newTotal;
    practice.totalQuestionsAttempted = (practice.totalQuestionsAttempted || 0) + (data.totalQuestions || 5);
    practice.averageAccuracyPercentage = newAvg;

    // Update AI Memory weak/strong topics
    if (accuracy < 60) {
      const existingWeak = profile.aiMemory.weakTopics.find(w => w.topic.toLowerCase() === topic.toLowerCase());
      if (existingWeak) {
        existingWeak.score = accuracy;
        existingWeak.lastAssessedAt = new Date();
      } else {
        profile.aiMemory.weakTopics.push({ topic, score: accuracy, lastAssessedAt: new Date() });
      }
    } else if (accuracy >= 85) {
      const existingStrong = profile.aiMemory.strongTopics.find(s => s.topic.toLowerCase() === topic.toLowerCase());
      if (existingStrong) {
        existingStrong.score = accuracy;
      } else {
        profile.aiMemory.strongTopics.push({ topic, score: accuracy });
      }
    }

    await profile.save();

    // Log to Journey Timeline
    const xp = Math.round(accuracy * 1.5);
    await this.logJourneyActivity(
      userId,
      'PRACTICE',
      'COMPLETED_ASSESSMENT',
      `Completed ${subject}: ${topic}`,
      `Score: ${score} | Accuracy: ${accuracy}%`,
      xp,
      { subject, topic, score, accuracy }
    );

    // Evaluate Achievements
    await this.evaluateAchievements(userId);
  }

  // Rule-Based Achievement Engine
  async evaluateAchievements(userId) {
    const profile = await this.getOrCreateProfile(userId);
    const unlockedIds = new Set(profile.achievements.map(a => a.badgeId));
    const newUnlocked = [];

    const stats = profile.statistics;
    const journeyCount = await JourneyActivity.countDocuments({ userId });

    // Check Badge 1: FIRST_STEP
    if (!unlockedIds.has('FIRST_STEP') && journeyCount >= 1) {
      newUnlocked.push(BADGES_CATALOG.find(b => b.badgeId === 'FIRST_STEP'));
    }

    // Check Badge 2 & 3: STREAK_3 & STREAK_7
    if (!unlockedIds.has('STREAK_3') && stats.learning.currentStreak >= 3) {
      newUnlocked.push(BADGES_CATALOG.find(b => b.badgeId === 'STREAK_3'));
    }
    if (!unlockedIds.has('STREAK_7') && stats.learning.currentStreak >= 7) {
      newUnlocked.push(BADGES_CATALOG.find(b => b.badgeId === 'STREAK_7'));
    }

    // Check Badge 4: QUIZ_MASTER
    if (!unlockedIds.has('QUIZ_MASTER') && stats.practice.totalQuizzes >= 3 && stats.practice.averageAccuracyPercentage >= 80) {
      newUnlocked.push(BADGES_CATALOG.find(b => b.badgeId === 'QUIZ_MASTER'));
    }

    // Check Badge 5: CODE_NINJA
    if (!unlockedIds.has('CODE_NINJA') && stats.codelab.problemsSolved >= 5) {
      newUnlocked.push(BADGES_CATALOG.find(b => b.badgeId === 'CODE_NINJA'));
    }

    // Check Badge 6: INTERVIEW_PRO
    if (!unlockedIds.has('INTERVIEW_PRO') && stats.interview.mockInterviewsCompleted >= 1) {
      newUnlocked.push(BADGES_CATALOG.find(b => b.badgeId === 'INTERVIEW_PRO'));
    }

    // Unlock new badges
    for (const badge of newUnlocked) {
      if (!badge) continue;
      profile.achievements.push({
        badgeId: badge.badgeId,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        unlockedAt: new Date()
      });

      await this.logJourneyActivity(
        userId,
        'ACHIEVEMENT',
        'BADGE_UNLOCKED',
        `Unlocked Badge: ${badge.name}`,
        badge.description,
        150,
        { badgeId: badge.badgeId }
      );
    }

    if (newUnlocked.length > 0) {
      await profile.save();
    }

    return profile.achievements;
  }

  // Add XP and Recalculate Rank Levels
  async addXpAndRecalculateStats(userId, xpAmount) {
    const profile = await StudentProfile.findOne({ userId });
    if (!profile) return;

    profile.statistics.overallXp = (profile.statistics.overallXp || 0) + xpAmount;
    const xp = profile.statistics.overallXp;

    let rank = 'Novice Scholar';
    if (xp >= 3000) rank = 'ASCENDRA Legend';
    else if (xp >= 1500) rank = 'Master Engineer';
    else if (xp >= 800) rank = 'Specialist';
    else if (xp >= 300) rank = 'Scholar';

    profile.statistics.rankLevel = rank;
    await profile.save();

    // Also sync to User model
    await User.findByIdAndUpdate(userId, { total_score: xp });
  }

  // AI Memory & Recommendation Source Engine
  async getAiMemoryContext(userId) {
    const profile = await this.getOrCreateProfile(userId);
    return {
      weakTopics: profile.aiMemory.weakTopics,
      strongTopics: profile.aiMemory.strongTopics,
      notes: profile.aiMemory.notes,
      learningPace: profile.aiMemory.learningPace,
      summaryContext: profile.aiMemory.summaryContext,
      targetRole: profile.targetRole,
      preferredLanguage: profile.preferredLanguage,
      overallXp: profile.statistics.overallXp,
      rankLevel: profile.statistics.rankLevel
    };
  }

  async addAiNote(userId, note) {
    if (!note || typeof note !== 'string') {
      throw new ValidationError('Note content is required');
    }

    const profile = await this.getOrCreateProfile(userId);
    profile.aiMemory.notes.push(note.trim());
    await profile.save();

    return profile.aiMemory.notes;
  }

  // Unified Recommendation Context Extractor for Gemini AI Coach
  async getRecommendationProfile(userId) {
    const profile = await this.getOrCreateProfile(userId);
    const user = await User.findById(userId).select('name email department role');

    return {
      studentId: userId,
      name: user.name,
      department: user.department,
      targetRole: profile.targetRole,
      studyGoals: profile.studyGoals,
      rankLevel: profile.statistics.rankLevel,
      overallXp: profile.statistics.overallXp,
      statsSummary: {
        lessonsCompleted: profile.statistics.learning.lessonsCompleted,
        quizzesCompleted: profile.statistics.practice.totalQuizzes,
        avgAccuracy: `${profile.statistics.practice.averageAccuracyPercentage}%`,
        problemsSolved: profile.statistics.codelab.problemsSolved,
        interviewsCompleted: profile.statistics.interview.mockInterviewsCompleted
      },
      aiMemory: {
        weakTopics: profile.aiMemory.weakTopics.map(w => w.topic),
        strongTopics: profile.aiMemory.strongTopics.map(s => s.topic),
        learningPace: profile.aiMemory.learningPace
      },
      unlockedBadgesCount: profile.achievements.length
    };
  }
}

const profileService = new ProfileService();
module.exports = {
  profileService,
  ProfileService,
  BADGES_CATALOG
};
