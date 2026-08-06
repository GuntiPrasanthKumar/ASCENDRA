import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton, EmptyState } from '../components/common/FeedbackStates';
import { mockProblems } from '../features/codelab/mock/problems';
import { mockSubmissions } from '../features/codelab/mock/submissions';
import ProblemCard from '../components/codelab/ProblemCard';
import { 
  Code, Code2, ShieldAlert, Star, History, Filter, Zap, 
  CheckCircle2, ChevronRight, Search, Sparkles, Target, ChevronLeft
} from 'lucide-react';

export default function CodeLabHome() {
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setProblems(mockProblems);
      
      const completedCoding = JSON.parse(localStorage.getItem('completed_coding') || '[]');
      if (completedCoding.length > 0) {
        setProblems(prev => prev.map(p => completedCoding.includes(p.id) ? { ...p, solved: true } : p));
      }

      setSubmissions(mockSubmissions);
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

  const allTopics = ['All', 'Strings', 'Two Pointers', 'Arrays', 'Hash Table', 'Dynamic Programming', 'Stack'];

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesTopic = topicFilter === 'All' || p.tags?.includes(topicFilter);
    return matchesSearch && matchesDiff && matchesTopic;
  });

  const dailyProblem = problems.find(p => p.id === 'two-sum') || problems[0];
  const recommendedProblem = problems.find(p => p.difficulty === 'Medium') || problems[0];
  const continueProblem = problems.find(p => p.id === 'two-sum') || problems[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] px-4 md:px-12 py-6 w-full font-body">
        <div className="w-full space-y-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Home</span>
            <span>&gt;</span>
            <span className="text-slate-900 font-semibold">CodeLab</span>
          </div>

          {/* Header & Quick Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">CodeLab Studio</h1>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Monaco editor, multi-language compilation simulator, and AI code quality analysis.</p>
              </div>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems..." 
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 shadow-2xs transition-colors"
              />
            </div>
          </div>

          {/* Main 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Section 1: Continue Coding */}
              {!searchQuery && continueProblem && (
                <div className="space-y-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Continue Coding</h2>
                    <p className="text-xs text-slate-500 font-medium">Pick up where you left off</p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xs relative overflow-hidden">
                    <div className="space-y-2 max-w-xl z-10">
                      <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase inline-block border border-emerald-100">
                        ACTIVE CHALLENGE • EASY
                      </span>
                      <h3 className="text-2xl font-display font-bold text-slate-900">
                        Two Sum
                      </h3>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">
                        Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.
                      </p>
                    </div>

                    <div className="flex items-center gap-6 z-10 w-full md:w-auto justify-between md:justify-end">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 hidden sm:flex">
                        <Code2 className="w-7 h-7" />
                      </div>

                      <button
                        onClick={() => navigate(`/codelab/${continueProblem.id}`)}
                        className="px-6 py-3.5 rounded-full bg-black hover:bg-slate-800 text-white font-semibold text-xs md:text-sm flex items-center gap-1.5 shadow-xs shrink-0 group transition-all"
                      >
                        <span>Open CodeLab Workspace</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: Recommended Challenge */}
              {!searchQuery && recommendedProblem && (
                <div className="space-y-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recommended Challenge</h2>
                    <p className="text-xs text-slate-500 font-medium">Algorithmic structures custom suggested by AI coach</p>
                  </div>

                  <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-display font-bold text-slate-900 tracking-tight">Longest Palindromic Substring</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                          STRINGS • DYNAMIC PROGRAMMING • MEDIUM
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/codelab/${recommendedProblem.id}`)}
                      className="px-5 py-2.5 rounded-full bg-white text-purple-600 border border-purple-200 hover:bg-purple-50 font-semibold text-xs transition-all flex items-center gap-1 shadow-2xs shrink-0"
                    >
                      <span>Launch</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Section 3: Problem Explorer */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Problem Explorer</h2>
                  <p className="text-xs text-slate-500 font-medium">Browse algorithm challenges by topic and difficulty</p>
                </div>

                {/* Filter Toolbar */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3.5 shadow-2xs">
                  {/* Row 1: Difficulty */}
                  <div className="flex items-center gap-3 flex-wrap text-xs">
                    <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5 text-slate-600" /> DIFFICULTY:
                    </span>
                    {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficultyFilter(diff)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          difficultyFilter === diff
                            ? 'bg-black text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>

                  {/* Row 2: Topic */}
                  <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-slate-100">
                    <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider">
                      TOPIC:
                    </span>
                    {allTopics.map((top) => (
                      <button
                        key={top}
                        onClick={() => setTopicFilter(top)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          topicFilter === top
                            ? 'bg-black text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {top}
                      </button>
                    ))}
                    <button className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Problem Cards List */}
                <div className="space-y-4">
                  {filteredProblems.length === 0 ? (
                    <EmptyState
                      icon={ShieldAlert}
                      title="No Coding Problems Match"
                      description="Try adjusting your active difficulty or topic filters."
                    />
                  ) : (
                    filteredProblems.map((prob) => (
                      <ProblemCard
                        key={prob.id}
                        problem={prob}
                        onSelect={() => navigate(`/codelab/${prob.id}`)}
                      />
                    ))
                  )}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 shadow-2xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {[1, 2, 3, 4, 5].map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <span className="text-xs text-slate-400 font-semibold px-1">...</span>

                  <button
                    onClick={() => setCurrentPage(20)}
                    className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 shadow-2xs"
                  >
                    20
                  </button>

                  <button 
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 shadow-2xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right Sidebar Column (1/3 width) */}
            <div className="space-y-6">
              
              {/* Daily Challenge Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Zap className="w-4 h-4 text-slate-700" />
                    <span>Daily Challenge</span>
                  </div>
                  <button 
                    onClick={() => navigate('/codelab')}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View all
                  </button>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-display font-bold text-slate-900">Two Sum</h3>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-4">
                    Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.
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
                  onClick={() => navigate('/codelab/two-sum')}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                >
                  <span>Solve Daily Challenge</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Recent Submissions Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <History className="w-4 h-4 text-slate-600" />
                    <span>Recent Submissions</span>
                  </div>
                  <button 
                    onClick={() => navigate('/my-learning')}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View all
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block">Reverse String</span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Accepted • JavaScript
                    </span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-[11px] font-medium text-slate-400 block">3 days ago</span>
                    <span className="text-xs font-bold text-slate-900 block">84 ms</span>
                  </div>
                </div>
              </div>

              {/* Focus Areas Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>Focus Areas</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-50 text-blue-700 font-semibold px-3.5 py-1.5 rounded-full text-xs">
                    String Manipulation
                  </span>
                  <span className="bg-blue-50 text-blue-700 font-semibold px-3.5 py-1.5 rounded-full text-xs">
                    Two Pointers
                  </span>
                  <span className="bg-blue-50 text-blue-700 font-semibold px-3.5 py-1.5 rounded-full text-xs">
                    Hash Tables
                  </span>
                  <span className="bg-blue-50 text-blue-700 font-semibold px-3.5 py-1.5 rounded-full text-xs">
                    Sliding Window
                  </span>
                </div>
              </div>

              {/* Improve Faster with AI Coach Card */}
              <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-purple-50/60 border border-blue-100 rounded-3xl p-6 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Improve Faster with AI Coach</span>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  Get personalized hints, explanations, and learning paths.
                </p>
                <button
                  onClick={() => navigate('/ai-coach')}
                  className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-2xs transition-all"
                >
                  <span>Ask AI Coach</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
}
