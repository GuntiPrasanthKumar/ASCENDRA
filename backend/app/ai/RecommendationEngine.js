const ContextEngine = require('./ContextEngine');
const AIGateway = require('./AIGateway');
const PromptBuilder = require('./PromptBuilder');

class RecommendationEngine {
  async generatePersonalizedRecommendations(userId) {
    const userContext = await ContextEngine.assembleUserContext(userId);

    const prompt = PromptBuilder.buildRecommendationPrompt({
      userProfile: { name: userContext.name, role: userContext.role },
      recentScores: userContext.recentScores,
      weakAreas: userContext.weakTopics
    });

    const response = await AIGateway.processRequest({
      userId,
      promptType: 'recommendations',
      prompt,
      isJson: true,
      useCache: true,
      cacheTtlMs: 15 * 60 * 1000 // 15 min cache
    });

    if (response.success && response.data) {
      return response.data;
    }

    // Heuristic fallback recommendations if AI service unavailable
    return {
      recommendedPathways: [
        {
          title: "Advanced Data Structures & Algorithms",
          reason: "Foundational mastery enhancement based on quiz performance",
          priority: "HIGH",
          estimatedMinutes: 30
        },
        {
          title: "System Architecture & Logic Design",
          reason: "Expand domain versatility across backend services",
          priority: "MEDIUM",
          estimatedMinutes: 20
        }
      ],
      focusGap: userContext.weakTopics?.[0] || "Dynamic Programming Recursion Optimization",
      suggestedPractice: "CodeLab Challenge #101: Dynamic Programming Checkpoint"
    };
  }
}

module.exports = new RecommendationEngine();
