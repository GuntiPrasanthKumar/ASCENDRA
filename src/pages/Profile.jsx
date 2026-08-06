import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { useAuthStore } from '../hooks/useAuthStore';
import { 
  User, BookOpen, Code2, Video, Award, Settings as SettingsIcon, 
  ChevronRight, Mail, Calendar, CheckCircle2, ChevronLeft, ShieldCheck
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const completedLessons = JSON.parse(localStorage.getItem('completed_lessons') || '[]').length || 1;
  const completedQuizzes = JSON.parse(localStorage.getItem('completed_quizzes') || '[]').length;
  const completedCoding = JSON.parse(localStorage.getItem('completed_coding') || '[]').length || 1;
  const completedInterviews = JSON.parse(localStorage.getItem('completed_interviews') || '[]').length || 1;
  const currentStreak = localStorage.getItem('skilltrove_streak') || '9';

  const studentName = user?.name || 'Vijay Kiran';
  const studentEmail = user?.email || 'vijay@example.com';

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] px-4 md:px-12 py-6 w-full font-body">
        <div className="w-full space-y-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Home</span>
            <span>&gt;</span>
            <span className="text-slate-900 font-semibold">Profile</span>
          </div>

          {/* Profile Header Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xs">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-slate-700 font-bold text-2xl shrink-0 shadow-2xs">
                <User className="w-10 h-10 text-slate-600" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
                    {studentName}
                  </h1>
                  {/* Verified Checkmark Badge */}
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-blue-600 text-white" />
                  </div>
                </div>

                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
                  STUDENT
                </span>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {studentEmail}
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Member since Aug 2024
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/settings')}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-semibold text-xs transition-all shadow-2xs flex items-center gap-2 shrink-0"
            >
              <SettingsIcon className="w-4 h-4 text-slate-600" />
              <span>Account Settings</span>
            </button>
          </div>

          {/* 3 Telemetry Stats Cards (Horizontal Row) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: LEARNING STATS */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-5 shadow-2xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">LEARNING STATS</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Lessons Completed</span>
                    <span className="font-bold text-slate-900">{completedLessons}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Quizzes Solved</span>
                    <span className="font-bold text-slate-900">{completedQuizzes}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Streak Count</span>
                    <span className="font-bold text-emerald-600">{currentStreak} Days</span>
                  </div>
                </div>
              </div>

              {/* Sparkline Graph Accent */}
              <div className="pt-2 flex items-center justify-between">
                <svg className="w-24 h-8 text-emerald-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 25 L25 20 L45 22 L65 10 L85 12 L95 5" />
                </svg>
                <span className="text-xs font-semibold text-slate-500">Keep it up!</span>
              </div>
            </div>

            {/* Card 2: CODING STATS */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-5 shadow-2xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Code2 className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">CODING STATS</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Problems Solved</span>
                    <span className="font-bold text-slate-900">{completedCoding}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>CodeLab XP</span>
                    <span className="font-bold text-slate-900">150 XP</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Rank</span>
                    <span className="font-bold text-blue-600">Beginner</span>
                  </div>
                </div>
              </div>

              {/* Sparkline Graph Accent */}
              <div className="pt-2 flex items-center justify-between">
                <svg className="w-24 h-8 text-blue-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 25 L25 18 L45 20 L65 8 L85 14 L95 6" />
                </svg>
                <span className="text-xs font-semibold text-slate-500">+150 XP this week</span>
              </div>
            </div>

            {/* Card 3: INTERVIEW STATS */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-5 shadow-2xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Video className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">INTERVIEW STATS</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Rehearsals Run!</span>
                    <span className="font-bold text-slate-900">{completedInterviews}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Avg. Rehearsal Score</span>
                    <span className="font-bold text-slate-900">88%</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Strong Areas</span>
                    <span className="font-bold text-slate-900">2</span>
                  </div>
                </div>
              </div>

              {/* Sparkline Graph Accent */}
              <div className="pt-2 flex items-center justify-between">
                <svg className="w-24 h-8 text-purple-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 20 L25 15 L45 22 L65 12 L85 18 L95 10" />
                </svg>
                <span className="text-xs font-semibold text-slate-500">Good progress!</span>
              </div>
            </div>

          </div>

          {/* Bottom Section: UNLOCKED ACHIEVEMENTS */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Award className="w-4 h-4 text-slate-600" />
                <span>UNLOCKED ACHIEVEMENTS</span>
              </div>
              <button 
                onClick={() => navigate('/achievements')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
              >
                <span>View all achievements</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Achievement Cards Carousel Grid */}
            <div className="flex items-center gap-4">
              <button className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 shrink-0 shadow-2xs">
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {/* Achievement 1 */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 hover:border-slate-300 transition-colors shadow-2xs">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-display font-bold text-slate-900 text-sm">Diagnostic Ace</h4>
                      <p className="text-xs text-slate-400 font-medium">Completed first diagnostic quiz checkpoint</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 pt-1 border-t border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Unlocked on Aug 12, 2024</span>
                  </div>
                </div>

                {/* Achievement 2 */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 hover:border-slate-300 transition-colors shadow-2xs">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-display font-bold text-slate-900 text-sm">Face Certified</h4>
                      <p className="text-xs text-slate-400 font-medium">Verified gaze proctoring checklist</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 pt-1 border-t border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Unlocked on Aug 10, 2024</span>
                  </div>
                </div>
              </div>

              <button className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 shrink-0 shadow-2xs">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
