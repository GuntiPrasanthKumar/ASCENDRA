import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import SectionHeader from '../components/dashboard/SectionHeader';
import { BookOpen, Award, CheckCircle2, ShieldCheck, Download, ChevronRight } from 'lucide-react';

export default function MyLearning() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  const completedLessons = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
  const completedQuizzes = JSON.parse(localStorage.getItem('completed_quizzes') || '[]');
  const completedCoding = JSON.parse(localStorage.getItem('completed_coding') || '[]');
  const completedInterviews = JSON.parse(localStorage.getItem('completed_interviews') || '[]');

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
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-10 pb-6 border-b border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-black flex items-center justify-center">
              <Award className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-black tracking-tight">My Portfolio & Certificates</h1>
              <p className="text-xs font-semibold text-slate-500 mt-1">Track earned badges, credentials, and digital verified assets.</p>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            
            {/* Active Enrolled Pathways */}
            <div>
              <SectionHeader title="Active Enrolled Pathways" subtitle="Ongoing modules and topic progression" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Advanced Algorithms */}
                <div className="bg-white p-7 rounded-[1.75rem] border border-slate-200/80 flex flex-col justify-between h-full group hover:border-slate-300 transition-all duration-300 shadow-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-black inline-block mb-3">
                      Computer Science Core
                    </span>
                    <h3 className="text-xl font-display font-extrabold text-black mb-1 group-hover:text-slate-600 transition-colors tracking-tight">
                      Advanced Algorithms
                    </h3>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6">
                      Dynamic programming, memoization, graph traversal, and time complexity analysis.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-400 uppercase text-[10px]">Completion</span>
                      <span className="text-black">75%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full border border-slate-200/40 overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '75%' }} />
                    </div>
                    <button
                      onClick={() => navigate('/learn/adv-algorithms')}
                      className="w-full py-3 rounded-full bg-black text-white font-bold hover:bg-slate-800 transition-all text-xs flex items-center justify-center gap-1 mt-2"
                    >
                      <span>Resume Pathway</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quantitative Aptitude */}
                <div className="bg-white p-7 rounded-[1.75rem] border border-slate-200/80 flex flex-col justify-between h-full group hover:border-slate-300 transition-all duration-300 shadow-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-black inline-block mb-3">
                      Placement Prep
                    </span>
                    <h3 className="text-xl font-display font-extrabold text-black mb-1 group-hover:text-slate-600 transition-colors tracking-tight">
                      Quantitative Aptitude
                    </h3>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6">
                      Ratios, percentages, speed distance, and logical reasoning speed tests.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-400 uppercase text-[10px]">Completion</span>
                      <span className="text-black">90%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full border border-slate-200/40 overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '90%' }} />
                    </div>
                    <button
                      onClick={() => navigate('/learn/quant-aptitude')}
                      className="w-full py-3 rounded-full bg-black text-white font-bold hover:bg-slate-800 transition-all text-xs flex items-center justify-center gap-1 mt-2"
                    >
                      <span>Resume Pathway</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Verified Digital Certificates */}
            <div>
              <SectionHeader title="Digital Certificates" subtitle="Cryptographically verified course credentials" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="group relative overflow-hidden bg-white p-6 rounded-[1.75rem] border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-black flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-black" /> {cert.status} Credential
                      </span>
                      <button className="p-2 rounded-full bg-slate-50 hover:bg-black hover:text-white transition-colors text-black border border-slate-200">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-base font-display font-extrabold text-black group-hover:text-slate-600 transition-colors mb-1 tracking-tight">
                      {cert.title}
                    </h4>
                    <p className="text-xs font-medium text-slate-500 mb-4">Issued: {cert.issuedDate} • ID: {cert.credentialId}</p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>VERIFIED BY ASCENDRA AI ENGINE</span>
                      <span className="text-black font-black uppercase">View Certificate</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
