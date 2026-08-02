import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton, EmptyState } from '../components/common/FeedbackStates';
import { mockInterviews } from '../features/interview/mock/interviews';
import InterviewCard from '../components/interview/InterviewCard';
import SectionHeader from '../components/dashboard/SectionHeader';
import { Video, Star, ShieldCheck, ShieldAlert, Filter, ChevronRight, History } from 'lucide-react';

export default function InterviewHome() {
  const [interviews, setInterviews] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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
        <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
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

  // Load recent rehearsals from localStorage if present
  const completedInterviewsList = JSON.parse(localStorage.getItem('completed_interviews') || '[]');

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header - Google Antigravity Style */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-6 border-b border-slate-200/80 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/60 text-indigo-600 flex items-center justify-center shadow-xs">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-medium text-slate-900 tracking-tight">AI Interview Studio</h1>
                <p className="text-slate-500 text-xs font-body mt-0.5">Simulate real placement technical & HR rounds with live webcam gaze tracking.</p>
              </div>
            </div>

            {/* Quick Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interview types..."
              className="px-4 py-2.5 rounded-full bg-white border border-slate-200/80 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 w-full sm:w-64 shadow-xs"
            />
          </div>

          <div className="flex flex-col gap-10">
            
            {/* 1. Continue Interview Banner */}
            {continueInterview && !searchQuery && (
              <div>
                <SectionHeader title="Continue Interview Rehearsal" subtitle="Resume your target placement preparation path" />
                <div className="bg-white p-8 rounded-[1.75rem] border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
                      {continueInterview.category} • {continueInterview.duration}
                    </span>
                    <h3 className="text-xl font-display font-medium text-slate-900 mb-1 tracking-tight">
                      {continueInterview.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-body leading-relaxed max-w-2xl">{continueInterview.description}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/interview/${continueInterview.id}/setup`)}
                    className="px-6 py-3.5 rounded-full bg-slate-900 text-white font-medium text-xs hover:bg-indigo-600 transition-all flex items-center gap-1.5 shrink-0 shadow-xs active:scale-[0.98]"
                  >
                    <span>Initialize Camera & Setup</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Recommended & Categories Grid (span 2) */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                
                {/* 2. Recommended Interview */}
                {recommendedInterview && !searchQuery && (
                  <div>
                    <SectionHeader title="Recommended Placement Round" subtitle="Custom AI suggested technical assessment" />
                    <div className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 flex items-center justify-between gap-4 shadow-xs">
                      <div className="flex gap-4 items-center">
                        <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
                          <Star className="w-5 h-5 fill-amber-500/20" />
                        </div>
                        <div>
                          <h4 className="font-display font-medium text-slate-900 text-sm">{recommendedInterview.title}</h4>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mt-0.5 tracking-wider">
                            {recommendedInterview.category} • {recommendedInterview.duration} • {recommendedInterview.difficulty}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/interview/${recommendedInterview.id}/setup`)}
                        className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-medium text-xs hover:bg-indigo-600 transition-all flex items-center gap-1"
                      >
                        <span>Start Setup</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Interview Categories Filter & Grid */}
                <div>
                  <SectionHeader title="Interview Categories" subtitle="Choose placement paths to rehearse" />
                  
                  {/* Category Filter Tabs */}
                  <div className="flex gap-1.5 flex-wrap items-center mb-6 bg-white border border-slate-200/80 p-2 rounded-[1.75rem] shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 ml-2 mr-1 flex items-center gap-1">
                      <Filter className="w-3 h-3" /> Track:
                    </span>
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                          activeCategory === cat
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200/60'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {filteredInterviews.length === 0 ? (
                    <EmptyState
                      icon={ShieldAlert}
                      title="No Interview Rounds Match"
                      description="Try clearing your search query or selecting another track filter."
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
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
                </div>

              </div>

              {/* Right Column: Solved Rehearsal History & Guidelines (span 1) */}
              <div className="flex flex-col gap-8">
                
                {/* Solved History Log */}
                <div className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-400" /> Recent Rehearsals
                  </h4>
                  <div className="flex flex-col gap-2.5 text-xs text-slate-600">
                    {completedInterviewsList.length > 0 ? (
                      completedInterviewsList.map((id, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex justify-between items-center">
                          <div>
                            <span className="font-extrabold text-[9px] uppercase tracking-wider block text-slate-400 mb-0.5">
                              {id.replace('int-', '').toUpperCase()} Placement Rehearsal
                            </span>
                            <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> Passed & Verified
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">Recent</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex justify-between items-center">
                        <div>
                          <span className="font-extrabold text-[9px] uppercase tracking-wider block text-slate-400 mb-0.5">HR Interview</span>
                          <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verified Baseline
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">Completed</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Proctoring Banner Info */}
                <div className="p-6 rounded-[1.75rem] bg-white border border-slate-200/80 shadow-xs text-xs text-slate-600 leading-relaxed font-body">
                  <span className="font-extrabold block text-indigo-700 uppercase tracking-widest text-[9px] mb-1.5">
                    PLACEMENT PROCTORING AI
                  </span>
                  Webcam face recognition and audio levels are continuously analyzed to measure gaze stability, confidence, and speech fluency.
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
