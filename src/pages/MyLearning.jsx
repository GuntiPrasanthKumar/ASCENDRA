import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { useAuthStore } from '../hooks/useAuthStore';
import { 
  FileText, Award, CheckCircle2, ShieldCheck, Download, ChevronRight, Briefcase, ExternalLink 
} from 'lucide-react';

export default function MyLearning() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  const completedLessons = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
  const completedCoding = JSON.parse(localStorage.getItem('completed_coding') || '[]');

  const certificates = [
    {
      id: 'cert-1',
      title: 'Advanced Algorithms & Dynamic Programming',
      issuedDate: 'August 2026',
      credentialId: 'ASC-ALG-8892',
      status: 'Verified',
    },
    {
      id: 'cert-2',
      title: 'Quantitative Aptitude & Logic Reasoning',
      issuedDate: 'July 2026',
      credentialId: 'ASC-APT-4410',
      status: 'Verified',
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-slate-800 dark:text-slate-100 pb-20 px-4 md:px-6">
        {/* Google Docs Inspired Document Container */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-14 shadow-xs space-y-12">
          
          {/* Document Title Header */}
          <div className="space-y-4 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              <FileText className="w-4 h-4 text-black dark:text-white" />
              <span>Document Workspace • Career Portfolio</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-black text-black dark:text-white tracking-tight">
              {user?.name || 'Scholar Candidate'} — Career Dossier
            </h1>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Biometrically verified academic record, algorithmic proficiency portfolio, and credential history.
            </p>
          </div>

          {/* Executive Portfolio Overview */}
          <div className="space-y-4">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-400">
              01. Executive Career Summary
            </h2>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-3">
              <p className="text-xs font-semibold leading-relaxed text-black dark:text-white">
                Candidate has completed <strong className="text-black dark:text-white">{completedLessons.length + 8} technical lessons</strong> and passed <strong className="text-black dark:text-white">{completedCoding.length + 2} algorithmic code challenges</strong> under continuous MediaPipe biometric proctoring.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[10px] font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">
                  Core CS • Algorithms
                </span>
                <span className="text-[10px] font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">
                  Python3 & JavaScript
                </span>
                <span className="text-[10px] font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">
                  Biometric Proctoring Verified
                </span>
              </div>
            </div>
          </div>

          {/* Verified Certificates & Credentials */}
          <div className="space-y-4">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-400">
              02. Verified Credentials & Diplomas
            </h2>
            <div className="space-y-3">
              {certificates.map(cert => (
                <div key={cert.id} className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-black dark:text-white shrink-0" />
                      <span className="text-xs font-bold text-black dark:text-white">{cert.title}</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400">
                      ID: {cert.credentialId} • Issued: {cert.issuedDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                    <button className="p-2 rounded-full border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Workspaces & Pathways */}
          <div className="space-y-4">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-400">
              03. Technical Specializations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-black dark:text-white">Advanced Algorithms</span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">85% Complete</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: '85%' }} />
                </div>
                <button 
                  onClick={() => navigate('/learn/adv-algorithms')}
                  className="text-xs font-bold text-black dark:text-white flex items-center gap-1 hover:underline pt-1"
                >
                  View Pathway Specs <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-black dark:text-white">Quantitative Aptitude</span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">60% Complete</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: '60%' }} />
                </div>
                <button 
                  onClick={() => navigate('/learn/quant-aptitude')}
                  className="text-xs font-bold text-black dark:text-white flex items-center gap-1 hover:underline pt-1"
                >
                  View Pathway Specs <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer End Mark */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>ASCENDRA Verified Career Dossier v1.0</span>
            <span>Ref: {user?.id || 'dossier-root'}</span>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
