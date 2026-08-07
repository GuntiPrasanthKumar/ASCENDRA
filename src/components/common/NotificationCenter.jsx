import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShieldAlert, Sparkles, X, Check } from 'lucide-react';

export default function NotificationCenter({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const list = [
      { id: 1, type: 'proctor', text: 'Webcam proctoring matches active and verified.', read: false, time: 'Just now' }
    ];
    const completedLessons = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
    if (completedLessons.length > 0) {
      list.push({ id: 2, type: 'lesson', text: 'Lesson completed: Dynamic Programming Introduction! +50 XP', read: false, time: '10m ago' });
    }
    const completedQuizzes = JSON.parse(localStorage.getItem('completed_quizzes') || '[]');
    if (completedQuizzes.length > 0) {
      list.push({ id: 3, type: 'quiz', text: 'Diagnostic Quiz completed with 100% accuracy! +300 XP', read: false, time: '1h ago' });
    }
    const completedCoding = JSON.parse(localStorage.getItem('completed_coding') || '[]');
    if (completedCoding.length > 0) {
      list.push({ id: 4, type: 'codelab', text: 'CodeLab solution accepted! +150 XP', read: false, time: '2h ago' });
    }
    setNotifications(list);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="relative">
        <div onClick={onClose} className="fixed inset-0 z-30" />
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[2rem] shadow-2xl p-5 z-40"
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-black dark:text-white" />
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono font-bold bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead} 
                  className="text-[10px] font-bold text-slate-500 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3 h-3" /> Mark Read
                </button>
              )}
              <button 
                onClick={onClose} 
                className="p-1 rounded-full text-slate-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
            {notifications.length > 0 ? (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  className={`p-3.5 rounded-2xl text-[11px] leading-relaxed font-medium border transition-all ${
                    n.read 
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400' 
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200/60 dark:border-slate-700 text-black dark:text-white'
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    {n.type === 'proctor' ? (
                      <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p>{n.text}</p>
                      <span className="text-[9px] font-mono text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">
                No new notifications.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
