import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockSubjects } from '../features/learning/mock/subjects';
import { mockStatistics } from '../features/learning/mock/statistics';
import { mockChapters } from '../features/learning/mock/chapters';
import SubjectCard from '../components/learn/SubjectCard';
import SearchBar from '../components/learn/SearchBar';
import LearningStatsCard from '../components/learn/LearningStatsCard';
import SectionHeader from '../components/dashboard/SectionHeader';
import { BookOpen, ShieldAlert, Award, Clock, PlayCircle, Star } from 'lucide-react';

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
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  // Filter subjects based on query
  const filteredSubjects = subjects.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Recommendations logic (Pro level pathway recommended)
  const recommendedSubject = subjects.find(s => s.difficulty === 'Pro') || subjects[0];
  const continueSubject = subjects[0] || null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header & Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/5">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-extrabold text-primary">Learning Hub</h1>
                <p className="text-textMuted text-xs font-medium mt-1">Explore structured syllabus pathways and concepts.</p>
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
                icon={<BookOpen className="w-5 h-5" />} 
              />
              <LearningStatsCard 
                label="Study Streak" 
                value={stats.studyStreak} 
                icon={<Clock className="w-5 h-5 animate-pulse" />} 
              />
              <LearningStatsCard 
                label="Total XP Earned" 
                value={`${stats.xpEarned} XP`} 
                icon={<Award className="w-5 h-5" />} 
              />
            </div>
          )}

          {/* Continue Learning Banner */}
          {continueSubject && (
            <div className="mb-10">
              <SectionHeader title="Continue Learning" subtitle="Resume active dynamic programming lessons" />
              <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-primary/[0.02] to-indigo-600/[0.02]">
                <div>
                  <span className="text-[10px] font-black text-primary bg-primary/5 border border-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                    Active Chapter
                  </span>
                  <h3 className="text-xl font-bold font-display text-primary mb-1">
                    {continueSubject.title}
                  </h3>
                  <p className="text-xs text-textMuted font-medium">Topic: Memoization Basics & state complexity.</p>
                </div>
                <button
                  onClick={() => navigate(`/learn/${continueSubject.id}`)}
                  className="px-6 py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-primary/15"
                >
                  <PlayCircle className="w-4.5 h-4.5" /> Open Subject Overview
                </button>
              </div>
            </div>
          )}

          {/* Recommended Subjects */}
          {recommendedSubject && !searchQuery && (
            <div className="mb-10">
              <SectionHeader title="Recommended Subject" subtitle="AI customized suggestion based on focus accuracy drop gaps" />
              <div className="glass p-6 rounded-3xl border border-slate-200/50 flex items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500">
                    <Star className="w-5 h-5 fill-amber-500/10" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{recommendedSubject.title}</h4>
                    <span className="text-[9px] font-black uppercase text-slate-500 block mt-0.5">Focus Track • {recommendedSubject.difficulty}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/learn/${recommendedSubject.id}`)}
                  className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-primary transition-all flex items-center gap-1.5"
                >
                  Start
                </button>
              </div>
            </div>
          )}

          {/* All Subjects Grid */}
          <div>
            <SectionHeader title="All Syllabus Subjects" subtitle="Explore available pathways" />
            
            {filteredSubjects.length === 0 ? (
              <div className="glass p-12 rounded-[2rem] border border-dashed border-slate-200/50 text-center flex flex-col items-center justify-center max-w-md mx-auto">
                <ShieldAlert className="w-10 h-10 text-slate-350 mb-3 animate-pulse" />
                <h3 className="font-bold text-slate-700">No Subjects Match</h3>
                <p className="text-xs text-textMuted mt-1">Refine your search queries or filter tags.</p>
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
