const User = require('../models/User.model');
const StudentProfile = require('../models/StudentProfile.model');
const LearningProgress = require('../models/LearningProgress.model');
const AssessmentResult = require('../models/AssessmentResult.model');

class ContextEngine {
  async assembleUserContext(userId) {
    if (!userId) return null;

    try {
      const user = await User.findById(userId).select('name email role').lean();
      const profile = await StudentProfile.findOne({ user: userId }).lean();
      const progress = await LearningProgress.find({ user: userId }).lean();
      const recentResults = await AssessmentResult.find({ user: userId })
        .sort({ completedAt: -1 })
        .limit(5)
        .lean();

      const weakTopics = [];
      recentResults.forEach(r => {
        if (r.accuracy < 70 && r.topic) {
          weakTopics.push(r.topic);
        }
      });

      return {
        userId: String(userId),
        name: user?.name || 'Student',
        role: user?.role || 'student',
        streak: profile?.streakCount || 0,
        xp: profile?.xp || 0,
        weakTopics: Array.from(new Set(weakTopics)),
        recentScores: recentResults.map(r => ({ topic: r.topic, accuracy: r.accuracy })),
        totalLessonsCompleted: progress.filter(p => p.completed).length
      };
    } catch (err) {
      console.warn('[ContextEngine] Context assembly fallback:', err.message);
      return { userId: String(userId), name: 'Student', role: 'student' };
    }
  }
}

module.exports = new ContextEngine();
