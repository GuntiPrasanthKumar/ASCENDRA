import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockPracticeSets } from '../features/practice/mock/practiceSets';
import { mockResults } from '../features/practice/mock/results';
import SectionHeader from '../components/dashboard/SectionHeader';
import { Calculator, Brain, Code, ArrowRight, PlayCircle, Star, AlertTriangle, History } from 'lucide-react';
import { motion } from 'framer-motion';

const ICONS = {
  Calculator: <Calculator className="w-5 h-5 text-indigo-600" />,
  Brain: <Brain className="w-5 h-5 text-accent" />,
  Code: <Code className="w-5 h-5 text-success" />
};

export default function Practice() {
  const [sets, setSets] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSets(mockPracticeSets);
      setResults(mockResults);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  // Find dynamic sections
  const continueSet = sets[0] || null;
  const recommendedSet = sets.find(s => s.subjectId === 'logical-reasoning') || sets[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/[0.01] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/5">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-extrabold text-primary">Practice Hub</h1>
              <p className="text-textMuted text-xs font-medium mt-1">Strengthen your quantitative aptitude and logic accuracy levels.</p>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            
            {/* 1. Continue Practice Banner */}
            {continueSet && (
              <div>
                <SectionHeader title="Continue Practice" subtitle="Resume active assessment cycles" />
                <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-primary/[0.02] to-indigo-600/[0.02] group">
                  <div>
                    <span className="text-[10px] font-black text-primary bg-primary/5 border border-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                      Aptitude Prep
                    </span>
                    <h3 className="text-xl font-bold font-display text-primary mb-1">
                      {continueSet.title}
                    </h3>
                    <p className="text-xs text-textMuted font-medium">{continueSet.description}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/practice/${continueSet.subjectId}/${continueSet.id}`)}
                    className="px-6 py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-primary/15 group-hover:scale-[1.01]"
                  >
                    <PlayCircle className="w-4.5 h-4.5" /> Start Practice Set
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Recommended & Subject Lists (span 2) */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                
                {/* 2. Recommended Practice */}
                {recommendedSet && (
                  <div>
                    <SectionHeader title="Recommended Practice" subtitle="AI suggestion to balance logic metrics" />
                    <div className="glass p-6 rounded-3xl border border-slate-200/50 flex items-center justify-between gap-4 hover:border-indigo-650/20 transition-all duration-300">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500">
                          <Star className="w-5 h-5 fill-amber-500/10" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{recommendedSet.title}</h4>
                          <span className="text-[9px] font-black uppercase text-slate-500 block mt-0.5">Logical Reasoning • {recommendedSet.timeLimit}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/practice/${recommendedSet.subjectId}/${recommendedSet.id}`)}
                        className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-primary transition-all"
                      >
                        Launch
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Subject Practice Sets List */}
                <div>
                  <SectionHeader title="Subject Practice Tracks" subtitle="Browse available logic pathways" />
                  <div className="flex flex-col gap-4">
                    {sets.map((set) => (
                      <div
                        key={set.id}
                        className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-accent/20 transition-all duration-300 w-full"
                      >
                        <div>
                          <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full tracking-wider block w-fit mb-2">
                            {set.subjectId === 'aptitude' ? 'Aptitude' : 'Logical Reasoning'}
                          </span>
                          <h4 className="font-bold text-slate-800 text-base group-hover:text-accent transition-colors">
                            {set.title}
                          </h4>
                          <p className="text-xs text-textMuted mt-1 leading-relaxed">{set.description}</p>
                        </div>

                        <button
                          onClick={() => navigate(`/practice/${set.subjectId}/${set.id}`)}
                          className="px-5 py-3.5 rounded-2xl bg-slate-905 text-slate-800 hover:bg-primary hover:text-white transition-all flex items-center gap-1.5 shrink-0 border border-slate-200"
                        >
                          Start <PlayCircle className="w-4 h-4 shrink-0" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Daily, Recent & Weak Topics (span 1) */}
              <div className="flex flex-col gap-8">
                
                {/* Daily Practice Quest */}
                <div className="glass p-6 rounded-[2.5rem] border border-slate-200/50 bg-gradient-to-br from-indigo-500/[0.04] to-accent/[0.04] border-indigo-500/15 flex flex-col justify-between h-full group hover:border-indigo-500/35 transition-all duration-300">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-50/50 border border-indigo-100/50 text-indigo-600 flex items-center gap-1 w-fit mb-4">
                      Daily Practice
                    </span>
                    <h3 className="text-lg font-bold font-display text-slate-800 mb-2">Daily Aptitude Challenge</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">Complete 3 questions in percentages to gain daily double XP points.</p>
                  </div>
                  <button
                    onClick={() => navigate('/practice/aptitude/set-1')}
                    className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01] text-xs"
                  >
                    Start Challenge <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 5. Recent Practice History */}
                <div className="glass p-6 rounded-3xl border border-slate-200/50">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 pl-1 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-slate-400" /> Recent Activity
                  </h4>
                  <div className="flex flex-col gap-3">
                    {results.map((res, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100/50 text-[10px] text-textMuted leading-relaxed flex justify-between items-center">
                        <div>
                          <span className="font-extrabold text-[8px] uppercase tracking-wider block text-slate-500 mb-0.5">Aptitude Set 1</span>
                          <span>Accuracy: {res.accuracy}%</span>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400">{res.completedAt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Weak Topics */}
                <div className="glass p-6 rounded-3xl border border-slate-200/50">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 pl-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-accent" /> Focus Gaps
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-red-500/5 border border-red-500/10 text-red-600">
                      Venn Diagrams
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-red-500/5 border border-red-500/10 text-red-600">
                      Ratios Subtraction
                    </span>
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
