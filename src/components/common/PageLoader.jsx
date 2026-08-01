import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[10000] select-none">
      <div className="relative flex flex-col items-center gap-4">
        <motion.div
          className="w-16 h-16 rounded-2xl p-2 bg-white/5 border border-white/10 flex items-center justify-center shadow-xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/ascendra-logo.png" alt="ASCENDRA" className="h-12 w-auto object-contain" />
        </motion.div>

        <motion.div
          className="w-12 h-12 rounded-full border-3 border-slate-200 border-t-indigo-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <motion.div 
        className="mt-6 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-display font-black text-xl tracking-widest text-primary uppercase">ASCENDRA</h3>
        <p className="mt-1 text-textMuted font-body text-xs font-semibold tracking-wider">
          Initializing ASCENDRA...
        </p>
      </motion.div>
    </div>
  );
};

export default PageLoader;
