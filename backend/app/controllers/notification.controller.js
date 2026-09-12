const Notification = require('../models/Notification.model');
const NotificationEngine = require('../services/notification/NotificationEngine');
const ReminderEngine = require('../services/notification/ReminderEngine');
const DigestGenerator = require('../services/notification/DigestGenerator');
const AIGateway = require('../ai/AIGateway');
const ResponseFormatter = require('../ai/ResponseFormatter');

/**
 * @desc    Get Active User Notifications
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Trigger smart reminders if list is empty
    let list = await Notification.find({ userId, expiry: { $gt: new Date() } })
      .sort({ createdAt: -1 })
      .limit(20);

    if (list.length === 0) {
      await ReminderEngine.generateSmartReminders(userId);
      list = await Notification.find({ userId, expiry: { $gt: new Date() } })
        .sort({ createdAt: -1 })
        .limit(20);
    }

    return res.status(200).json(ResponseFormatter.formatSuccess({
      unreadCount: list.filter(n => !n.isRead).length,
      notifications: list
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Mark All Notifications as Read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
exports.markAllRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    return res.status(200).json(ResponseFormatter.formatSuccess({ message: 'All notifications marked as read' }));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Generate AI Morning Briefing
 * @route   POST /api/notifications/morning-brief
 * @access  Private
 */
exports.generateMorningBrief = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const brief = await NotificationEngine.dispatchNotification({
      userId,
      title: 'AI Morning Briefing — Target Focus for Today',
      message: 'Good morning! Complete Lesson 9 in Dynamic Programming and solve 1 CodeLab challenge to maintain your 5-day streak.',
      priority: 'HIGH',
      category: 'ACADEMIC',
      action: {
        title: 'Open Today Target',
        url: '/learn/adv-algorithms/dynamic-programming/dp-introduction'
      },
      expiryDays: 1
    });

    return res.status(200).json(ResponseFormatter.formatSuccess(brief));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Generate AI Evening Summary Review
 * @route   POST /api/notifications/evening-review
 * @access  Private
 */
exports.generateEveningReview = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const review = await NotificationEngine.dispatchNotification({
      userId,
      title: 'AI Evening Summary — Daily Performance Review',
      message: 'Great progress today! You gained +150 XP and maintained 92% assessment accuracy.',
      priority: 'MEDIUM',
      category: 'ACHIEVEMENT',
      action: {
        title: 'View Dashboard Progress',
        url: '/dashboard'
      },
      expiryDays: 1
    });

    return res.status(200).json(ResponseFormatter.formatSuccess(review));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get Notification Digest
 * @route   GET /api/notifications/digest
 * @access  Private
 */
exports.getDigest = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const digest = await DigestGenerator.generateDailyDigest(userId);

    return res.status(200).json(ResponseFormatter.formatSuccess(digest));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get User Notification Preferences
 * @route   GET /api/notifications/preferences
 * @access  Private
 */
exports.getPreferences = async (req, res, next) => {
  try {
    return res.status(200).json(ResponseFormatter.formatSuccess({
      channels: { inApp: true, email: true, push: false },
      categories: { academic: true, practice: true, security: true, achievements: true }
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update User Notification Preferences
 * @route   PUT /api/notifications/preferences
 * @access  Private
 */
exports.updatePreferences = async (req, res, next) => {
  try {
    const { channels, categories } = req.body;
    return res.status(200).json(ResponseFormatter.formatSuccess({
      channels: channels || { inApp: true, email: true, push: false },
      categories: categories || { academic: true, practice: true, security: true, achievements: true }
    }));
  } catch (err) {
    next(err);
  }
};
