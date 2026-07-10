import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockProblems } from '../features/codelab/mock/problems';
import { mockSubmissions } from '../features/codelab/mock/submissions';
import SectionHeader from '../components/dashboard/SectionHeader';
import { Code, ShieldAlert, Award, Star, History, PlayCircle } from 'lucide-react';

export default function CodeLabHome() {
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setProblems(mockProblems);
      setSubmissions(mockSubmissions);
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

  // Filter problems by difficulty
  const filteredProblems = problems.filter(p => activeFilter === 'All' || p.difficulty === activeFilter);

  const dailyProblem = problems[0] || null;
  const recommendedProblem = problems[1] || problems[0] || null;
  const continueProblem = problems[0] || null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/5">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-extrabold text-primary">Coding Lab</h1>
              <p className="text-textMuted text-xs font-medium mt-1">Compile solutions, pass edge tests, and review quality diagnostics.</p>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            
            {/* 1. Continue Coding Banner */}
            {continueProblem && (
              <div>
                <SectionHeader title="Continue Coding" subtitle="Pick up from where you left off" />
                <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-primary/[0.02] to-indigo-600/[0.02] group">
                  <div>
                    <span className="text-[10px] font-black text-primary bg-primary/5 border border-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                      Active Challenge
                    </span>
                    <h3 className="text-xl font-bold font-display text-primary mb-1">
                      {continueProblem.title}
                    </h3>
                    <p className="text-xs text-textMuted font-medium">{continueProblem.description}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/codelab/${continueProblem.id}`)}
                    className="px-6 py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-primary/15 group-hover:scale-[1.01]"
                  >
                    <PlayCircle className="w-4.5 h-4.5" /> Open Workspace
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Recommended & Problem Lists (span 2) */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                
                {/* Recommended problem */}
                {recommendedProblem && (
                  <div>
                    <SectionHeader title="Recommended Challenge" subtitle="Algorithmic structures custom suggested by AI coach" />
                    <div className="glass p-6 rounded-3xl border border-slate-200/50 flex items-center justify-between gap-4">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500 animate-pulse">
                          <Star className="w-5 h-5 fill-amber-500/10" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{recommendedProblem.title}</h4>
                          <span className="text-[9px] font-black uppercase text-slate-500 block mt-0.5">Focus: Arrays & Hash • {recommendedProblem.difficulty}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/codelab/${recommendedProblem.id}`)}
                        className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-primary transition-all"
                      >
                        Launch
                      </button>
                    </div>
                  </div>
                )}

                {/* Problems list with filter toolbar */}
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <SectionHeader title="Challenge Bank" subtitle="Choose algorithms to practice" />
                    
                    {/* Filters */}
                    <div className="flex gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl select-none self-end sm:self-auto">
                      {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setActiveFilter(diff)}
                          className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                            activeFilter === diff
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {filteredProblems.length === 0 ? (
                      <div className="glass p-12 rounded-[2rem] border border-dashed border-slate-200/50 text-center flex flex-col items-center justify-center">
                        <ShieldAlert className="w-8 h-8 text-slate-350 mb-2" />
                        <h4 className="font-bold text-slate-700">No Problems Found</h4>
                        <p className="text-xs text-textMuted mt-1 font-medium">Refine your active difficulty level filter tabs.</p>
                      </div>
                    ) : (
                      filteredProblems.map((prob) => {
                        const isEasy = prob.difficulty === 'Easy';
                        return (
                          <div
                            key={prob.id}
                            className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-accent/20 transition-all duration-300 w-full"
                          >
                            <div>
                              <div className="flex gap-2 items-center mb-2">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                                  isEasy ? 'bg-success/5 border-success/15 text-success' : 'bg-warning/5 border-warning/15 text-warning'
                                }`}>
                                  {prob.difficulty}
                                </span>
                                {prob.tags.map((t, idx) => (
                                  <span key={idx} className="text-[9px] font-extrabold text-slate-400">
                                    • {t}
                                  </span>
                                ))}
                              </div>
                              <h4 className="font-bold text-slate-800 text-base group-hover:text-accent transition-colors">
                                {prob.title}
                              </h4>
                              <p className="text-xs text-textMuted mt-1 leading-relaxed">{prob.description}</p>
                            </div>

                            <button
                              onClick={() => navigate(`/codelab/${prob.id}`)}
                              className="px-5 py-3.5 rounded-2xl bg-slate-905 text-slate-800 hover:bg-primary hover:text-white transition-all flex items-center gap-1.5 shrink-0 border border-slate-200"
                            >
                              Code <PlayCircle className="w-4 h-4 shrink-0" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column: Daily Quest & Solved History (span 1) */}
              <div className="flex flex-col gap-8">
                
                {/* Daily Quest */}
                {dailyProblem && (
                  <div className="glass p-6 rounded-[2.5rem] border border-slate-200/50 bg-gradient-to-br from-indigo-500/[0.04] to-accent/[0.04] border-indigo-500/15 flex flex-col justify-between h-full group hover:border-indigo-500/35 transition-all duration-300">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-50/50 border border-indigo-100/50 text-indigo-600 flex items-center gap-1 w-fit mb-4">
                        Daily Challenge
                      </span>
                      <h3 className="text-lg font-bold font-display text-slate-800 mb-2">{dailyProblem.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">{dailyProblem.description}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/codelab/${dailyProblem.id}`)}
                      className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01] text-xs"
                    >
                      Solve Daily Challenge <PlayCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Solved history logs */}
                <div className="glass p-6 rounded-3xl border border-slate-200/50">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 pl-1 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-slate-400" /> Solved History
                  </h4>
                  <div className="flex flex-col gap-3">
                    {submissions.map((sub, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100/50 text-[10px] text-textMuted leading-relaxed flex justify-between items-center">
                        <div>
                          <span className="font-extrabold text-[8px] uppercase tracking-wider block text-slate-500 mb-0.5">{sub.problemId === 'reverse-string' ? 'Reverse String' : 'Two Sum'}</span>
                          <span className="text-success font-bold">{sub.status}</span>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400">{sub.submittedAt}</span>
                      </div>
                    ))}
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
