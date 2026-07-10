import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GoalChecklist({ initialGoals = [] }) {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    // Load persisted checkbox states from local storage if available
    const saved = localStorage.getItem('skilltrove_today_goals');
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
        return;
      } catch (e) {
        console.error('Failed to parse goals, falling back:', e);
      }
    }
    setGoals(initialGoals);
  }, [initialGoals]);

  const toggleGoal = (id) => {
    const updated = goals.map(g => g.id === id ? { ...g, done: !g.done } : g);
    setGoals(updated);
    localStorage.setItem('skilltrove_today_goals', JSON.stringify(updated));
  };

  const doneCount = goals.filter(g => g.done).length;
  const percent = goals.length > 0 ? Math.round((doneCount / goals.length) * 100) : 0;

  return (
    <div className="glass p-8 rounded-[2rem] border border-slate-200/50 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold font-display text-primary">Today's Goals</h3>
          <span className="text-[10px] font-black text-accent bg-accent/5 border border-accent/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {doneCount}/{goals.length} Completed
          </span>
        </div>

        {/* Mini progress line */}
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-accent transition-all duration-300" style={{ width: `${percent}%` }} />
        </div>

        <div className="flex flex-col gap-4">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className="flex items-start text-left gap-3 group transition-colors"
            >
              <div className="shrink-0 mt-0.5 text-textMuted group-hover:text-accent transition-colors">
                {goal.done ? (
                  <CheckSquare className="w-5 h-5 text-accent" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </div>
              <span className={`text-sm font-medium transition-all ${
                goal.done ? 'line-through text-textMuted' : 'text-slate-700'
              }`}>
                {goal.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {percent === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 flex items-center gap-2 text-xs font-bold text-success bg-success/5 border border-success/15 p-3 rounded-2xl"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Excellent work! Daily milestones complete.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
