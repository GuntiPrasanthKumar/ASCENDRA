import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  LayoutDashboard, BookOpen, Activity, Code, Video, Sparkles, Award, 
  User, Settings, LogOut, Sun, Moon, Bell, Search, Menu, X, ShieldAlert, Users, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter from './NotificationCenter';

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

export default function TopNavbar({ onOpenCommandPalette }) {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [notiOpen, setNotiOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const userRole = user?.role?.toLowerCase() || 'student';

  const menuItems = [
    { path: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { path: '/learn', label: 'Learning', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { path: '/practice', label: 'Practice', icon: <Activity className="w-3.5 h-3.5" /> },
    { path: '/codelab', label: 'CodeLab', icon: <Code className="w-3.5 h-3.5" /> },
    { path: '/interview', label: 'Interview', icon: <Video className="w-3.5 h-3.5" /> },
    { path: '/ai-mentor', label: 'AI Coach', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { path: '/my-learning', label: 'Portfolio', icon: <Award className="w-3.5 h-3.5" /> },
  ];

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

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 bg-[#F8F9FA]/90 dark:bg-[#131314]/90 backdrop-blur-xl border-b border-[#E3E3E3]/80 dark:border-[#2E2F31]/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6 shrink-0">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 focus:outline-none group"
          >
            <img src="/ascendra-logo.png" alt="ASCENDRA" className="h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          </button>
        </div>

        {/* Center: Curvy Google Navigation Links (Desktop) */}
        <nav className="hidden xl:flex items-center bg-[#F0F4F9]/80 dark:bg-[#1E1E20]/90 p-1 rounded-full border border-[#E3E3E3]/70 dark:border-[#2E2F31] shadow-xs">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-[#1A73E8] text-white dark:bg-[#A8C7FA] dark:text-[#041E49] shadow-xs'
                    : 'text-[#5F6368] dark:text-[#C4C7C5] hover:text-[#1F1F1F] dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#282A2C]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Command Bar Search, Theme, Notifications & User Avatar */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Google / Cursor style Command Search Bar */}
          <div className="relative hidden lg:block w-56 xl:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5F6368] dark:text-[#8E918F]" />
            <input
              type="text"
              readOnly
              onClick={onOpenCommandPalette}
              value={searchVal}
              placeholder="Search or type command..."
              className="w-full pl-9 pr-10 py-2 rounded-full bg-[#F0F4F9]/80 dark:bg-[#1E1E20] border border-[#E3E3E3]/80 dark:border-[#2E2F31] focus:outline-none focus:ring-2 focus:ring-[#1A73E8] text-xs font-semibold text-[#1F1F1F] dark:text-[#E3E3E3] placeholder-[#5F6368] dark:placeholder-[#8E918F] cursor-pointer hover:bg-white dark:hover:bg-[#282A2C] transition-all"
            />
            <button
              onClick={onOpenCommandPalette}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-[#5F6368] dark:text-[#8E918F] bg-white dark:bg-[#282A2C] px-1.5 py-0.5 rounded-full border border-[#E3E3E3] dark:border-[#444746]"
            >
              ⌘K
            </button>

            {/* Search Dropdown */}
            {searchVal.trim().length > 0 && (
              <div className="absolute top-11 left-0 right-0 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[1.5rem] shadow-xl z-50 p-2 flex flex-col gap-1">
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
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col gap-0.5 border border-transparent transition-all select-none"
                  >
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                    <span className="text-xs font-bold text-black dark:text-white">{item.title}</span>
                  </button>
                ))}
                {SEARCHABLE_ITEMS.filter(item =>
                  item.title.toLowerCase().includes(searchVal.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchVal.toLowerCase())
                ).length === 0 && (
                  <span className="text-[10px] text-slate-400 font-bold text-center py-4 select-none">No command matches found.</span>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100/80 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800 transition-all"
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Notification Center Popover */}
          <div className="relative">
            <button
              onClick={() => setNotiOpen(!notiOpen)}
              className={`p-2 rounded-full border transition-all flex items-center justify-center relative ${
                notiOpen 
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black' 
                  : 'bg-slate-100/80 dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-black dark:bg-white ring-2 ring-white dark:ring-slate-950" />
              )}
            </button>

            <NotificationCenter isOpen={notiOpen} onClose={() => setNotiOpen(false)} />
          </div>

          {/* User Profile Pill Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full border border-slate-200/70 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all shrink-0"
            >
              <div className="w-7 h-7 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-xs">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline">{user?.name?.split(' ')[0] || 'Scholar'}</span>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <>
                  <div onClick={() => setProfileOpen(false)} className="fixed inset-0 z-30" />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[2rem] shadow-xl p-4 z-40 flex flex-col gap-1.5"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-xs font-bold text-black dark:text-white">{user?.name || 'Scholar'}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{userRole}</p>
                    </div>

                    <button
                      onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-black dark:text-white" /> My Profile
                    </button>

                    <button
                      onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-black dark:text-white" /> System Settings
                    </button>

                    {(userRole === 'teacher' || userRole === 'faculty') && (
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/teacher'); }}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                      >
                        <Users className="w-4 h-4 text-black dark:text-white" /> Teacher Console
                      </button>
                    )}

                    {userRole === 'admin' && (
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/admin'); }}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                      >
                        <ShieldCheck className="w-4 h-4 text-black dark:text-white" /> Admin Panel
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle Button (XL and smaller) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-slate-100/80 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-black dark:text-white xl:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Navigation Modal */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs xl:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 left-4 right-4 z-50 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-2xl xl:hidden flex flex-col gap-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              {/* Mobile Search input */}
              <div className="relative mt-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Command search..."
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-black dark:text-white placeholder-slate-400"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
