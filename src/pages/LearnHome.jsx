import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockSubjects } from '../features/learning/mock/subjects';
import { mockChapters } from '../features/learning/mock/chapters';
import { mockLessons } from '../features/learning/mock/lessons';
import { useLearningStore } from '../hooks/useLearningStore';
import {
  BookOpen, Clock, Award, Search, ChevronRight, PlayCircle,
  Code2, Network, Layers, Database, Server, Calculator,
  Map, Activity, Check, Flame, Zap, Star
} from 'lucide-react';

// Icon map per subject
const SUBJECT_ICONS = {
  'adv-algorithms': <Code2 className="w-5 h-5" />,
  'data-structures': <Network className="w-5 h-5" />,
  'system-design': <Server className="w-5 h-5" />,
  'os-concepts': <Layers className="w-5 h-5" />,
  'dbms': <Database className="w-5 h-5" />,
  'quant-aptitude': <Calculator className="w-5 h-5" />,
};

const COLOR_CLASSES = {
  blue: {
    bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100',
    bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700'
  },
  emerald: {
    bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100',
    bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700'
  },
  purple: {
    bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100',
    bar: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700'
  },
  amber: {
    bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100',
    bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700'
  },
  rose: {
    bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100',
    bar: 'bg-rose-500', badge: 'bg-rose-100 text-rose-700'
  },
  indigo: {
    bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100',
    bar: 'bg-indigo-500', badge: 'bg-indigo-100 text-indigo-700'
  },
};

const ROADMAP_STEPS = [
  { label: 'Basics', key: 'data-structures' },
  { label: 'Algorithms', key: 'adv-algorithms' },
  { label: 'OS Concepts', key: 'os-concepts' },
  { label: 'Databases', key: 'dbms' },
  { label: 'System Design', key: 'system-design' },
  { label: 'Aptitude', key: 'quant-aptitude' },
];

