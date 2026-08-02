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
    { title: 'AI Learning', subtitle: 'Adaptive Paths', icon: <Sparkles className="w-5 h-5 text-white" /> },
    { title: 'Practice Arena', subtitle: 'Aptitude & Logic', icon: <Target className="w-5 h-5 text-white" /> },
    { title: 'CodeLab', subtitle: 'Online Monaco IDE', icon: <Code2 className="w-5 h-5 text-white" /> },
    { title: 'Interview Studio', subtitle: 'AI Proctoring', icon: <MessageSquare className="w-5 h-5 text-white" /> },
    { title: 'AI Mentor', subtitle: '24/7 Guidance', icon: <Bot className="w-5 h-5 text-white" /> },
    { title: 'Career Insights', subtitle: 'Placement Scorecard', icon: <TrendingUp className="w-5 h-5 text-white" /> }
  ];

  // Row 2: Technology Cards (Right -> Left)
  const row2Tech = [
    { title: 'Python', subtitle: 'Data Science & Core', icon: <Cpu className="w-5 h-5 text-white" /> },
    { title: 'Java', subtitle: 'Enterprise Backend', icon: <FileCode className="w-5 h-5 text-white" /> },
    { title: 'React', subtitle: 'Modern Web UI', icon: <Layers className="w-5 h-5 text-white" /> },
    { title: 'Node.js', subtitle: 'Async Server Runtime', icon: <Server className="w-5 h-5 text-white" /> },
    { title: 'AI & GenAI', subtitle: 'LLMs & Intelligence', icon: <BrainCircuit className="w-5 h-5 text-white" /> },
    { title: 'Machine Learning', subtitle: 'Predictive Models', icon: <Database className="w-5 h-5 text-white" /> },
    { title: 'Cloud', subtitle: 'Distributed Systems', icon: <Cloud className="w-5 h-5 text-white" /> },
    { title: 'MongoDB', subtitle: 'NoSQL Databases', icon: <Database className="w-5 h-5 text-white" /> },
    { title: 'SQL', subtitle: 'Relational Queries', icon: <Database className="w-5 h-5 text-white" /> },
    { title: 'Docker', subtitle: 'Containerization', icon: <Box className="w-5 h-5 text-white" /> }
  ];

  // Row 3: Skill Cards (Left -> Right)
  const row3Skills = [
    { title: 'Problem Solving', subtitle: 'Logical Thinking', icon: <Zap className="w-5 h-5 text-white" /> },
    { title: 'Data Structures', subtitle: 'Arrays, Trees, Graphs', icon: <GitFork className="w-5 h-5 text-white" /> },
    { title: 'Algorithms', subtitle: 'Sorting, DP, Greedy', icon: <Workflow className="w-5 h-5 text-white" /> },
    { title: 'Aptitude', subtitle: 'Quantitative & Verbal', icon: <Award className="w-5 h-5 text-white" /> },
    { title: 'Communication', subtitle: 'Technical Clarity', icon: <MessageCircle className="w-5 h-5 text-white" /> },
    { title: 'Leadership', subtitle: 'Team Ownership', icon: <Shield className="w-5 h-5 text-white" /> },
    { title: 'Critical Thinking', subtitle: 'Analytical Mastery', icon: <Lightbulb className="w-5 h-5 text-white" /> },
    { title: 'System Design', subtitle: 'Scalable Architecture', icon: <LayoutGrid className="w-5 h-5 text-white" /> }
  ];

  // Row 4: Career Cards (Right -> Left)
  const row4Career = [
    { title: 'Industry Ready', subtitle: 'Production Standard', icon: <Briefcase className="w-5 h-5 text-white" /> },
    { title: 'Mock Interviews', subtitle: 'Camera & Voice Check', icon: <Video className="w-5 h-5 text-white" /> },
    { title: 'Coding Challenges', subtitle: 'LeetCode Style', icon: <Code2 className="w-5 h-5 text-white" /> },
    { title: 'Resume Builder', subtitle: 'ATS Optimized', icon: <FileText className="w-5 h-5 text-white" /> },
    { title: 'Portfolio', subtitle: 'Verified Projects', icon: <Globe className="w-5 h-5 text-white" /> },
    { title: 'Career Growth', subtitle: 'Continuous Upskilling', icon: <Flame className="w-5 h-5 text-white" /> },
    { title: 'Certifications', subtitle: 'Verified Credentials', icon: <CheckCircle className="w-5 h-5 text-white" /> },
    { title: 'AI Guidance', subtitle: 'Real-time Mentorship', icon: <Bot className="w-5 h-5 text-white" /> }
  ];

  return (
    <section className="py-24 bg-black border-t border-b border-slate-800/60 relative overflow-hidden text-white">

      <div className="max-w-7xl mx-auto px-6 text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-white/10 border border-white/20 text-white mb-3"
        >
          <Sparkles className="w-3.5 h-3.5" /> High-Performance Tech Stack
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-display font-black text-white tracking-tight"
        >
          Infinite Engineering Potential
        </motion.h2>
      </div>

      {/* 4 Marquee Rows */}
      <div className="space-y-4">
        {/* Row 1: Left -> Right */}
        <InfiniteMarquee items={row1Features} direction="right" speed={32} />

        {/* Row 2: Right -> Left */}
        <InfiniteMarquee items={row2Tech} direction="left" speed={42} />

        {/* Row 3: Left -> Right */}
        <InfiniteMarquee items={row3Skills} direction="right" speed={38} />

        {/* Row 4: Right -> Left */}
        <InfiniteMarquee items={row4Career} direction="left" speed={48} />
      </div>
    </section>
  );
}
