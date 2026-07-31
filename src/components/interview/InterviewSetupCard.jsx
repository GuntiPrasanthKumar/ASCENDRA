import React from 'react';
import { Camera, Mic, ShieldCheck } from 'lucide-react';

export default function InterviewSetupCard({ camStatus, micStatus, faceStatus }) {
  return (
    <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-4 select-none">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 pl-1">Hardware Diagnostic Check</h3>
      
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center p-3.5 rounded-2xl bg-slate-50 border border-slate-105">
          <div className="flex gap-3 items-center">
            <Camera className="w-4 h-4 text-slate-450" />
            <span className="text-xs font-semibold text-slate-700">Camera Stream</span>
          </div>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            camStatus === 'Active' ? 'bg-success/5 border-success/10 text-success' : 'bg-red-500/5 border-red-500/10 text-red-600 animate-pulse'
          }`}>
            {camStatus}
          </span>
        </div>

        <div className="flex justify-between items-center p-3.5 rounded-2xl bg-slate-50 border border-slate-105">
          <div className="flex gap-3 items-center">
            <Mic className="w-4 h-4 text-slate-450" />
            <span className="text-xs font-semibold text-slate-700">Microphone Input</span>
          </div>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            micStatus === 'Active' ? 'bg-success/5 border-success/10 text-success' : 'bg-red-500/5 border-red-500/10 text-red-600 animate-pulse'
          }`}>
            {micStatus}
          </span>
        </div>

        <div className="flex justify-between items-center p-3.5 rounded-2xl bg-slate-50 border border-slate-105">
          <div className="flex gap-3 items-center">
            <ShieldCheck className="w-4 h-4 text-slate-450" />
            <span className="text-xs font-semibold text-slate-700">Face Recognition Match</span>
          </div>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            faceStatus === 'Match Verified' ? 'bg-success/5 border-success/10 text-success' : 'bg-red-500/5 border-red-500/10 text-red-600 animate-pulse'
          }`}>
            {faceStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
