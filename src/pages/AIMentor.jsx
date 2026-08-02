import React, { useState } from 'react';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { useAuthStore } from '../hooks/useAuthStore';

// Modular AI Mentor Components
import AIMentorHeader from '../components/aimentor/AIMentorHeader';
import ConversationPanel from '../components/aimentor/ConversationPanel';
import RecommendationPanel from '../components/aimentor/RecommendationPanel';
import LearningInsightsPanel from '../components/aimentor/LearningInsightsPanel';
import CareerInsightsPanel from '../components/aimentor/CareerInsightsPanel';
import { ShieldAlert } from 'lucide-react';

export default function AIMentor() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const studentName = user?.name?.split(' ')[0] || 'Scholar';

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-28 pb-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (hasError) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-6 flex items-center justify-center">
          <div className="max-w-md w-full p-8 border border-slate-200 bg-white text-center flex flex-col items-center">
            <ShieldAlert className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-bold text-black mb-2">AI Coach Unavailable</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We encountered an issue connecting to your career guidance engine.
            </p>
            <button
              onClick={() => setHasError(false)}
              className="w-full py-4 bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all"
            >
              Retry Connection
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
          
          {/* AI Mentor Header */}
          <AIMentorHeader
            name={studentName}
            streak="7 Days"
            progress={74}
            weeklyGoal="5 / 7 Days"
          />

          {/* Conversation Panel (Interactive AI Coach Chat UI) */}
          <ConversationPanel />

          {/* Intelligent Recommendation Panel */}
          <RecommendationPanel />

          {/* Learning Insights Panel */}
          <LearningInsightsPanel />

          {/* Career Insights Panel */}
          <CareerInsightsPanel />

        </div>
      </div>
    </PageTransition>
  );
}
