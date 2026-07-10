import React from 'react';

export default function DashboardLayout({ children, sidebar }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left main feed area */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        {children}
      </div>

      {/* Right side info panel */}
      <div className="flex flex-col gap-8">
        {sidebar}
      </div>
    </div>
  );
}
