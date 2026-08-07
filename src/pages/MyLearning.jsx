import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { useAuthStore } from '../hooks/useAuthStore';
import { 
  Award, ShieldCheck, Download, ChevronRight, CheckCircle2, Star, 
  Home, ScanFace, Calendar, ExternalLink, User
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
        <div className="min-h-screen bg-[#F8F9FA] px-4 md:px-12 py-6 w-full">
          <div className="w-full">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  const certificates = [
    {
      id: 'cert-1',
      title: 'Advanced Algorithms & Dynamic Programming',
      issuedDate: 'August 2026',
      credentialId: 'ASC-ALG-8892',
      status: 'Verified',
      skills: ['Recursion', 'Memoization', 'DP Optimization'],
      color: 'blue'
    },
    {
      id: 'cert-2',
      title: 'Quantitative Aptitude & Logic Reasoning',
      issuedDate: 'July 2026',
      credentialId: 'ASC-APT-4410',
      status: 'Verified',
      skills: ['Logical Reasoning', 'Data Interpretation'],
      color: 'purple'
    }
  ];

  const studentName = user?.name || 'Vijay Kiran';

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] px-4 md:px-12 py-6 w-full font-body">
        <div className="w-full space-y-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Home className="w-3.5 h-3.5 hover:text-slate-600 cursor-pointer" onClick={() => navigate('/dashboard')} />
            <span>&gt;</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/my-learning')}>My Learning</span>
            <span>&gt;</span>
            <span className="text-slate-900 font-semibold">Portfolio Dossier</span>
          </div>

          {/* Header Banner */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xs">
            <div className="space-y-2.5 max-w-3xl">
              <div className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase border border-emerald-100 flex items-center gap-1.5 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Career Portfolio</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
                {studentName} — Portfolio Dossier
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
                Biometrically proctored computer science certifications, verified algorithmic accomplishments, and technical specializations.
              </p>
            </div>

            <button className="px-6 py-3.5 rounded-full bg-black hover:bg-slate-800 text-white font-semibold text-xs md:text-sm flex items-center gap-2 transition-all shadow-xs shrink-0">
              <Download className="w-4 h-4" />
              <span>Export PDF Portfolio</span>
            </button>
          </div>

          {/* Section 01: Executive Technical Summary */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              01. EXECUTIVE TECHNICAL SUMMARY
            </span>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ScanFace className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-display font-bold text-slate-900 tracking-tight">
                    MediaPipe Biometric Proctoring Verified
                  </h3>
                </div>

                <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase border border-emerald-100 flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified</span>
                </span>
              </div>

              <p className="text-xs font-medium text-slate-600 leading-relaxed max-w-4xl">
                Candidate has completed 9 technical lessons and accepted 2 CodeLab algorithmic challenges with 100% identity verification compliance.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <span className="bg-slate-100 text-slate-700 font-semibold px-4 py-1.5 rounded-full text-xs">
                  Data Structures &amp; Algorithms
                </span>
                <span className="bg-slate-100 text-slate-700 font-semibold px-4 py-1.5 rounded-full text-xs">
                  Python3 &amp; JavaScript (ES6+)
                </span>
                <span className="bg-slate-100 text-slate-700 font-semibold px-4 py-1.5 rounded-full text-xs">
                  System Architecture &amp; Logic
                </span>
              </div>
            </div>
          </div>

          {/* Section 02: Verified Credentials & Diplomas */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              02. VERIFIED CREDENTIALS &amp; DIPLOMAS
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map(cert => (
                <div key={cert.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        cert.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        <User className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-base font-display font-bold text-slate-900 tracking-tight leading-snug">{cert.title}</h4>
                        <p className="text-xs font-semibold text-slate-400">ID: {cert.credentialId}</p>
                      </div>
                    </div>

                    <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase border border-emerald-100 flex items-center gap-1.5 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((s, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 font-semibold px-3 py-1 rounded-full text-xs">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Issued {cert.issuedDate}
                    </span>
                    <button className="font-semibold text-blue-600 hover:underline flex items-center gap-1">
                      <span>Download Record</span>
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 03: Technical Specializations & Pathways */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              03. TECHNICAL SPECIALIZATIONS &amp; PATHWAYS
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specialization 1 */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5" />
                    </div>
                    <span className="text-base font-display font-bold text-slate-900">Advanced Algorithms</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">85% Complete</span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }} />
                </div>

                <button 
                  onClick={() => navigate('/learn/adv-algorithms')}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 pt-1"
                >
                  <span>View Pathway Specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Specialization 2 */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5" />
                    </div>
                    <span className="text-base font-display font-bold text-slate-900">Quantitative Aptitude</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">60% Complete</span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '60%' }} />
                </div>

                <button 
                  onClick={() => navigate('/learn/quant-aptitude')}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 pt-1"
                >
                  <span>View Pathway Specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Meta End Bar */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-medium text-slate-400">
            <span>ASCENDRA Verified Career Portfolio</span>
            <div className="flex items-center gap-1.5">
              <span>Ref: 6a7k3b9v5d19f9385ef41de6eb</span>
              <ExternalLink className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600" />
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
