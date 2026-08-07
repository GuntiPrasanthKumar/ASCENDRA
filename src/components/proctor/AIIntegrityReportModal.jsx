import React from 'react';
import { ShieldCheck, ShieldAlert, Award, AlertTriangle, FileText, CheckCircle2, X } from 'lucide-react';

export default function AIIntegrityReportModal({ isOpen, onClose, report }) {
  if (!isOpen || !report) return null;

  const {
    sessionId,
    integrityScore = 100,
    riskStatus = 'LOW_RISK',
    recommendation = 'PASSED_VERIFICATION',
    strikes = 0,
    categoryBreakdown = {},
    evidences = []
  } = report;

  const isLowRisk = riskStatus === 'LOW_RISK';
  const isMedRisk = riskStatus === 'MEDIUM_RISK';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isLowRisk ? 'bg-emerald-50 text-emerald-600' : isMedRisk ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
            }`}>
              {isLowRisk ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">AI Integrity Verification Report</h2>
              <p className="text-xs font-mono text-slate-400">Session ID: {sessionId}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score & Risk Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Integrity Score</span>
            <div className="text-3xl font-display font-extrabold text-slate-900">{integrityScore}%</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Risk Assessment</span>
            <div className={`text-xs font-bold uppercase px-3 py-1 rounded-full inline-block ${
              isLowRisk ? 'bg-emerald-100 text-emerald-700' : isMedRisk ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
            }`}>
              {riskStatus.replace('_', ' ')}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Strikes</span>
            <div className="text-3xl font-display font-extrabold text-slate-900">{strikes}</div>
          </div>
        </div>

        {/* Engine Category Breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Engine Sub-scores</h4>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col items-center">
              <span className="font-bold text-blue-900">Identity Engine</span>
              <span className="text-base font-extrabold text-blue-700 mt-1">{categoryBreakdown.identityScore ?? 100}%</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex flex-col items-center">
              <span className="font-bold text-purple-900">Behavior Engine</span>
              <span className="text-base font-extrabold text-purple-700 mt-1">{categoryBreakdown.behaviorScore ?? 100}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-100/60 border border-slate-200 flex flex-col items-center">
              <span className="font-bold text-slate-900">Environment Engine</span>
              <span className="text-base font-extrabold text-slate-700 mt-1">{categoryBreakdown.environmentScore ?? 100}%</span>
            </div>
          </div>
        </div>

        {/* Evidence Log Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recorded Evidence Timeline</h4>
          {evidences.length === 0 ? (
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2 text-xs font-medium text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero proctoring violations recorded during active session. Clean assessment.</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {evidences.map((ev, idx) => (
                <div key={ev.evidenceId || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800">{ev.violationType.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-slate-400 ml-2">[{ev.engine}]</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Final Recommendation */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">AI Recommendation</span>
              <span className="text-xs font-bold tracking-wider">{recommendation.replace(/_/g, ' ')}</span>
            </div>
          </div>
          <button onClick={onClose} className="px-5 py-2 rounded-full bg-white text-slate-900 font-bold text-xs hover:bg-slate-100">
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
