import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockPracticeSets } from '../features/practice/mock/practiceSets';
import { mockResults } from '../features/practice/mock/results';
import { 
  Target, Brain, Star, AlertTriangle, History, ChevronRight, 
  Percent, PlayCircle, ArrowRight, CheckCircle2, Clock
} from 'lucide-react';

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
    }, 400);
    return () => clearTimeout(timer);
  }, []);

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

  const continueSet = sets[0] || null;
  const recommendedSet = sets.find(s => s.subjectId === 'logical-reasoning') || sets[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] px-4 md:px-12 py-6 w-full font-body">
        <div className="w-full space-y-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Home</span>
            <span>&gt;</span>
            <span className="text-slate-900 font-semibold">Practice</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-4 pb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">Practice Hub</h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Strengthen your quantitative aptitude and logic accuracy levels.</p>
            </div>
          </div>

          {/* Main 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Main Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Section 1: Continue Practice */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Continue Practice</h2>
                  <p className="text-xs text-slate-500 font-medium">Resume active assessment cycles</p>
                </div>

                {continueSet && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xs">
                    <div className="space-y-2 max-w-md">
                      <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase inline-block">
                        APTITUDE PREP
                      </span>
                      <h3 className="text-xl font-display font-bold text-slate-900">
                        Percentages &amp; Ratios Set
                      </h3>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">
                        10 quick ratio computations and percentage adjustments.
                      </p>
                    </div>

                    {/* Circular Progress Ring & Action Button */}
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                      {/* Circular Progress SVG */}
                      <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-100"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-blue-600"
                            strokeDasharray="65, 100"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-xs font-bold text-slate-900">65%</span>
                      </div>

                      <button
                        onClick={() => navigate(`/practice/${continueSet.subjectId}/${continueSet.id}`)}
                        className="px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs md:text-sm flex items-center gap-1.5 shadow-xs shrink-0 group transition-all"
                      >
                        <span>Start Practice Set</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Recommended Practice */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recommended Practice</h2>
                  <p className="text-xs text-slate-500 font-medium">AI suggestion to balance logic metrics</p>
                </div>

                {recommendedSet && (
                  <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Star className="w-6 h-6 fill-white" />
                      </div>
                      <div>
                        <h4 className="text-base font-display font-bold text-slate-900 tracking-tight">Syllogisms &amp; Sequences Set</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                          LOGICAL REASONING • 3 MINS
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/practice/${recommendedSet.subjectId}/${recommendedSet.id}`)}
                      className="px-5 py-2.5 rounded-full bg-white text-purple-600 border border-purple-200 hover:bg-purple-50 font-semibold text-xs transition-all flex items-center gap-1 shadow-2xs shrink-0"
                    >
                      <span>Launch</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Section 3: Subject Practice Tracks */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Subject Practice Tracks</h2>
                  <p className="text-xs text-slate-500 font-medium">Browse available logic pathways</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-5 shadow-2xs">
                  {/* Track 1: Aptitude */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-bold text-xl flex items-center justify-center shrink-0">
                        %
                      </div>
                      <div className="space-y-1">
                        <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                          APTITUDE
                        </span>
                        <h4 className="text-base font-display font-bold text-slate-900">Percentages &amp; Ratios Set</h4>
                        <p className="text-xs font-medium text-slate-400">10 quick ratio computations and percentage adjustments.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                      <div className="space-y-1 text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Progress</span>
                        <span className="text-xs font-bold text-slate-900 block">12 / 20 Sets</span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>

                      <button
                        onClick={() => navigate('/practice/aptitude/set-1')}
                        className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-all shrink-0"
                      >
                        <span>Start</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Track 2: Logical Reasoning */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Brain className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="bg-purple-50 text-purple-700 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                          LOGICAL REASONING
                        </span>
                        <h4 className="text-base font-display font-bold text-slate-900">Syllogisms &amp; Sequences Set</h4>
                        <p className="text-xs font-medium text-slate-400">Logic puzzles and Venn Diagram relations.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                      <div className="space-y-1 text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Progress</span>
                        <span className="text-xs font-bold text-slate-900 block">8 / 15 Sets</span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-600 rounded-full" style={{ width: '53%' }} />
                        </div>
                      </div>

                      <button
                        onClick={() => navigate('/practice/logical-reasoning/set-1')}
                        className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-all shrink-0"
                      >
                        <span>Start</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar Column (1/3 width) */}
            <div className="space-y-6">
              
              {/* Daily Practice Challenge Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase">
                    DAILY PRACTICE
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-display font-bold text-slate-900">Daily Aptitude Challenge</h3>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">
                    Complete 3 questions in percentages to gain daily double XP points.
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>1 / 3 completed</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '33%' }} />
                  </div>
                </div>

                <button
                  onClick={() => navigate('/practice/aptitude/set-1')}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                >
                  <span>Start Challenge</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Recent Activity Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <History className="w-4 h-4 text-slate-600" />
                    <span>Recent Activity</span>
                  </div>
                  <button 
                    onClick={() => navigate('/my-learning')}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View all
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">APTITUDE SET 1</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">Accuracy: 66%</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">Yesterday</span>
                </div>
              </div>

              {/* Focus Gaps Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Focus Gaps</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold px-3.5 py-1.5 rounded-full text-xs">
                    Venn Diagrams
                  </span>
                  <span className="bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold px-3.5 py-1.5 rounded-full text-xs">
                    Ratios Subtraction
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
}
