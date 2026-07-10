import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldAlert, Award, FileText, CheckCircle2 } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

export default function TeacherDashboard() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,rgba(108,99,255,0.03),transparent)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-black text-primary">Teacher Portal</h1>
              <p className="text-textMuted text-sm font-medium mt-1">Classroom administration and biometric integrity feeds.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Overview Card */}
            <div className="glass p-8 rounded-[2rem] border border-slate-200/50 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-display text-primary mb-2">Classroom Performance</h3>
                <p className="text-textMuted text-sm leading-relaxed mb-6">Track aggregate scores, completion statuses, and adaptive difficulty levels for connected students.</p>
              </div>
              <span className="text-xs font-black text-accent uppercase tracking-widest bg-accent/5 px-4 py-2 rounded-full w-fit">
                Phase 2 Modules Locked
              </span>
            </div>

            {/* Proctor Logs Card */}
            <div className="glass p-8 rounded-[2rem] border border-slate-200/50 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-display text-primary mb-2">Proctor Logs</h3>
                <p className="text-textMuted text-sm leading-relaxed mb-6">Review automated strikes, gaze anomalies, tab switches, and webcam identity mismatches.</p>
              </div>
              <span className="text-xs font-black text-accent uppercase tracking-widest bg-accent/5 px-4 py-2 rounded-full w-fit">
                Logs Offline
              </span>
            </div>

            {/* Curriculum Designer Card */}
            <div className="glass p-8 rounded-[2rem] border border-slate-200/50 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-display text-primary mb-2">Quest Assignee</h3>
                <p className="text-textMuted text-sm leading-relaxed mb-6">Design and deploy math puzzles, coding challenges, or final proctored exams directly to student dash boards.</p>
              </div>
              <span className="text-xs font-black text-accent uppercase tracking-widest bg-accent/5 px-4 py-2 rounded-full w-fit">
                Locked
              </span>
            </div>
          </div>

          {/* Verification Status */}
          <div className="glass p-8 rounded-[2rem] border border-dashed border-slate-200/50 text-center flex flex-col items-center max-w-xl mx-auto">
            <CheckCircle2 className="w-10 h-10 text-success mb-4" />
            <h4 className="font-bold text-primary mb-1">Lead Architect Notes</h4>
            <p className="text-xs text-textMuted leading-relaxed mb-4">
              Your credentials match the authorized teacher access scopes. The database routes and role guards have verified your token successfully. This module is prepped for Phase 2 interface overlays.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
