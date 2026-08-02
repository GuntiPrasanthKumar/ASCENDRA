import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockQuizzes } from '../features/quiz/mock/quiz';
import { Award, ShieldAlert, PlayCircle } from 'lucide-react';

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
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-10 pb-6 border-b border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-black flex items-center justify-center">
              <Award className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-black tracking-tight">Diagnostic Quizzes</h1>
              <p className="text-xs font-semibold text-slate-500 mt-1">Verify your concept mastery and unlock path completion certificates.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {quizzes.length === 0 ? (
              <div className="p-12 rounded-[2.5rem] border border-dashed border-slate-200 text-center flex flex-col items-center justify-center bg-white">
                <ShieldAlert className="w-8 h-8 text-slate-300 mb-2" />
                <h4 className="text-base font-display font-extrabold text-slate-700">No Quizzes Configured</h4>
                <p className="text-xs font-medium text-slate-500 mt-1">Check back later as faculty registers diagnostic syllabus checkpoints.</p>
              </div>
            ) : (
              quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-6 rounded-[1.75rem] border border-slate-200/80 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-slate-300 transition-all duration-300 w-full shadow-xs"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase text-black bg-slate-100 border border-slate-200 px-3 py-0.5 rounded-full tracking-wider block w-fit mb-2">
                      Algorithms DP Track
                    </span>
                    <h4 className="text-base font-display font-extrabold text-black group-hover:text-slate-600 transition-colors tracking-tight">
                      {quiz.title}
                    </h4>
                    <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">{quiz.description}</p>
                  </div>

                  <button
                    onClick={() => navigate(`/quiz/${quiz.subjectId}/${quiz.id}`)}
                    className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 text-xs font-bold"
                  >
                    <span>Start Quiz</span>
                    <PlayCircle className="w-4 h-4 shrink-0" />
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
