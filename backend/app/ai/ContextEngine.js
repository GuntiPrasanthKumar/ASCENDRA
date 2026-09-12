const mongoose = require('mongoose');
const User = require('../models/User.model');
const StudentProfile = require('../models/StudentProfile.model');
const LearningProgress = require('../models/LearningProgress.model');
const AssessmentResult = require('../models/AssessmentResult.model');
const AIMemory = require('../models/AIMemory.model');

class ContextEngine {
  async assembleUserContext(userId) {
    if (!userId) return null;

    let user = null;
    let profile = null;
    let progress = [];
    let memory = null;
    let recentResults = [];

    try {
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        user = await User.findById(userId).select('name email role').lean();
        profile = await StudentProfile.findOne({ user: userId }).lean();
        progress = await LearningProgress.find({ user: userId }).lean();
        memory = await AIMemory.findOne({ userId }).lean();
        recentResults = await AssessmentResult.find({ user: userId })
          .sort({ completedAt: -1 })
          .limit(5)
          .lean();
      }
    } catch (err) {
      console.warn('[ContextEngine] DB query warning:', err.message);
    }

    const weakTopics = [];
    recentResults.forEach(r => {
      if (r.accuracy < 70 && r.topic) {
        weakTopics.push(r.topic);
      }
    });
    if (memory?.weakTopics) {
      memory.weakTopics.forEach(t => weakTopics.push(t.topic));
    }

    return {
      userId: String(userId),
      name: user?.name || 'Student',
      role: user?.role || 'student',
      currentGoal: memory?.currentGoal || profile?.targetRole || 'Software Engineer',
      targetCompany: memory?.targetCompany || 'Tier 1 Tech',
      learningStyle: memory?.learningStyle || 'PRACTICAL',
      recurringMistakes: memory?.recurringMistakes || [],
      streak: profile?.streakCount || 0,
      xp: profile?.xp || 0,
      weakTopics: Array.from(new Set(weakTopics.filter(Boolean))),
      recentScores: recentResults.map(r => ({ topic: r.topic, accuracy: r.accuracy })),
      totalLessonsCompleted: progress.filter(p => p.completed).length
    };
  }
}

module.exports = new ContextEngine();
