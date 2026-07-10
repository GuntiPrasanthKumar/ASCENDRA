import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockSubjects } from '../features/learning/mock/subjects';
import { mockChapters } from '../features/learning/mock/chapters';
import { mockLessons } from '../features/learning/mock/lessons';
import { ArrowLeft, BookOpen, ShieldAlert, PlayCircle, CheckCircle, Circle } from 'lucide-react';

export default function ChapterPage() {
  const { subjectId, chapterId } = useParams();
  const [data, setData] = useState({ subject: null, chapter: null, lessons: [] });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const subjectMatch = mockSubjects.find(s => s.id === subjectId);
      const chapterMatch = mockChapters.find(c => c.id === chapterId);
      const chapterLessons = mockLessons.filter(l => l.chapterId === chapterId);
      
      setData({
        subject: subjectMatch || null,
        chapter: chapterMatch || null,
        lessons: chapterLessons
      });
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [subjectId, chapterId]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  const { subject, chapter, lessons } = data;

  if (!subject || !chapter) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 flex items-center justify-center">
          <div className="glass max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/50 text-center flex flex-col items-center">
            <ShieldAlert className="w-12 h-12 text-error mb-4" />
            <h2 className="text-xl font-bold text-primary mb-2">Chapter Not Found</h2>
            <p className="text-xs text-textMuted mb-6 leading-relaxed">
              We could not find the requested chapter overview details.
            </p>
            <button onClick={() => navigate(`/learn/${subjectId || ''}`)} className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all">
              Return to Subject Page
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Load completed lessons from local storage
  const completedLessonIds = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
  const completionPercentage = lessons.length > 0 
    ? Math.round((lessons.filter(l => completedLessonIds.includes(l.id)).length / lessons.length) * 100) 
    : 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          
          <button
            onClick={() => navigate(`/learn/${subject.id}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-655 font-bold text-xs transition-all border border-slate-250 mb-8 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Chapters
          </button>

          {/* Chapter Overview Header */}
          <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-gradient-to-br from-indigo-500/[0.01] to-primary/[0.01]">
            <div>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">
                Chapter {chapter.order}
              </span>
              <h1 className="text-3xl font-display font-extrabold text-primary mb-2">
                {chapter.title}
              </h1>
              <p className="text-textMuted text-xs font-semibold leading-relaxed max-w-xl mb-4">{chapter.description}</p>
              
              <div className="flex gap-4 items-center text-[10px] font-black uppercase text-slate-500 tracking-wider">
                <span>{chapter.estimatedMinutes} Mins Duration</span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
              <span className="text-[10px] font-black text-indigo-600 uppercase">Chapter progress: {completionPercentage}%</span>
              <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div className="h-full bg-primary" style={{ width: `${completionPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="flex flex-col gap-3">
            {lessons.length === 0 ? (
              <div className="glass p-12 rounded-[2rem] border border-dashed border-slate-200/50 text-center flex flex-col items-center justify-center">
                <BookOpen className="w-8 h-8 text-slate-350 mb-2 animate-pulse" />
                <h4 className="font-bold text-slate-700">No Lessons Found</h4>
                <p className="text-xs text-textMuted mt-1">Lessons are currently locked or in development.</p>
              </div>
            ) : (
              lessons.map((lesson) => {
                const isCompleted = completedLessonIds.includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    onClick={() => navigate(`/learn/${subject.id}/${chapter.id}/${lesson.id}`)}
                    className="flex justify-between items-center glass p-5 rounded-3xl border border-slate-200/50 hover:border-primary/20 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex gap-4 items-center min-w-0">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-success shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 shrink-0 group-hover:text-primary transition-colors" />
                      )}
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors truncate">
                          {lesson.title}
                        </h4>
                        <span className="text-[9px] font-black uppercase tracking-wider text-textMuted mt-0.5 block">
                          {lesson.estimatedMinutes} mins • {lesson.pointsAwarded} XP
                        </span>
                      </div>
                    </div>

                    <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary hover:text-accent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      Start <PlayCircle className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
