import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { useAuthStore } from '../hooks/useAuthStore';
import { useTheme } from '../contexts/ThemeContext';
import { useToastStore } from '../components/common/Toast';
import { 
  Settings as SettingsIcon, Sun, Moon, Bell, Shield, Globe, User, 
  ChevronRight, Save, ChevronDown
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast('Preferences saved successfully!', 'success');
  };

  const userName = user?.name || 'Vijay Kiran';
  const userEmail = user?.email || 'kannidivijaykiran22@gmail.com';

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] px-4 md:px-12 py-6 w-full font-body">
        <div className="w-full space-y-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Home</span>
            <span>&gt;</span>
            <span className="text-slate-900 font-semibold">Settings</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-4 pb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">System Preferences</h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Configure layout themes, proctor permissions, and profile configurations.</p>
            </div>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Account Information Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <User className="w-4 h-4 text-slate-600" />
                <span>ACCOUNT INFORMATION</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FULL NAME</label>
                  <input
                    type="text"
                    defaultValue={userName}
                    disabled
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs font-bold text-slate-800 cursor-not-allowed focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    defaultValue={userEmail}
                    disabled
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs font-bold text-slate-800 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Display & Localization Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Globe className="w-4 h-4 text-slate-600" />
                <span>DISPLAY &amp; LOCALIZATION</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Visual Dark Mode</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Toggle interface design palette styles</p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-5 py-2.5 rounded-full bg-black hover:bg-slate-800 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-xs shrink-0"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-white" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-white" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Interface Language</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Select localization parameter values</p>
                </div>

                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="appearance-none px-6 py-2.5 pr-10 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="en">English (US)</option>
                    <option value="ko">한국어 (Korean)</option>
                    <option value="de">Deutsch (German)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Notifications & Alerts Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Bell className="w-4 h-4 text-slate-600" />
                <span>NOTIFICATIONS &amp; ALERTS</span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Syllabus Reminder Email Alerts</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Receive reminders regarding incomplete daily goals</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Proctor Privacy Policy Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Shield className="w-4 h-4 text-slate-600" />
                  <span>PROCTOR PRIVACY POLICY</span>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-3xl">
                  Biometric face descriptors and gaze metrics are computed locally on client engines using browser APIs. No stream frames are uploaded or saved to remote databases.
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* Bottom Save Action Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-black hover:bg-slate-800 text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences Configuration</span>
            </button>

          </form>

        </div>
      </div>
    </PageTransition>
  );
}
