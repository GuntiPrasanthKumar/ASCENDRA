import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShieldAlert, Sparkles, X, Check, ArrowRight, Sun, Moon } from 'lucide-react';
import api from '../../utils/api';

export default function NotificationCenter({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        if (res.data?.data?.notifications) {
          const apiList = res.data.data.notifications.map(n => ({
            id: n._id,
            type: n.category?.toLowerCase() || 'academic',
            title: n.title,
            text: n.message,
            priority: n.priority,
            read: n.isRead,
            time: 'Active',
            action: n.action
          }));
          setNotifications(apiList);
        }
      } catch (err) {
        // Fallback to local action-oriented items
        const list = [
          { 
            id: '1', 
            type: 'proctor', 
            title: 'Identity Verification Compliant',
            text: 'Webcam proctoring matches active and verified.', 
            read: false, 
            time: 'Just now',
            action: { title: 'View Security Log', url: '/dashboard' }
          },
          { 
            id: '2', 
            type: 'academic', 
            title: 'Dynamic Programming Milestone',
            text: 'Lesson completed: Dynamic Programming Introduction! +50 XP', 
            read: false, 
            time: '10m ago',
            action: { title: 'Resume DP Track', url: '/learn/adv-algorithms/dynamic-programming/dp-introduction' }
          },
          { 
            id: '3', 
            type: 'practice', 
            title: 'Decaying Skill Alert — Heap Priority Queues',
            text: 'Decaying Skill Alert (72% accuracy, unpracticed for 12 days).', 
            read: false, 
            time: '1h ago',
            action: { title: 'Start Practice Review', url: '/practice' }
          }
        ];
        setNotifications(list);
      }
    };

    fetchNotifications();
  }, [isOpen]);

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await api.put('/notifications/read-all');
    } catch (e) {
      // Handled silently
    }
  };

  const handleActionClick = (url) => {
    if (url) {
      onClose();
      navigate(url);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="relative select-none">
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
                Actionable Notifications
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

          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
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
                    {n.type === 'proctor' || n.type === 'security' ? (
                      <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">{n.title || 'Notification'}</span>
                        <span className="text-[9px] font-mono text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{n.text}</p>
                      
                      {n.action && n.action.title && (
                        <button
                          onClick={() => handleActionClick(n.action.url)}
                          className="mt-2 w-full py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-[10px] flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
                        >
                          <span>{n.action.title}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
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
