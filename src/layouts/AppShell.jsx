import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../components/common/TopNavbar';
import Breadcrumbs from '../components/common/Breadcrumbs';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background text-slate-800 transition-colors duration-300 flex flex-col">
      {/* 1. New Top Navigation Bar */}
      <TopNavbar />

      {/* 2. Main Page Container & Layout Area (Full width, no side-nav offset) */}
      <main className="flex-1 px-4 md:px-8 py-4 max-w-7xl w-full mx-auto">
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs />

        {/* Child Pages Outlet */}
        <Outlet />
      </main>
    </div>
  );
}
