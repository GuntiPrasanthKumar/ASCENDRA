const Chat = require('../models/Chat.model');
const AIService = require('../ai/AIService');

// @desc    Get user chat history
// @route   GET /api/chat
// @access  Private
exports.getChatHistory = async (req, res, next) => {
  try {
    let chat = await Chat.findOne({ user: req.user.id });

    if (!chat) {
      chat = await Chat.create({
        user: req.user.id,
        messages: [
          {
            role: 'ai',
            content: 'Hello! I am your **ASCENDRA AI Tutor**. I am specialized in multiple domains. \n\nSelect a **Knowledge Core** from the left to focus our session, or just ask me anything!'
          }
        ]
      });
    }

    res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
};

// @desc    Send message to AI
// @route   POST /api/chat
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { content, activeSkill } = req.body;

    // Use central AIService orchestrator
    const response = await AIService.chat(req.user.id, content, activeSkill);

    let chat = await Chat.findOne({ user: req.user.id });
    if (!chat) {
      chat = { user: req.user.id, messages: [] };
    }

    res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
};

// @desc    Clear chat history
// @route   DELETE /api/chat
// @access  Private
exports.clearChat = async (req, res, next) => {
  try {
    await AIService.clearMemory(req.user.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
