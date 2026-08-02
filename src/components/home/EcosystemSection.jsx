import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Target, Code2, MessageSquare, Bot, TrendingUp, ChevronRight, Zap
} from 'lucide-react';

export default function EcosystemSection() {
  const ecosystemCards = [
    {
      id: 'ai-learning',
      title: 'AI Learning',
      subtitle: 'Personalized learning paths powered by intelligent recommendations.',
      actionPath: '/learn',
      tag: 'AI Module',
      visual: (
        <div className="w-full h-full bg-[#0c0d14] rounded-[1.75rem] p-6 flex flex-col justify-between relative overflow-hidden group-hover:shadow-xl transition-all duration-500 border border-slate-800/60">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 opacity-30 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Gemini 3.5 Flash
            </span>
          </div>
          <div className="relative z-10 my-auto text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <h4 className="text-white font-display font-bold text-lg tracking-tight">ASCENDRA Core</h4>
          </div>
          <div className="relative z-10 text-[10px] text-slate-400 font-mono flex justify-between">
            <span>v2.4 Active</span>
            <span>Adaptive Engine</span>
          </div>
        </div>
      )
    },
    {
      id: 'practice-arena',
      title: 'Practice Arena',
      subtitle: 'Master aptitude, reasoning, logic, and technical assessments.',
      actionPath: '/practice',
      tag: 'Aptitude & Logic',
      visual: (
        <div className="w-full h-full bg-[#0c0d14] rounded-[1.75rem] p-6 flex flex-col justify-between relative overflow-hidden group-hover:shadow-xl transition-all duration-500 border border-slate-800/60">
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-gradient-to-br from-emerald-500 via-teal-400 to-lime-300 opacity-25 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40 flex items-center gap-1">
              <Target className="w-3 h-3" /> Diagnostic Mode
            </span>
          </div>
          <div className="relative z-10 my-auto text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-lg group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7" />
            </div>
            <h4 className="text-white font-display font-bold text-lg tracking-tight">99.4% Accuracy</h4>
          </div>
          <div className="relative z-10 text-[10px] text-slate-400 font-mono flex justify-between">
            <span>Multi-Topic</span>
            <span>Live Timers</span>
          </div>
        </div>
      )
    },
    {
      id: 'codelab',
      title: 'CodeLab',
      subtitle: 'Solve coding challenges in a modern development workspace.',
      actionPath: '/codelab',
      tag: 'Monaco IDE',
      visual: (
        <div className="w-full h-full bg-[#0c0d14] rounded-[1.75rem] p-5 flex flex-col justify-between relative overflow-hidden group-hover:shadow-xl transition-all duration-500 border border-slate-800/60">
          {/* Simulated CodeLab Window Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 z-10">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              /codelab-preview
            </span>
          </div>
          <div className="my-auto z-10 font-mono text-[11px] text-slate-300 space-y-1.5 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400">
              <Code2 className="w-3.5 h-3.5" />
              <span>function solve(nums) &#123;</span>
            </div>
            <div className="pl-4 text-slate-400">// Optimized DP Solution</div>
            <div className="pl-4 text-cyan-400">return dp[n - 1];</div>
            <div className="text-indigo-400">&#125;</div>
          </div>
          <div className="z-10 text-[10px] text-emerald-400 font-mono flex justify-between items-center">
            <span>Passes Testcases (12/12)</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">Fast</span>
          </div>
        </div>
      )
    },
    {
      id: 'interview-studio',
      title: 'Interview Studio',
      subtitle: 'Prepare with AI-powered mock interviews and detailed feedback.',
      actionPath: '/interview',
      tag: 'Proctoring Certified',
      visual: (
        <div className="w-full h-full bg-[#0c0d14] rounded-[1.75rem] p-6 flex flex-col justify-between relative overflow-hidden group-hover:shadow-xl transition-all duration-500 border border-slate-800/60">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-600 via-amber-500 to-rose-500 opacity-25 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/40 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> Agent Rehearsal
            </span>
          </div>
          <div className="relative z-10 my-auto text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg group-hover:scale-110 transition-transform">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h4 className="text-white font-display font-bold text-lg tracking-tight">AI Interview Teams</h4>
          </div>
          <div className="relative z-10 text-[10px] text-slate-400 font-mono flex justify-between">
            <span>Gaze Certified</span>
            <span>Live Audio</span>
          </div>
        </div>
      )
    },
    {
      id: 'ai-mentor',
      title: 'AI Mentor Guidance',
      subtitle: 'Receive intelligent guidance based on your learning journey.',
      actionPath: '/ai-mentor',
      tag: '24/7 AI Coach',
      visual: (
        <div className="w-full h-full bg-[#0c0d14] rounded-[1.75rem] p-6 flex flex-col justify-between relative overflow-hidden group-hover:shadow-xl transition-all duration-500 border border-slate-800/60">
          <div className="absolute bottom-0 left-0 w-44 h-44 bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-indigo-400 opacity-25 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] font-bold tracking-widest text-violet-400 uppercase bg-violet-950/60 px-2.5 py-1 rounded-full border border-violet-800/40 flex items-center gap-1">
              <Bot className="w-3 h-3" /> Career Coach
            </span>
          </div>
          <div className="relative z-10 my-auto text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-3 shadow-lg group-hover:scale-110 transition-transform">
              <Bot className="w-7 h-7" />
            </div>
            <h4 className="text-white font-display font-bold text-lg tracking-tight">Antigravity Mentor</h4>
          </div>
          <div className="relative z-10 text-[10px] text-slate-400 font-mono flex justify-between">
            <span>Real-time Tips</span>
            <span>Weak Topics</span>
          </div>
        </div>
      )
    },
    {
      id: 'career-insights',
      title: 'Career Insights',
      subtitle: 'Track your progress and measure industry readiness.',
      actionPath: '/my-learning',
      tag: 'Placement Telemetry',
      visual: (
        <div className="w-full h-full bg-[#0c0d14] rounded-[1.75rem] p-6 flex flex-col justify-between relative overflow-hidden group-hover:shadow-xl transition-all duration-500 border border-slate-800/60">
          <div className="absolute top-1/2 right-0 w-44 h-44 bg-gradient-to-l from-blue-600 via-sky-500 to-indigo-400 opacity-25 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-800/40 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Scorecard 100
            </span>
          </div>
          <div className="relative z-10 my-auto text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 shadow-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h4 className="text-white font-display font-bold text-lg tracking-tight">Placement Index 86</h4>
          </div>
          <div className="relative z-10 text-[10px] text-slate-400 font-mono flex justify-between">
            <span>Top 5% Tier</span>
            <span>Resume Ready</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-28 px-6 bg-white relative z-10 overflow-hidden text-slate-900 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header - Clean Google Antigravity Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-display font-medium text-slate-900 tracking-tight mb-3"
            >
              Explore the ASCENDRA Ecosystem
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-600 text-sm md:text-base font-body max-w-2xl leading-relaxed"
            >
              Discover AI-powered experiences that help you learn, practice, code, prepare for interviews, and become industry-ready.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium text-xs md:text-sm transition-all"
            >
              <span>Explore all modules</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* 3x2 Grid of Google Antigravity Style Squircle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ecosystemCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="group flex flex-col justify-between"
            >
              <Link to={card.actionPath} className="block">
                {/* Dark Inner Squircle Card Image Box */}
                <div className="w-full aspect-[4/3] mb-5">
                  {card.visual}
                </div>

                {/* Text Content Below Image Box - Google Antigravity Style */}
                <div className="space-y-1.5">
                  <h3 className="text-xl md:text-2xl font-display font-medium text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-body leading-relaxed max-w-sm">
                    {card.subtitle}
                  </p>
                  <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    <span>Explore module</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
