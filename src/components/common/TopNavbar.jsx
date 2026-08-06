import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  LayoutDashboard, BookOpen, Activity, Code, Video, Sparkles, Award, 
  User, Settings, LogOut, Sun, Moon, Bell, Search, Menu, X, ShieldCheck, Users
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
    { path: '/dashboard', label: 'Home', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/learn', label: 'Subjects', icon: <BookOpen className="w-4 h-4" /> },
    { path: '/practice', label: 'Practice', icon: <Activity className="w-4 h-4" /> },
    { path: '/codelab', label: 'CodeLab', icon: <Code className="w-4 h-4" /> },
    { path: '/interview', label: 'Interview', icon: <Video className="w-4 h-4" /> },
    { path: '/ai-mentor', label: 'AI Coach', icon: <Sparkles className="w-4 h-4" /> },
    { path: '/my-learning', label: 'Portfolio', icon: <Award className="w-4 h-4" /> },
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#4353FF] via-[#3B46F6] to-[#4F46E5] text-white shadow-md transition-colors duration-300">
      <div className="w-full px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 focus:outline-none group p-1.5 rounded-2xl hover:bg-white/10 transition-all duration-200"
          >
            <img src="/ascendra-logo.png" alt="ASCENDRA" className="h-9 md:h-10 w-auto object-contain brightness-0 invert transition-transform duration-200 group-hover:scale-105" />
          </button>
        </div>

        {/* Center: Blue Pill Bar matching user's requested style */}
        <nav className="hidden lg:flex items-center gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 select-none group ${
                  isActive
                    ? 'bg-white/25 border border-white/40 text-white shadow-sm scale-105'
                    : 'text-white/90 hover:text-white hover:bg-white/20 hover:scale-105'
                }`}
              >
                <span className="transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Search, Theme, Notifications & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Search Input Bar */}
          <div className="relative hidden md:block w-44 lg:w-52">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/70" />
            <input
              type="text"
              readOnly
              onClick={onOpenCommandPalette}
              value={searchVal}
              placeholder="Search..."
              className="w-full pl-9 pr-9 py-1.5 rounded-full bg-white/15 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white text-xs font-semibold text-white placeholder-white/70 cursor-pointer hover:bg-white/25 hover:scale-[1.02] transition-all duration-200"
            />
            <button
              onClick={onOpenCommandPalette}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-white bg-white/20 px-1.5 py-0.5 rounded-full border border-white/30"
            >
              ⌘K
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 hover:scale-110 text-white border border-white/30 transition-all duration-200"
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification Bell Button */}
          <div className="relative">
            <button
              onClick={() => setNotiOpen(!notiOpen)}
              className={`p-2 rounded-full border transition-all duration-200 flex items-center justify-center relative hover:scale-110 ${
                notiOpen 
                  ? 'bg-white text-[#3B46F6] border-white shadow-xs' 
                  : 'bg-white/15 border-white/30 text-white hover:bg-white/25'
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-[#3B46F6]" />
              )}
            </button>

            <NotificationCenter isOpen={notiOpen} onClose={() => setNotiOpen(false)} />
          </div>

          {/* Profile Avatar Button */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full border border-white/40 bg-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-200 shrink-0 group"
            >
              <div className="w-7 h-7 rounded-full bg-white text-[#3B46F6] flex items-center justify-center font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <span className="text-xs font-bold text-white hidden sm:inline">
                {user?.name?.split(' ')[0] || 'Scholar'}
              </span>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <>
                  <div onClick={() => setProfileOpen(false)} className="fixed inset-0 z-30" />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white text-[#1F1F1F] border border-[#E3E3E3] rounded-[1.75rem] shadow-xl p-3 z-40 flex flex-col gap-1"
                  >
                    <div className="px-4 py-2.5 border-b border-[#E3E3E3] mb-1">
                      <p className="text-xs font-bold text-[#1F1F1F]">{user?.name || 'Scholar'}</p>
                      <p className="text-[10px] font-mono text-[#5F6368] capitalize">{userRole}</p>
                    </div>

                    <button
                      onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#1F1F1F] hover:bg-[#F0F4F9] hover:text-[#4353FF] transition-all text-left"
                    >
                      <User className="w-4 h-4 text-[#4353FF]" /> Profile Dossier
                    </button>

                    {userRole === 'teacher' && (
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/teacher'); }}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#1F1F1F] hover:bg-[#F0F4F9] hover:text-[#4353FF] transition-all text-left"
                      >
                        <Users className="w-4 h-4 text-[#4353FF]" /> Educator Desk
                      </button>
                    )}

                    {userRole === 'admin' && (
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/admin'); }}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#1F1F1F] hover:bg-[#F0F4F9] hover:text-[#4353FF] transition-all text-left"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#4353FF]" /> System Admin
                      </button>
                    )}

                    <button
                      onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#1F1F1F] hover:bg-[#F0F4F9] hover:text-[#4353FF] transition-all text-left"
                    >
                      <Settings className="w-4 h-4 text-[#4353FF]" /> Preferences
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#D93025] hover:bg-[#FCE8E6] transition-all text-left mt-1"
                    >
                      <LogOut className="w-4 h-4 text-[#D93025]" /> Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#3B46F6] border-b border-white/20 px-4 py-4 space-y-2 overflow-hidden shadow-lg"
          >
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(item.path);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                  location.pathname === item.path
                    ? 'bg-white text-[#3B46F6]'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
