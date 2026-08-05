import React from 'react';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardHeader({ title, description, connectionStatus = 'Neural Link Active' }) {
  return (
    <div className="flex flex-col gap-2 mb-8">
      {connectionStatus && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 w-fit mb-2"
        >
          <Zap className="w-3.5 h-3.5 text-black" />
          <span className="text-[10px] font-black text-black uppercase tracking-widest">{connectionStatus}</span>
        </motion.div>
      )}
      <h1 className="text-4xl md:text-5xl font-display font-extrabold text-black tracking-tight">
        {title}
      </h1>
      {description && <p className="text-slate-500 text-lg font-medium mt-1">{description}</p>}
    </div>
  );
}
