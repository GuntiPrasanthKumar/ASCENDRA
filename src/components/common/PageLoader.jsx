import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[10000] select-none p-6">
      <div className="relative flex flex-col items-center gap-6">
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          <img src="/ascendra-logo.png" alt="ASCENDRA" className="h-32 md:h-44 w-auto object-contain" />
        </motion.div>

        <div className="relative flex items-center justify-center mt-2">
          <motion.div
            className="w-10 h-10 rounded-full border-3 border-indigo-600/20 border-t-indigo-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>

      <motion.div 
        className="mt-6 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-textMuted font-body text-xs font-semibold tracking-widest uppercase animate-pulse">
          Initializing Application...
        </p>
      </motion.div>
    </div>
  );
};

export default PageLoader;
