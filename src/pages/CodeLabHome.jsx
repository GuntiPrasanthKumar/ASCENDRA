import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton, EmptyState } from '../components/common/FeedbackStates';
import { mockProblems } from '../features/codelab/mock/problems';
import { mockSubmissions } from '../features/codelab/mock/submissions';
import SectionHeader from '../components/dashboard/SectionHeader';
import ProblemCard from '../components/codelab/ProblemCard';
import { Code, ShieldAlert, Star, History, Filter, Zap, CheckCircle2, ChevronRight } from 'lucide-react';

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
        <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  const allTopics = ['All', ...new Set(problems.flatMap(p => p.tags || []))];

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
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-200 flex-wrap gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-black flex items-center justify-center">
                <Code className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-extrabold text-black tracking-tight">CodeLab Studio</h1>
                <p className="text-xs font-semibold text-slate-500 mt-1">Monaco editor, multi-language compilation simulator, and AI code quality analysis.</p>
              </div>
            </div>

            {/* Quick Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems..."
              className="px-4 py-2.5 rounded-full bg-white border border-slate-200/80 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black w-full sm:w-64 text-black placeholder-slate-400 shadow-xs"
            />
          </div>

          <div className="flex flex-col gap-10">
            
            {/* Continue Coding Banner */}
            {continueProblem && !searchQuery && (
              <div>
                <SectionHeader title="Continue Coding" subtitle="Pick up where you left off" />
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-black mb-3 inline-block">
                      Active Challenge • {continueProblem.difficulty}
                    </span>
                    <h3 className="text-xl font-display font-extrabold text-black mb-1 tracking-tight">
                      {continueProblem.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-2xl">{continueProblem.description}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/codelab/${continueProblem.id}`)}
                    className="px-6 py-3.5 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 active:scale-[0.98]"
                  >
                    <span>Open CodeLab Workspace</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                
                {/* Recommended Problem */}
                {recommendedProblem && !searchQuery && (
                  <div>
                    <SectionHeader title="Recommended Challenge" subtitle="Algorithmic structures custom suggested by AI coach" />
                    <div className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 flex items-center justify-between gap-4 shadow-xs">
                      <div className="flex gap-4 items-center">
                        <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-black">
                          <Star className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h4 className="text-base font-display font-extrabold text-black tracking-tight">{recommendedProblem.title}</h4>
                          <span className="text-[10px] font-black uppercase text-slate-500 block mt-0.5 tracking-wider">
                            {recommendedProblem.tags?.join(' • ')} • {recommendedProblem.difficulty}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/codelab/${recommendedProblem.id}`)}
                        className="px-5 py-2.5 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-1"
                      >
                        <span>Launch</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Problem Explorer & Filters */}
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <SectionHeader title="Problem Explorer" subtitle="Browse algorithm challenges by topic and difficulty" />
                  </div>

                  {/* Filter Toolbar */}
                  <div className="bg-white p-4 rounded-[1.75rem] border border-slate-200/80 flex flex-wrap gap-4 items-center justify-between mb-6 shadow-xs">
                    {/* Difficulty Pills */}
                    <div className="flex gap-1.5 flex-wrap items-center">
                      <span className="text-[10px] font-black uppercase text-slate-400 mr-1 flex items-center gap-1">
                        <Filter className="w-3 h-3 text-black" /> Difficulty:
                      </span>
                      {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setDifficultyFilter(diff)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                            difficultyFilter === diff
                              ? 'bg-black text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
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
                          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                            topicFilter === top
                              ? 'bg-black text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
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

              {/* Right Column */}
              <div className="flex flex-col gap-8">
                
                {/* Daily Challenge */}
                {dailyProblem && (
                  <div className="bg-white p-7 rounded-[1.75rem] border border-slate-200/80 flex flex-col justify-between h-full group hover:border-slate-300 transition-all duration-300 shadow-xs">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-black flex items-center gap-1 w-fit mb-4">
                        <Zap className="w-3.5 h-3.5 text-black" /> Daily Challenge
                      </span>
                      <h3 className="text-lg font-display font-extrabold text-black mb-2 tracking-tight">{dailyProblem.title}</h3>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6">{dailyProblem.description}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/codelab/${dailyProblem.id}`)}
                      className="w-full py-3.5 rounded-full bg-black text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 text-xs"
                    >
                      <span>Solve Daily Challenge</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Recent Submissions */}
                <div className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 shadow-xs">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                    <History className="w-4 h-4 text-black" /> Recent Submissions
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    {submissions.map((sub, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 flex justify-between items-center">
                        <div>
                          <span className="font-black text-[10px] text-black block mb-0.5">
                            {sub.problemId === 'reverse-string' ? 'Reverse String' : 'Two Sum'}
                          </span>
                          <span className="text-black font-bold text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-black" /> {sub.status} • {sub.language}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-slate-400 block">{sub.submittedAt}</span>
                          <span className="text-[9px] font-black text-black">{sub.runtime}</span>
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
