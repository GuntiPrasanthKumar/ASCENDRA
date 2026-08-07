const AIService = require('../ai/AIService');
const ResponseFormatter = require('../ai/ResponseFormatter');

exports.chat = async (req, res, next) => {
  try {
    const { content, activeSkill } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json(ResponseFormatter.formatError('Message content is required', { code: 'INVALID_INPUT' }));
    }

    const response = await AIService.chat(userId, content, activeSkill);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.streamChat = async (req, res, next) => {
  try {
    const { content, activeSkill } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json(ResponseFormatter.formatError('Message content is required', { code: 'INVALID_INPUT' }));
    }

    await AIService.streamChat(userId, content, activeSkill, res);
  } catch (err) {
    next(err);
  }
};

exports.discover = async (req, res, next) => {
  try {
    const { query } = req.body;
    const userId = req.user._id;

    if (!query) {
      return res.status(400).json(ResponseFormatter.formatError('Query is required', { code: 'INVALID_INPUT' }));
    }

    const response = await AIService.discoverKnowledge(userId, query);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.generateAssessment = async (req, res, next) => {
  try {
    const { subject, topic, numQuestions } = req.body;
    const userId = req.user._id;

    if (!subject || !topic) {
      return res.status(400).json(ResponseFormatter.formatError('Subject and topic are required', { code: 'INVALID_INPUT' }));
    }

    const response = await AIService.generateAssessment(userId, subject, topic, numQuestions || 20);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const recommendations = await AIService.getRecommendations(userId);

    return res.status(200).json(ResponseFormatter.formatSuccess(recommendations, { provider: 'RecommendationEngine' }));
  } catch (err) {
    next(err);
  }
};

exports.clearMemory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await AIService.clearMemory(userId);

    return res.status(200).json(ResponseFormatter.formatSuccess({ cleared: true }));
  } catch (err) {
    next(err);
  }
};
