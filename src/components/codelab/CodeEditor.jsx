import React from 'react';
import MonacoEditor from '@monaco-editor/react';

export default function CodeEditor({ value, onChange, language = 'javascript' }) {
  return (
    <div className="w-full h-[360px] rounded-2xl overflow-hidden border border-slate-200">
      <MonacoEditor
        height="100%"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange(val || '')}
        options={{
          fontSize: 12,
          minimap: { enabled: false },
          automaticLayout: true,
          fontFamily: 'Consolas, monospace',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible'
          }
        }}
      />
    </div>
  );
}
