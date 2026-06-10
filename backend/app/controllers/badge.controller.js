const Badge = require('../models/Badge.model');

// @desc    Get all badges
// @route   GET /api/badges
// @access  Private
exports.getBadges = async (req, res, next) => {
  try {
    const badges = await Badge.find();
    res.status(200).json(badges);
  } catch (err) {
    next(err);
  }
};
