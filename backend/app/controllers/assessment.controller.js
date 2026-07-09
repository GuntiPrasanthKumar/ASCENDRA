const AssessmentResult = require('../models/AssessmentResult.model');
const { generateAssessmentAI, discoverKnowledgeAI } = require('../services/ai.service');

// @desc    Discover domain and subtopics from a raw query
// @route   POST /api/assessments/discover
// @access  Private
exports.discoverTopics = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      const discovery = await discoverKnowledgeAI(query);
      return res.status(200).json({
        success: true,
        data: discovery
      });
    } else {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
  } catch (err) {
    console.error('Discovery Error:', err.message);
    res.status(500).json({ message: 'Failed to discover topics' });
  }
};

// @desc    Generate 20 questions based on topic and Blooms Taxonomy
// @route   POST /api/assessments/generate
// @access  Private
exports.generateQuestions = async (req, res) => {
  try {
    const { subject, topic } = req.body;

    if (!subject || !topic) {
      return res.status(400).json({ message: 'Subject and topic are required' });
    }

    let questions = [];

    // Attempt Real AI Generation if key exists
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        questions = await generateAssessmentAI(subject, topic);
        
        // STRICT VALIDATION: Reject any AI hallucinations that look like the old templates
        const bannedPatterns = [
          /In the context of/i,
          /what is the primary role of/i,
          /Optimized .* Pipeline/i,
          /Distributed .* Logic/i,
          /Enhanced .* Scalability/i,
          /Standardized .* Protocol/i
        ];
        
        const hasBannedPattern = questions.some(q => {
          const textToCheck = `${q.text} ${q.options ? q.options.join(' ') : ''}`;
          return bannedPatterns.some(pattern => pattern.test(textToCheck));
        });

        if (hasBannedPattern) {
          throw new Error('AI generated a generic template question. Rejected.');
        }

      } catch (aiErr) {
        console.error('AI Service Failed:', aiErr.message);
        throw new Error(aiErr.message || 'AI Generation failed completely. Please try again.');
      }
    } else {
      throw new Error('GEMINI_API_KEY is missing or invalid.');
    }

    if (!questions || questions.length === 0) {
      throw new Error('AI returned an empty question set.');
    }

    // Ensure exactly 20 questions
    if (questions.length > 20) questions = questions.slice(0, 20);

    res.status(200).json({
      success: true,
      topic,
      subject,
      totalQuestions: questions.length,
      questions: questions
    });

  } catch (err) {
    console.error('Generation Error:', err.message);
    res.status(500).json({ message: err.message || 'Failed to generate questions' });
  }
};

// @desc    Save assessment results
// @route   POST /api/assessments/save
// @access  Private
exports.saveResult = async (req, res) => {
  try {
    const { subject, topic, level, score, totalQuestions, strikes, details } = req.body;
    const accuracy = (score / totalQuestions) * 100;

    const newResult = new AssessmentResult({
      user: req.user.id,
      subject,
      topic,
      level,
      score,
      totalQuestions,
      accuracy,
      strikes,
      details
    });

    await newResult.save();

    // Increment points and total_score for the user
    const User = require('../models/User.model');
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { total_score: score, points: score },
      $set: { last_active: new Date() }
    });

    res.status(201).json({
      success: true,
      message: 'Assessment results saved successfully',
      data: newResult
    });
  } catch (err) {
    console.error('Save Result Error:', err.message);
    res.status(500).json({ message: 'Failed to save assessment results' });
  }
};

// @desc    Get user's past results
// @route   GET /api/assessments/my-results
// @access  Private
exports.getMyResults = async (req, res) => {
  try {
    const results = await AssessmentResult.find({ user: req.user.id }).sort({ completedAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch results' });
  }
};
