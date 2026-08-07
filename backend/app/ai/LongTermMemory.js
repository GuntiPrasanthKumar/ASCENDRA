const StudentProfile = require('../models/StudentProfile.model');

class LongTermMemory {
  async getStudentMemory(userId) {
    try {
      const profile = await StudentProfile.findOne({ user: userId }).lean();
      return {
        masteredTopics: profile?.masteredTopics || [],
        weakAreas: profile?.weakAreas || [],
        lastAssessmentDate: profile?.lastAssessmentDate || null,
        targetGoals: profile?.targetGoals || []
      };
    } catch (err) {
      return { masteredTopics: [], weakAreas: [] };
    }
  }

  async recordWeakArea(userId, topic) {
    try {
      await StudentProfile.findOneAndUpdate(
        { user: userId },
        { $addToSet: { weakAreas: topic } },
        { upsert: true }
      );
    } catch (err) {
      console.warn('[LongTermMemory] Record weak area warning:', err.message);
    }
  }

  async recordMasteredTopic(userId, topic) {
    try {
      await StudentProfile.findOneAndUpdate(
        { user: userId },
        { 
          $addToSet: { masteredTopics: topic },
          $pull: { weakAreas: topic }
        },
        { upsert: true }
      );
    } catch (err) {
      console.warn('[LongTermMemory] Record mastered topic warning:', err.message);
    }
  }
}

module.exports = new LongTermMemory();
