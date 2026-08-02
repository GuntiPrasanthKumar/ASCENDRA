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
    title: 'AI Proctoring',
    description: 'Real-time face detection, blink analysis, gaze tracking, and posture monitoring to ensure complete academic integrity.',
    icon: <ShieldCheck className="w-8 h-8 text-black" />,
  },
  {
    title: 'Adaptive Learning',
    description: 'Smart question difficulty scaling based on real-time student performance and learning patterns.',
    icon: <BrainCircuit className="w-8 h-8 text-black" />,
  },
  {
    title: 'Deep Analytics',
    description: 'Comprehensive skill heatmaps, performance trends, leaderboards and actionable AI-powered insights.',
    icon: <BarChart3 className="w-8 h-8 text-black" />,
  },
  {
    title: 'Secure by Design',
    description: 'End-to-end security with clipboard monitoring, fullscreen enforcement and keyboard shortcut blocking.',
    icon: <Lock className="w-8 h-8 text-black" />,
  },
  {
    title: 'Self-Paced Practice',
    description: 'Bite-sized quizzes and guided practice sessions tailored directly to elementary and middle school learning standards.',
    icon: <Users className="w-8 h-8 text-black" />,
  },
  {
    title: 'AI Tutor',
    description: 'Your personal 24/7 AI learning companion that explains concepts, generates practice problems and tracks gaps.',
    icon: <Zap className="w-8 h-8 text-black" />,
  },
];

const testimonials = [
  { name: 'Liam S.', dept: 'Grade 5 Student', text: 'ASCENDRA is so fun! The AI tutor helps me understand math fractions easily like a game.', rating: 5 },
  { name: 'Mrs. Davis', dept: 'Parent of Grade 3 & 7', text: "The detailed accuracy analytics and proctoring let me track my children's actual progress. Game changer.", rating: 5 },
  { name: 'Sophia K.', dept: 'Grade 8 Student', text: 'The AI Tutor explained science concepts better than my textbook. Absolutely love the design!', rating: 5 },
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
          <span className="text-sm font-medium">Platform Live v2.0 — Now with AI Proctoring</span>
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
          className="text-lg md:text-xl text-slate-500 font-body max-w-2xl mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          An AI-powered secure assessment and adaptive learning platform tailored for Grades 1–10 students. Experience integrity and intelligence — combined.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            to="/signup"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-primary rounded-full hover:bg-accent overflow-hidden shadow-lg hover:shadow-accent/30 hover:shadow-xl"
          >
            <span className="relative flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            to="/practice"
            className="group inline-flex items-center justify-center px-8 py-4 font-bold transition-all duration-300 glass rounded-full border border-muted hover:border-accent"
          >
            See Live Demo
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-black mb-4">Powered by Intelligence</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with intuitive design to deliver an unparalleled assessment experience.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white p-8 border border-slate-200 hover:-translate-y-2 transition-transform duration-300 cursor-default"
              >
                <div className="w-16 h-16 bg-slate-100 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold font-display text-black mb-3">{feature.title}</h3>
                <p className="text-slate-500">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ASCENDRA Ecosystem Section */}
      <EcosystemSection />

      {/* ASCENDRA Infinite Showcase Marquee */}
      <ShowcaseSection />

      {/* Stats Section */}
      <section className="py-20 px-6 bg-black text-white relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {[
            { value: '50k+', label: 'Active Students' },
            { value: '1M+', label: 'Assessments Taken' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '100%', label: 'Client-side AI' },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            >
              <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{stat.value}</div>
              <div className="text-white/50 font-body text-sm uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-black mb-4">Loved by Learners</h2>
            <p className="text-slate-500">Don't just take our word for it.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 border border-slate-200"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-black fill-black" />
                  ))}
                </div>
                <p className="text-slate-500 italic mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center font-bold text-white font-display">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-black text-sm">{t.name}</h4>
                    <p className="text-slate-500 text-xs">{t.dept}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-white relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-black rounded-none p-16 relative overflow-hidden"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 relative z-10">
              Ready to transform your learning?
            </h2>
            <p className="text-white/60 text-lg mb-8 relative z-10">
              Join 50,000+ students already using ASCENDRA. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-white rounded-full hover:bg-slate-100 transition-all shadow-lg gap-2"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 font-bold text-white rounded-full border border-white/30 hover:border-white transition-all"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
