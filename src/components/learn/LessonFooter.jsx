import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Trophy, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

function ChapterCompleteModal({ xpEarned, onClose, onNextChapter }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 18 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-200/80 relative overflow-hidden"
      >
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 via-white to-emerald-50/40 pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10">
          {/* Trophy Icon */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-400/30">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.12, type: 'spring' }}
              >
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </motion.div>
            ))}
          </div>

          <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-2">
            Chapter Complete! 🎉
          </h2>
          <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
            Excellent work! You've mastered every lesson in this chapter.
          </p>

          {/* XP badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3 mb-6">
            <span className="text-2xl font-display font-extrabold text-indigo-700">+{xpEarned} XP</span>
            <span className="text-xs font-bold text-indigo-500">earned this chapter</span>
          </div>

          <div className="flex flex-col gap-2">
            {onNextChapter && (
              <button
                onClick={onNextChapter}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                Continue to Next Chapter <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
            >
              Stay on This Lesson
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LessonFooter({ onPrev, onNext, isCompleted, onComplete, isLastLesson, chapterXP, onNextChapter }) {
  const [showChapterModal, setShowChapterModal] = useState(false);

  const handleComplete = () => {
    if (onComplete) onComplete();

    // Fire confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#22c55e', '#f59e0b', '#3b82f6'],
    });

    // Show chapter complete modal if this was the last lesson
    if (isLastLesson) {
      setTimeout(() => setShowChapterModal(true), 800);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showChapterModal && (
          <ChapterCompleteModal
            xpEarned={chapterXP || 0}
            onClose={() => setShowChapterModal(false)}
            onNextChapter={onNextChapter ? () => { setShowChapterModal(false); onNextChapter(); } : null}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-100">
        <div className="flex gap-3 w-full sm:w-auto justify-between sm:justify-start">
          {onPrev ? (
            <button
              onClick={onPrev}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : (
            <div />
          )}
        </div>

        <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end items-center">
          {!isCompleted && (
            <motion.button
              onClick={handleComplete}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20"
            >
              <Check className="w-4 h-4" /> Mark as Complete
            </motion.button>
          )}

          {isCompleted && (
            <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs">
              <Check className="w-4 h-4" /> Completed
            </div>
          )}

          {onNext ? (
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-md"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
