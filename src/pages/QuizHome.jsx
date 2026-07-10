import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockQuizzes } from '../features/quiz/mock/quiz';
import SectionHeader from '../components/dashboard/SectionHeader';
import { Award, ShieldAlert, PlayCircle, Clock } from 'lucide-react';

export default function QuizHome() {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuizzes(mockQuizzes);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto animate-pulse">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/5">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-extrabold text-primary">Diagnostic Quizzes</h1>
              <p className="text-textMuted text-xs font-medium mt-1">Verify your concept mastery and unlock path completion certificates.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {quizzes.length === 0 ? (
              <div className="glass p-12 rounded-[2rem] border border-dashed border-slate-200/50 text-center flex flex-col items-center justify-center">
                <ShieldAlert className="w-8 h-8 text-slate-350 mb-2 animate-pulse" />
                <h4 className="font-bold text-slate-700">No Quizzes Configured</h4>
                <p className="text-xs text-textMuted mt-1">Check back later as faculty registers diagnostic syllabus checkpoints.</p>
              </div>
            ) : (
              quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-accent/20 transition-all duration-300 w-full animate-fade-in"
                >
                  <div>
                    <span className="text-[9px] font-black uppercase text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full tracking-wider block w-fit mb-2">
                      Algorithms DP Track
                    </span>
                    <h4 className="font-bold text-slate-800 text-base group-hover:text-accent transition-colors">
                      {quiz.title}
                    </h4>
                    <p className="text-xs text-textMuted mt-1 leading-relaxed">{quiz.description}</p>
                  </div>

                  <button
                    onClick={() => navigate(`/quiz/${quiz.subjectId}/${quiz.id}`)}
                    className="px-5 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-primary transition-all flex items-center gap-1.5 shrink-0 shadow-md group-hover:scale-[1.01]"
                  >
                    Start Quiz <PlayCircle className="w-4 h-4 shrink-0" />
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
