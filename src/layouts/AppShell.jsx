import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../components/common/TopNavbar';
import Breadcrumbs from '../components/common/Breadcrumbs';
import CommandPalette from '../components/common/CommandPalette';

export default function AppShell() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {/* 1. Top Navigation Bar */}
      <TopNavbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      {/* 2. Global Command Palette Modal (Ctrl + K) */}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />

      {/* 3. Main Workspace Area */}
      <main className="flex-1 px-4 md:px-8 py-4 max-w-7xl w-full mx-auto">
        <Breadcrumbs />
        <Outlet />
      </main>
    </div>
  );
}
