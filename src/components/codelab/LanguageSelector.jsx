import React from 'react';
import { Terminal } from 'lucide-react';

export default function LanguageSelector({ languages = [], selectedId, onSelect }) {
  return (
    <div className="flex items-center gap-2 select-none shrink-0">
      <Terminal className="w-4 h-4 text-slate-400" />
      <select
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-700"
      >
        {languages.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
