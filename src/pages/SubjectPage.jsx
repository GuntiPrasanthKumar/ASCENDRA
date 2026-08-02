import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockSubjects } from '../features/learning/mock/subjects';
import { mockChapters } from '../features/learning/mock/chapters';
import ChapterCard from '../components/learn/ChapterCard';
import { ArrowLeft, BookOpen, ShieldAlert, PlayCircle } from 'lucide-react';

export default function SubjectPage() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const matchSub = mockSubjects.find(s => s.id === subjectId);
      const matchChapters = mockChapters.filter(c => c.subjectId === subjectId);

      setSubject(matchSub || null);
      setChapters(matchChapters);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [subjectId]);

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

  if (!subject) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 flex items-center justify-center">
          <div className="glass max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/50 text-center flex flex-col items-center">
            <ShieldAlert className="w-12 h-12 text-error mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-primary mb-2">Subject Overview Not Found</h2>
            <p className="text-xs text-textMuted mb-6 leading-relaxed">
              We could not find the requested syllabus subject path details.
            </p>
            <button onClick={() => navigate('/learn')} className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all">
              Return to Hub
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          
          <button
            onClick={() => navigate('/learn')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-650 font-bold text-xs transition-all border border-slate-250 mb-8 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Subject List
          </button>

          {/* Subject Overview Card */}
          <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-gradient-to-br from-indigo-500/[0.01] to-primary/[0.01]">
            <div>
              <div className="flex gap-2 items-center mb-2">
                <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {subject.difficulty}
                </span>
                <span className="text-[10px] font-black text-slate-500 uppercase">
                  • {subject.estimatedHours} Hours
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-primary mb-2">
                {subject.title}
              </h1>
              <p className="text-textMuted text-xs font-semibold leading-relaxed max-w-2xl">{subject.description}</p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
              <span className="text-[10px] font-black text-indigo-600 uppercase">Overall Progress: {subject.progress}%</span>
              <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div className="h-full bg-primary" style={{ width: `${subject.progress}%` }} />
              </div>
            </div>
          </div>

          {/* Chapters List */}
          <div className="flex flex-col gap-4">
            {chapters.map((ch) => (
              <ChapterCard
                key={ch.id}
                title={ch.title}
                order={ch.order}
                lessonsCount={ch.lessonsCount}
                completedLessons={ch.completedLessons}
                onSelect={() => navigate(`/learn/${subject.id}/${ch.id}`)}
              />
            ))}
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
