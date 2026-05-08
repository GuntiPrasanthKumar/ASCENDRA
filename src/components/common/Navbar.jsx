import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BrainCircuit } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Vault', path: '/vault' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Echo', path: '/echo' },
    { name: 'About', path: '/about' },
  ];

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

        {/* Auth Buttons Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-accent transition-colors">
            Log In
          </Link>
          <Link to="/signup" className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-accent hover:shadow-[0_0_15px_rgba(108,99,255,0.4)] transition-all">
            Get Started
          </Link>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
