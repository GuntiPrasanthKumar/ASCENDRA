const StudentAttempt = require('../models/StudentAttempt.model');

// @desc    Get user performance data
// @route   GET /api/analytics/performance
// @access  Private
exports.getPerformance = async (req, res, next) => {
  try {
    const attempts = await StudentAttempt.find({ user: req.user.id, status: 'completed' })
      .sort('completedAt')
      .limit(10);

    const data = attempts.map(a => ({
      name: new Date(a.completedAt).toLocaleDateString(),
      score: a.score
    }));

    if (data.length === 0) {
      return res.status(200).json([
        { name: 'Mon', score: 400 },
        { name: 'Tue', score: 300 },
        { name: 'Wed', score: 550 },
        { name: 'Thu', score: 450 },
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
    const attempts = await StudentAttempt.find({ user: req.user.id, status: 'completed' });
    const total = attempts.length;
    const avgScore = total > 0 ? (attempts.reduce((acc, a) => acc + (a.score / a.maxScore), 0) / total * 100).toFixed(1) : 0;

    res.status(200).json({
      totalQuizzes: total,
      avgScore: `${avgScore}%`,
      streak: '5 Days', // Mock logic for streak
      rank: '#12'       // Mock logic for rank
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
    // Basic mock implementation for heatmap
    res.status(200).json([
      { date: '2023-10-01', count: 2 },
      { date: '2023-10-02', count: 0 },
      { date: '2023-10-03', count: 5 }
    ]);
  } catch (err) {
    next(err);
  }
};
