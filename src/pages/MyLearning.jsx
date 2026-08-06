import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { useAuthStore } from '../hooks/useAuthStore';
import { 
  FileText, Award, ShieldCheck, Download, ChevronRight, CheckCircle2, Star, Sparkles
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
        <div className="min-h-screen bg-[#F8F9FA] pt-2 pb-12 px-4 md:px-6">
          <div className="w-full">
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
      skills: ['Recursion', 'Memoization', 'DP Optimization']
    },
    {
      id: 'cert-2',
      title: 'Quantitative Aptitude & Logic Reasoning',
      issuedDate: 'July 2026',
      credentialId: 'ASC-APT-4410',
      status: 'Verified',
      skills: ['Logical Reasoning', 'Data Interpretation']
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] pb-20 w-full transition-colors duration-300">
        
        {/* Google NotebookLM Inspired Portfolio Document Workspace */}
        <div className="w-full bg-white border border-[#E3E3E3] rounded-[2rem] p-8 md:p-12 shadow-xs space-y-10 my-4">
          
          {/* Header Banner */}
          <div className="space-y-3 pb-8 border-b border-[#E3E3E3] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0FE] text-xs font-bold text-[#1A73E8]">
                <FileText className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Verified Career Portfolio</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-[#1F1F1F] tracking-tight">
                {user?.name || 'Scholar Candidate'} — Portfolio Dossier
              </h1>
              <p className="text-xs font-medium text-[#5F6368] leading-relaxed max-w-2xl">
                Biometrically proctored computer science certifications, verified algorithmic accomplishments, and technical specializations.
              </p>
            </div>

            <button className="px-5 py-2.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs shrink-0">
              <Download className="w-4 h-4" />
              <span>Export PDF Portfolio</span>
            </button>
          </div>

          {/* Executive Career Summary Card */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5F6368]">
              01. Executive Technical Summary
            </span>
            <div className="p-6 rounded-2xl bg-[#F0F4F9] border border-[#E3E3E3] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1A73E8]">
                <Sparkles className="w-4 h-4 text-[#1A73E8]" />
                <span>MediaPipe Biometric Proctoring Verified</span>
              </div>
              <p className="text-xs font-medium leading-relaxed text-[#1F1F1F]">
                Candidate has completed <strong className="text-[#1A73E8] font-bold">{completedLessons.length + 8} technical lessons</strong> and accepted <strong className="text-[#1A73E8] font-bold">{completedCoding.length + 2} CodeLab algorithmic challenges</strong> with 100% identity verification compliance.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[10px] font-mono font-bold bg-white border border-[#E3E3E3] px-3 py-1 rounded-full text-[#1F1F1F]">
                  Data Structures & Algorithms
                </span>
                <span className="text-[10px] font-mono font-bold bg-white border border-[#E3E3E3] px-3 py-1 rounded-full text-[#1F1F1F]">
                  Python3 & JavaScript (ES6+)
                </span>
                <span className="text-[10px] font-mono font-bold bg-white border border-[#E3E3E3] px-3 py-1 rounded-full text-[#1F1F1F]">
                  System Architecture & Logic
                </span>
              </div>
            </div>
          </div>

          {/* Verified Certificates Grid */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5F6368]">
              02. Verified Credentials & Diplomas
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map(cert => (
                <div key={cert.id} className="p-6 rounded-2xl bg-white border border-[#E3E3E3] hover:border-[#1A73E8] transition-all space-y-4 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-full bg-[#E8F0FE] text-[#1A73E8]">
                        <Award className="w-5 h-5 text-[#1A73E8]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1F1F1F] leading-snug">{cert.title}</h4>
                        <p className="text-[10px] font-mono text-[#5F6368] mt-0.5">ID: {cert.credentialId}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#1E8E3E] bg-[#E6F4EA] px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cert.skills.map((s, idx) => (
                      <span key={idx} className="text-[9px] font-mono bg-[#F0F4F9] border border-[#E3E3E3] px-2.5 py-0.5 rounded-full text-[#5F6368]">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#E3E3E3] flex justify-between items-center text-[10px] font-mono text-[#5F6368]">
                    <span>Issued {cert.issuedDate}</span>
                    <button className="font-bold text-[#1A73E8] hover:underline flex items-center gap-1">
                      Download Record <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specializations */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5F6368]">
              03. Technical Specializations & Pathways
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white border border-[#E3E3E3] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#1A73E8]" />
                    <span className="text-xs font-bold text-[#1F1F1F]">Advanced Algorithms</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#1A73E8]">85% Complete</span>
                </div>
                <div className="w-full h-2 bg-[#F0F4F9] rounded-full overflow-hidden border border-[#E3E3E3]">
                  <div className="h-full bg-[#1A73E8] rounded-full" style={{ width: '85%' }} />
                </div>
                <button 
                  onClick={() => navigate('/learn/adv-algorithms')}
                  className="text-xs font-bold text-[#1A73E8] flex items-center gap-1 hover:underline pt-1"
                >
                  View Pathway Specs <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E3E3E3] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#1A73E8]" />
                    <span className="text-xs font-bold text-[#1F1F1F]">Quantitative Aptitude</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#1A73E8]">60% Complete</span>
                </div>
                <div className="w-full h-2 bg-[#F0F4F9] rounded-full overflow-hidden border border-[#E3E3E3]">
                  <div className="h-full bg-[#1A73E8] rounded-full" style={{ width: '60%' }} />
                </div>
                <button 
                  onClick={() => navigate('/learn/quant-aptitude')}
                  className="text-xs font-bold text-[#1A73E8] flex items-center gap-1 hover:underline pt-1"
                >
                  View Pathway Specs <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer End Mark */}
          <div className="pt-6 border-t border-[#E3E3E3] flex justify-between items-center text-[10px] font-mono text-[#5F6368]">
            <span>ASCENDRA Verified Career Portfolio</span>
            <span>Ref: {user?.id || 'dossier-root'}</span>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
