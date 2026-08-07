import React, { useState } from 'react';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { useAuthStore } from '../hooks/useAuthStore';
import ConversationWorkspace from '../components/aimentor/ConversationWorkspace';
import UnifiedAIBriefingPanel from '../components/aimentor/UnifiedAIBriefingPanel';
import { ShieldAlert } from 'lucide-react';

export default function AIMentor() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const studentName = user?.name?.split(' ')[0] || 'Vijay';

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#F8F9FA] px-4 md:px-12 py-6 w-full">
          <div className="w-full">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (hasError) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#F8F9FA] px-4 md:px-12 py-6 flex items-center justify-center">
          <div className="max-w-md w-full p-8 rounded-3xl border border-slate-200/80 bg-white text-center flex flex-col items-center shadow-2xs">
            <ShieldAlert className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-display font-bold text-slate-900 mb-2">AI Mentor Workspace Offline</h2>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              We encountered an issue connecting to your career guidance engine.
            </p>
            <button
              onClick={() => setHasError(false)}
              className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs"
            >
              Reconnect Mentor Engine
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] px-4 md:px-12 py-6 w-full font-body">
        <div className="w-full">
          
          {/* AI Mentor 2-Column Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left 2/3: Conversation Workspace */}
            <div className="lg:col-span-2">
              <ConversationWorkspace userName={studentName} />
            </div>

            {/* Right 1/3: AI Briefing Center Sidebar */}
            <div>
              <UnifiedAIBriefingPanel 
                progress={74}
                weeklyGoal="5 / 7 Days"
                streak="7 Days"
              />
            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
}
