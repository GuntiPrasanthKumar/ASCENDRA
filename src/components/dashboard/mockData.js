export const dashboardMockData = {
  summary: [
    { id: 'rank', label: 'Global Rank', value: '#142', change: 'Active', color: 'text-accent' },
    { id: 'accuracy', label: 'Avg. Accuracy', value: '88.5%', change: '+0.5%', color: 'text-success' },
    { id: 'quizzes', label: 'Total Quizzes', value: '42', change: 'Lifetime', color: 'text-accent2' },
    { id: 'streak', label: 'Active Streak', value: '7 Days', change: 'Flame', color: 'text-warning' }
  ],
  
  welcomeHero: {
    greeting: 'Welcome back',
    streak: '7 Days',
    aiInsight: 'You are learning 15% faster during early morning sessions. Maintain this momentum today!',
    actionText: 'Resume DP Pathway',
    actionUrl: '/my-learning'
  },

  aiCoach: {
    title: 'Focus Shift: Heap Priority Queues',
    type: 'Concept Mastery',
    description: 'Your accuracy in Heap structures dropped to 72% in your last practice path. Let\'s fix this trend.',
    aiInsight: 'Heaps form 18% of upcoming technical challenges. Solving 5 heap sort questions now will stabilize your overall score.',
    actionText: 'Initialize Heap Practice',
    actionUrl: '/practice',
    matchScore: 94
  },

  continueLearning: {
    lessonId: 'intro-recursion',
    subject: 'Advanced Algorithms',
    chapter: 'Dynamic Programming & Memoization',
    progress: 68,
    totalLessons: 12,
    completedLessons: 8,
    aiInsight: 'Dynamic Programming forms 22% of coding rounds. Completing this module unlocks the dynamic solver certificate.',
    actionText: 'Start Lesson 9',
    actionUrl: '/my-learning'
  },

  goals: [
    { id: 'goal-1', text: 'Solve the Daily Coding Challenge', done: false },
    { id: 'goal-2', text: 'Complete a Practice Assessment in Math', done: true },
    { id: 'goal-3', text: 'Discuss Recursion limits with AI Mentor', done: false },
    { id: 'goal-4', text: 'Review 3 gaze stability proctoring items', done: false }
  ],

  codingChallenge: {
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    points: 150,
    category: 'String Processing',
    description: 'Given a string s, return the longest palindromic substring in s. Optimize for O(N^2) time complexity.',
    aiInsight: 'Palindromic string matching matches 3 core interview patterns. Solving this increases string processing confidence.',
    actionText: 'Solve Coding Lab',
    actionUrl: '/practice'
  },

  practiceChallenge: {
    title: 'Quantitative Aptitude Prep',
    difficulty: 'Easy',
    questions: 10,
    timeLimit: '15 mins',
    description: '10 quick aptitude questions covering percentages, ratios, and algorithmic complexity estimations.',
    aiInsight: 'Aptitude tests are the first filter for placements. A quick 15-minute test keeps you prepared.',
    actionText: 'Start Aptitude Path',
    actionUrl: '/practice'
  },

  progressTracks: {
    tracks: [
      { id: 'learn', name: 'Learning Path', value: 74, color: 'bg-primary' },
      { id: 'coding', name: 'Coding Labs', value: 45, color: 'bg-accent' },
      { id: 'practice', name: 'Practice Paths', value: 88, color: 'bg-success' },
      { id: 'interview', name: 'Interview Studio', value: 30, color: 'bg-warning' }
    ],
    aiInsight: 'Your Coding Lab participation is trailing behind your quiz pathways. Try to balance your metrics this week.',
    actionText: 'View Growth Details',
    actionUrl: '/my-learning'
  },

  upcomingTasks: [
    { id: 'task-1', type: 'Interview', title: 'System Design Mock Interview', time: 'Tomorrow, 10:00 AM', status: 'Scheduled', aiInsight: 'Focus on database partitioning and load balancers. Webcams and proctoring will be active.', actionText: 'Review Prep Notes', actionUrl: '/ai-mentor' },
    { id: 'task-2', type: 'Assessment', title: 'FACULTY EXAM: Algorithms Final', time: 'July 15, 2:00 PM', status: 'Assigned', aiInsight: 'Dynamic programming and recursive structures form 60% of this syllabus.', actionText: 'Study Core Syllabus', actionUrl: '/my-learning' }
  ],

  achievements: {
    items: [
      { id: 'badge-1', title: 'Streak Master', desc: 'Maintained a 7-day learning streak', icon: 'Flame', unlockedAt: '2 days ago' },
      { id: 'badge-2', title: 'Proctor Certified', desc: 'Completed 3 tests with 100% gaze stability', icon: 'ShieldCheck', unlockedAt: 'Last week' },
      { id: 'badge-3', title: 'Recursion Pro', desc: 'Perfect score on Advanced recursion path', icon: 'Award', unlockedAt: '2 weeks ago' }
    ],
    aiInsight: 'You are 1 badge away from unlocking the "Algorithm Grandmaster" title. Complete today\'s coding challenge to unlock it.',
    actionText: 'View Trophy Room',
    actionUrl: '/my-learning'
  }
};
