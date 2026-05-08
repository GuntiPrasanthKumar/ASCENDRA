import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[10000]">
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-muted border-t-accent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-0 flex items-center justify-center text-primary font-display font-bold text-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          ST
        </motion.div>
      </div>
      <motion.p 
        className="mt-4 text-textMuted font-body tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Initializing SkillTrove...
      </motion.p>
    </div>
  );
};

export default PageLoader;
