import React from 'react';
import { 
  BookOpen, Activity, Code, Video, Bell, Search, User, ShieldAlert 
} from 'lucide-react';

// ─────────────────────────────────────────────
// Premium Shimmer Skeletons
// ─────────────────────────────────────────────

export function PageSkeleton() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col gap-8 p-6" role="status" aria-label="Loading page content">
      <div className="h-12 w-1/3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse rounded-2xl" />
      <div className="h-4 w-2/3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="h-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse rounded-[2rem]" />
        <div className="h-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse rounded-[2rem]" />
        <div className="h-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse rounded-[2rem]" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-4" role="status" aria-label="Loading card content">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      <div className="h-6 w-2/3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse rounded-xl" />
      <div className="h-4 w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse rounded-xl" />
      <div className="h-4 w-1/2 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse rounded-xl" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full flex flex-col gap-4" role="status" aria-label="Loading table content">
      <div className="h-10 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse rounded-xl w-full" />
      <div className="h-8 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse rounded-xl w-full" />
      <div className="h-8 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse rounded-xl w-full" />
      <div className="h-8 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse rounded-xl w-full" />
    </div>
  );
}

export function AISkeleton() {
  return (
    <div className="flex gap-4 items-start" role="status" aria-label="AI response generating">
      <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0 animate-pulse" />
      <div className="flex flex-col gap-2 w-full">
        <div className="h-4 bg-slate-200 rounded-lg w-1/4 animate-pulse" />
        <div className="h-16 bg-slate-200 rounded-2xl w-3/4 animate-pulse" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Generic Empty State Component
// ─────────────────────────────────────────────

export function EmptyState({ icon: Icon, title, description, actionText, onAction }) {
  return (
    <div className="p-12 rounded-[2rem] bg-gradient-to-br from-indigo-50/20 via-white to-slate-50/50 border-2 border-dashed border-slate-200/70 flex flex-col items-center text-center w-full">
      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 mb-4 shadow-sm border border-slate-100">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <h4 className="font-bold text-slate-800 text-sm mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 transition-all shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Specialized Domain Empty States
// ─────────────────────────────────────────────

export function LearningEmptyState({ onAction }) {
  return (
    <EmptyState
      icon={BookOpen}
      title="No Enrolled Learning Pathways"
      description="You haven't enrolled in any learning subjects yet. Browse courses to start your roadmap."
      actionText="Browse Courses"
      onAction={onAction}
    />
  );
}

export function PracticeEmptyState({ onAction }) {
  return (
    <EmptyState
      icon={Activity}
      title="No Active Practice Sets"
      description="All practice assessments are up to date! Take a new diagnostic set to test your skills."
      actionText="Start Practice Set"
      onAction={onAction}
    />
  );
}

export function CodeLabEmptyState({ onAction }) {
  return (
    <EmptyState
      icon={Code}
      title="No Coding Submissions Found"
      description="You haven't submitted code in CodeLab yet. Pick a problem to start coding."
      actionText="Explore CodeLab"
      onAction={onAction}
    />
  );
}

export function InterviewEmptyState({ onAction }) {
  return (
    <EmptyState
      icon={Video}
      title="No Interview Rehearsals Completed"
      description="Prepare for campus placement rounds with AI gaze stability & proctoring."
      actionText="Schedule Rehearsal"
      onAction={onAction}
    />
  );
}

export function NotificationsEmptyState() {
  return (
    <EmptyState
      icon={Bell}
      title="All Caught Up!"
      description="You have no unread notifications or security alerts."
    />
  );
}

export function SearchEmptyState({ query }) {
  return (
    <EmptyState
      icon={Search}
      title={`No Results for "${query}"`}
      description="Try checking for spelling errors or searching for a broader term."
    />
  );
}

export function ProfileEmptyState({ onAction }) {
  return (
    <EmptyState
      icon={User}
      title="Profile Incomplete"
      description="Add your target roles, resume link, and bio to personalize recommendations."
      actionText="Update Profile"
      onAction={onAction}
    />
  );
}
