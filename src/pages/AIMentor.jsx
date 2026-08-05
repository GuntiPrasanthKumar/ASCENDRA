import React, { useState } from 'react';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { useAuthStore } from '../hooks/useAuthStore';

// AI Mentor Redesign Components
import ConversationWorkspace from '../components/aimentor/ConversationWorkspace';
import UnifiedAIBriefingPanel from '../components/aimentor/UnifiedAIBriefingPanel';
import { ShieldAlert } from 'lucide-react';

export default function AIMentor() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const studentName = user?.name?.split(' ')[0] || 'Scholar';

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

  if (hasError) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 flex items-center justify-center">
          <div className="max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/80 bg-white text-center flex flex-col items-center shadow-xs">
            <ShieldAlert className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-display font-extrabold text-black mb-2">AI Mentor Workspace Offline</h2>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              We encountered an issue connecting to your career guidance engine.
            </p>
            <button
              onClick={() => setHasError(false)}
              className="w-full py-3.5 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all"
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
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* AI Mentor 70% / 30% NotebookLM Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
            
            {/* Left 70%: Conversation Workspace & Quick Action Chips */}
            <div className="lg:col-span-7">
              <ConversationWorkspace userName={studentName} />
            </div>

            {/* Right 30%: Single Unified AI Briefing Panel */}
            <div className="lg:col-span-3">
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
