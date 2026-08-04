import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import EcosystemSection from '../components/home/EcosystemSection';
import ShowcaseSection from '../components/home/ShowcaseSection';
import { ArrowRight, ShieldCheck, BrainCircuit, BarChart3, Zap, Users, Star, Lock } from 'lucide-react';

const HeroScene = lazy(() => import('../components/3d/HeroScene'));

const features = [
  {
    title: 'AI Proctoring & Gaze Tracking',
    description: 'Real-time face detection, gaze stability monitoring, and posture metrics ensuring complete integrity for technical mock assessments.',
    icon: <ShieldCheck className="w-8 h-8 text-black" />,
  },
  {
    title: 'Adaptive Learning Pathways',
    description: 'Dynamic problem difficulty scaling and adaptive syllabus checkpoints tailored to individual student speed and concept mastery.',
    icon: <BrainCircuit className="w-8 h-8 text-black" />,
  },
  {
    title: 'Deep Telemetry & Analytics',
    description: 'Comprehensive skill heatmaps, performance trend charts, and actionable AI coach recommendations.',
    icon: <BarChart3 className="w-8 h-8 text-black" />,
  },
  {
    title: 'Secure Assessment Environment',
    description: 'Integrity compliance with real-time biometric descriptor matching and proctoring incident tracking.',
    icon: <Lock className="w-8 h-8 text-black" />,
  },
  {
    title: 'CodeLab & Placement Practice',
    description: 'Multi-language code compilation workspace, test case verification, and quantitative aptitude modules aligned with industry placement standards.',
    icon: <Users className="w-8 h-8 text-black" />,
  },
  {
    title: '24/7 AI Coach & Mentor',
    description: 'Interactive AI tutor that diagnoses weak topics, recommends targeted coding problems, and guides career placement strategy.',
    icon: <Zap className="w-8 h-8 text-black" />,
  },
];

const testimonials = [
  { name: 'Alex Chen', dept: 'CS Graduate & Placement Candidate', text: 'ASCENDRA’s mock AI interview and gaze proctoring gave me the exact confidence needed to excel in technical placement rounds.', rating: 5 },
  { name: 'Prof. Marcus Vance', dept: 'Department Chair & Faculty Lead', text: 'The real-time telemetry, accuracy heatmaps, and diagnostic syllabus checkpoints elevate our entire student batch’s placement readiness.', rating: 5 },
  { name: 'Priya Sharma', dept: 'Software Engineering Aspirant', text: 'CodeLab and the AI Coach explained dynamic programming and graph algorithms clearer than any conventional textbook.', rating: 5 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function Home() {
  return (
    <PageTransition>
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* Hero */}
      <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[88vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-accent/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          <span className="text-sm font-medium">ASCENDRA v1.0 — Intelligent Learning & AI Proctoring Platform</span>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-display font-extrabold text-primary mb-6 tracking-tight leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Learn.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent2 relative">
            Assess.
            <motion.div
              className="absolute -bottom-2 left-0 w-full h-[4px] bg-gradient-to-r from-accent to-accent2 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1 }}
            />
          </span>{' '}
          Excel.
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-textMuted max-w-3xl mb-10 leading-relaxed font-body"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          An all-in-one AI learning ecosystem featuring real-time proctoring, Monaco-powered CodeLab workspace, adaptive diagnostic quizzes, and placement interview simulations.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-accent to-accent2 text-white font-display font-bold text-lg hover:shadow-xl hover:shadow-accent/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-full glass border-slate-200/50 font-display font-bold text-lg hover:bg-surface/50 hover:scale-105 transition-all duration-300 text-primary flex items-center justify-center"
          >
            Sign In to Dashboard
          </Link>
        </motion.div>
      </div>

      {/* Interactive Showcase Section */}
      <ShowcaseSection />

      {/* Ecosystem Architecture */}
      <EcosystemSection />

      {/* Key Product Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-200/20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-accent tracking-widest uppercase mb-2 block">Platform Capabilities</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-primary">Everything You Need to Excel</h2>
          <p className="text-textMuted mt-4 max-w-2xl mx-auto">Built from the ground up for technical mastery, real-time proctoring, and placement success.</p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="mb-6 p-4 rounded-2xl bg-slate-100/80 border border-slate-200/80 w-fit group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-primary mb-3">{feature.title}</h3>
              <p className="text-textMuted text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Social Proof & Testimonials */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-200/20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-accent tracking-widest uppercase mb-2 block">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-primary">Trusted by Scholars & Faculty</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-textMuted text-sm leading-relaxed italic mb-6">"{t.text}"</p>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-bold text-primary text-sm">{t.name}</h4>
                <span className="text-xs text-textMuted">{t.dept}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-[3rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold mb-6 tracking-tight">Ready to Master Your Learning Journey?</h2>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-body">
            Join thousands of engineering candidates preparing for placement benchmark success with ASCENDRA.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-white text-black font-display font-bold text-lg hover:bg-slate-100 hover:scale-105 transition-all shadow-lg"
          >
            Launch ASCENDRA Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
