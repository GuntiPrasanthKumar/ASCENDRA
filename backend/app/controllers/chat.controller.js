const Chat = require('../models/Chat.model');

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
            content: 'Hello! I am your **SkillTrove AI Tutor**. I am specialized in multiple domains. \n\nSelect a **Knowledge Core** from the left to focus our session, or just ask me anything!'
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

    let chat = await Chat.findOne({ user: req.user.id });

    if (!chat) {
      chat = new Chat({ user: req.user.id, messages: [] });
    }

    // Add user message
    chat.messages.push({ role: 'user', content });
    chat.activeSkill = activeSkill || chat.activeSkill;

    // Simulate AI response logic (could be integrated with OpenAI/Gemini)
    let aiContent = "";
    const skillName = activeSkill || 'general';

    if (activeSkill === 'science') {
      aiContent = `As your **Science & Nature Tutor**, let's talk about the **Water Cycle**! \n\nWater evaporates from the sea, condenses into clouds, and falls back to Earth as rain or snow. This cycle keeps our fresh water clean and flowing!\n\nWould you like to learn about **Photosynthesis** next?`;
    } else if (activeSkill === 'math') {
      aiContent = `As your **Mathematics Tutor**, here is a tip on **Fractions**:\n\nWhen adding fractions like 1/4 and 2/4, keep the denominator (bottom number) the same and add the numerators (top numbers):\n\n$$\\frac{1}{4} + \\frac{2}{4} = \\frac{3}{4}$$\n\nWould you like to try a practice problem?`;
    } else if (activeSkill === 'english') {
      aiContent = `As your **English & Grammar Tutor**, remember that **Adjectives** describe nouns (like a *blue* sky) while **Adverbs** describe actions (like running *quickly*).\n\nLet's practice finding some in a sentence!`;
    } else if (activeSkill === 'history') {
      aiContent = `As your **History & Geography Tutor**, did you know that the **Ancient Egyptians** built the Great Pyramids thousands of years ago as tombs for their Pharaohs?\n\nThey are some of the oldest structures in the world!`;
    } else {
      aiContent = `Hello! I am your **SkillTrove AI Tutor** for Grades 1–10. I've activated my general assistant core to help you learn.\n\nSelect a subject like Science, Math, English, or History from the left, or ask me any question!`;
    }

    // Add AI message
    chat.messages.push({ role: 'ai', content: aiContent });
    chat.updatedAt = Date.now();

    await chat.save();

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
    await Chat.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
