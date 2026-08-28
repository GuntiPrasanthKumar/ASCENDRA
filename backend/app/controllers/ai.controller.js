const AIService = require('../ai/AIService');
const AIActionRegistry = require('../ai/AIActionRegistry');
const AIPlannerService = require('../ai/AIPlannerService');
const AIMemory = require('../models/AIMemory.model');
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

exports.executeAction = async (req, res, next) => {
  try {
    const { action, params, actionChain } = req.body;
    const userId = req.user._id;

    if (Array.isArray(actionChain) && actionChain.length > 0) {
      const results = await AIActionRegistry.executeChain(actionChain, { userId });
      return res.status(200).json(ResponseFormatter.formatSuccess({ actionChain: results }));
    }

    if (!action) {
      return res.status(400).json(ResponseFormatter.formatError('Action name is required', { code: 'INVALID_INPUT' }));
    }

    const result = await AIActionRegistry.executeAction(action, params || {}, { userId });

    // Handle memory updates if returned by action
    if (result.type === 'MEMORY_UPDATE' && result.updates) {
      await AIMemory.findOneAndUpdate(
        { userId },
        { $set: result.updates },
        { upsert: true }
      );
    }

    return res.status(200).json(ResponseFormatter.formatSuccess(result));
  } catch (err) {
    next(err);
  }
};

exports.getMemory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let memory = await AIMemory.findOne({ userId }).lean();
    if (!memory) {
      memory = await AIMemory.create({ userId });
    }
    return res.status(200).json(ResponseFormatter.formatSuccess(memory));
  } catch (err) {
    next(err);
  }
};

exports.updateMemory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const memory = await AIMemory.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { upsert: true, new: true }
    );
    return res.status(200).json(ResponseFormatter.formatSuccess(memory));
  } catch (err) {
    next(err);
  }
};

exports.getPlanner = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const plan = await AIPlannerService.generateDailyPlan(userId);
    return res.status(200).json(ResponseFormatter.formatSuccess(plan));
  } catch (err) {
    next(err);
  }
};
