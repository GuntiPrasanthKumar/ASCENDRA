import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Settings, LogOut, ShieldCheck, Users, Search, Bell } from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuthStore';

const Navbar = ({ onOpenCommandPalette }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const userRole = user?.role?.toLowerCase() || 'student';

  const guestLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/learn', label: 'Learn' },
    { path: '/practice', label: 'Practice' },
    { path: '/codelab', label: 'CodeLab' },
    { path: '/ai-mentor', label: 'AI Mentor' },
    { path: '/interview', label: 'Interview Studio' },
  ];

  const authLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/learn', label: 'Learn' },
    { path: '/practice', label: 'Practice' },
    { path: '/codelab', label: 'CodeLab' },
    { path: '/ai-mentor', label: 'AI Mentor' },
    { path: '/interview', label: 'Interview Studio' },
    { path: '/my-learning', label: 'Progress' },
    { path: '/profile', label: 'Profile' },
    { path: '/settings', label: 'Settings' },
  ];

  if (userRole === 'teacher' || userRole === 'faculty') {
    authLinks.push({ path: '/teacher', label: 'Teacher Desk' });
  } else if (userRole === 'admin') {
    authLinks.push({ path: '/admin', label: 'Admin Desk' });
  }

  const menuItems = isAuthenticated ? authLinks : guestLinks;

  const handleSignOut = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="w-full bg-[#F8F9FA] text-black transition-colors duration-200">
      <div className="w-full px-6 md:px-12 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Title */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 focus:outline-none shrink-0"
        >
          <img src="/ascendra-logo.png" alt="ASCENDRA" className="h-9 w-auto object-contain" />
          <span className="font-display font-bold text-lg text-black tracking-tight">
            ASCENDRA
          </span>
        </button>

        {/* Right Pushed Navigation & Actions */}
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center gap-7">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && item.path !== '/dashboard' && location.pathname.startsWith(item.path));
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
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                    {(user?.name || 'S').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-black">{user?.name || 'Student'}</span>
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
                          <p className="text-sm font-bold text-black">{user?.name || 'Student'}</p>
                          <p className="text-xs text-neutral-500 capitalize">{userRole}</p>
                        </div>

                        <button
                          onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-black hover:bg-neutral-100 transition-colors text-left"
                        >
                          <User className="w-4 h-4" /> Profile Dossier
                        </button>

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
            ) : (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-neutral-600 hover:text-black transition-colors px-3 py-1.5"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="text-sm font-medium text-white bg-black hover:bg-neutral-800 transition-colors px-4 py-1.5 rounded-full"
                >
                  Get Started
                </NavLink>
              </div>
            )}

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
};

export default Navbar;
