import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuthStore';
import { 
  LayoutDashboard, BookOpen, Activity, Sparkles, Award, 
  User, Settings, ShieldCheck, Users, LogOut, X, Code, Video 
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuthStore();
  const userRole = user?.role?.toLowerCase() || 'student';

  const menuItems = [
    { path: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/learn', label: 'Learning', icon: <BookOpen className="w-4 h-4" /> },
    { path: '/practice', label: 'Practice', icon: <Activity className="w-4 h-4" /> },
    { path: '/codelab', label: 'CodeLab', icon: <Code className="w-4 h-4" /> },
    { path: '/interview', label: 'Interview Studio', icon: <Video className="w-4 h-4" /> },
    { path: '/ai-mentor', label: 'AI Mentor', icon: <Sparkles className="w-4 h-4" /> },
    { path: '/my-learning', label: 'Insights', icon: <Award className="w-4 h-4" /> },
    { path: '/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSignOut = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Sidebar background overlay for mobile view */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-all duration-300"
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-400 border-r border-white/5 flex flex-col justify-between p-6 transition-transform duration-300 transform lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col gap-8">
          {/* Logo header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/ascendra-logo.png" alt="ASCENDRA" className="h-9 w-auto object-contain rounded-lg" />
              <span className="font-display font-black text-white text-lg tracking-widest uppercase">ASCENDRA</span>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links list */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all border border-transparent ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border-indigo-500/20'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* Role-Based Teacher / Admin console links */}
            {(userRole === 'teacher' || userRole === 'faculty' || userRole === 'admin') && (
              <div className="pt-4 mt-4 border-t border-white/5 flex flex-col gap-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-4 mb-2 block">
                  Admin Gates
                </span>
                
                {(userRole === 'teacher' || userRole === 'faculty') && (
                  <NavLink
                    to="/teacher"
                    onClick={onClose}
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all border border-transparent ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border-indigo-500/20'
                        : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Teacher Console</span>
                  </NavLink>
                )}

                {userRole === 'admin' && (
                  <NavLink
                    to="/admin"
                    onClick={onClose}
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all border border-transparent ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border-indigo-500/20'
                        : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </NavLink>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* Footer profile & logout */}
        <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-extrabold text-xs">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-xs truncate">{user?.name || 'Scholar'}</h4>
              <span className="text-[10px] text-slate-500 capitalize">{userRole}</span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-xs font-bold hover:bg-red-500/10 hover:text-red-400 border border-transparent transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
