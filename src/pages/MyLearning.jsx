import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { useAuthStore } from '../hooks/useAuthStore';
import { 
  FileText, Award, ShieldCheck, Download, ChevronRight 
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
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#131314] pt-2 pb-12 px-4 md:px-6">
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
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] pb-20 w-full transition-colors duration-300">
        
        {/* Google Docs Inspired White Sheet Document Workspace */}
        <div className="w-full bg-white border border-[#E3E3E3] rounded-[2rem] p-8 md:p-14 shadow-sm space-y-12 my-4">
          
          {/* Document Title Header */}
          <div className="space-y-4 pb-8 border-b border-[#E3E3E3] dark:border-[#2E2F31]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#1A73E8] dark:text-[#A8C7FA]">
              <FileText className="w-4 h-4 text-[#1A73E8] dark:text-[#A8C7FA]" />
              <span>Document Workspace • Career Dossier</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[#1F1F1F] dark:text-white tracking-tight">
              {user?.name || 'Scholar Candidate'} — Career Dossier
            </h1>
            <p className="text-xs font-medium text-[#5F6368] dark:text-[#8E918F] leading-relaxed">
              Biometrically verified academic record, algorithmic proficiency portfolio, and credential history.
            </p>
          </div>

          {/* Executive Portfolio Overview */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5F6368] dark:text-[#8E918F]">
              01. Executive Career Summary
            </h2>
            <div className="p-6 rounded-2xl bg-[#F0F4F9] dark:bg-[#282A2C] border border-[#E3E3E3]/60 dark:border-[#444746] space-y-3">
              <p className="text-xs font-semibold leading-relaxed text-[#1F1F1F] dark:text-[#E3E3E3]">
                Candidate has completed <strong className="text-[#1A73E8] dark:text-[#A8C7FA]">{completedLessons.length + 8} technical lessons</strong> and passed <strong className="text-[#1A73E8] dark:text-[#A8C7FA]">{completedCoding.length + 2} algorithmic code challenges</strong> under continuous MediaPipe biometric proctoring.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[10px] font-mono font-bold bg-white dark:bg-[#1E1E20] border border-[#E3E3E3] dark:border-[#444746] px-3 py-1 rounded-full text-[#5F6368] dark:text-[#C4C7C5]">
                  Core CS • Algorithms
                </span>
                <span className="text-[10px] font-mono font-bold bg-white dark:bg-[#1E1E20] border border-[#E3E3E3] dark:border-[#444746] px-3 py-1 rounded-full text-[#5F6368] dark:text-[#C4C7C5]">
                  Python3 & JavaScript
                </span>
                <span className="text-[10px] font-mono font-bold bg-white dark:bg-[#1E1E20] border border-[#E3E3E3] dark:border-[#444746] px-3 py-1 rounded-full text-[#5F6368] dark:text-[#C4C7C5]">
                  Biometric Proctoring Verified
                </span>
              </div>
            </div>
          </div>

          {/* Verified Certificates & Credentials */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5F6368] dark:text-[#8E918F]">
              02. Verified Credentials & Diplomas
            </h2>
            <div className="space-y-3">
              {certificates.map(cert => (
                <div key={cert.id} className="p-5 rounded-2xl google-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#1A73E8] dark:text-[#A8C7FA] shrink-0" />
                      <span className="text-xs font-bold text-[#1F1F1F] dark:text-[#E3E3E3]">{cert.title}</span>
                    </div>
                    <p className="text-[10px] font-mono text-[#5F6368] dark:text-[#8E918F]">
                      ID: {cert.credentialId} • Issued: {cert.issuedDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-[#1E8E3E] bg-[#E6F4EA] dark:bg-[#0C3B19] px-3 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                    <button className="p-2 rounded-full border border-[#E3E3E3] dark:border-[#444746] hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] text-[#5F6368] dark:text-[#C4C7C5] transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Workspaces & Pathways */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5F6368] dark:text-[#8E918F]">
              03. Technical Specializations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#F0F4F9] dark:bg-[#282A2C] border border-[#E3E3E3]/80 dark:border-[#444746] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F1F1F] dark:text-[#E3E3E3]">Advanced Algorithms</span>
                  <span className="text-[10px] font-mono font-bold text-[#5F6368] dark:text-[#8E918F]">85% Complete</span>
                </div>
                <div className="w-full h-1.5 bg-[#E3E3E3] dark:bg-[#444746] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1A73E8] dark:bg-[#A8C7FA] rounded-full" style={{ width: '85%' }} />
                </div>
                <button 
                  onClick={() => navigate('/learn/adv-algorithms')}
                  className="text-xs font-bold text-[#1A73E8] dark:text-[#A8C7FA] flex items-center gap-1 hover:underline pt-1"
                >
                  View Pathway Specs <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#F0F4F9] dark:bg-[#282A2C] border border-[#E3E3E3]/80 dark:border-[#444746] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F1F1F] dark:text-[#E3E3E3]">Quantitative Aptitude</span>
                  <span className="text-[10px] font-mono font-bold text-[#5F6368] dark:text-[#8E918F]">60% Complete</span>
                </div>
                <div className="w-full h-1.5 bg-[#E3E3E3] dark:bg-[#444746] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1A73E8] dark:bg-[#A8C7FA] rounded-full" style={{ width: '60%' }} />
                </div>
                <button 
                  onClick={() => navigate('/learn/quant-aptitude')}
                  className="text-xs font-bold text-[#1A73E8] dark:text-[#A8C7FA] flex items-center gap-1 hover:underline pt-1"
                >
                  View Pathway Specs <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer End Mark */}
          <div className="pt-8 border-t border-[#E3E3E3] dark:border-[#2E2F31] flex justify-between items-center text-[10px] font-mono text-[#5F6368] dark:text-[#8E918F]">
            <span>ASCENDRA Verified Career Dossier v1.0</span>
            <span>Ref: {user?.id || 'dossier-root'}</span>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
