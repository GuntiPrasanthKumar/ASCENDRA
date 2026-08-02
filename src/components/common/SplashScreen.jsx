import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(() => {
    // Check if splash screen was already displayed in this browser session
    const hasShown = sessionStorage.getItem('ascendra_splash_shown');
    return !hasShown;
  });

  useEffect(() => {
    if (!isVisible) {
      if (onComplete) onComplete();
      return;
    }

    // Set timer to complete splash screen after 2.0 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('ascendra_splash_shown', 'true');
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="ascendra-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-[#020617] flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Background Neural Soft Glow */}
          <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Center Logo & Tagline Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center text-center px-6"
          >
            {/* Neural Pulse Ring around Logo */}
            <div className="relative flex items-center justify-center mb-6">
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"
                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <img
                src="/ascendra-logo.png"
                alt="ASCENDRA"
                className="h-28 sm:h-36 md:h-44 w-auto object-contain relative z-10 drop-shadow-[0_0_35px_rgba(59,130,246,0.3)]"
              />
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[10px] sm:text-xs font-bold text-slate-300 tracking-[0.25em] uppercase font-display"
            >
              WHERE INTELLIGENCE MEETS AMBITION.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
