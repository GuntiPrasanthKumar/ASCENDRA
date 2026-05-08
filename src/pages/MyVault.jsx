import React from 'react';
import { motion } from 'framer-motion';
import { Award, Download, FileText } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import HeatmapCard from '../components/dashboard/HeatmapCard';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';

export default function MyVault() {
  const badges = [
    { name: 'Fast Learner', icon: '🚀', desc: 'Completed 5 quizzes in a row' },
    { name: 'Perfect Score', icon: '⭐', desc: 'Scored 100% in a major test' },
    { name: 'Night Owl', icon: '🦉', desc: 'Studied past midnight 3 times' },
    { name: 'Code Master', icon: '💻', desc: 'Solved 10 hard coding problems' },
  ];

  const certificates = [
    { title: 'Intro to Data Structures', date: 'May 2026', score: '92%' },
    { title: 'Advanced React patterns', date: 'Apr 2026', score: '88%' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-display font-bold text-primary mb-2">My Vault</h1>
            <p className="text-textMuted text-lg">Your personal achievements, analytics, and certificates.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 h-[400px]">
              <AnalyticsChart />
            </div>
            <div className="h-[400px]">
              <HeatmapCard />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Badges Wall */}
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-2xl font-display font-bold text-primary mb-6 flex items-center gap-2">
                <Award className="text-accent" /> Badges Wall
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-2xl bg-white/50 border border-muted flex items-start gap-4 cursor-default relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <div className="text-3xl">{badge.icon}</div>
                    <div>
                      <h4 className="font-bold text-primary text-sm">{badge.name}</h4>
                      <p className="text-xs text-textMuted mt-1">{badge.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certificates */}
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-2xl font-display font-bold text-primary mb-6 flex items-center gap-2">
                <FileText className="text-accent2" /> Digital Certificates
              </h3>
              <div className="space-y-4">
                {certificates.map((cert, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-muted hover:border-accent transition-colors">
                    <div>
                      <h4 className="font-bold text-primary">{cert.title}</h4>
                      <div className="flex gap-4 text-xs text-textMuted mt-1">
                        <span>Issued: {cert.date}</span>
                        <span>Score: {cert.score}</span>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
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
