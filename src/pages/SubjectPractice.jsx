import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockPracticeData } from '../components/practice/mockPracticeData';
import { ArrowLeft, Clock, HelpCircle, ShieldAlert, Award, PlayCircle } from 'lucide-react';

export default function SubjectPractice() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const match = mockPracticeData.subjects.find(s => s.id === subjectId);
      setSubject(match || null);
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
            <ShieldAlert className="w-12 h-12 text-error mb-4" />
            <h2 className="text-xl font-bold text-primary mb-2">Subject Practice Not Found</h2>
            <p className="text-xs text-textMuted mb-6 leading-relaxed">
              We could not find the requested practice track module.
            </p>
            <button onClick={() => navigate('/practice')} className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all">
              Return to Practice Hub
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <button
            onClick={() => navigate('/practice')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs transition-all border border-slate-250 mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Subjects
          </button>

          <div className="mb-10">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">
              Practice Pathway
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-primary mb-2">
              {subject.title}
            </h1>
            <p className="text-textMuted text-sm font-medium leading-relaxed">{subject.description}</p>
          </div>

          <div className="flex flex-col gap-4">
            {subject.sets.length === 0 ? (
              <div className="glass p-12 rounded-[2rem] border border-dashed border-slate-200/50 text-center flex flex-col items-center justify-center">
                <HelpCircle className="w-8 h-8 text-slate-350 mb-2 animate-pulse" />
                <h4 className="font-bold text-slate-700">No Sets Configured</h4>
                <p className="text-xs text-textMuted mt-1">Practice assessment questionnaires are currently empty.</p>
              </div>
            ) : (
              subject.sets.map((set) => (
                <div
                  key={set.id}
                  className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-accent/20 transition-all duration-300 w-full"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 text-base group-hover:text-accent transition-colors">
                      {set.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs font-semibold text-textMuted mt-2">
                      <span className="flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" /> {set.questionsCount} Questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {set.timeLimit}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/practice/${subject.id}/${set.id}`)}
                    className="px-5 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-primary transition-all flex items-center gap-2 group-hover:scale-[1.01]"
                  >
                    Launch Set <PlayCircle className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
