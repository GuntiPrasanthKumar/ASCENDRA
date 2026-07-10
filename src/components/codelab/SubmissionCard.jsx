import React from 'react';
import { History, Clock, Server } from 'lucide-react';

export default function SubmissionCard({ submissions = [] }) {
  return (
    <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-4">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 pl-1 flex items-center gap-1.5">
        <History className="w-4 h-4 text-slate-400" /> Submission Logs
      </h3>
      {submissions.length === 0 ? (
        <span className="text-xs text-textMuted italic font-semibold pl-1">No past attempts recorded.</span>
      ) : (
        <div className="flex flex-col gap-3">
          {submissions.map((sub) => (
            <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 text-[10px] text-textMuted flex justify-between items-center">
              <div>
                <span className={`font-black uppercase tracking-wider block mb-1 text-[9px] ${sub.status === 'Accepted' ? 'text-success' : 'text-error'}`}>
                  {sub.status}
                </span>
                <div className="flex items-center gap-3 font-semibold text-slate-500">
                  <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> {sub.runtime}</span>
                  <span className="flex items-center gap-0.5"><Server className="w-3.5 h-3.5" /> {sub.memory}</span>
                </div>
              </div>
              <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase">
                {sub.language}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
