import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockInterviews } from '../features/interview/mock/interviews';
import { mockFeedback } from '../features/interview/mock/feedback';
import { mockScores } from '../features/interview/mock/scores';

// Reusable Components
import EvaluationCard from '../components/interview/EvaluationCard';
import FeedbackCard from '../components/interview/FeedbackCard';
import RecommendationCard from '../components/interview/RecommendationCard';

// Icons
import { ShieldAlert } from 'lucide-react';

export default function EvaluationReport() {
  const { interviewId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeInterview = mockInterviews.find(i => i.id === interviewId);
      // Fallback details if custom round completed
      const score = mockScores[interviewId] || mockScores['int-hr'];
      const feedback = mockFeedback[interviewId] || mockFeedback['int-hr'];

      if (activeInterview) {
        setData({ activeInterview, score, feedback });
      }
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [interviewId]);

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

  if (!data) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 flex items-center justify-center">
          <div className="glass max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/50 text-center flex flex-col items-center">
            <ShieldAlert className="w-12 h-12 text-error mb-4" />
            <h2 className="text-xl font-bold text-primary mb-2">Evaluation Report Not Found</h2>
            <p className="text-xs text-textMuted mb-6 leading-relaxed">
              We could not find scorecard logs for this completed interview session.
            </p>
            <button onClick={() => navigate('/interview')} className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all">
              Return to Hub
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const { activeInterview, score, feedback } = data;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Evaluation score overview */}
          <div className="mb-10 animate-fade-in">
            <EvaluationCard score={score} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Feedback details (span 2) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <FeedbackCard feedback={feedback} />

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/interview/${activeInterview.id}/setup`)}
                  className="flex-1 py-4 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all text-xs"
                >
                  Retry Interview
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all text-xs"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>

            {/* AI recommendations (span 1) */}
            <div className="flex flex-col gap-6">
              <RecommendationCard
                recommendations={feedback.recommendations}
                onAction={() => navigate('/learn')}
              />
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
