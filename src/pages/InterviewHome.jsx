import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockInterviews } from '../features/interview/mock/interviews';
import InterviewCard from '../components/interview/InterviewCard';
import SectionHeader from '../components/dashboard/SectionHeader';
import { Video, ShieldAlert, PlayCircle, History } from 'lucide-react';

export default function InterviewHome() {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setInterviews(mockInterviews);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 animate-pulse">
          <div className="max-w-7xl mx-auto">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  const continueInterview = interviews[0] || null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/5">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-extrabold text-primary">Interview Studio</h1>
              <p className="text-textMuted text-xs font-medium mt-1">Practice simulated placement rounds with gaze stability proctoring checks.</p>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            
            {/* 1. Continue Interview Banner */}
            {continueInterview && (
              <div>
                <SectionHeader title="Continue Interview Session" subtitle="Resume active diagnostic sessions" />
                <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-primary/[0.02] to-indigo-600/[0.02] group">
                  <div>
                    <span className="text-[10px] font-black text-primary bg-primary/5 border border-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                      Diagnostic Prep
                    </span>
                    <h3 className="text-xl font-bold font-display text-primary mb-1">
                      {continueInterview.title}
                    </h3>
                    <p className="text-xs text-textMuted font-medium">{continueInterview.description}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/interview/${continueInterview.id}/setup`)}
                    className="px-6 py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-primary/15 group-hover:scale-[1.01]"
                  >
                    <PlayCircle className="w-4.5 h-4.5" /> Initialize Setup
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Interview Grid (span 2) */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                <div>
                  <SectionHeader title="Interview Categories" subtitle="Choose placement paths to rehearse" />
                  
                  {interviews.length === 0 ? (
                    <div className="glass p-12 rounded-[2rem] border border-dashed border-slate-200/50 text-center flex flex-col items-center justify-center">
                      <ShieldAlert className="w-8 h-8 text-slate-350 mb-2 animate-pulse" />
                      <h4 className="font-bold text-slate-700">No Categories Found</h4>
                      <p className="text-xs text-textMuted mt-1">Interviews are currently locked.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
                      {interviews.map((int) => (
                        <InterviewCard
                          key={int.id}
                          title={int.title}
                          category={int.category}
                          duration={int.duration}
                          difficulty={int.difficulty}
                          description={int.description}
                          onSelect={() => navigate(`/interview/${int.id}/setup`)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Solved History (span 1) */}
              <div className="flex flex-col gap-8">
                
                {/* Recent activity history log */}
                <div className="glass p-6 rounded-3xl border border-slate-200/50">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 pl-1 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-slate-400" /> Recent Rehearsals
                  </h4>
                  <div className="flex flex-col gap-3 text-[10px] text-textMuted">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100/50 flex justify-between items-center leading-relaxed">
                      <div>
                        <span className="font-extrabold text-[8px] uppercase tracking-wider block text-slate-500 mb-0.5">HR Interview</span>
                        <span className="text-success font-bold">Passed</span>
                      </div>
                      <span className="text-[8px] font-bold text-slate-400">2 days ago</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
