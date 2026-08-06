import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton, EmptyState } from '../components/common/FeedbackStates';
import { mockInterviews } from '../features/interview/mock/interviews';
import InterviewCard from '../components/interview/InterviewCard';
import { 
  Code2, Star, ShieldCheck, ShieldAlert, Filter, ChevronRight, 
  History, Clock, Search, Zap, Users, FileText, MessageSquare, ChevronLeft
} from 'lucide-react';

export default function InterviewHome() {
  const [interviews, setInterviews] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setInterviews(mockInterviews);
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

  const categoriesList = ['All', 'HR', 'Behavioral', 'Technical', 'Frontend', 'Backend', 'Full Stack', 'AI Engineer'];

  const filteredInterviews = interviews.filter(int => {
    const matchesCategory = activeCategory === 'All' || int.category === activeCategory;
    const matchesSearch = int.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          int.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const continueInterview = interviews.find(i => i.id === 'int-hr') || interviews[0];
  const recommendedInterview = interviews.find(i => i.id === 'int-tech') || interviews[1];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] px-4 md:px-12 py-6 w-full font-body">
        <div className="w-full space-y-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/practice')}>Practice</span>
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
              {!searchQuery && continueInterview && (
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
                        onClick={() => navigate(`/interview/${continueInterview.id}/setup`)}
                        className="px-6 py-3.5 rounded-full bg-black hover:bg-slate-800 text-white font-semibold text-xs md:text-sm flex items-center gap-1.5 shadow-xs shrink-0 group transition-all"
                      >
                        <span>Initialize Camera &amp; Setup</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: Recommended Challenge */}
              {!searchQuery && recommendedInterview && (
                <div className="space-y-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recommended Challenge</h2>
                    <p className="text-xs text-slate-500 font-medium">Custom AI suggested technical assessment</p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-display font-bold text-slate-900 tracking-tight">Technical Algorithms &amp; System Design</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                          TECHNICAL • 20 MINS • HARD
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/interview/${recommendedInterview.id}/setup`)}
                      className="px-5 py-2.5 rounded-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 font-semibold text-xs transition-all flex items-center gap-1 shadow-2xs shrink-0"
                    >
                      <span>Start Setup</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Section 3: Interview Categories */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Interview Categories</h2>
                  <p className="text-xs text-slate-500 font-medium">Choose placement paths to rehearse</p>
                </div>

                {/* Filter Toolbar */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-3 flex items-center gap-2 flex-wrap text-xs shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 ml-1">
                    <Filter className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        activeCategory === cat
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  <button className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 ml-auto">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Interview Cards Grid */}
                {filteredInterviews.length === 0 ? (
                  <EmptyState
                    icon={ShieldAlert}
                    title="No Interview Rounds Match"
                    description="Try clearing your search query or selecting another category filter."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {filteredInterviews.map((int) => (
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
              
              {/* Card 1: Recent Rehearsals Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span>Recent Rehearsals</span>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block">HR Placement Rehearsal</span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Passed &amp; Verified
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">Recent</span>
                </div>
              </div>

              {/* Card 2: Placement Proctoring AI Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Placement Proctoring AI</span>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  Webcam face recognition and audio levels are continuously analyzed to measure gaze stability, confidence, and speech fluency.
                </p>
              </div>

              {/* Card 3: Recent Submissions Card */}
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
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Accepted - JavaScript
                    </span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-[11px] font-medium text-slate-400 block">3 days ago</span>
                    <span className="text-xs font-bold text-slate-900 block">84 ms</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Quick Actions Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Zap className="w-4 h-4 text-slate-700" />
                  <span>Quick Actions</span>
                </div>

                <div className="space-y-2.5">
                  <div 
                    onClick={() => navigate('/interview')}
                    className="bg-slate-50 border border-slate-200/60 hover:bg-slate-100 p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold text-slate-900 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span>Mock Interview</span>
                    </div>
                    <Users className="w-4 h-4 text-slate-400" />
                  </div>

                  <div 
                    onClick={() => navigate('/profile')}
                    className="bg-slate-50 border border-slate-200/60 hover:bg-slate-100 p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold text-slate-900 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span>Resume Analyzer</span>
                    </div>
                    <FileText className="w-4 h-4 text-slate-400" />
                  </div>

                  <div 
                    onClick={() => navigate('/ai-coach')}
                    className="bg-slate-50 border border-slate-200/60 hover:bg-slate-100 p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold text-slate-900 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                      <span>AI Feedback</span>
                    </div>
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <button
                  onClick={() => navigate('/ai-coach')}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 pt-1"
                >
                  <span>View all tools</span>
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
