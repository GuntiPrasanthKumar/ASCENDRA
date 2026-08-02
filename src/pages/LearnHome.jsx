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
          
          {/* Header & Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-black flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-extrabold text-black tracking-tight">Learning Hub</h1>
                <p className="text-xs font-semibold text-slate-500 mt-1">Explore structured syllabus pathways and concepts.</p>
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
                icon={<BookOpen className="w-5 h-5 text-black" />} 
              />
              <LearningStatsCard 
                label="Study Streak" 
                value={stats.studyStreak} 
                icon={<Clock className="w-5 h-5 text-black" />} 
              />
              <LearningStatsCard 
                label="Total XP Earned" 
                value={`${stats.xpEarned} XP`} 
                icon={<Award className="w-5 h-5 text-black" />} 
              />
            </div>
          )}

          {/* Continue Learning Banner */}
          {continueSubject && (
            <div className="mb-10">
              <SectionHeader title="Continue Learning" subtitle="Resume active dynamic programming lessons" />
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-black mb-3 inline-block">
                    Active Chapter
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-black mb-1 tracking-tight">
                    {continueSubject.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">Topic: Memoization Basics & state complexity.</p>
                </div>
                <button
                  onClick={() => navigate(`/learn/${continueSubject.id}`)}
                  className="px-6 py-3.5 rounded-full bg-black hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 active:scale-[0.98]"
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
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-black">
                    <Star className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h4 className="text-base font-display font-extrabold text-black tracking-tight">{recommendedSubject.title}</h4>
                    <span className="text-[10px] font-black uppercase text-slate-500 block mt-0.5 tracking-wider">Focus Track • {recommendedSubject.difficulty}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/learn/${recommendedSubject.id}`)}
                  className="px-5 py-2.5 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-1"
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
              <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-slate-200 text-center flex flex-col items-center justify-center max-w-md mx-auto">
                <ShieldAlert className="w-10 h-10 text-slate-300 mb-3" />
                <h3 className="text-base font-display font-extrabold text-slate-800">No Subjects Match</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">Refine your search queries or filter tags.</p>
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
