import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { useAuthStore } from '../hooks/useAuthStore';
import { User, BookOpen, Code, Video, Award, Settings as SettingsIcon } from 'lucide-react';

export default function Profile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const completedLessons = JSON.parse(localStorage.getItem('completed_lessons') || '[]').length;
  const completedQuizzes = JSON.parse(localStorage.getItem('completed_quizzes') || '[]').length;
  const completedCoding = JSON.parse(localStorage.getItem('completed_coding') || '[]').length || 1;
  const completedInterviews = JSON.parse(localStorage.getItem('completed_interviews') || '[]').length || 1;
  const currentStreak = localStorage.getItem('skilltrove_streak') || '7';

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Profile Header card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 shadow-xs">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-black shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-extrabold text-black tracking-tight">
                  {user?.name || 'Scholar'}
                </h1>
                <p className="text-slate-500 text-xs font-semibold mt-1 uppercase tracking-wider">{user?.role || 'Student'}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-black hover:text-white text-slate-800 font-bold text-xs transition-all border border-slate-200 shrink-0 shadow-xs"
            >
              <SettingsIcon className="w-4 h-4" /> Account Settings
            </button>
          </div>

          {/* Statistics grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 select-none">
            
            {/* Learning statistics */}
            <div className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 flex flex-col gap-3 shadow-xs">
              <span className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[10px] text-slate-500">
                <BookOpen className="w-4 h-4 text-black" /> Learning Stats
              </span>
              <div className="flex flex-col gap-2 text-xs text-slate-600 mt-1">
                <div className="flex justify-between font-medium">
                  <span>Lessons Completed:</span>
                  <span className="text-black font-extrabold">{completedLessons}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Quizzes Solved:</span>
                  <span className="text-black font-extrabold">{completedQuizzes}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Streak Count:</span>
                  <span className="text-black font-extrabold">{currentStreak} Days</span>
                </div>
              </div>
            </div>

            {/* Coding statistics */}
            <div className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 flex flex-col gap-3 shadow-xs">
              <span className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[10px] text-slate-500">
                <Code className="w-4 h-4 text-black" /> Coding Stats
              </span>
              <div className="flex flex-col gap-2 text-slate-600 text-xs mt-1">
                <div className="flex justify-between font-medium">
                  <span>Problems Solved:</span>
                  <span className="text-black font-extrabold">{completedCoding}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>CodeLab XP:</span>
                  <span className="text-black font-extrabold">{completedCoding * 150} XP</span>
                </div>
              </div>
            </div>

            {/* Interview statistics */}
            <div className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 flex flex-col gap-3 shadow-xs">
              <span className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[10px] text-slate-500">
                <Video className="w-4 h-4 text-black" /> Interview Stats
              </span>
              <div className="flex flex-col gap-2 text-xs text-slate-600 mt-1">
                <div className="flex justify-between font-medium">
                  <span>Rehearsals Run:</span>
                  <span className="text-black font-extrabold">{completedInterviews}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Avg. Rehearsal score:</span>
                  <span className="text-black font-extrabold">88%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Unlocked achievements */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-black" /> Unlocked Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-black shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-black text-xs">Diagnostic Ace</h4>
                  <p className="text-[10px] font-medium text-slate-500 mt-0.5">Completed first diagnostic quiz checkpoint</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-black shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-black text-xs">Face Certified</h4>
                  <p className="text-[10px] font-medium text-slate-500 mt-0.5">Verified gaze proctoring checklist</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
