const Notification = require('../../models/Notification.model');

class DigestGenerator {
  async generateDailyDigest(userId) {
    const unread = await Notification.find({ userId, isRead: false }).sort({ createdAt: -1 });

    const totalCount = unread.length;
    const highPriority = unread.filter(n => n.priority === 'HIGH').length;

    return {
      period: 'Daily Digest',
      totalUnread: totalCount,
      highPriorityCount: highPriority,
      summaryText: totalCount > 0 
        ? `You have ${totalCount} unread action items including ${highPriority} high-priority skill review alerts.`
        : 'All notification action items are up to date! Great job staying on top of your learning velocity.',
      topActions: unread.slice(0, 3).map(n => ({
        title: n.title,
        actionTitle: n.action?.title,
        actionUrl: n.action?.url
      }))
    };
  }
}

module.exports = new DigestGenerator();
