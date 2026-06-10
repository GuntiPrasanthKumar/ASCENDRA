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

    if (activeSkill === 'frontend') {
      aiContent = `As your **Frontend Engineer**, here's an insight on React state:\n\nAlways use functional updates when the next state depends on the previous one:\n\n\`\`\`javascript\nsetCount(prev => prev + 1);\n\`\`\`\n\nThis prevents race conditions in asynchronous closures! Shall we explore **React.memo** next?`;
    } else if (activeSkill === 'dsa') {
      aiContent = `In **Big O analysis**, your query seems to relate to logarithmic time. \n\n**O(log n)** typically occurs when you divide the problem size in half each step, like in a **Binary Search Tree**.\n\nWould you like me to generate a practice problem on **Heap Sort**?`;
    } else {
      aiContent = `I've analyzed your question through my **${skillName}** core. \n\nThe core concept involves **Integrity** and **Efficiency**. \n\n\`\`\`javascript\nconst skillTrove = "Intelligence + Integrity";\nconsole.log(skillTrove);\n\`\`\`\n\nHow else can I assist your learning journey today?`;
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
