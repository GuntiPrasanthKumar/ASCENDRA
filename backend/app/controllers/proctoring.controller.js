const ProctoringLog = require('../models/ProctoringLog.model');

// @desc    Log a proctoring violation
// @route   POST /api/proctoring/log
// @access  Private
exports.logViolation = async (req, res, next) => {
  try {
    const { event_type, severity, metadata, assessmentId, attemptId } = req.body;

    const log = await ProctoringLog.create({
      user: req.user.id,
      assessment: assessmentId,
      attempt: attemptId,
      eventType: event_type,
      severity: severity || 'LOW',
      metadata
    });

    console.log(`[PROCTORING ALERT] User: ${req.user.email} | Event: ${event_type} | Severity: ${severity}`);

    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

// @desc    Get user proctoring logs
// @route   GET /api/proctoring/logs
// @access  Private/Admin/Instructor
exports.getLogs = async (req, res, next) => {
  try {
    const logs = await ProctoringLog.find({ user: req.params.userId }).sort('-timestamp');
    res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
};
