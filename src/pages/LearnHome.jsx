import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockSubjects } from '../features/learning/mock/subjects';
import { mockStatistics } from '../features/learning/mock/statistics';
import SubjectCard from '../components/learn/SubjectCard';
import SearchBar from '../components/learn/SearchBar';
import LearningStatsCard from '../components/learn/LearningStatsCard';
import SectionHeader from '../components/dashboard/SectionHeader';
import { BookOpen, ShieldAlert, Award, Clock, Star, ChevronRight } from 'lucide-react';

export default function LearnHome() {
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSubjects(mockSubjects);
      setStats(mockStatistics);
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

  // Filter subjects by Search Query
  const filteredSubjects = subjects.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recommendedSubject = subjects.find(s => s.id === 'quant-aptitude') || subjects[1];
  const continueSubject = subjects[0] || null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header & Search Bar - Google Antigravity Style */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-200/80">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/60 text-indigo-600 flex items-center justify-center shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-medium text-slate-900 tracking-tight">Learning Hub</h1>
                <p className="text-slate-500 text-xs font-body mt-0.5">Explore structured syllabus pathways and concepts.</p>
              </div>
            </div>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Learning Statistics */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <LearningStatsCard 
                label="Completed Lessons" 
                value={`${stats.completedLessons} / ${stats.totalLessons}`} 
                icon={<BookOpen className="w-5 h-5 text-indigo-600" />} 
              />
              <LearningStatsCard 
                label="Study Streak" 
                value={stats.studyStreak} 
                icon={<Clock className="w-5 h-5 text-amber-500 animate-pulse" />} 
              />
              <LearningStatsCard 
                label="Total XP Earned" 
                value={`${stats.xpEarned} XP`} 
                icon={<Award className="w-5 h-5 text-emerald-600" />} 
              />
            </div>
          )}

          {/* Continue Learning Banner */}
          {continueSubject && (
            <div className="mb-10">
              <SectionHeader title="Continue Learning" subtitle="Resume active dynamic programming lessons" />
              <div className="bg-white p-8 rounded-[1.75rem] border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
                    Active Chapter
                  </span>
                  <h3 className="text-xl font-display font-medium text-slate-900 mb-1 tracking-tight">
                    {continueSubject.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-body">Topic: Memoization Basics & state complexity.</p>
                </div>
                <button
                  onClick={() => navigate(`/learn/${continueSubject.id}`)}
                  className="px-6 py-3.5 rounded-full bg-slate-900 hover:bg-indigo-600 text-white font-medium text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-xs active:scale-[0.98]"
                >
                  <span>Open Subject Overview</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Recommended Subject */}
          {recommendedSubject && !searchQuery && (
            <div className="mb-10">
              <SectionHeader title="Recommended Subject" subtitle="AI customized suggestion based on focus accuracy drop gaps" />
              <div className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 flex items-center justify-between gap-4 shadow-xs">
                <div className="flex gap-4 items-center">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
                    <Star className="w-5 h-5 fill-amber-500/20" />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-slate-900 text-sm">{recommendedSubject.title}</h4>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mt-0.5 tracking-wider">Focus Track • {recommendedSubject.difficulty}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/learn/${recommendedSubject.id}`)}
                  className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-medium text-xs hover:bg-indigo-600 transition-all flex items-center gap-1"
                >
                  <span>Start</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* All Subjects Grid */}
          <div>
            <SectionHeader title="All Syllabus Subjects" subtitle="Explore available pathways" />
            
            {filteredSubjects.length === 0 ? (
              <div className="bg-white p-12 rounded-[1.75rem] border border-dashed border-slate-200 text-center flex flex-col items-center justify-center max-w-md mx-auto">
                <ShieldAlert className="w-10 h-10 text-slate-300 mb-3 animate-pulse" />
                <h3 className="font-display font-medium text-slate-800">No Subjects Match</h3>
                <p className="text-xs text-slate-500 mt-1 font-body">Refine your search queries or filter tags.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSubjects.map((subj) => (
                  <SubjectCard
                    key={subj.id}
                    title={subj.title}
                    description={subj.description}
                    difficulty={subj.difficulty}
                    estimatedHours={subj.estimatedHours}
                    lessonsCount={subj.chapterIds.length}
                    progress={subj.progress}
                    onSelect={() => navigate(`/learn/${subj.id}`)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
