import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockInterviews } from '../features/interview/mock/interviews';
import { mockFeedback } from '../features/interview/mock/feedback';
import { mockScores } from '../features/interview/mock/scores';
import api from '../utils/api';

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
    const fetchReport = async () => {
      const activeInterview = mockInterviews.find(i => i.id === interviewId);
      let score = mockScores[interviewId] || mockScores['int-hr'];
      let feedback = mockFeedback[interviewId] || mockFeedback['int-hr'];

      try {
        const res = await api.get(`/interview/report/${interviewId}`);
        const rep = res.data?.data;
        if (rep) {
          score = {
            overall: rep.overallScore,
            communication: rep.communicationScore,
            technical: rep.technicalScore,
            problemSolving: rep.problemSolvingScore,
            gazeStability: 96,
            verdict: rep.readinessBadge === 'TIER_1_READY' ? 'Strong Hire' : 'Hire'
          };
          feedback = {
            strengths: rep.strengths || feedback.strengths,
            weaknesses: rep.weaknesses || feedback.weaknesses,
            recommendations: rep.recommendations || feedback.recommendations
          };
        }
      } catch (e) {
        // Fallback to local mock data
      }

      if (activeInterview) {
        setData({ activeInterview, score, feedback });
      }
      setIsLoading(false);
    };

    fetchReport();
  }, [interviewId]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6">
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
        <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 flex items-center justify-center">
          <div className="bg-white max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/80 text-center flex flex-col items-center shadow-xs">
            <ShieldAlert className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-display font-extrabold text-black mb-2">Evaluation Report Not Found</h2>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              We could not find scorecard logs for this completed interview session.
            </p>
            <button onClick={() => navigate('/interview')} className="w-full py-3.5 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all">
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
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Evaluation score overview */}
          <div className="mb-10">
            <EvaluationCard score={score} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Feedback details (span 2) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <FeedbackCard feedback={feedback} />

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/interview/${activeInterview.id}/setup`)}
                  className="flex-1 py-3.5 rounded-full border border-slate-200/80 bg-white text-black font-bold hover:bg-slate-50 transition-all text-xs shadow-xs"
                >
                  Retry Interview
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-3.5 rounded-full bg-black text-white font-bold hover:bg-slate-800 transition-all text-xs shadow-xs"
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
