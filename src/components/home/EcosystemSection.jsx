import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Target, Code2, MessageSquare, Bot, TrendingUp, ArrowRight 
} from 'lucide-react';

export default function EcosystemSection() {
  const ecosystemCards = [
    {
      id: 'ai-learning',
      title: 'AI Learning',
      description: 'Personalized learning paths powered by intelligent recommendations.',
      icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
      actionText: 'Start Learning',
      actionPath: '/learn',
      gradient: 'from-indigo-500/10 via-purple-500/5 to-transparent',
      borderHover: 'hover:border-indigo-500/40 hover:shadow-indigo-500/10',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
    },
    {
      id: 'practice-arena',
      title: 'Practice Arena',
      description: 'Master aptitude, reasoning, logic, and technical assessments.',
      icon: <Target className="w-6 h-6 text-emerald-500" />,
      actionText: 'Practice Now',
      actionPath: '/practice',
      gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      borderHover: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    },
    {
      id: 'codelab',
      title: 'CodeLab',
      description: 'Solve coding challenges in a modern development workspace.',
      icon: <Code2 className="w-6 h-6 text-cyan-500" />,
      actionText: 'Open CodeLab',
      actionPath: '/codelab',
      gradient: 'from-cyan-500/10 via-blue-500/5 to-transparent',
      borderHover: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10',
      badgeColor: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20'
    },
    {
      id: 'interview-studio',
      title: 'Interview Studio',
      description: 'Prepare with AI-powered mock interviews and detailed feedback.',
      icon: <MessageSquare className="w-6 h-6 text-amber-500" />,
      actionText: 'Start Interview',
      actionPath: '/interview',
      gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
      borderHover: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    },
    {
      id: 'ai-mentor',
      title: 'AI Mentor',
      description: 'Receive intelligent guidance based on your learning journey.',
      icon: <Bot className="w-6 h-6 text-violet-500" />,
      actionText: 'Meet Mentor',
      actionPath: '/ai-mentor',
      gradient: 'from-violet-500/10 via-fuchsia-500/5 to-transparent',
      borderHover: 'hover:border-violet-500/40 hover:shadow-violet-500/10',
      badgeColor: 'bg-violet-500/10 text-violet-600 border-violet-500/20'
    },
    {
      id: 'career-insights',
      title: 'Career Insights',
      description: 'Track your progress and measure industry readiness.',
      icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
      actionText: 'View Insights',
      actionPath: '/my-learning',
      gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
      borderHover: 'hover:border-blue-500/40 hover:shadow-blue-500/10',
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    }
  ];

  return (
    <section className="py-28 px-6 bg-slate-950 relative z-10 overflow-hidden text-white">
      {/* Background Soft Glow & Ambient Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/30 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
          >
            <Sparkles className="w-3.5 h-3.5" /> ASCENDRA Architecture
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-black text-white tracking-tight"
          >
            Explore the ASCENDRA Ecosystem
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm md:text-base font-medium leading-relaxed"
          >
            Discover AI-powered experiences that help you learn, practice, code, prepare for interviews, and become industry-ready.
          </motion.p>
        </div>

        {/* 3x2 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecosystemCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className={`group relative rounded-[2rem] p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 ${card.borderHover} transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg`}
            >
              {/* Card Ambient Radial Glow */}
              <div className={`absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />

              <div>
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                    AI Module
                  </span>
                </div>

                {/* Card Title & Description */}
                <h3 className="text-xl font-bold font-display text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">
                  {card.description}
                </p>
              </div>

              {/* Action Button */}
              <Link
                to={card.actionPath}
                className="w-full py-3.5 px-5 rounded-2xl bg-slate-800/80 hover:bg-indigo-600 border border-slate-700/60 hover:border-indigo-500 text-white text-xs font-bold transition-all duration-200 flex items-center justify-between group/btn shadow-md active:scale-[0.98]"
              >
                <span>{card.actionText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
