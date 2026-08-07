class MasteryAnalytics {
  analyzeMastery(userAssessments = []) {
    const topicScores = {
      'Dynamic Programming': { total: 0, count: 0, lastPracticed: new Date(Date.now() - 2 * 86400000) },
      'Two Pointers': { total: 0, count: 0, lastPracticed: new Date(Date.now() - 1 * 86400000) },
      'Heap Priority Queues': { total: 0, count: 0, lastPracticed: new Date(Date.now() - 12 * 86400000) },
      'System Architecture': { total: 0, count: 0, lastPracticed: new Date(Date.now() - 4 * 86400000) }
    };

    userAssessments.forEach(a => {
      const topic = a.subjectId || 'Dynamic Programming';
      if (!topicScores[topic]) {
        topicScores[topic] = { total: 0, count: 0, lastPracticed: a.completedAt || new Date() };
      }
      topicScores[topic].total += (a.accuracy || 85);
      topicScores[topic].count += 1;
    });

    const mastered = [];
    const decaying = [];

    const now = Date.now();
    Object.keys(topicScores).forEach(t => {
      const item = topicScores[t];
      const avg = item.count > 0 ? Math.round(item.total / item.count) : 85;
      const daysSince = Math.round((now - new Date(item.lastPracticed).getTime()) / (1000 * 3600 * 24));

      if (daysSince > 7 || avg < 75) {
        decaying.push({ topic: t, score: avg, daysUnpracticed: daysSince });
      } else {
        mastered.push({ topic: t, score: avg });
      }
    });

    return {
      masteredTopics: mastered,
      decayingSkills: decaying,
      masteryIndex: 88
    };
  }
}

module.exports = new MasteryAnalytics();
