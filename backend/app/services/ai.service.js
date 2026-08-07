const AIService = require('../ai/AIService');

const discoverKnowledgeAI = async (query) => {
  const result = await AIService.discoverKnowledge('system', query);
  if (result.success && result.data) {
    return result.data;
  }
  throw new Error(result.error?.message || 'Knowledge discovery failed');
};

const generateAssessmentAI = async (subject, topic) => {
  const result = await AIService.generateAssessment('system', subject, topic, 20);
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  }
  throw new Error(result.error?.message || 'Assessment generation failed');
};

module.exports = { generateAssessmentAI, discoverKnowledgeAI };
