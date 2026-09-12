import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockSubjects } from '../features/learning/mock/subjects';
import { mockChapters } from '../features/learning/mock/chapters';
import { mockLessons } from '../features/learning/mock/lessons';
import { useLearningStore } from '../hooks/useLearningStore';
import { ArrowLeft, ShieldAlert, BookOpen, Clock, Zap, CheckCircle, PlayCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubjectPage() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { getChapterProgress, isChapterComplete, getSubjectProgress } = useLearningStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      const matchSub = mockSubjects.find(s => s.id === subjectId);
      const matchChapters = mockChapters.filter(c => c.subjectId === subjectId);
      setSubject(matchSub || null);
      setChapters(matchChapters);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [subjectId]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#F8F9FA] pt-8 pb-20 px-4 md:px-6">
          <div className="max-w-4xl mx-auto"><PageSkeleton /></div>
        </div>
      </PageTransition>
    );
  }

  if (!subject) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#F8F9FA] pt-8 pb-20 px-4 md:px-6 flex items-center justify-center">
          <div className="max-w-md w-full p-8 rounded-3xl border border-slate-200/80 bg-white text-center flex flex-col items-center shadow-xs">
            <ShieldAlert className="w-12 h-12 text-slate-300 mb-4" />
            <h2 className="text-xl font-display font-extrabold text-slate-900 mb-2">Subject Not Found</h2>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              We couldn't find the requested subject.
            </p>
            <button
              onClick={() => navigate('/learn')}
              className="w-full py-3.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
            >
              Return to Learning Hub
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const { completed, total, progress } = getSubjectProgress(subjectId);
  const totalXP = mockLessons
    .filter(l => chapters.some(c => c.id === l.chapterId))
    .reduce((sum, l) => sum + (l.pointsAwarded || 0), 0);
  const totalMinutes = chapters.reduce((sum, c) => sum + (c.estimatedMinutes || 0), 0);

  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', bar: 'bg-rose-500', badge: 'bg-rose-100 text-rose-700' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', bar: 'bg-indigo-500', badge: 'bg-indigo-100 text-indigo-700' },
  };
  const colors = colorMap[subject.color] || colorMap.indigo;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] pt-2 pb-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">

          <button
            onClick={() => navigate('/learn')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all border border-slate-200 mb-6 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
          </button>

          {/* Subject Overview */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 mb-8 shadow-xs">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${colors.badge}`}>
                    {subject.difficulty}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {subject.estimatedHours}h estimated
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight mb-2">
                  {subject.title}
                </h1>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl mb-5">
                  {subject.description}
                </p>

                {/* Stat pills */}
                <div className="flex items-center flex-wrap gap-3">
                  <div className={`flex items-center gap-1.5 text-xs font-bold ${colors.text} ${colors.bg} px-3 py-1.5 rounded-xl`}>
                    <BookOpen className="w-3.5 h-3.5" />
                    {chapters.length} Chapters
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl">
                    <Clock className="w-3.5 h-3.5" />
                    {totalMinutes} min total
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl">
                    <Zap className="w-3.5 h-3.5" />
                    {totalXP} XP available
                  </div>
                </div>
              </div>

              {/* Progress section */}
              <div className="shrink-0 flex flex-col items-end gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Overall Progress</span>
                <span className="text-4xl font-display font-extrabold text-slate-900">{progress}%</span>
                <div className="w-36 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${colors.bar} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400">{completed} / {total} lessons done</span>
              </div>
            </div>
          </div>

          {/* Chapters List */}
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900 mb-4">Chapters</h2>
            <div className="flex flex-col gap-4">
              {chapters.map((ch, idx) => {
                const chProgress = getChapterProgress(ch.id);
                const chComplete = isChapterComplete(ch.id);
                const chLessons = mockLessons.filter(l => l.chapterId === ch.id);
                const chXP = chLessons.reduce((sum, l) => sum + (l.pointsAwarded || 0), 0);

                return (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    onClick={() => navigate(`/learn/${subject.id}/${ch.id}`)}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group shadow-xs"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-4 items-start flex-1 min-w-0">
                        {/* Chapter number */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
                          chComplete
                            ? 'bg-emerald-500 text-white'
                            : chProgress > 0
                            ? `${colors.bg} ${colors.text}`
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          {chComplete ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Chapter {ch.order}
                            </span>
                            {chComplete && (
                              <span className="text-[10px] font-black text-emerald-500 uppercase">✓ Complete</span>
                            )}
                            {chProgress > 0 && !chComplete && (
                              <span className={`text-[10px] font-black uppercase ${colors.text}`}>{chProgress}% done</span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                            {ch.title}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed line-clamp-2">
                            {ch.description}
                          </p>

                          {/* Chapter meta */}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] font-bold text-slate-400">{ch.lessonIds.length} lessons</span>
                            <span className="text-[10px] font-bold text-slate-400">{ch.estimatedMinutes} min</span>
                            <span className="text-[10px] font-bold text-indigo-500">+{chXP} XP</span>
                          </div>

                          {/* Progress bar */}
                          {chProgress > 0 && (
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3">
                              <motion.div
                                className={`h-full ${chComplete ? 'bg-emerald-500' : colors.bar} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${chProgress}%` }}
                                transition={{ duration: 0.7, ease: 'easeOut', delay: idx * 0.08 }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
