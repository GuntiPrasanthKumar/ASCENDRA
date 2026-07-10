import React from 'react';

export default function PracticeLayout({ sidebar, children }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start select-none">
      <div className="lg:col-span-3">
        {children}
      </div>
      <div className="flex flex-col gap-6 w-full">
        {sidebar}
      </div>
    </div>
  );
}
