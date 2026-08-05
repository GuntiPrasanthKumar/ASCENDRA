import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockQuizzes } from '../features/quiz/mock/quiz';

// Reusable Quiz Components
import ResultCard from '../components/quiz/ResultCard';
import PerformanceCard from '../components/quiz/PerformanceCard';
import ProgressSummaryCard from '../components/quiz/ProgressSummaryCard';
import ActivityCard from '../components/quiz/ActivityCard';

// Icons
import { ShieldAlert } from 'lucide-react';

export default function QuizResults() {
  const { subjectId, quizId } = useParams();
  const [data, setData] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeQuiz = mockQuizzes.find(q => q.id === quizId);

      if (activeQuiz) {
        setData({ activeQuiz });
        
        // Load quiz result details
        const savedResult = JSON.parse(localStorage.getItem(`quiz_result_${subjectId}_${quizId}`) || '{"score":3,"total":3,"timeTaken":"2m 10s"}');
        setResult(savedResult);

        // Load recent activity logs
        const logs = JSON.parse(localStorage.getItem('skilltrove_activities') || '[]');
        setActivities(logs);
      }
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [subjectId, quizId]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!data || !result) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 flex items-center justify-center">
          <div className="bg-white max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/80 text-center flex flex-col items-center shadow-xs">
            <ShieldAlert className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-display font-extrabold text-black mb-2">Quiz Results Not Found</h2>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              We could not find scorecard logs for the completed diagnostic quiz.
            </p>
            <button onClick={() => navigate('/quiz')} className="w-full py-3.5 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all">
              Return to Quizzes List
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Result card header */}
          <div className="mb-10">
            <ResultCard score={result.score} totalQuestions={result.total} timeTaken={result.timeTaken} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Performance analysis card (span 2) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <PerformanceCard
                summary="Excellent accuracy! You have successfully mastered recursive dynamic state transitions and memory lookup arrays."
                strongAreas={['Memoization lookup arrays', 'Optimal criteria']}
                weakAreas={[]}
              />

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/quiz/${subjectId}/${quizId}`)}
                  className="flex-1 py-3.5 rounded-full border border-slate-200/80 bg-white text-black font-bold hover:bg-slate-50 transition-all text-xs shadow-xs"
                >
                  Retry Diagnostic
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-3.5 rounded-full bg-black text-white font-bold hover:bg-slate-800 transition-all text-xs shadow-xs"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>

            {/* Sidebar tracks (span 1) */}
            <div className="flex flex-col gap-6">
              <ProgressSummaryCard 
                lessonCompletion={80}
                chapterProgress={75}
                overallLearningProgress={65}
              />
              <ActivityCard activities={activities} />
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
