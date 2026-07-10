import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardHeader({ title, description, connectionStatus = 'Neural Link Active' }) {
  return (
    <div className="flex flex-col gap-2 mb-8">
      {connectionStatus && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 w-fit mb-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span className="text-[10px] font-black text-accent uppercase tracking-widest">{connectionStatus}</span>
        </motion.div>
      )}
      <h1 className="text-4xl md:text-5xl font-display font-extrabold text-primary tracking-tight">
        {title}
      </h1>
      {description && <p className="text-textMuted text-lg font-medium mt-1">{description}</p>}
    </div>
  );
}
