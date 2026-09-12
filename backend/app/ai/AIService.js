const AIGateway = require('./AIGateway');
const ContextEngine = require('./ContextEngine');
const MemoryEngine = require('./MemoryEngine');
const ConversationEngine = require('./ConversationEngine');
const PromptRegistry = require('./PromptRegistry');
const RecommendationEngine = require('./RecommendationEngine');
const StreamingSupport = require('./StreamingSupport');

class AIService {
  async chat(userId, userMessage, activeSkill = 'general') {
    return await ConversationEngine.processTurn(userId, userMessage, activeSkill);
  }

  async discoverKnowledge(userId, query) {
    const prompt = PromptRegistry.getPrompt('discovery', { query });

    return await AIGateway.processRequest({
      userId,
      promptType: 'knowledge_discovery',
      prompt,
      isJson: true,
      useCache: true,
      cacheTtlMs: 30 * 60 * 1000 // 30 mins cache
    });
  }

  async generateAssessment(userId, subject, topic, numQuestions = 20) {
    const prompt = PromptRegistry.getPrompt('assessment', { subject, topic, numQuestions });

    return await AIGateway.processRequest({
      userId,
      promptType: 'assessment_generation',
      prompt,
      isJson: true,
      useCache: true,
      cacheTtlMs: 60 * 60 * 1000 // 1 hour cache per subject/topic
    });
  }

  async getRecommendations(userId) {
    return await RecommendationEngine.generatePersonalizedRecommendations(userId);
  }

  async streamChat(userId, userMessage, activeSkill, res) {
    const userContext = await ContextEngine.assembleUserContext(userId);
    const chatHistory = await MemoryEngine.getSessionHistory(userId, 6);

    const prompt = PromptRegistry.getPrompt('tutor', {
      userContext,
      chatHistory,
      userMessage,
      domain: activeSkill
    });

    await StreamingSupport.streamResponse(res, userId, 'chat_stream', prompt);
  }

  async clearMemory(userId) {
    return await MemoryEngine.clearSessionMemory(userId);
  }
}

module.exports = new AIService();
