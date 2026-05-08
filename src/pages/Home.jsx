import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { ArrowRight, ShieldCheck, BrainCircuit, BarChart3, Users, ChevronRight } from 'lucide-react';

const HeroScene = lazy(() => import('../components/3d/HeroScene'));

const features = [
  {
    title: 'AI Proctoring',
    description: 'Advanced face detection, eye tracking, and posture analysis to ensure complete integrity.',
    icon: <ShieldCheck className="w-8 h-8 text-accent" />
  },
  {
    title: 'Adaptive Learning',
    description: 'Smart question difficulty scaling based on real-time student performance.',
    icon: <BrainCircuit className="w-8 h-8 text-accent2" />
  },
  {
    title: 'Deep Analytics',
    description: 'Comprehensive skill heatmaps, performance tracking, and actionable insights.',
    icon: <BarChart3 className="w-8 h-8 text-success" />
  }
];

const departments = [
  { name: 'Computer Science', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { name: 'Electronics', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { name: 'Mechanical', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { name: 'Civil Eng', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { name: 'Data Science', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' }
];

export default function Home() {
  return (
    <PageTransition>
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-accent/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          <span className="text-sm font-medium">Platform Live v2.0</span>
        </motion.div>

        <motion.h1 
          className="text-6xl md:text-8xl font-display font-extrabold text-primary mb-6 tracking-tight leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Learn. <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent2 relative">
            Assess.
            <motion.div 
              className="absolute -bottom-2 left-0 w-full h-[4px] bg-gradient-to-r from-accent to-accent2 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1 }}
            />
          </span> Excel.
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-textMuted font-body max-w-2xl mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          An AI-powered secure assessment and adaptive learning platform tailored for university students. Experience integrity and intelligence combined.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link 
            to="/signup" 
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-primary rounded-full hover:bg-accent overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></div>
            <span className="relative flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="py-24 px-6 bg-surface relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-primary mb-4">Powered by Intelligence</h2>
            <p className="text-textMuted max-w-2xl mx-auto">Our platform combines cutting-edge AI with intuitive design to deliver an unparalleled assessment experience.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -10 }}
                className="glass p-8 rounded-3xl border border-muted"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold font-display text-primary mb-3">{feature.title}</h3>
                <p className="text-textMuted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Carousel */}
      <section className="py-24 px-6 bg-background relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold text-primary mb-4">Explore Departments</h2>
              <p className="text-textMuted max-w-xl">Tailored assessments and learning paths for every major.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-accent font-medium hover:text-primary transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-10 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {departments.map((dept, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[300px] h-[400px] rounded-3xl overflow-hidden relative snap-center group cursor-pointer"
              >
                <img 
                  src={dept.img} 
                  alt={dept.name} 
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-white text-2xl font-bold font-display mb-2">{dept.name}</h3>
                  <div className="flex items-center gap-2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                    <span>View Courses</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-primary text-white relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50k+', label: 'Active Students' },
            { value: '1M+', label: 'Assessments Taken' },
            { value: '99.9%', label: 'Uptime' },
            { value: '100%', label: 'Secure' },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: "spring" }}
            >
              <div className="text-4xl md:text-5xl font-display font-bold text-accent2 mb-2">{stat.value}</div>
              <div className="text-white/70 font-body text-sm uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

    </PageTransition>
  );
}
