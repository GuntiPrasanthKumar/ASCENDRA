import React from 'react';

export default function WorkspaceLayout({ 
  header, 
  primaryStage, 
  sideRail, 
  className = '' 
}) {
  return (
    <div className={`min-h-[85vh] flex flex-col gap-6 ${className}`}>
      {/* Optional Top Header / AI Command Bar */}
      {header && (
        <div className="w-full">
          {header}
        </div>
      )}

      {/* NotebookLM / Gemini 70% Primary Stage + 30% Side Rail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start flex-1">
        {/* Primary Workspace Stage (70%) */}
        <div className="lg:col-span-7 flex flex-col gap-8 w-full min-w-0">
          {primaryStage}
        </div>

        {/* Side Rail / Context Telemetry Panel (30%) */}
        {sideRail && (
          <div className="lg:col-span-3 flex flex-col gap-6 sticky top-20 w-full min-w-0">
            {sideRail}
          </div>
        )}
      </div>
    </div>
  );
}
