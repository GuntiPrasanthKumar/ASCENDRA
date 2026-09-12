import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockSubjects } from '../features/learning/mock/subjects';
import { mockChapters } from '../features/learning/mock/chapters';
import { mockLessons } from '../features/learning/mock/lessons';
import { useLearningStore } from '../hooks/useLearningStore';
import { ArrowLeft, BookOpen, ShieldAlert, PlayCircle, CheckCircle, Clock, Zap, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChapterPage() {
  const { subjectId, chapterId } = useParams();
  const [data, setData] = useState({ subject: null, chapter: null, lessons: [] });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { isLessonCompleted, getChapterProgress } = useLearningStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      const subjectMatch = mockSubjects.find(s => s.id === subjectId);
      const chapterMatch = mockChapters.find(c => c.id === chapterId);
      const chapterLessons = mockLessons.filter(l => l.chapterId === chapterId);

      setData({
        subject: subjectMatch || null,
        chapter: chapterMatch || null,
        lessons: chapterLessons,
      });
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [subjectId, chapterId]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#F8F9FA] pt-8 pb-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto"><PageSkeleton /></div>
        </div>
      </PageTransition>
    );
  }

  const { subject, chapter, lessons } = data;

  if (!subject || !chapter) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#F8F9FA] pt-8 pb-20 px-4 md:px-6 flex items-center justify-center">
          <div className="max-w-md w-full p-8 rounded-3xl border border-slate-200/80 bg-white text-center flex flex-col items-center shadow-xs">
            <ShieldAlert className="w-12 h-12 text-slate-300 mb-4" />
            <h2 className="text-xl font-display font-extrabold text-slate-900 mb-2">Chapter Not Found</h2>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              We couldn't find this chapter. It may still be in development.
            </p>
            <button
              onClick={() => navigate(`/learn/${subjectId || ''}`)}
              className="w-full py-3.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
            >
              Return to Subject
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const completionPercentage = getChapterProgress(chapterId);
  const completedCount = lessons.filter(l => isLessonCompleted(l.id)).length;
  const totalXP = lessons.reduce((sum, l) => sum + (l.pointsAwarded || 0), 0);

  // First incomplete lesson for "Continue" button
  const nextLesson = lessons.find(l => !isLessonCompleted(l.id));

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] pt-2 pb-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Back */}
          <button
            onClick={() => navigate(`/learn/${subject.id}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all border border-slate-200 mb-6 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {subject.title}
          </button>

          {/* Chapter Overview Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 mb-6 shadow-xs">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Chapter {chapter.order}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {chapter.estimatedMinutes} min
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight mb-2">
                  {chapter.title}
                </h1>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl mb-4">
                  {chapter.description}
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <BookOpen className="w-4 h-4" />
                    {lessons.length} Lessons
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <Clock className="w-4 h-4" />
                    {chapter.estimatedMinutes} min
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                    <Zap className="w-4 h-4" />
                    {totalXP} XP available
                  </div>
                </div>
              </div>

              {/* Progress ring area */}
              <div className="shrink-0 flex flex-col items-end gap-3">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Progress
                  </span>
                  <span className="text-3xl font-display font-extrabold text-slate-900">
                    {completionPercentage}%
                  </span>
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {completedCount} / {lessons.length} done
                  </span>
                </div>

                {nextLesson && (
                  <button
                    onClick={() => navigate(`/learn/${subject.id}/${chapter.id}/${nextLesson.id}`)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                  >
                    <PlayCircle className="w-4 h-4" />
                    {completedCount === 0 ? 'Start Chapter' : 'Continue'}
                  </button>
                )}
                {completedCount === lessons.length && lessons.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <CheckCircle className="w-4 h-4" />
                    Chapter Complete!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="flex flex-col gap-3">
            {lessons.length === 0 ? (
              <div className="p-12 rounded-3xl border border-dashed border-slate-200 text-center flex flex-col items-center bg-white">
                <Lock className="w-8 h-8 text-slate-300 mb-2" />
                <h4 className="text-base font-display font-extrabold text-slate-600">No Lessons Yet</h4>
                <p className="text-xs font-medium text-slate-400 mt-1">Lessons are being developed. Check back soon!</p>
              </div>
            ) : (
              lessons.map((lesson, idx) => {
                const completed = isLessonCompleted(lesson.id);
                const isActive = nextLesson?.id === lesson.id;

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => navigate(`/learn/${subject.id}/${chapter.id}/${lesson.id}`)}
                    className={`flex justify-between items-center p-5 rounded-2xl border transition-all duration-200 cursor-pointer group shadow-xs ${
                      isActive
                        ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                        : completed
                        ? 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex gap-4 items-center min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black ${
                        completed
                          ? 'bg-emerald-500 text-white'
                          : isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                      }`}>
                        {completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-sm font-bold truncate ${
                          completed ? 'text-emerald-700' : isActive ? 'text-indigo-900' : 'text-slate-800'
                        }`}>
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[10px] font-bold text-slate-400">
                            {lesson.estimatedMinutes} min
                          </span>
                          <span className="text-[10px] font-bold text-indigo-500">
                            +{lesson.pointsAwarded} XP
                          </span>
                          {completed && (
                            <span className="text-[10px] font-bold text-emerald-500">Completed ✓</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-all duration-200 shrink-0 ml-4 ${
                      completed ? 'text-emerald-500' : isActive ? 'text-indigo-600' : 'text-slate-300 group-hover:text-slate-600'
                    }`}>
                      {completed ? 'Review' : isActive ? (
                        <><PlayCircle className="w-4 h-4" /> Continue</>
                      ) : (
                        <><PlayCircle className="w-4 h-4 opacity-0 group-hover:opacity-100" /> Start</>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
