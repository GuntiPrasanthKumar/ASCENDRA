import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search subjects...' }) {
  return (
    <div className="relative w-full md:w-72">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-black text-xs font-semibold text-black placeholder-slate-400"
      />
    </div>
  );
}
