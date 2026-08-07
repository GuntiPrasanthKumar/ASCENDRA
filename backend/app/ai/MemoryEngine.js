const SessionMemory = require('./SessionMemory');
const LongTermMemory = require('./LongTermMemory');
const AIMemory = require('../models/AIMemory.model');
const mongoose = require('mongoose');

class MemoryEngine {
  async getSessionHistory(userId, maxTurns = 10) {
    return await SessionMemory.getSessionHistory(userId, maxTurns);
  }

  async appendTurn(userId, userMessage, aiMessage, activeSkill) {
    return await SessionMemory.appendTurn(userId, userMessage, aiMessage, activeSkill);
  }

  async clearSessionMemory(userId) {
    return await SessionMemory.clearMemory(userId);
  }

  async getLongTermMemory(userId) {
    return await LongTermMemory.getStudentMemory(userId);
  }

  async recordWeakArea(userId, topic) {
    return await LongTermMemory.recordWeakArea(userId, topic);
  }

  async recordMasteredTopic(userId, topic) {
    return await LongTermMemory.recordMasteredTopic(userId, topic);
  }

  async getPersistentAIMemory(userId) {
    if (!userId || !mongoose.connection || mongoose.connection.readyState !== 1) {
      return {
        currentGoal: 'Full Stack Software Engineer',
        targetCompany: 'Tier 1 Tech',
        learningStyle: 'PRACTICAL',
        weakTopics: [],
        recurringMistakes: []
      };
    }

    let memory = await AIMemory.findOne({ userId }).lean();
    if (!memory) {
      memory = await AIMemory.create({ userId });
    }
    return memory;
  }

  async updatePersistentAIMemory(userId, updates = {}) {
    if (!userId || !mongoose.connection || mongoose.connection.readyState !== 1) {
      return null;
    }

    return await AIMemory.findOneAndUpdate(
      { userId },
      { $set: updates },
      { upsert: true, new: true }
    );
  }
}

module.exports = new MemoryEngine();
