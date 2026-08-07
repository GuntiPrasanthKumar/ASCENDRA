const AIGateway = require('./AIGateway');
const ContextEngine = require('./ContextEngine');
const SessionMemory = require('./SessionMemory');
const LongTermMemory = require('./LongTermMemory');
const PromptBuilder = require('./PromptBuilder');
const RecommendationEngine = require('./RecommendationEngine');
const StreamingSupport = require('./StreamingSupport');

class AIService {
  async chat(userId, userMessage, activeSkill = 'general') {
    const userContext = await ContextEngine.assembleUserContext(userId);
    const chatHistory = await SessionMemory.getSessionHistory(userId, 8);

    const prompt = PromptBuilder.buildTutorPrompt({
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
      await SessionMemory.appendTurn(userId, userMessage, response.data, activeSkill);
    }

    return response;
  }

  async discoverKnowledge(userId, query) {
    const prompt = PromptBuilder.buildDiscoveryPrompt(query);

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
    const prompt = PromptBuilder.buildAssessmentPrompt({ subject, topic, numQuestions });

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
    const recommendations = await RecommendationEngine.generatePersonalizedRecommendations(userId);
    return recommendations;
  }

  async streamChat(userId, userMessage, activeSkill, res) {
    const userContext = await ContextEngine.assembleUserContext(userId);
    const chatHistory = await SessionMemory.getSessionHistory(userId, 6);

    const prompt = PromptBuilder.buildTutorPrompt({
      userContext,
      chatHistory,
      userMessage,
      domain: activeSkill
    });

    await StreamingSupport.streamResponse(res, userId, 'chat_stream', prompt);
  }

  async clearMemory(userId) {
    return await SessionMemory.clearMemory(userId);
  }
}

module.exports = new AIService();
