import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockSubjects } from '../features/learning/mock/subjects';
import { mockStatistics } from '../features/learning/mock/statistics';
import SubjectCard from '../components/learn/SubjectCard';
import { 
  BookOpen, Clock, Award, Search, ChevronRight, PlayCircle, 
  Code2, Network, ListFilter, Binary, Map, Activity, Check, FileText, Calculator
} from 'lucide-react';

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

  const filteredSubjects = subjects.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recommendedCards = [
    {
      id: 'adv-algorithms',
      title: 'Dynamic Programming',
      subtitle: 'Improve problem solving',
      lessons: '12 Lessons',
      level: 'Beginner',
      icon: <Code2 className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50'
    },
    {
      id: 'data-structures',
      title: 'Data Structures',
      subtitle: 'Strengthen fundamentals',
      lessons: '15 Lessons',
      level: 'Beginner',
      icon: <Network className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50'
    },
    {
      id: 'graph-theory',
      title: 'Graph Theory',
      subtitle: 'Master graph concepts',
      lessons: '10 Lessons',
      level: 'Intermediate',
      icon: <ListFilter className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50'
    },
    {
      id: 'binary-search',
      title: 'Binary Search',
      subtitle: 'Search with efficiency',
      lessons: '8 Lessons',
      level: 'Beginner',
      icon: <Binary className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50'
    }
  ];

  const roadmapSteps = [
    { label: 'Basics', status: 'completed' },
    { label: 'Data Structures', status: 'completed' },
    { label: 'Algorithms', status: 'active' },
    { label: 'Advanced DP', status: 'upcoming' },
    { label: 'Graphs', status: 'upcoming' },
    { label: 'Mock Tests', status: 'upcoming' },
    { label: 'Revision', status: 'upcoming' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] px-4 md:px-12 py-6 w-full font-body">
        <div className="w-full space-y-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Home</span>
            <span>&gt;</span>
            <span className="text-slate-900 font-semibold">Learn</span>
          </div>

          {/* Header & Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">Learning Hub</h1>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Explore structured syllabus pathways and concepts.</p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects..." 
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 shadow-2xs transition-colors"
              />
            </div>
          </div>

          {/* 3 Learning Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Card 1: Completed Lessons */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center justify-between gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">COMPLETED LESSONS</span>
                <div className="text-xl font-bold text-slate-900">4/16</div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </div>

            {/* Card 2: Study Streak */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">STUDY STREAK</span>
                <div className="text-xl font-bold text-slate-900">7 Days</div>
                <span className="text-xs font-semibold text-emerald-600 block mt-0.5">Keep it up! 🔥</span>
              </div>
            </div>

            {/* Card 3: Total XP Earned */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TOTAL XP EARNED</span>
                <div className="text-xl font-bold text-slate-900">850 XP</div>
                <span className="text-xs font-semibold text-purple-600 block mt-0.5">Excellent progress!</span>
              </div>
            </div>
          </div>

          {/* Continue Learning Banner */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Continue Learning</h2>
              <p className="text-xs text-slate-500 font-medium">Resume your active learning journey</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-blue-50/80 border border-blue-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-2xs">
              <div className="space-y-3 max-w-xl z-10">
                <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase inline-block">
                  ACTIVE CHAPTER
                </span>
                <h3 className="text-2xl font-display font-bold text-slate-900">
                  Advanced Algorithms
                </h3>
                <p className="text-xs font-medium text-slate-600">
                  Topic: Memoization Basics &amp; state complexity.
                </p>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span className="text-blue-600">66% Completed</span>
                    <span className="text-slate-400">5 / 8 Lessons</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '66%' }} />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-6 z-10 w-full md:w-auto justify-end">
                <button
                  onClick={() => navigate('/learn/adv-algorithms')}
                  className="px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs md:text-sm flex items-center gap-2 transition-all shadow-xs shrink-0 group"
                >
                  <span>Open Subject Overview</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Decorative Background Sphere */}
              <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-48 bg-blue-200/40 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>

          {/* Recommended Subjects */}
          {!searchQuery && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recommended Subjects</h2>
                  <p className="text-xs text-slate-500 font-medium">AI customized suggestions based on your focus areas and accuracy gaps</p>
                </div>
                <button 
                  onClick={() => navigate('/learn')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center relative">
                {recommendedCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => navigate(`/learn/${card.id}`)}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        {card.icon}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{card.title}</h4>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{card.subtitle}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                        <span className="bg-slate-100 px-2.5 py-0.5 rounded-full">{card.lessons}</span>
                        <span className="bg-slate-100 px-2.5 py-0.5 rounded-full">{card.level}</span>
                      </div>

                      <div className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                        <span>Continue</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Your Learning Path */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Your Learning Path</h2>
                <p className="text-xs text-slate-500 font-medium">Track your personalized roadmap</p>
              </div>
              <button 
                onClick={() => navigate('/my-learning')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs"
              >
                <Map className="w-4 h-4" />
                <span>View roadmap</span>
              </button>
            </div>

            {/* Grid of Subject Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSubjects.map((subj, idx) => (
                <SubjectCard
                  key={subj.id}
                  title={subj.title}
                  description={subj.description}
                  difficulty={subj.difficulty || (idx === 0 ? 'PRO' : 'EASY')}
                  estimatedHours={subj.estimatedHours || (idx === 0 ? 20 : 12)}
                  progress={subj.progress || (idx === 0 ? 74 : 40)}
                  themeColor={idx === 0 ? 'blue' : 'emerald'}
                  icon={idx === 0 ? <FileText className="w-4.5 h-4.5" /> : <Calculator className="w-4.5 h-4.5" />}
                  onSelect={() => navigate(`/learn/${subj.id}`)}
                />
              ))}
            </div>
          </div>

          {/* Roadmap Overview Section */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-slate-900">Roadmap Overview</h3>
                  <p className="text-xs text-slate-500 font-medium">You're on track! Keep the momentum going.</p>
                </div>
              </div>

              <button 
                onClick={() => navigate('/my-learning')}
                className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                View full roadmap <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stepper Timeline Bar */}
            <div className="relative pt-6 pb-2 overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Connecting Line */}
                <div className="absolute top-10 left-[8%] right-[8%] h-0.5 bg-slate-200 -z-0" />
                
                <div className="flex justify-between items-center relative z-10">
                  {roadmapSteps.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isActive = step.status === 'active';

                    return (
                      <div key={idx} className="flex flex-col items-center gap-3 text-center">
                        {isCompleted && (
                          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}

                        {isActive && (
                          <div className="w-7 h-7 rounded-full bg-blue-600 border-4 border-blue-200 flex items-center justify-center shadow-xs animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}

                        {!isCompleted && !isActive && (
                          <div className="w-7 h-7 rounded-full border-2 border-slate-300 bg-white" />
                        )}

                        <span className={`text-xs ${isActive ? 'font-bold text-slate-900' : isCompleted ? 'font-semibold text-slate-700' : 'font-medium text-slate-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
