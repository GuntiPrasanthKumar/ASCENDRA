import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton, EmptyState } from '../components/common/FeedbackStates';
import { mockProblems } from '../features/codelab/mock/problems';
import { mockSubmissions } from '../features/codelab/mock/submissions';
import SectionHeader from '../components/dashboard/SectionHeader';
import ProblemCard from '../components/codelab/ProblemCard';
import { Code, ShieldAlert, Star, History, PlayCircle, Filter, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CodeLabHome() {
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setProblems(mockProblems);
      
      // Load any locally persisted solved problems
      const completedCoding = JSON.parse(localStorage.getItem('completed_coding') || '[]');
      if (completedCoding.length > 0) {
        setProblems(prev => prev.map(p => completedCoding.includes(p.id) ? { ...p, solved: true } : p));
      }

      setSubmissions(mockSubmissions);
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

  // Filter topics list dynamically from problems
  const allTopics = ['All', ...new Set(problems.flatMap(p => p.tags || []))];

  // Filter problems by Search, Difficulty, and Topic
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesTopic = topicFilter === 'All' || p.tags?.includes(topicFilter);
    return matchesSearch && matchesDiff && matchesTopic;
  });

  const dailyProblem = problems.find(p => p.id === 'two-sum') || problems[0];
  const recommendedProblem = problems.find(p => p.difficulty === 'Medium') || problems[0];
  const continueProblem = problems.find(p => !p.solved) || problems[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/5">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-extrabold text-primary">CodeLab Studio</h1>
                <p className="text-textMuted text-xs font-medium mt-1">Monaco editor, multi-language compilation simulator, and AI code quality analysis.</p>
              </div>
            </div>

            {/* Quick Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems..."
              className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
            />
          </div>

          <div className="flex flex-col gap-10">
            
            {/* 1. Continue Coding Banner */}
            {continueProblem && !searchQuery && (
              <div>
                <SectionHeader title="Continue Coding" subtitle="Pick up where you left off" />
                <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-primary/[0.02] to-indigo-600/[0.02] group">
                  <div>
                    <span className="text-[10px] font-black text-primary bg-primary/5 border border-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                      Active Challenge • {continueProblem.difficulty}
                    </span>
                    <h3 className="text-xl font-bold font-display text-primary mb-1">
                      {continueProblem.title}
                    </h3>
                    <p className="text-xs text-textMuted font-medium leading-relaxed max-w-2xl">{continueProblem.description}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/codelab/${continueProblem.id}`)}
                    className="px-6 py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-primary/15 group-hover:scale-[1.01]"
                  >
                    <PlayCircle className="w-4.5 h-4.5" /> Open CodeLab Workspace
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Recommended & Problem Explorer List (span 2) */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                
                {/* 2. Recommended Problem */}
                {recommendedProblem && !searchQuery && (
                  <div>
                    <SectionHeader title="Recommended Challenge" subtitle="Algorithmic structures custom suggested by AI coach" />
                    <div className="glass p-6 rounded-3xl border border-slate-200/50 flex items-center justify-between gap-4">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500">
                          <Star className="w-5 h-5 fill-amber-500/10" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{recommendedProblem.title}</h4>
                          <span className="text-[9px] font-black uppercase text-slate-500 block mt-0.5">
                            {recommendedProblem.tags?.join(' • ')} • {recommendedProblem.difficulty}
                          </span>
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

                {/* 3. Problem Explorer & Filters */}
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <SectionHeader title="Problem Explorer" subtitle="Browse algorithm challenges by topic and difficulty" />
                  </div>

                  {/* Filter Toolbar */}
                  <div className="glass p-4 rounded-2xl border border-slate-200/50 flex flex-wrap gap-4 items-center justify-between mb-6">
                    {/* Difficulty Pills */}
                    <div className="flex gap-1.5 flex-wrap items-center">
                      <span className="text-[10px] font-black uppercase text-slate-400 mr-1 flex items-center gap-1">
                        <Filter className="w-3 h-3" /> Difficulty:
                      </span>
                      {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setDifficultyFilter(diff)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                            difficultyFilter === diff
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>

                    {/* Topic Pills */}
                    <div className="flex gap-1.5 flex-wrap items-center">
                      <span className="text-[10px] font-black uppercase text-slate-400 mr-1">Topic:</span>
                      {allTopics.map((top) => (
                        <button
                          key={top}
                          onClick={() => setTopicFilter(top)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                            topicFilter === top
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {top}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Problem Cards List */}
                  <div className="flex flex-col gap-4">
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
                </div>

              </div>

              {/* Right Column: Daily Challenge & Solved History (span 1) */}
              <div className="flex flex-col gap-8">
                
                {/* Daily Challenge */}
                {dailyProblem && (
                  <div className="glass p-6 rounded-[2.5rem] border border-slate-200/50 bg-gradient-to-br from-indigo-500/[0.04] to-accent/[0.04] border-indigo-500/15 flex flex-col justify-between h-full group hover:border-indigo-500/35 transition-all duration-300">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-50/50 border border-indigo-100/50 text-indigo-600 flex items-center gap-1 w-fit mb-4">
                        <Sparkles className="w-3.5 h-3.5" /> Daily Challenge
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

                {/* Recent Submissions */}
                <div className="glass p-6 rounded-3xl border border-slate-200/50">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 pl-1 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-slate-400" /> Recent Submissions
                  </h4>
                  <div className="flex flex-col gap-3">
                    {submissions.map((sub, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] text-textMuted leading-relaxed flex justify-between items-center">
                        <div>
                          <span className="font-bold text-[10px] text-slate-800 block mb-0.5">
                            {sub.problemId === 'reverse-string' ? 'Reverse String' : 'Two Sum'}
                          </span>
                          <span className="text-success font-black flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {sub.status} • {sub.language}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-bold text-slate-400 block">{sub.submittedAt}</span>
                          <span className="text-[8px] font-bold text-indigo-600">{sub.runtime}</span>
                        </div>
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
