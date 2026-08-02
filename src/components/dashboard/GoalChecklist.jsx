import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GoalChecklist({ initialGoals = [] }) {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
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
    <div className="p-8 rounded-[2.5rem] border border-slate-200/80 bg-white flex flex-col justify-between h-full shadow-xs">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold font-display text-black">Today's Goals</h3>
          <span className="text-[10px] font-black text-black bg-slate-100 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-wider">
            {doneCount}/{goals.length} Completed
          </span>
        </div>

        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-black transition-all duration-300" style={{ width: `${percent}%` }} />
        </div>

        <div className="flex flex-col gap-4">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className="flex items-start text-left gap-3 group transition-colors"
            >
              <div className="shrink-0 mt-0.5 text-slate-400 group-hover:text-black transition-colors">
                {goal.done ? (
                  <CheckSquare className="w-5 h-5 text-black" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <span className={`text-sm font-medium transition-all ${
                goal.done ? 'line-through text-slate-400' : 'text-slate-800'
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
            className="mt-6 flex items-center gap-2 text-xs font-bold text-black bg-slate-50 border border-slate-200/60 p-3 rounded-2xl"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-black" />
            <span>Excellent work! Daily milestones complete.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
