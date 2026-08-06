import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Sun, Moon, Bell, Search, Menu, X, User, Settings, LogOut, ShieldCheck, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter from './NotificationCenter';

export default function TopNavbar({ onOpenCommandPalette }) {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const userRole = user?.role?.toLowerCase() || 'student';

  const menuItems = [
    { path: '/dashboard', label: 'Home' },
    { path: '/learn', label: 'Subjects' },
    { path: '/practice', label: 'Practice' },
    { path: '/codelab', label: 'CodeLab' },
    { path: '/interview', label: 'Interview' },
    { path: '/ai-mentor', label: 'AI Coach' },
    { path: '/my-learning', label: 'Portfolio' },
  ];

  useEffect(() => {
    const list = [
      { id: 1, type: 'proctor', text: 'Webcam proctoring matches active and verified.', read: false }
    ];
    const completedLessons = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
    if (completedLessons.length > 0) {
      list.push({ id: 2, type: 'lesson', text: 'Lesson completed: Dynamic Programming Introduction! +50 XP', read: false });
    }
    setNotifications(list);
  }, []);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="w-full bg-[#F8F9FA] text-black transition-colors duration-200">
      <div className="w-full px-6 md:px-12 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Title */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 focus:outline-none shrink-0"
        >
          <img src="/ascendra-logo.png" alt="ASCENDRA" className="h-9 w-auto object-contain" />
          <span className="font-display font-bold text-lg text-black tracking-tight">
            ASCENDRA
          </span>
        </button>

        {/* Right Pushed Navigation & Actions (Increases font size slightly, direct on screen) */}
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center gap-7">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`text-sm transition-colors duration-150 select-none py-1 ${
                    isActive
                      ? 'text-black font-bold border-b-2 border-black'
                      : 'text-neutral-600 hover:text-black font-medium'
                  }`}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-5 border-l border-neutral-300 pl-6">
            
            {/* Search Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className="text-sm text-neutral-600 hover:text-black font-medium transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-neutral-600 hover:text-black transition-colors"
              aria-label="Toggle visual theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotiOpen(!notiOpen)}
                className="text-neutral-600 hover:text-black transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-black" />
                )}
              </button>

              <NotificationCenter isOpen={notiOpen} onClose={() => setNotiOpen(false)} />
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                  {user?.name?.charAt(0) || 'S'}
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div onClick={() => setProfileOpen(false)} className="fixed inset-0 z-30" />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute right-0 mt-2 w-52 bg-white text-black border border-neutral-200 rounded-md shadow-md p-2 z-40 flex flex-col gap-0.5"
                    >
                      <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                        <p className="text-sm font-bold text-black">{user?.name || 'Scholar'}</p>
                        <p className="text-xs text-neutral-500 capitalize">{userRole}</p>
                      </div>

                      <button
                        onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-black hover:bg-neutral-100 transition-colors text-left"
                      >
                        <User className="w-4 h-4" /> Profile Dossier
                      </button>

                      {userRole === 'teacher' && (
                        <button
                          onClick={() => { setProfileOpen(false); navigate('/teacher'); }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-black hover:bg-neutral-100 transition-colors text-left"
                        >
                          <Users className="w-4 h-4" /> Educator Desk
                        </button>
                      )}

                      {userRole === 'admin' && (
                        <button
                          onClick={() => { setProfileOpen(false); navigate('/admin'); }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-black hover:bg-neutral-100 transition-colors text-left"
                        >
                          <ShieldCheck className="w-4 h-4" /> System Admin
                        </button>
                      )}

                      <button
                        onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-black hover:bg-neutral-100 transition-colors text-left"
                      >
                        <Settings className="w-4 h-4" /> Preferences
                      </button>

                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-black hover:bg-neutral-100 transition-colors text-left mt-1 border-t border-neutral-100"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-black transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#F8F9FA] px-6 py-4 space-y-2 overflow-hidden border-t border-neutral-200"
          >
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(item.path);
                }}
                className={`w-full text-left py-2.5 text-sm font-medium ${
                  location.pathname === item.path
                    ? 'text-black font-bold'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
