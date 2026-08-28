const ContextEngine = require('./ContextEngine');
const MemoryEngine = require('./MemoryEngine');
const PromptRegistry = require('./PromptRegistry');
const AIGateway = require('./AIGateway');

class ConversationEngine {
  async processTurn(userId, userMessage, activeSkill = 'general') {
    const userContext = await ContextEngine.assembleUserContext(userId);
    const chatHistory = await MemoryEngine.getSessionHistory(userId, 8);

    const prompt = PromptRegistry.getPrompt('tutor', {
      userContext,
      chatHistory,
      userMessage,
      domain: activeSkill
    });

    const response = await AIGateway.processRequest({
      userId,
      promptType: 'chat',
      prompt,
      isJson: false,
      useCache: false
    });

    if (response.success && typeof response.data === 'string') {
      await MemoryEngine.appendTurn(userId, userMessage, response.data, activeSkill);
    }

    return response;
  }
}

module.exports = new ConversationEngine();
