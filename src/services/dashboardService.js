import api from '../utils/api';

export const getDashboardData = async () => {
  let summary = {
    totalQuizzes: 0,
    avgScore: '0%',
    streak: '0 Days',
    rank: '#--'
  };

  try {
    const response = await api.get('/analytics/summary');
    if (response.data) {
      summary = response.data;
    }
  } catch (err) {
    console.error('Failed to load live summary data, falling back to mocks:', err);
  }

  // Supply complete structured datasets for Sprint 1 Dashboard
  return {
    summary,
    
    // Continue Learning
    continueLearning: {
      lessonId: 'intro-recursion',
      title: 'Dynamic Programming & Memoization',
      module: 'Advanced Algorithms',
      progress: 68,
      totalLessons: 12,
      completedLessons: 8
    },

    // Today's Goals
    goals: [
      { id: 'goal-1', text: 'Solve the Daily Coding Challenge', done: false },
      { id: 'goal-2', text: 'Complete a Practice Assessment in Math', done: true },
      { id: 'goal-3', text: 'Discuss Recursion limits with AI Mentor', done: false },
      { id: 'goal-4', text: 'Review 3 gaze stability proctoring items', done: false }
    ],

    // AI Recommendation
    recommendation: {
      title: 'Strengthen Heap Operations',
      type: 'Technical Skill',
      description: 'Your recent accuracy in Heap-based priority queues dropped by 12%. Practice 5 quick heap sorting questions.',
      matchScore: 94,
      timeEstimate: '15 mins',
      actionUrl: '/practice'
    },

    // Daily Coding Challenge
    codingChallenge: {
      title: 'Longest Palindromic Substring',
      difficulty: 'Medium',
      points: 150,
      category: 'String Processing',
      description: 'Given a string s, return the longest palindromic substring in s. Optimize for O(N^2) time complexity.',
      actionUrl: '/practice'
    },

    // Practice Challenge
    practiceChallenge: {
      title: 'Quantitative Aptitude Prep',
      difficulty: 'Easy',
      questions: 10,
      timeLimit: '15 mins',
      description: '10 quick aptitude questions covering percentages, ratios, and algorithmic complexity estimations.',
      actionUrl: '/practice'
    },

    // Progress Overview Details
    progressTracks: [
      { id: 'learn', name: 'Learning Path', value: 74, color: 'bg-primary' },
      { id: 'coding', name: 'Coding Labs', value: 45, color: 'bg-accent' },
      { id: 'practice', name: 'Practice Paths', value: 88, color: 'bg-success' },
      { id: 'interview', name: 'Interview Studio', value: 30, color: 'bg-warning' }
    ],

    // Upcoming Tasks
    upcomingTasks: [
      { id: 'task-1', type: 'Interview', title: 'System Design Mock Interview', time: 'Tomorrow, 10:00 AM', status: 'Scheduled' },
      { id: 'task-2', type: 'Assessment', title: 'FACULTY EXAM: Algorithms Final', time: 'July 15, 2:00 PM', status: 'Assigned' }
    ],

    // Achievements & Badges
    achievements: [
      { id: 'badge-1', title: 'Streak Master', desc: 'Maintained a 7-day learning streak', icon: 'Flame', unlockedAt: '2 days ago' },
      { id: 'badge-2', title: 'Proctor Certified', desc: 'Completed 3 tests with 100% gaze stability', icon: 'ShieldCheck', unlockedAt: 'Last week' },
      { id: 'badge-3', title: 'Recursion Pro', desc: 'Perfect score on Advanced recursion path', icon: 'Award', unlockedAt: '2 weeks ago' }
    ]
  };
};
