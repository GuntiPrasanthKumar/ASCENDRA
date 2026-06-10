import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BrainCircuit, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const guestLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];

  const authLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Proctoring', path: '/proctoring' },
    { name: 'Vault', path: '/vault' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Echo', path: '/echo' },
    { name: 'AI Tutor', path: '/assistant' },
    { name: 'About', path: '/about' },
  ];


  const links = isAuthenticated ? authLinks : guestLinks;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] glass px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <BrainCircuit className="w-8 h-8 text-primary relative z-10 group-hover:text-accent transition-colors" />
            <div className="absolute inset-0 bg-accent/20 blur-md rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span className="font-display font-bold text-xl tracking-wide text-primary">
            SkillTrove
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative font-body text-sm font-medium transition-colors ${
                location.pathname === link.path ? 'text-accent' : 'text-textPrimary hover:text-accent'
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 w-full h-[2px] bg-accent rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Auth Area Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-primary">{user?.name || 'Student'}</span>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-52 glass rounded-2xl shadow-xl border border-white/30 overflow-hidden"
                  >
                    <div className="p-4 border-b border-muted">
                      <p className="font-bold text-primary text-sm">{user?.name || 'Student'}</p>
                      <p className="text-textMuted text-xs">{user?.email || 'student@skilltrove.ai'}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-textPrimary hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link
                        to="/vault"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-textPrimary hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <User className="w-4 h-4" /> My Vault
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-error hover:bg-error/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-accent transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-accent hover:shadow-[0_0_15px_rgba(108,99,255,0.4)] transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full glass border-t border-white/20 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-body text-lg ${
                    location.pathname === link.path ? 'text-accent font-bold' : 'text-textPrimary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/20 my-2" />
              {isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="flex items-center gap-2 font-body text-lg text-error"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="font-body text-lg text-textPrimary"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="bg-primary text-white text-center py-3 rounded-xl font-medium mt-2"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
