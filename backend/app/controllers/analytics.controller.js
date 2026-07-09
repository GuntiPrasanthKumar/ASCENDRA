const AssessmentResult = require('../models/AssessmentResult.model');
const User = require('../models/User.model');

// @desc    Get user performance data
// @route   GET /api/analytics/performance
// @access  Private
// exports.getPerformance = async (req, res, next) => {
exports.getPerformance = async (req, res, next) => {
  try {
    const results = await AssessmentResult.find({ user: req.user.id })
      .sort('completedAt')
      .limit(10);

    const data = results.map(r => ({
      name: new Date(r.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: Math.round(r.accuracy)
    }));

    if (data.length === 0) {
      return res.status(200).json([
        { name: 'Mon', score: 40 },
        { name: 'Tue', score: 30 },
        { name: 'Wed', score: 55 },
        { name: 'Thu', score: 45 },
      ]);
    }

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

// @desc    Get user summary stats
// @route   GET /api/analytics/summary
// @access  Private
exports.getSummary = async (req, res, next) => {
  try {
    const results = await AssessmentResult.find({ user: req.user.id });
    const total = results.length;
    const avgScore = total > 0 ? (results.reduce((acc, r) => acc + r.accuracy, 0) / total).toFixed(1) : 0;

    const user = await User.findById(req.user.id);
    const scoreVal = user?.points || user?.total_score || 0;
    const usersCount = await User.countDocuments({ $or: [{ points: { $gt: scoreVal } }, { total_score: { $gt: scoreVal } }] });
    const rank = `#${usersCount + 1}`;
    const streak = `${user?.streak || 0} Days`;

    res.status(200).json({
      totalQuizzes: total,
      avgScore: `${avgScore}%`,
      streak,
      rank
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user heatmap
// @route   GET /api/analytics/heatmap
// @access  Private
exports.getHeatmap = async (req, res, next) => {
  try {
    const results = await AssessmentResult.find({ user: req.user.id });
    const counts = {};
    results.forEach(r => {
      const dateStr = new Date(r.completedAt).toISOString().split('T')[0];
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    const data = Object.keys(counts).map(date => ({
      date,
      count: counts[date]
    }));

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
