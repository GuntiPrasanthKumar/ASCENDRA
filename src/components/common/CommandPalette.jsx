import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Activity, Code, Video, Sparkles, Award, User, Settings, ArrowRight, CornerDownLeft } from 'lucide-react';

const COMMAND_ITEMS = [
  { id: 'dash', title: 'Dashboard Overview', category: 'Navigation', path: '/dashboard', icon: <Search className="w-4 h-4" /> },
  { id: 'learn', title: 'Learning Hub & Subjects', category: 'Navigation', path: '/learn', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'practice', title: 'Practice & Quizzes', category: 'Navigation', path: '/practice', icon: <Activity className="w-4 h-4" /> },
  { id: 'codelab', title: 'CodeLab Environment', category: 'Navigation', path: '/codelab', icon: <Code className="w-4 h-4" /> },
  { id: 'interview', title: 'Interview Studio', category: 'Navigation', path: '/interview', icon: <Video className="w-4 h-4" /> },
  { id: 'aicoach', title: 'AI Mentor Briefing', category: 'Navigation', path: '/ai-mentor', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'portfolio', title: 'My Portfolio & Certificates', category: 'Navigation', path: '/my-learning', icon: <Award className="w-4 h-4" /> },
  { id: 'profile', title: 'User Profile Settings', category: 'System', path: '/profile', icon: <User className="w-4 h-4" /> },
  { id: 'settings', title: 'System Configurations', category: 'System', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  { id: 'dp-intro', title: 'Introduction to Dynamic Programming', category: 'Lesson', path: '/learn/adv-algorithms/dynamic-programming/dp-introduction', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'two-sum', title: 'Two Sum Problem', category: 'CodeLab', path: '/codelab/two-sum', icon: <Code className="w-4 h-4" /> }
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const filteredItems = COMMAND_ITEMS.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = useCallback((path) => {
    onClose();
    setQuery('');
    navigate(path);
  }, [navigate, onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
        e.preventDefault();
        handleSelect(filteredItems[selectedIndex].path);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filteredItems, selectedIndex, handleSelect]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden z-10"
        >
          {/* Search Header */}
          <div className="relative flex items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type a command or search workspaces..."
              className="w-full bg-transparent text-sm font-bold text-black dark:text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded border border-slate-200 dark:border-slate-700"
            >
              ESC
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-3 flex flex-col gap-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.path)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all select-none text-left ${
                      isSelected
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        isSelected
                          ? 'bg-white/10 dark:bg-black/10'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{item.title}</div>
                        <div className={`text-[10px] font-mono uppercase tracking-wider ${
                          isSelected ? 'text-white/70 dark:text-black/70' : 'text-slate-400'
                        }`}>
                          {item.category}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex items-center gap-1 text-[10px] font-mono font-bold opacity-80">
                        <span>Open</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs font-bold text-slate-400">
                No matching workspace commands found.
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">↵</kbd> Select
              </span>
            </div>
            <span>ASCENDRA Command Hub</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
