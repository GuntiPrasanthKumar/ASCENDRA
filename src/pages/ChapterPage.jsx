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
          <div className="max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/80 bg-white text-center flex flex-col items-center shadow-xs">
            <ShieldAlert className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-display font-extrabold text-black mb-2">Chapter Not Found</h2>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              We could not find the requested chapter overview details.
            </p>
            <button onClick={() => navigate(`/learn/${subjectId || ''}`)} className="w-full py-4 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all">
              Return to Subject Page
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const completedLessonIds = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
  const completionPercentage = lessons.length > 0 
    ? Math.round((lessons.filter(l => completedLessonIds.includes(l.id)).length / lessons.length) * 100) 
    : 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          
          <button
            onClick={() => navigate(`/learn/${subject.id}`)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-black font-bold text-xs transition-all border border-slate-200/80 mb-8 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Chapters
          </button>

          {/* Chapter Overview Header */}
          <div className="p-8 rounded-[2.5rem] border border-slate-200/80 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 shadow-xs">
            <div>
              <span className="text-[10px] font-black text-black uppercase tracking-widest block mb-1">
                Chapter {chapter.order}
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-black tracking-tight mb-2">
                {chapter.title}
              </h1>
              <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-xl mb-4">{chapter.description}</p>
              
              <div className="flex gap-4 items-center text-[10px] font-black uppercase text-slate-500 tracking-wider">
                <span>{chapter.estimatedMinutes} Mins Duration</span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
              <span className="text-[10px] font-black text-black uppercase">Chapter progress: {completionPercentage}%</span>
              <div className="w-32 h-1.5 bg-slate-100 rounded-full border border-slate-200/40 overflow-hidden">
                <div className="h-full bg-black rounded-full" style={{ width: `${completionPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="flex flex-col gap-3">
            {lessons.length === 0 ? (
              <div className="p-12 rounded-[2.5rem] border border-dashed border-slate-200 text-center flex flex-col items-center justify-center bg-white">
                <BookOpen className="w-8 h-8 text-slate-300 mb-2" />
                <h4 className="text-base font-display font-extrabold text-slate-700">No Lessons Found</h4>
                <p className="text-xs font-medium text-slate-500 mt-1">Lessons are currently locked or in development.</p>
              </div>
            ) : (
              lessons.map((lesson) => {
                const isCompleted = completedLessonIds.includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    onClick={() => navigate(`/learn/${subject.id}/${chapter.id}/${lesson.id}`)}
                    className="flex justify-between items-center p-5 rounded-3xl border border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 cursor-pointer group shadow-xs"
                  >
                    <div className="flex gap-4 items-center min-w-0">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-black shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 shrink-0 group-hover:text-black transition-colors" />
                      )}
                      <div>
                        <h4 className="text-base font-display font-extrabold text-black group-hover:text-slate-600 transition-colors truncate tracking-tight">
                          {lesson.title}
                        </h4>
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 mt-0.5 block">
                          {lesson.estimatedMinutes} mins • {lesson.pointsAwarded} XP
                        </span>
                      </div>
                    </div>

                    <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-black opacity-0 group-hover:opacity-100 transition-all duration-300">
                      Start <PlayCircle className="w-4 h-4 shrink-0 text-black" />
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
