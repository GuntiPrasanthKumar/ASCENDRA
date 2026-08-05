import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockPracticeSets } from '../features/practice/mock/practiceSets';
import { mockResults } from '../features/practice/mock/results';
import SectionHeader from '../components/dashboard/SectionHeader';
import { Brain, ArrowRight, Star, AlertTriangle, History, ChevronRight } from 'lucide-react';

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
        <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  const continueSet = sets[0] || null;
  const recommendedSet = sets.find(s => s.subjectId === 'logical-reasoning') || sets[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-10 pb-6 border-b border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-black flex items-center justify-center">
              <Brain className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-black tracking-tight">Practice Hub</h1>
              <p className="text-xs font-semibold text-slate-500 mt-1">Strengthen your quantitative aptitude and logic accuracy levels.</p>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            
            {/* Continue Practice Banner */}
            {continueSet && (
              <div>
                <SectionHeader title="Continue Practice" subtitle="Resume active assessment cycles" />
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-black mb-3 inline-block">
                      Aptitude Prep
                    </span>
                    <h3 className="text-xl font-display font-extrabold text-black mb-1 tracking-tight">
                      {continueSet.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">{continueSet.description}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/practice/${continueSet.subjectId}/${continueSet.id}`)}
                    className="px-6 py-3.5 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 active:scale-[0.98]"
                  >
                    <span>Start Practice Set</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                
                {/* Recommended Practice */}
                {recommendedSet && (
                  <div>
                    <SectionHeader title="Recommended Practice" subtitle="AI suggestion to balance logic metrics" />
                    <div className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 flex items-center justify-between gap-4 shadow-xs">
                      <div className="flex gap-4 items-center">
                        <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-black">
                          <Star className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h4 className="text-base font-display font-extrabold text-black tracking-tight">{recommendedSet.title}</h4>
                          <span className="text-[10px] font-black uppercase text-slate-500 block mt-0.5 tracking-wider">Logical Reasoning • {recommendedSet.timeLimit}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/practice/${recommendedSet.subjectId}/${recommendedSet.id}`)}
                        className="px-5 py-2.5 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-1"
                      >
                        <span>Launch</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Subject Practice Sets List */}
                <div>
                  <SectionHeader title="Subject Practice Tracks" subtitle="Browse available logic pathways" />
                  <div className="flex flex-col gap-4">
                    {sets.map((set) => (
                      <div
                        key={set.id}
                        className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-slate-300 transition-all duration-300 shadow-xs"
                      >
                        <div>
                          <span className="text-[10px] font-black uppercase text-black bg-slate-100 border border-slate-200 px-3 py-0.5 rounded-full tracking-wider block w-fit mb-2">
                            {set.subjectId === 'aptitude' ? 'Aptitude' : 'Logical Reasoning'}
                          </span>
                          <h4 className="text-base font-display font-extrabold text-black group-hover:text-slate-600 transition-colors tracking-tight">
                            {set.title}
                          </h4>
                          <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">{set.description}</p>
                        </div>

                        <button
                          onClick={() => navigate(`/practice/${set.subjectId}/${set.id}`)}
                          className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-slate-800 transition-all flex items-center gap-1 shrink-0 text-xs font-bold"
                        >
                          <span>Start</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-8">
                
                {/* Daily Practice Quest */}
                <div className="bg-white p-7 rounded-[1.75rem] border border-slate-200/80 flex flex-col justify-between h-full group hover:border-slate-300 transition-all duration-300 shadow-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-black flex items-center gap-1 w-fit mb-4">
                      Daily Practice
                    </span>
                    <h3 className="text-lg font-display font-extrabold text-black mb-2 tracking-tight">Daily Aptitude Challenge</h3>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6">Complete 3 questions in percentages to gain daily double XP points.</p>
                  </div>
                  <button
                    onClick={() => navigate('/practice/aptitude/set-1')}
                    className="w-full py-3.5 rounded-full bg-black text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 text-xs"
                  >
                    <span>Start Challenge</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Recent Practice History */}
                <div className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 shadow-xs">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                    <History className="w-4 h-4 text-black" /> Recent Activity
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    {results.map((res, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 flex justify-between items-center">
                        <div>
                          <span className="font-black text-[9px] uppercase tracking-wider block text-slate-400">Aptitude Set 1</span>
                          <span className="font-bold text-black">Accuracy: {res.accuracy}%</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{res.completedAt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Focus Gaps */}
                <div className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 shadow-xs">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-black" /> Focus Gaps
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-black">
                      Venn Diagrams
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-black">
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
