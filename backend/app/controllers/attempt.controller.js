const StudentAttempt = require('../models/StudentAttempt.model');
const Assessment = require('../models/Assessment.model');

// @desc    Start attempt
// @route   POST /api/attempts/start
// @access  Private
exports.startAttempt = async (req, res, next) => {
  try {
    const { assessmentId } = req.body;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ success: false, error: 'Assessment not found' });
    }

    // Check if there is already an in-progress attempt
    let attempt = await StudentAttempt.findOne({
      user: req.user.id,
      assessment: assessmentId,
      status: 'in-progress'
    });

    if (!attempt) {
      attempt = await StudentAttempt.create({
        user: req.user.id,
        assessment: assessmentId,
        score: 0,
        maxScore: 0,
        status: 'in-progress'
      });
    }

    res.status(201).json(attempt);
  } catch (err) {
    next(err);
  }
};

// @desc    Submit attempt
// @route   POST /api/attempts/:id/submit
// @access  Private
exports.submitAttempt = async (req, res, next) => {
  try {
    const { answers, score, maxScore } = req.body;

    let attempt = await StudentAttempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({ success: false, error: `Attempt not found with id of ${req.params.id}` });
    }

    // Make sure user is attempt owner
    if (attempt.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this attempt' });
    }

    attempt = await StudentAttempt.findByIdAndUpdate(req.params.id, {
      answers,
      score,
      maxScore,
      status: 'completed',
      completedAt: Date.now()
    }, {
      new: true,
      runValidators: true
    });

    res.status(200).json(attempt);
  } catch (err) {
    next(err);
  }
};
