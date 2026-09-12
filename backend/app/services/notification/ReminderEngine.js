const NotificationEngine = require('./NotificationEngine');

class ReminderEngine {
  async generateSmartReminders(userId) {
    const reminders = [];

    // 1. Decaying Skill Reminder
    const r1 = await NotificationEngine.dispatchNotification({
      userId,
      title: 'Decaying Skill Alert — Heap Priority Queues',
      message: 'Your accuracy in Heap Priority Queues was 72% and has not been practiced in 12 days.',
      priority: 'HIGH',
      category: 'PRACTICE',
      action: {
        title: 'Start Skill Review',
        url: '/practice'
      },
      expiryDays: 3,
      deliveryChannel: 'IN_APP'
    });
    reminders.push(r1);

    // 2. Unfinished Lesson Milestone
    const r2 = await NotificationEngine.dispatchNotification({
      userId,
      title: 'Academic Milestone — Dynamic Programming',
      message: 'You are 1 lesson away from completing 75% of your Advanced Algorithms specialization.',
      priority: 'MEDIUM',
      category: 'ACADEMIC',
      action: {
        title: 'Resume DP Lesson 9',
        url: '/learn/adv-algorithms/dynamic-programming/dp-introduction'
      },
      expiryDays: 5,
      deliveryChannel: 'IN_APP'
    });
    reminders.push(r2);

    return reminders;
  }
}

module.exports = new ReminderEngine();
