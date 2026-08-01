import React, { useState } from 'react';
import PageTransition from '../components/common/PageTransition';
import { useAuthStore } from '../hooks/useAuthStore';
import { useTheme } from '../contexts/ThemeContext';
import { useToastStore } from '../components/common/Toast';
import { Settings as SettingsIcon, Sun, Moon, Bell, Shield, Globe, User } from 'lucide-react';

export default function Settings() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToastStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast('Preferences saved successfully!', 'success');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/5">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-extrabold text-primary">System Preferences</h1>
              <p className="text-textMuted text-xs font-medium mt-1">Configure layout themes, proctor permissions, and profile configurations.</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
            
            {/* Account Info */}
            <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-4">
              <span className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-slate-500 pl-1 select-none">
                <User className="w-4 h-4 text-slate-400" /> Account Information
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase pl-1 select-none">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || 'Scholar'}
                    disabled
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-150 text-xs font-semibold text-slate-500 cursor-not-allowed focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase pl-1 select-none">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email || 'scholar@ascendra.edu'}
                    disabled
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-150 text-xs font-semibold text-slate-500 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Layout Preferences */}
            <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-4">
              <span className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-slate-500 pl-1 select-none">
                <Globe className="w-4 h-4 text-slate-400" /> Display & Localization
              </span>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Visual Dark Mode</h4>
                  <p className="text-[10px] text-textMuted mt-0.5">Toggle interface design palette styles</p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-warning" /> Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" /> Dark Mode
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-t border-slate-100 pt-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Interface Language</h4>
                  <p className="text-[10px] text-textMuted mt-0.5">Select localization parameter values</p>
                </div>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none text-slate-750"
                >
                  <option value="en">English (US)</option>
                  <option value="ko">한국어 (Korean)</option>
                  <option value="de">Deutsch (German)</option>
                </select>
              </div>
            </div>

            {/* Notification and privacy settings */}
            <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-4">
              <span className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-slate-500 pl-1 select-none">
                <Bell className="w-4 h-4 text-slate-400" /> Notifications & Alerts
              </span>

              <div className="flex justify-between items-center py-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Syllabus Reminder Email Alerts</h4>
                  <p className="text-[10px] text-textMuted mt-0.5">Receive reminders regarding incomplete daily goals</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4.5 h-4.5 text-primary border-slate-300 rounded focus:ring-primary"
                />
              </div>
            </div>

            {/* Proctor privacy notice */}
            <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-4">
              <span className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-slate-500 pl-1 select-none">
                <Shield className="w-4 h-4 text-slate-400" /> Proctor Privacy Policy
              </span>
              <p className="text-[10px] text-textMuted leading-relaxed">
                Biometric face descriptors and gaze metrics are computed locally on client engines using browser APIs. No stream frames are uploaded or saved to remote databases.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all shadow-lg shadow-primary/10 mt-4"
            >
              Save Preferences Configuration
            </button>

          </form>

        </div>
      </div>
    </PageTransition>
  );
}