export default function LearnHome() {
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const {
    totalXP,
    studyStreak,
    completedLessonIds,
    getSubjectProgress,
    getLastActiveSubject,
    getLastActiveChapter,
    lastActiveLessonId,
    lastActiveChapterId,
    lastActiveSubjectId,
  } = useLearningStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSubjects(mockSubjects);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#F8F9FA] px-4 md:px-12 py-6 w-full">
          <PageSkeleton />
        </div>
      </PageTransition>
    );
  }

  const totalLessons = mockLessons.length;
  const completedCount = completedLessonIds.length;

  const filteredSubjects = subjects.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Continue learning: last active lesson, or first incomplete lesson overall
  const lastActiveSubject = getLastActiveSubject();
  const lastActiveChapter = getLastActiveChapter();
  const continueLesson = lastActiveLessonId && lastActiveChapterId && lastActiveSubjectId
    ? { subjectId: lastActiveSubjectId, chapterId: lastActiveChapterId, lessonId: lastActiveLessonId }
    : null;

  // Compute roadmap step statuses
  const roadmapWithStatus = ROADMAP_STEPS.map(step => {
    const { progress } = getSubjectProgress(step.key);
    return {
      ...step,
      progress,
      status: progress === 100 ? 'completed' : progress > 0 ? 'active' : 'upcoming',
    };
  });

  // Stat cards
  const stats = [
    {
      label: 'Completed Lessons',
      value: `${completedCount}/${totalLessons}`,
      sub: `${totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0}% complete`,
      icon: <BookOpen className="w-5 h-5" />,
      color: 'blue',
      progress: totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0,
    },
    {
      label: 'Study Streak',
      value: `${studyStreak} Lessons`,
      sub: studyStreak > 0 ? '🔥 Keep it up!' : 'Start learning!',
      icon: <Flame className="w-5 h-5" />,
      color: 'emerald',
    },
    {
      label: 'Total XP Earned',
      value: `${totalXP} XP`,
      sub: totalXP >= 500 ? '⭐ Excellent progress!' : 'Keep earning XP!',
      icon: <Zap className="w-5 h-5" />,
      color: 'purple',
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] px-4 md:px-12 py-6 w-full font-body">
        <div className="w-full space-y-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Home</span>
            <span>›</span>
            <span className="text-slate-900 font-semibold">Learn</span>
          </div>

          {/* Header + Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">Learning Hub</h1>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                  Master structured pathways — from fundamentals to system design.
                </p>
              </div>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 shadow-xs transition-colors"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {stats.map((stat, i) => {
              const c = COLOR_CLASSES[stat.color];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.border} border flex items-center justify-center ${c.text} shrink-0`}>
                      {stat.icon}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                      <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                      {stat.progress !== undefined ? (
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${c.bar} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.progress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                          />
                        </div>
                      ) : (
                        <span className={`text-xs font-semibold ${c.text} block`}>{stat.sub}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Continue Learning Banner */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Continue Learning</h2>
              <p className="text-xs text-slate-500 font-medium">Resume where you left off</p>
            </div>

            <div className="bg-gradient-to-r from-indigo-50/80 via-blue-50/40 to-indigo-50/80 border border-indigo-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-xs">
              <div className="space-y-3 max-w-xl z-10">
                <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase inline-block">
                  {continueLesson ? 'Resume Lesson' : 'Start Learning'}
                </span>
                <h3 className="text-2xl font-display font-bold text-slate-900">
                  {lastActiveSubject ? lastActiveSubject.title : 'Advanced Algorithms'}
                </h3>
                <p className="text-xs font-medium text-slate-600">
                  {lastActiveChapter ? lastActiveChapter.title : 'Begin your learning journey with our curated course catalog.'}
                </p>
                {lastActiveSubjectId && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span className="text-indigo-600">
                        {getSubjectProgress(lastActiveSubjectId).progress}% Completed
                      </span>
                      <span className="text-slate-400">
                        {getSubjectProgress(lastActiveSubjectId).completed} / {getSubjectProgress(lastActiveSubjectId).total} Lessons
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                        style={{ width: `${getSubjectProgress(lastActiveSubjectId).progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 z-10 w-full md:w-auto justify-end">
                <button
                  onClick={() => {
                    if (continueLesson) {
                      navigate(`/learn/${continueLesson.subjectId}/${continueLesson.chapterId}/${continueLesson.lessonId}`);
                    } else {
                      navigate('/learn/adv-algorithms');
                    }
                  }}
                  className="px-6 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs md:text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 shrink-0 group"
                >
                  <span>{continueLesson ? 'Continue Lesson' : 'Start Learning'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-200/30 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>

          {/* All Subjects Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">
                  {searchQuery ? `Results for "${searchQuery}"` : 'Your Learning Path'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {filteredSubjects.length} subject{filteredSubjects.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>

            {filteredSubjects.length === 0 ? (
              <div className="py-16 text-center">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-500">No subjects match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredSubjects.map((subject, idx) => {
                  const { progress, completed, total } = getSubjectProgress(subject.id);
                  const colors = COLOR_CLASSES[subject.color] || COLOR_CLASSES.indigo;
                  const icon = SUBJECT_ICONS[subject.id];
                  const chapterCount = mockChapters.filter(c => c.subjectId === subject.id).length;

                  return (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      onClick={() => navigate(`/learn/${subject.id}`)}
                      className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group shadow-xs flex flex-col"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-11 h-11 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center ${colors.text} group-hover:scale-105 transition-transform`}>
                          {icon}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${colors.badge}`}>
                          {subject.difficulty}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2 mb-4">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                          {subject.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                          {subject.description}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                          {chapterCount} chapters
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                          {subject.estimatedHours}h
                        </span>
                        {total > 0 && (
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${colors.badge}`}>
                            {completed}/{total} lessons
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400">Progress</span>
                          <span className={`text-[10px] font-bold ${colors.text}`}>{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${colors.bar} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 + idx * 0.07 }}
                          />
                        </div>
                      </div>

                      {/* CTA row */}
                      <div className={`flex items-center justify-between pt-4 mt-4 border-t border-slate-100`}>
                        <span className="text-[10px] font-bold text-slate-400">
                          {progress === 0 ? 'Not started' : progress === 100 ? '✓ Completed' : 'In progress'}
                        </span>
                        <div className={`flex items-center gap-1 text-xs font-bold ${colors.text} group-hover:gap-2 transition-all`}>
                          <span>{progress > 0 ? 'Continue' : 'Start'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Roadmap Overview */}
          {!searchQuery && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-slate-900">Placement Roadmap</h3>
                    <p className="text-xs text-slate-500 font-medium">Your structured path to placement readiness.</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/my-learning')}
                  className="text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1"
                >
                  View full roadmap <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative pt-6 pb-2 overflow-x-auto">
                <div className="min-w-[600px]">
                  <div className="absolute top-10 left-[6%] right-[6%] h-0.5 bg-slate-200" />
                  <div className="flex justify-between items-center relative z-10">
                    {roadmapWithStatus.map((step, idx) => {
                      const isCompleted = step.status === 'completed';
                      const isActive = step.status === 'active';
                      return (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-3 text-center cursor-pointer"
                          onClick={() => navigate(`/learn/${step.key}`)}
                        >
                          {isCompleted ? (
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          ) : isActive ? (
                            <div className="w-8 h-8 rounded-full bg-indigo-600 border-4 border-indigo-200 flex items-center justify-center shadow-xs">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-slate-300 bg-white" />
                          )}

                          <div className="space-y-0.5">
                            <span className={`text-xs block ${
                              isActive ? 'font-bold text-slate-900' :
                              isCompleted ? 'font-semibold text-slate-700' :
                              'font-medium text-slate-400'
                            }`}>
                              {step.label}
                            </span>
                            {step.progress > 0 && (
                              <span className="text-[10px] font-bold text-indigo-500 block">{step.progress}%</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
