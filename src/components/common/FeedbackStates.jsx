import React from 'react';
import { Loader2 } from 'lucide-react';

// ─────────────────────────────────────────────
// Skeletons
// ─────────────────────────────────────────────

export function PageSkeleton() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col gap-8 animate-pulse p-6">
      <div className="h-12 w-1/3 bg-slate-200 rounded-2xl" />
      <div className="h-4 w-2/3 bg-slate-200 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="h-48 bg-slate-200 rounded-[2rem]" />
        <div className="h-48 bg-slate-200 rounded-[2rem]" />
        <div className="h-48 bg-slate-200 rounded-[2rem]" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-2xl bg-slate-200" />
      <div className="h-6 w-2/3 bg-slate-200 rounded-xl" />
      <div className="h-4 w-full bg-slate-200 rounded-xl" />
      <div className="h-4 w-1/2 bg-slate-200 rounded-xl" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full flex flex-col gap-4 animate-pulse">
      <div className="h-10 bg-slate-200 rounded-xl w-full" />
      <div className="h-8 bg-slate-200 rounded-xl w-full" />
      <div className="h-8 bg-slate-200 rounded-xl w-full" />
      <div className="h-8 bg-slate-200 rounded-xl w-full" />
      <div className="h-8 bg-slate-200 rounded-xl w-full" />
    </div>
  );
}

export function AISkeleton() {
  return (
    <div className="flex gap-4 items-start animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
      <div className="flex flex-col gap-2 w-full">
        <div className="h-4 bg-slate-200 rounded-lg w-1/4" />
        <div className="h-16 bg-slate-200 rounded-2xl w-3/4" />
      </div>
    </div>
  );
}

export function RouteLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-textMuted uppercase tracking-widest animate-pulse">Synchronizing Session...</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Reusable Empty State
// ─────────────────────────────────────────────

export function EmptyState({ icon: Icon, title, description, actionText, onAction }) {
  return (
    <div className="p-12 rounded-[2rem] bg-gradient-to-br from-indigo-50/10 to-pink-50/10 border-2 border-dashed border-slate-200/50 flex flex-col items-center text-center w-full">
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 mb-4 shadow-sm border border-slate-100">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
          {actionText}
        </button>
      )}
    </div>
  );
}
