import React from 'react';
import { motion } from 'framer-motion';
import InfiniteMarquee from '../common/InfiniteMarquee';
import { 
  Sparkles, Target, Code2, MessageSquare, Bot, TrendingUp,
  Cpu, FileCode, Layers, Server, BrainCircuit, Database, Cloud, Box,
  Zap, GitFork, Workflow, Award, MessageCircle, Shield, Lightbulb, LayoutGrid,
  Briefcase, Video, FileText, Globe, Flame, CheckCircle
} from 'lucide-react';

export default function ShowcaseSection() {
  // Row 1: Feature Cards (Left -> Right)
  const row1Features = [
    { title: 'AI Learning', subtitle: 'Adaptive Paths', icon: <Sparkles className="w-5 h-5" /> },
    { title: 'Practice Arena', subtitle: 'Aptitude & Logic', icon: <Target className="w-5 h-5" /> },
    { title: 'CodeLab', subtitle: 'Online Monaco IDE', icon: <Code2 className="w-5 h-5" /> },
    { title: 'Interview Studio', subtitle: 'AI Proctoring', icon: <MessageSquare className="w-5 h-5" /> },
    { title: 'AI Mentor', subtitle: '24/7 Guidance', icon: <Bot className="w-5 h-5" /> },
    { title: 'Career Insights', subtitle: 'Placement Scorecard', icon: <TrendingUp className="w-5 h-5" /> }
  ];

  // Row 2: Technology Cards (Right -> Left)
  const row2Tech = [
    { title: 'Python', subtitle: 'Data Science & Core', icon: <Cpu className="w-5 h-5" /> },
    { title: 'Java', subtitle: 'Enterprise Backend', icon: <FileCode className="w-5 h-5" /> },
    { title: 'React', subtitle: 'Modern Web UI', icon: <Layers className="w-5 h-5" /> },
    { title: 'Node.js', subtitle: 'Async Server Runtime', icon: <Server className="w-5 h-5" /> },
    { title: 'AI & GenAI', subtitle: 'LLMs & Intelligence', icon: <BrainCircuit className="w-5 h-5" /> },
    { title: 'Machine Learning', subtitle: 'Predictive Models', icon: <Database className="w-5 h-5" /> },
    { title: 'Cloud', subtitle: 'Distributed Systems', icon: <Cloud className="w-5 h-5" /> },
    { title: 'MongoDB', subtitle: 'NoSQL Databases', icon: <Database className="w-5 h-5" /> },
    { title: 'SQL', subtitle: 'Relational Queries', icon: <Database className="w-5 h-5" /> },
    { title: 'Docker', subtitle: 'Containerization', icon: <Box className="w-5 h-5" /> }
  ];

  // Row 3: Skill Cards (Left -> Right)
  const row3Skills = [
    { title: 'Problem Solving', subtitle: 'Logical Thinking', icon: <Zap className="w-5 h-5" /> },
    { title: 'Data Structures', subtitle: 'Arrays, Trees, Graphs', icon: <GitFork className="w-5 h-5" /> },
    { title: 'Algorithms', subtitle: 'Sorting, DP, Greedy', icon: <Workflow className="w-5 h-5" /> },
    { title: 'Aptitude', subtitle: 'Quantitative & Verbal', icon: <Award className="w-5 h-5" /> },
    { title: 'Communication', subtitle: 'Technical Clarity', icon: <MessageCircle className="w-5 h-5" /> },
    { title: 'Leadership', subtitle: 'Team Ownership', icon: <Shield className="w-5 h-5" /> },
    { title: 'Critical Thinking', subtitle: 'Analytical Mastery', icon: <Lightbulb className="w-5 h-5" /> },
    { title: 'System Design', subtitle: 'Scalable Architecture', icon: <LayoutGrid className="w-5 h-5" /> }
  ];

  // Row 4: Career Cards (Right -> Left)
  const row4Career = [
    { title: 'Industry Ready', subtitle: 'Production Standard', icon: <Briefcase className="w-5 h-5" /> },
    { title: 'Mock Interviews', subtitle: 'Camera & Voice Check', icon: <Video className="w-5 h-5" /> },
    { title: 'Coding Challenges', subtitle: 'LeetCode Style', icon: <Code2 className="w-5 h-5" /> },
    { title: 'Resume Builder', subtitle: 'ATS Optimized', icon: <FileText className="w-5 h-5" /> },
    { title: 'Portfolio', subtitle: 'Verified Projects', icon: <Globe className="w-5 h-5" /> },
    { title: 'Career Growth', subtitle: 'Continuous Upskilling', icon: <Flame className="w-5 h-5" /> },
    { title: 'Certifications', subtitle: 'Verified Credentials', icon: <CheckCircle className="w-5 h-5" /> },
    { title: 'AI Guidance', subtitle: 'Real-time Mentorship', icon: <Bot className="w-5 h-5" /> }
  ];

  return (
    <section className="py-24 bg-[#F8F9FA] border-t border-b border-slate-200/80 relative overflow-hidden text-slate-900">

      <div className="max-w-7xl mx-auto px-6 text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-slate-200/80 border border-slate-300 text-slate-900 mb-3"
        >
          <Sparkles className="w-3.5 h-3.5" /> High-Performance Tech Stack
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight"
        >
          Infinite Engineering Potential
        </motion.h2>
      </div>

      {/* 4 Marquee Rows */}
      <div className="space-y-4">
        {/* Row 1: Left -> Right */}
        <InfiniteMarquee items={row1Features} direction="right" speed={32} isLight={true} />

        {/* Row 2: Right -> Left */}
        <InfiniteMarquee items={row2Tech} direction="left" speed={42} isLight={true} />

        {/* Row 3: Left -> Right */}
        <InfiniteMarquee items={row3Skills} direction="right" speed={38} isLight={true} />

        {/* Row 4: Right -> Left */}
        <InfiniteMarquee items={row4Career} direction="left" speed={48} isLight={true} />
      </div>
    </section>
  );
}
