const Notification = require('../../models/Notification.model');

class NotificationEngine {
  async dispatchNotification({
    userId,
    title,
    message,
    priority = 'MEDIUM',
    category = 'ACADEMIC',
    action,
    expiryDays = 7,
    deliveryChannel = 'IN_APP'
  }) {
    if (!userId || !title || !message || !action || !action.title || !action.url) {
      throw new Error('Notification requires userId, title, message, and actionable title & url');
    }

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + expiryDays);

    const notification = await Notification.create({
      userId,
      title,
      message,
      priority,
      category,
      action: {
        title: action.title,
        url: action.url,
        payload: action.payload || {}
      },
      expiry,
      deliveryChannel,
      isRead: false
    });

    return notification;
  }
}

module.exports = new NotificationEngine();
