import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { useAuthStore } from '../hooks/useAuthStore';
import { useLearningStore } from '../hooks/useLearningStore';
import { mockSubjects } from '../features/learning/mock/subjects';
import { mockChapters } from '../features/learning/mock/chapters';
import { mockLessons } from '../features/learning/mock/lessons';
import { mockProblems } from '../features/codelab/mock/problems';
import { generateDashboardAIInsights } from '../services/geminiService';
import confetti from 'canvas-confetti';
import { 
  Search, BookOpen, Code, Video, Activity, Compass, 
  PlayCircle, ArrowRight, CheckCircle2, ChevronRight, 
  Clock, TrendingUp, Star, Check, Sparkles, RefreshCw,
  Flame, CheckSquare, Square, Zap, Award, Target, Trophy,
  X, Layers, Database, Server, Calculator, ExternalLink, HelpCircle
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  // Learning Store state
  const {
    completedLessonIds,
    studyStreak,
    totalXP: learnXP,
    lastActiveSubjectId,
    lastActiveChapterId,
    lastActiveLessonId,
    getSubjectProgress,
    getTotalCompleted
  } = useLearningStore();

  // Local storage cross-module states
  const [completedCoding, setCompletedCoding] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [completedInterviews, setCompletedInterviews] = useState([]);

  // Daily goals state
  const [goals, setGoals] = useState([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // AI Briefing state
  const [aiInsight, setAiInsight] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const studentName = user?.name?.split(' ')[0] || 'Vijay';

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // Load localStorage data
  useEffect(() => {
    try {
      const coding = JSON.parse(localStorage.getItem('completed_coding') || '[]');
      const quizzes = JSON.parse(localStorage.getItem('completed_quizzes') || '[]');
      const interviews = JSON.parse(localStorage.getItem('completed_interviews') || '[]');
      setCompletedCoding(coding);
      setCompletedQuizzes(quizzes);
      setCompletedInterviews(interviews);

      // Load or initialize daily goals
      const savedGoals = localStorage.getItem('ascendra_daily_goals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      } else {
        const initialGoals = [
          { id: 'g1', text: 'Complete 1 Syllabus Lesson in Learning Hub', done: completedLessonIds.length > 0, category: 'learn', path: '/learn' },
          { id: 'g2', text: 'Solve 1 CodeLab Algorithm Challenge', done: coding.length > 0, category: 'code', path: '/codelab' },
          { id: 'g3', text: 'Review Weak Areas in Practice Diagnostics', done: quizzes.length > 0, category: 'practice', path: '/practice' },
          { id: 'g4', text: 'Consult with AI Career Mentor', done: false, category: 'mentor', path: '/ai-mentor' },
        ];
        setGoals(initialGoals);
        localStorage.setItem('ascendra_daily_goals', JSON.stringify(initialGoals));
      }
    } catch (e) {
      console.error('Error loading dashboard state:', e);
    }
  }, [completedLessonIds.length]);

  // Total calculated XP across all modules
  const totalCalculatedXP = useMemo(() => {
    const codingXP = completedCoding.length * 100;
    const quizXP = completedQuizzes.length * 75;
    const interviewXP = completedInterviews.length * 150;
    return (learnXP || 0) + codingXP + quizXP + interviewXP;
  }, [learnXP, completedCoding.length, completedQuizzes.length, completedInterviews.length]);

  // Active Workspace Target computation
  const activeTarget = useMemo(() => {
    const activeSub = mockSubjects.find(s => s.id === lastActiveSubjectId) || mockSubjects[0];
    const activeChap = mockChapters.find(c => c.id === lastActiveChapterId) || 
      mockChapters.find(c => c.subjectId === activeSub.id) || mockChapters[0];
    const activeLes = mockLessons.find(l => l.id === lastActiveLessonId) || 
      mockLessons.find(l => l.chapterId === activeChap.id) || mockLessons[0];

    const subjectProgress = getSubjectProgress(activeSub.id);

    return {
      subject: activeSub,
      chapter: activeChap,
      lesson: activeLes,
      progress: subjectProgress.progress,
      completed: subjectProgress.completed,
      total: subjectProgress.total,
      path: `/learn/${activeSub.id}/${activeChap.id}/${activeLes.id}`
    };
  }, [lastActiveSubjectId, lastActiveChapterId, lastActiveLessonId, getSubjectProgress]);

  // Live Next Best Recommendations
  const nextRecommendations = useMemo(() => {
    // 1. Next Incomplete Lesson
    const nextIncompleteLesson = mockLessons.find(l => !completedLessonIds.includes(l.id)) || mockLessons[0];
    const lessonChapter = mockChapters.find(c => c.id === nextIncompleteLesson.chapterId);
    const lessonSubject = mockSubjects.find(s => s.id === lessonChapter?.subjectId);

    // 2. Next Unsolved Code Problem
    const nextUnsolvedProblem = mockProblems.find(p => !completedCoding.includes(p.id)) || mockProblems[0];

    return [
      {
        id: 'rec-lesson',
        title: nextIncompleteLesson.title,
        subtitle: `${lessonSubject?.title || 'Algorithms'} • ${lessonChapter?.title || 'Theory'}`,
        reason: `Continues your technical roadmap. Awards +${nextIncompleteLesson.pointsAwarded || 50} XP upon completion.`,
        type: 'Next Lesson',
        icon: <BookOpen className="w-4 h-4 text-blue-600" />,
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-100',
        path: `/learn/${lessonSubject?.id || 'adv-algorithms'}/${lessonChapter?.id || 'dynamic-programming'}/${nextIncompleteLesson.id}`,
        actionText: 'Resume Lesson'
      },
      {
        id: 'rec-coding',
        title: nextUnsolvedProblem.title,
        subtitle: `${nextUnsolvedProblem.difficulty} • ${nextUnsolvedProblem.tags.join(', ')}`,
        reason: `Practice key algorithm patterns with Monaco IDE & automated test-case evaluation.`,
        type: 'CodeLab Challenge',
        icon: <Code className="w-4 h-4 text-emerald-600" />,
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        path: `/codelab/${nextUnsolvedProblem.id}`,
        actionText: 'Solve in CodeLab'
      },
      {
        id: 'rec-practice',
        title: 'Quantitative Aptitude & Logic',
        subtitle: '10 Diagnostic Questions • 15 Mins',
        reason: `Sharpen speed math and problem-solving speed for placement screening rounds.`,
        type: 'Diagnostic Test',
        icon: <Activity className="w-4 h-4 text-purple-600" />,
        badgeBg: 'bg-purple-50 text-purple-700 border-purple-100',
        path: '/practice/quant-aptitude',
        actionText: 'Start Test'
      },
      {
        id: 'rec-interview',
        title: 'Technical AI Mock Interview',
        subtitle: 'Proctoring & Eye-Gaze Tracking Active',
        reason: `Simulate high-stakes placement rounds with instant AI feedback scorecards.`,
        type: 'AI Interview Studio',
        icon: <Video className="w-4 h-4 text-amber-600" />,
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-100',
        path: '/interview/int-tech/setup',
        actionText: 'Begin Rehearsal'
      }
    ];
  }, [completedLessonIds, completedCoding]);

  // Verified Activity Journey Timeline
  const recentActivities = useMemo(() => {
    const list = [];

    // Add completed lessons
    completedLessonIds.slice(-3).reverse().forEach((lessonId, idx) => {
      const les = mockLessons.find(l => l.id === lessonId);
      if (les) {
        list.push({
          id: `act-les-${lessonId}`,
          title: `Completed Lesson: ${les.title}`,
          subtitle: `Awarded +${les.pointsAwarded || 50} XP • Verified Mastery`,
          time: idx === 0 ? 'Recently completed' : 'Previous session',
          type: 'lesson',
          icon: <BookOpen className="w-4 h-4 text-blue-600" />,
          color: 'bg-blue-50 border-blue-100',
          path: `/learn`
        });
      }
    });

    // Add completed coding problems
    completedCoding.slice(-2).reverse().forEach((probId) => {
      const prob = mockProblems.find(p => p.id === probId);
      if (prob) {
        list.push({
          id: `act-code-${probId}`,
          title: `Solved Problem: ${prob.title}`,
          subtitle: `${prob.difficulty} Challenge • 100% Testcases Passed`,
          time: 'Verified Solution',
          type: 'code',
          icon: <Code className="w-4 h-4 text-emerald-600" />,
          color: 'bg-emerald-50 border-emerald-100',
          path: `/codelab/${prob.id}`
        });
      }
    });

    // Fallback baseline if new user
    if (list.length === 0) {
      list.push(
        {
          id: 'act-init-1',
          title: 'Enrolled in Computer Science Core Path',
          subtitle: '6 Domain Roadmaps Unlocked • 25+ Interactive Lessons',
          time: 'Active',
          type: 'enroll',
          icon: <Award className="w-4 h-4 text-indigo-600" />,
          color: 'bg-indigo-50 border-indigo-100',
          path: '/learn'
        },
        {
          id: 'act-init-2',
          title: 'CodeLab Monaco IDE Initialized',
          subtitle: 'Multi-language compiler & real-time test execution ready',
          time: 'Ready',
          type: 'code',
          icon: <Code className="w-4 h-4 text-emerald-600" />,
          color: 'bg-emerald-50 border-emerald-100',
          path: '/codelab'
        }
      );
    }

    return list;
  }, [completedLessonIds, completedCoding]);

  // Global Search Engine
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();

    const matches = [];

    // Search Lessons
    mockLessons.forEach(l => {
      if (l.title.toLowerCase().includes(q)) {
        const ch = mockChapters.find(c => c.id === l.chapterId);
        matches.push({
          id: `search-l-${l.id}`,
          title: l.title,
          category: 'Lesson',
          subtitle: `${ch?.title || 'Chapter'} • ${l.estimatedMinutes} mins`,
          icon: <BookOpen className="w-4 h-4 text-blue-600" />,
          badge: 'Learn',
          badgeColor: 'bg-blue-50 text-blue-700',
          path: `/learn/${ch?.subjectId || 'adv-algorithms'}/${ch?.id || 'dynamic-programming'}/${l.id}`
        });
      }
    });

    // Search Subjects
    mockSubjects.forEach(s => {
      if (s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) {
        matches.push({
          id: `search-s-${s.id}`,
          title: s.title,
          category: 'Course Subject',
          subtitle: `${s.difficulty} • ${s.estimatedHours}h syllabus`,
          icon: <Layers className="w-4 h-4 text-purple-600" />,
          badge: 'Syllabus',
          badgeColor: 'bg-purple-50 text-purple-700',
          path: `/learn/${s.id}`
        });
      }
    });

    // Search CodeLab Problems
    mockProblems.forEach(p => {
      if (p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))) {
        matches.push({
          id: `search-p-${p.id}`,
          title: p.title,
          category: 'CodeLab Problem',
          subtitle: `${p.difficulty} • ${p.tags.join(', ')}`,
          icon: <Code className="w-4 h-4 text-emerald-600" />,
          badge: 'CodeLab',
          badgeColor: 'bg-emerald-50 text-emerald-700',
          path: `/codelab/${p.id}`
        });
      }
    });

    return matches.slice(0, 6);
  }, [searchQuery]);

  // Click outside listener for search
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate live AI Briefing on demand
  const handleGenerateAIBriefing = async () => {
    setIsGeneratingAI(true);
    try {
      const insights = await generateDashboardAIInsights({
        userName: studentName,
        completedLessonsCount: completedLessonIds.length,
        totalLessonsCount: mockLessons.length,
        activeSubjectTitle: activeTarget.subject.title,
        activeChapterTitle: activeTarget.chapter.title,
        codingCount: completedCoding.length,
        quizCount: completedQuizzes.length,
        streak: studyStreak || 1,
        totalXP: totalCalculatedXP
      });
      setAiInsight(insights);
    } catch (err) {
      console.error('Error generating AI briefing:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Toggle Daily Goal
  const handleToggleGoal = (id) => {
    const updated = goals.map(g => g.id === id ? { ...g, done: !g.done } : g);
    setGoals(updated);
    localStorage.setItem('ascendra_daily_goals', JSON.stringify(updated));

    const completedCount = updated.filter(g => g.done).length;
    if (completedCount === updated.length && updated.length > 0) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
      });
    }
  };

  const doneGoalsCount = goals.filter(g => g.done).length;
  const goalsPercent = goals.length > 0 ? Math.round((doneGoalsCount / goals.length) * 100) : 0;

  // Track progress calculation
  const totalLessonsCount = mockLessons.length;
  const learnPercent = totalLessonsCount > 0 ? Math.round((completedLessonIds.length / totalLessonsCount) * 100) : 0;
  const codingPercent = mockProblems.length > 0 ? Math.round((completedCoding.length / mockProblems.length) * 100) : 0;
  const practicePercent = Math.min(100, completedQuizzes.length * 25 || 25);
  const interviewPercent = Math.min(100, completedInterviews.length * 33 || 15);

  // Dynamic weekly streak calculation
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDayIndex = new Date().getDay();
  const weeklyStreak = dayNames.map((day, idx) => {
    const isToday = idx === currentDayIndex;
    const isPastOrToday = idx <= currentDayIndex;
    const active = isPastOrToday && ((studyStreak || 1) >= (currentDayIndex - idx + 1));
    return { day, active, isToday };
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] px-4 md:px-10 py-6 w-full font-body">
        <div className="w-full space-y-8 max-w-7xl mx-auto">
          
          {/* ══════════════════════════════════════════════════════════
              TOP SEARCH BAR WITH LIVE INSTANT RESULTS
              ══════════════════════════════════════════════════════════ */}
          <div ref={searchContainerRef} className="w-full flex justify-center relative z-40">
            <div className="relative w-full max-w-3xl">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Search subjects, lessons, coding challenges (e.g. Dynamic Programming, Two Sum)..." 
                className="w-full pl-11 pr-10 py-3 rounded-full bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 shadow-xs transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Live Search Results Popup */}
              <AnimatePresence>
                {isSearchOpen && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-3 space-y-1 overflow-hidden"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                      <span>Matching Results ({searchResults.length})</span>
                      <span>Instant Jump</span>
                    </div>

                    {searchResults.map((res) => (
                      <button
                        key={res.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          navigate(res.path);
                        }}
                        className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            {res.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                              {res.title}
                            </div>
                            <div className="text-[11px] font-medium text-slate-400 truncate">
                              {res.subtitle}
                            </div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${res.badgeColor}`}>
                          {res.badge}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              HERO GREETING & REAL-TIME TELEMETRY METRICS
              ══════════════════════════════════════════════════════════ */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-1.5 flex-1"
            >
              <div className="flex items-center gap-2">
                <span className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase border border-indigo-100 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>AI Command Center</span>
                </span>
                <span className="text-xs font-bold text-slate-400">• Academic Term Active</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
                {greeting}, {studentName} 👋
              </h1>

              <div className="flex items-center gap-3 pt-0.5">
                <p className="text-xs md:text-sm text-slate-500 font-medium max-w-2xl">
                  {aiInsight?.greetingInsight || 
                    `You are learning consistently with ${completedLessonIds.length} syllabus lessons mastered and ${completedCoding.length} CodeLab problems solved.`}
                </p>
                
                <button
                  onClick={handleGenerateAIBriefing}
                  disabled={isGeneratingAI}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors text-[11px] font-bold flex items-center gap-1.5 shrink-0 border border-slate-200/80"
                  title="Generate live AI telemetry insights"
                >
                  <RefreshCw className={`w-3 h-3 ${isGeneratingAI ? 'animate-spin text-indigo-600' : ''}`} />
                  <span>{isGeneratingAI ? 'Analyzing...' : 'AI Briefing'}</span>
                </button>
              </div>
            </motion.div>

            {/* Top Right Live Stats Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-4 flex items-center gap-5 shadow-xs shrink-0 w-full sm:w-auto flex-wrap sm:flex-nowrap"
            >
              {/* Stat 1: Total XP */}
              <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <Zap className="w-5 h-5 fill-indigo-600/20" />
                </div>
                <div>
                  <div className="text-base font-display font-bold text-slate-900">{totalCalculatedXP}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total XP</div>
                </div>
              </div>

              {/* Stat 2: Active Streak */}
              <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                  <Flame className="w-5 h-5 fill-amber-500/20" />
                </div>
                <div>
                  <div className="text-base font-display font-bold text-slate-900">{studyStreak || 1} Days</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Streak</div>
                </div>
              </div>

              {/* Stat 3: Completed Lessons */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-display font-bold text-slate-900">{completedLessonIds.length}/{totalLessonsCount}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lessons</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              ACTIVE WORKSPACE TARGET CARD (LIVE RESUME)
              ══════════════════════════════════════════════════════════ */}
          <motion.div 
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-r from-indigo-50/90 via-blue-50/50 to-indigo-50/90 border border-indigo-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs relative overflow-hidden"
          >
            <div className="space-y-3 max-w-2xl z-10">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                <div className="w-7 h-7 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="uppercase tracking-wider text-[10px]">Active Learning Target</span>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                  {activeTarget.lesson.title}
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Module: <span className="font-bold text-slate-800">{activeTarget.subject.title}</span> › {activeTarget.chapter.title}
                </p>
              </div>

              {/* Progress bar in active module */}
              <div className="space-y-1 pt-1 max-w-md">
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span className="text-indigo-600">{activeTarget.progress}% Completed in Subject</span>
                  <span className="text-slate-400">{activeTarget.completed} / {activeTarget.total} Lessons</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-700" 
                    style={{ width: `${activeTarget.progress}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 z-10 shrink-0">
              <button
                onClick={() => navigate(activeTarget.path)}
                className="px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-sm flex items-center gap-2.5 transition-all shadow-lg shadow-indigo-600/20 group"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Resume Lesson</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
          </motion.div>

          {/* ══════════════════════════════════════════════════════════
              AI-RECOMMENDED INTENT ACTIONS (LIVE 4 CARDS)
              ══════════════════════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>Personalized Next Actions</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Curated recommendations based on your recent activity and placement targets.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {nextRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between group shadow-xs space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${rec.badgeBg}`}>
                        {rec.type}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {rec.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5 line-clamp-1">
                        {rec.subtitle}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 leading-relaxed line-clamp-2 font-medium">
                      {rec.reason}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(rec.path)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{rec.actionText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              2-COLUMN WORKSPACE: DAILY GOALS & MULTI-TRACK MASTERY
              ══════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Cols: Interactive Goals & Weekly Streak */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Daily Goals Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-bold text-slate-900">Today's Milestone Checklist</h3>
                      <p className="text-xs text-slate-500 font-medium">Complete daily milestones to maximize streak multipliers</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    {doneGoalsCount}/{goals.length} Done ({goalsPercent}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-500 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${goalsPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Goals Checklist Items */}
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      onClick={() => handleToggleGoal(goal.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        goal.done 
                          ? 'bg-emerald-50/50 border-emerald-100 text-slate-500' 
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {goal.done ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300 shrink-0 hover:text-slate-600" />
                        )}
                        <span className={`text-xs font-semibold truncate ${goal.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {goal.text}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (goal.path) navigate(goal.path);
                        }}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0"
                      >
                        <span>Go</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {goalsPercent === 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs font-bold"
                  >
                    <Trophy className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>All daily milestones completed! +100 Bonus XP earned today. 🎉</span>
                  </motion.div>
                )}
              </div>

              {/* Weekly Streak Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                      <Flame className="w-5 h-5 fill-amber-500/20" />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-bold text-slate-900">Weekly Consistency Radar</h3>
                      <p className="text-xs text-slate-500 font-medium">Keep learning daily to prevent streak resets</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                    🔥 {studyStreak || 1} Day Active Streak
                  </span>
                </div>

                {/* Day Circles */}
                <div className="grid grid-cols-7 gap-2 pt-2">
                  {weeklyStreak.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold transition-all ${
                        item.active
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : item.isToday
                          ? 'border-2 border-dashed border-indigo-400 bg-indigo-50 text-indigo-700'
                          : 'border border-slate-200 bg-slate-50 text-slate-400'
                      }`}>
                        {item.active ? <Check className="w-4 h-4 stroke-[3]" /> : item.day[0]}
                      </div>
                      <span className={`text-[10px] font-bold ${item.isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 5 Cols: Multi-Track Mastery & Verified Activity */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Multi-Track Competency Breakdown */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-display font-bold text-slate-900">Curriculum Competency</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Real-time stats</span>
                </div>

                <div className="space-y-4 pt-1">
                  {/* Track 1: Learning Hub */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-blue-600" /> Syllabus Lessons</span>
                      <span>{learnPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${learnPercent}%` }} />
                    </div>
                  </div>

                  {/* Track 2: CodeLab */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-2"><Code className="w-3.5 h-3.5 text-emerald-600" /> CodeLab Solving</span>
                      <span>{codingPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${codingPercent}%` }} />
                    </div>
                  </div>

                  {/* Track 3: Practice Diagnostics */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-purple-600" /> Practice Diagnostic Tests</span>
                      <span>{practicePercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${practicePercent}%` }} />
                    </div>
                  </div>

                  {/* Track 4: AI Mock Interviews */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-2"><Video className="w-3.5 h-3.5 text-amber-600" /> AI Mock Interviews</span>
                      <span>{interviewPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${interviewPercent}%` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Placement Benchmark Target</span>
                  <span className="font-bold text-indigo-600">85% Required</span>
                </div>
              </div>

              {/* Verified Activity Timeline */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-display font-bold text-slate-900">Verified Activity Stream</h3>
                  </div>
                  <button 
                    onClick={() => navigate('/my-learning')}
                    className="text-[11px] font-bold text-indigo-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  {recentActivities.map((act) => (
                    <div
                      key={act.id}
                      onClick={() => navigate(act.path)}
                      className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                          {act.icon}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {act.title}
                          </h4>
                          <p className="text-[10px] font-medium text-slate-400 truncate">
                            {act.subtitle}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-slate-400 shrink-0">
                        {act.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
}
