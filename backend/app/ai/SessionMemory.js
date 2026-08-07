const Chat = require('../models/Chat.model');

class SessionMemory {
  async getSessionHistory(userId, maxTurns = 10) {
    try {
      const chat = await Chat.findOne({ user: userId }).lean();
      if (!chat || !Array.isArray(chat.messages)) return [];

      return chat.messages.slice(-maxTurns);
    } catch (err) {
      console.warn('[SessionMemory] Fetch history warning:', err.message);
      return [];
    }
  }

  async appendTurn(userId, userMessage, aiMessage, activeSkill) {
    try {
      let chat = await Chat.findOne({ user: userId });
      if (!chat) {
        chat = new Chat({ user: userId, messages: [] });
      }

      chat.messages.push({ role: 'user', content: userMessage });
      chat.messages.push({ role: 'ai', content: aiMessage });
      if (activeSkill) chat.activeSkill = activeSkill;
      chat.updatedAt = Date.now();

      await chat.save();
      return chat;
    } catch (err) {
      console.warn('[SessionMemory] Append turn warning:', err.message);
      return null;
    }
  }

  async clearMemory(userId) {
    try {
      await Chat.findOneAndDelete({ user: userId });
      return true;
    } catch (err) {
      return false;
    }
  }
}

module.exports = new SessionMemory();
