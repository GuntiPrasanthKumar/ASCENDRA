import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton, EmptyState } from '../components/common/FeedbackStates';
import { mockInterviews } from '../features/interview/mock/interviews';
import InterviewCard from '../components/interview/InterviewCard';
import SectionHeader from '../components/dashboard/SectionHeader';
import { Video, PlayCircle, History, Star, ShieldCheck, ShieldAlert, Filter } from 'lucide-react';

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
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6">
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
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-6 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/5">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-extrabold text-primary">AI Interview Studio</h1>
                <p className="text-textMuted text-xs font-medium mt-1">Simulate real placement technical & HR rounds with live webcam gaze tracking.</p>
              </div>
            </div>

            {/* Quick Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interview types..."
              className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
            />
          </div>

          <div className="flex flex-col gap-10">
            
            {/* 1. Continue Interview Banner */}
            {continueInterview && !searchQuery && (
              <div>
                <SectionHeader title="Continue Interview Rehearsal" subtitle="Resume your target placement preparation path" />
                <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-primary/[0.02] to-indigo-600/[0.02] group">
                  <div>
                    <span className="text-[10px] font-black text-primary bg-primary/5 border border-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                      {continueInterview.category} • {continueInterview.duration}
                    </span>
                    <h3 className="text-xl font-bold font-display text-primary mb-1">
                      {continueInterview.title}
                    </h3>
                    <p className="text-xs text-textMuted font-medium leading-relaxed max-w-2xl">{continueInterview.description}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/interview/${continueInterview.id}/setup`)}
                    className="px-6 py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-primary/15 group-hover:scale-[1.01]"
                  >
                    <PlayCircle className="w-4.5 h-4.5" /> Initialize Camera & Setup
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
                    <div className="glass p-6 rounded-3xl border border-slate-200/50 flex items-center justify-between gap-4">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500">
                          <Star className="w-5 h-5 fill-amber-500/10" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{recommendedInterview.title}</h4>
                          <span className="text-[9px] font-black uppercase text-slate-500 block mt-0.5">
                            {recommendedInterview.category} • {recommendedInterview.duration} • {recommendedInterview.difficulty}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/interview/${recommendedInterview.id}/setup`)}
                        className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-primary transition-all"
                      >
                        Start Setup
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Interview Categories Filter & Grid */}
                <div>
                  <SectionHeader title="Interview Categories" subtitle="Choose placement paths to rehearse" />
                  
                  {/* Category Filter Tabs */}
                  <div className="flex gap-1.5 flex-wrap items-center mb-6 bg-slate-50 border border-slate-200 p-2 rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-slate-400 mr-1 flex items-center gap-1">
                      <Filter className="w-3 h-3" /> Track:
                    </span>
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                          activeCategory === cat
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
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
                <div className="glass p-6 rounded-3xl border border-slate-200/50">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 pl-1 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-slate-400" /> Recent Rehearsals
                  </h4>
                  <div className="flex flex-col gap-3 text-[10px] text-textMuted">
                    {completedInterviewsList.length > 0 ? (
                      completedInterviewsList.map((id, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center leading-relaxed">
                          <div>
                            <span className="font-extrabold text-[8px] uppercase tracking-wider block text-slate-500 mb-0.5">
                              {id.replace('int-', '').toUpperCase()} Placement Rehearsal
                            </span>
                            <span className="text-success font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-success" /> Passed & Verified
                            </span>
                          </div>
                          <span className="text-[8px] font-bold text-slate-400">Recent</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center leading-relaxed">
                        <div>
                          <span className="font-extrabold text-[8px] uppercase tracking-wider block text-slate-500 mb-0.5">HR Interview</span>
                          <span className="text-success font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-success" /> Verified Baseline
                          </span>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400">Completed</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Proctoring Banner Info */}
                <div className="p-5 rounded-3xl bg-indigo-50/20 border border-indigo-100 text-[10px] text-slate-600 leading-relaxed">
                  <span className="font-extrabold block text-indigo-800 uppercase tracking-widest text-[8px] mb-1">
                    PLACEMENT PROCTORING AI:
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
