import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { useAuthStore } from '../hooks/useAuthStore';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Bell, Search, User, LogOut, Sun, Moon, 
  Menu, Sparkles, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SEARCHABLE_ITEMS = [
  { title: 'Advanced Algorithms', category: 'Subject', path: '/learn/adv-algorithms' },
  { title: 'Quantitative Aptitude', category: 'Subject', path: '/learn/quant-aptitude' },
  { title: 'Introduction to Dynamic Programming', category: 'Lesson', path: '/learn/adv-algorithms/dynamic-programming/dp-introduction' },
  { title: 'Memoization Basics', category: 'Lesson', path: '/learn/adv-algorithms/dynamic-programming/memoization-basics' },
  { title: 'Reverse String', category: 'Coding Problem', path: '/codelab/reverse-string' },
  { title: 'Two Sum', category: 'Coding Problem', path: '/codelab/two-sum' },
  { title: 'Behavioral & HR Interview', category: 'Interview Category', path: '/interview/int-hr/setup' },
  { title: 'Technical Algorithm Round', category: 'Interview Category', path: '/interview/int-tech/setup' }
];

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  
  // Notification dropdown states
  const [notiOpen, setNotiOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load dynamic notifications based on student flow completions
  useEffect(() => {
    const list = [
      { id: 1, type: 'proctor', text: 'Webcam proctoring matches active and verified.', read: false }
    ];

    const completedLessons = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
    if (completedLessons.length > 0) {
      list.push({ id: 2, type: 'lesson', text: 'Lesson completed: Dynamic Programming Introduction! +50 XP', read: false });
    }

    const completedQuizzes = JSON.parse(localStorage.getItem('completed_quizzes') || '[]');
    if (completedQuizzes.length > 0) {
      list.push({ id: 3, type: 'quiz', text: 'Diagnostic Quiz completed with 100% accuracy! +300 XP', read: false });
    }

    const completedCoding = JSON.parse(localStorage.getItem('completed_coding') || '[]');
    if (completedCoding.length > 0) {
      list.push({ id: 4, type: 'codelab', text: 'CodeLab solution accepted! +150 XP', read: false });
    }

    setNotifications(list);
  }, []);

  // Profile dropdown states
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background text-slate-800 transition-colors duration-300 flex">
      {/* 1. Responsive Sidebar drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Layout area (Right side) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* 2. Top Header Navbar */}
        <header className="sticky top-0 z-30 h-20 bg-background/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 lg:hidden border border-slate-200"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search box */}
            <div className="relative hidden md:block w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search topics, paths..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xs font-semibold"
              />
              {/* Floating results overlay */}
              {searchVal.trim().length > 0 && (
                <div className="absolute top-12 left-0 right-0 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 flex flex-col gap-1">
                  {SEARCHABLE_ITEMS.filter(item =>
                    item.title.toLowerCase().includes(searchVal.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchVal.toLowerCase())
                  ).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate(item.path);
                        setSearchVal('');
                      }}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 flex flex-col gap-0.5 border border-transparent hover:border-slate-100 transition-all select-none"
                    >
                      <span className="text-[10px] font-black text-indigo-650 uppercase tracking-wider">{item.category}</span>
                      <span className="text-xs font-bold text-slate-800">{item.title}</span>
                    </button>
                  ))}
                  {SEARCHABLE_ITEMS.filter(item =>
                    item.title.toLowerCase().includes(searchVal.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchVal.toLowerCase())
                  ).length === 0 && (
                    <span className="text-[10px] text-textMuted font-bold text-center py-4 select-none">No matches found.</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action links & icons (Notifications, User menu, Theme) */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Center Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotiOpen(!notiOpen)}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-center relative ${
                  notiOpen 
                    ? 'bg-primary/5 border-primary/20 text-primary' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent ring-2 ring-background" />
                )}
              </button>

              <AnimatePresence>
                {notiOpen && (
                  <>
                    <div onClick={() => setNotiOpen(false)} className="fixed inset-0 z-30" />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-80 glass border border-slate-200/50 rounded-3xl shadow-xl p-5 z-40"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-650">Notifications</h4>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">
                            Mark Read
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        {notifications.map(n => (
                          <div key={n.id} className={`p-3 rounded-2xl text-[11px] leading-relaxed font-semibold border ${
                            n.read 
                              ? 'bg-slate-50 border-slate-100 text-slate-500' 
                              : 'bg-indigo-50/20 border-indigo-100/50 text-indigo-700'
                          }`}>
                            <div className="flex gap-2 items-start">
                              {n.type === 'proctor' ? (
                                <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              ) : (
                                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
                              )}
                              <span>{n.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all shrink-0"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 font-extrabold text-xs">
                  {user?.name?.charAt(0) || 'S'}
                </div>
                <span className="text-xs font-bold text-slate-700 hidden sm:inline">{user?.name?.split(' ')[0] || 'Scholar'}</span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div onClick={() => setProfileOpen(false)} className="fixed inset-0 z-30" />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 glass border border-slate-200/50 rounded-3xl shadow-xl p-4 z-40 flex flex-col gap-1.5"
                    >
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-50 transition-colors text-left"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* 3. Page Container & Content Layout */}
        <main className="flex-1 px-6 py-8 md:px-10 md:py-12 max-w-7xl w-full mx-auto">
          {/* Breadcrumbs Navigation */}
          <Breadcrumbs />

          {/* Child pages Outlet */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
