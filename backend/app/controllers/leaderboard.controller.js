const User = require('../models/User.model');

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('name department points badges')
      .sort('-points')
      .limit(10);

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
