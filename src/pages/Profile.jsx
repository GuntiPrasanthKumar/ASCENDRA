import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { useAuthStore } from '../hooks/useAuthStore';
import { User, BookOpen, Code, Video, Award, Settings as SettingsIcon } from 'lucide-react';

export default function Profile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Load dynamically synchronized state
  const completedLessons = JSON.parse(localStorage.getItem('completed_lessons') || '[]').length;
  const completedQuizzes = JSON.parse(localStorage.getItem('completed_quizzes') || '[]').length;
  const completedCoding = JSON.parse(localStorage.getItem('completed_coding') || '[]').length || 1; // mock baseline
  const completedInterviews = JSON.parse(localStorage.getItem('completed_interviews') || '[]').length || 1; // mock baseline
  const currentStreak = localStorage.getItem('skilltrove_streak') || '7';

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Profile Header card */}
          <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-gradient-to-br from-indigo-500/[0.01] to-primary/[0.01]">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-extrabold text-primary">
                  {user?.name || 'Scholar'}
                </h1>
                <p className="text-textMuted text-xs font-semibold mt-1 uppercase tracking-wider">{user?.role || 'Student'}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-655 font-bold text-xs transition-all border border-slate-250 shadow-sm shrink-0"
            >
              <SettingsIcon className="w-4 h-4" /> Account Settings
            </button>
          </div>

          {/* Statistics grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 select-none">
            
            {/* Learning statistics */}
            <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-3">
              <span className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-slate-500 pl-1">
                <BookOpen className="w-4 h-4 text-indigo-500" /> Learning Stats
              </span>
              <div className="flex flex-col gap-1.5 font-semibold text-xs text-slate-655 mt-2">
                <div className="flex justify-between">
                  <span>Lessons Completed:</span>
                  <span className="text-slate-800 font-extrabold">{completedLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quizzes Solved:</span>
                  <span className="text-slate-800 font-extrabold">{completedQuizzes}</span>
                </div>
                <div className="flex justify-between">
                  <span>Streak Count:</span>
                  <span className="text-slate-800 font-extrabold">{currentStreak} Days</span>
                </div>
              </div>
            </div>

            {/* Coding statistics */}
            <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-3">
              <span className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-slate-500 pl-1">
                <Code className="w-4 h-4 text-success" /> Coding Stats
              </span>
              <div className="flex flex-col gap-1.5 font-semibold text-xs text-slate-655 mt-2">
                <div className="flex justify-between">
                  <span>Problems Solved:</span>
                  <span className="text-slate-800 font-extrabold">{completedCoding}</span>
                </div>
                <div className="flex justify-between">
                  <span>CodeLab XP:</span>
                  <span className="text-slate-800 font-extrabold">{completedCoding * 150} XP</span>
                </div>
              </div>
            </div>

            {/* Interview statistics */}
            <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-3">
              <span className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-slate-500 pl-1">
                <Video className="w-4 h-4 text-accent" /> Interview Stats
              </span>
              <div className="flex flex-col gap-1.5 font-semibold text-xs text-slate-655 mt-2">
                <div className="flex justify-between">
                  <span>Rehearsals Run:</span>
                  <span className="text-slate-800 font-extrabold">{completedInterviews}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Rehearsal score:</span>
                  <span className="text-slate-800 font-extrabold">88%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Unlocked achievements */}
          <div className="glass p-6 rounded-[2.5rem] border border-slate-200/50">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 pl-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-500" /> Unlocked Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-105 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Diagnostic Ace</h4>
                  <p className="text-[10px] text-textMuted mt-0.5 font-medium">Completed first diagnostic quiz checkpoint</p>
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-105 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-655 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Face Certified</h4>
                  <p className="text-[10px] text-textMuted mt-0.5 font-medium">Verified gaze proctoring checklist</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
