import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import api from '../../utils/api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

function getColorClass(count) {
  if (count === 0) return 'bg-muted/40 hover:bg-muted';
  if (count <= 1) return 'bg-accent/25 hover:bg-accent/40';
  if (count <= 2) return 'bg-accent/50 hover:bg-accent/65';
  if (count <= 3) return 'bg-accent/75 hover:bg-accent/90';
  if (count <= 4) return 'bg-accent hover:bg-accent/90';
  return 'bg-accent shadow-[0_0_6px_rgba(108,99,255,0.6)]';
}

export default function HeatmapCard() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [activityData, setActivityData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const res = await api.get('/analytics/heatmap');
        // Convert array [{date, count}] to object {date: count}
        const dataMap = {};
        res.data.forEach(item => {
          dataMap[item.date.split('T')[0]] = item.count;
        });
        setActivityData(dataMap);
      } catch (err) {
        console.error("Heatmap fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeatmap();
  }, []);

  // Build a 53×7 grid (weeks × days)
  const weeks = useMemo(() => {
    const firstDay = new Date(year, 0, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const gridStart = new Date(firstDay);
    gridStart.setDate(gridStart.getDate() - startOffset);

    const grid = [];
    let cursor = new Date(gridStart);
    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const key = cursor.toISOString().slice(0, 10);
        const inYear = cursor.getFullYear() === year;
        week.push({
          date: new Date(cursor),
          key,
          count: inYear ? (activityData[key] ?? 0) : -1,
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      grid.push(week);
    }
    return grid;
  }, [year, activityData]);

  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstInYear = week.find(d => d.count >= 0);
      if (firstInYear) {
        const m = firstInYear.date.getMonth();
        if (m !== lastMonth) {
          labels.push({ month: MONTHS[m], weekIndex: wi });
          lastMonth = m;
        }
      }
    });
    return labels;
  }, [weeks]);

  const totalActivities = useMemo(() => Object.values(activityData).reduce((a, b) => a + b, 0), [activityData]);
  const activeDays = useMemo(() => Object.values(activityData).filter(v => v > 0).length, [activityData]);
  const maxStreak = useMemo(() => {
    let streak = 0, max = 0;
    const sortedKeys = Object.keys(activityData).sort();
    sortedKeys.forEach(k => {
      if (activityData[k] > 0) { streak++; max = Math.max(max, streak); }
      else streak = 0;
    });
    return max;
  }, [activityData]);

  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="glass p-6 rounded-3xl w-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-display font-bold text-primary">Learning Activity</h3>
        </div>
        <div className="flex items-center gap-2 bg-white/60 border border-muted rounded-xl px-3 py-1">
          <button onClick={() => setYear(y => y - 1)} disabled={year <= currentYear - 4} className="text-textMuted hover:text-primary transition-colors disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono font-bold text-sm text-primary w-12 text-center">{year}</span>
          <button onClick={() => setYear(y => y + 1)} disabled={year >= currentYear} className="text-textMuted hover:text-primary transition-colors disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-5 flex-wrap">
        {[
          { label: 'Total Sessions', value: isLoading ? '...' : totalActivities },
          { label: 'Active Days', value: isLoading ? '...' : activeDays },
          { label: 'Best Streak', value: isLoading ? '...' : `${maxStreak}d` },
        ].map((s) => (
          <div key={s.label} className="flex-1 min-w-[80px] bg-white/50 border border-muted rounded-xl px-3 py-2 text-center">
            <div className="font-display font-bold text-primary text-lg">{s.value}</div>
            <div className="text-textMuted text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="min-w-max">
          <div className="flex ml-7 mb-1 relative h-4">
            {monthLabels.map(({ month, weekIndex }) => (
              <div key={`${month}-${weekIndex}`} className="absolute text-[10px] text-textMuted font-medium" style={{ left: `${weekIndex * 13}px` }}>
                {month}
              </div>
            ))}
          </div>
          <div className="flex gap-0">
            <div className="flex flex-col gap-[3px] mr-1 mt-0">
              {DAYS.map((d, i) => (
                <div key={i} className="h-[10px] w-6 text-[9px] text-textMuted flex items-center justify-end pr-1">
                  {d}
                </div>
              ))}
            </div>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px] mr-[3px]">
                {week.map((cell, di) => (
                  <motion.div
                    key={cell.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onMouseEnter={() => setTooltip(cell)}
                    onMouseLeave={() => setTooltip(null)}
                    className={`w-[10px] h-[10px] rounded-sm transition-all cursor-pointer relative ${cell.count < 0 ? 'bg-transparent' : getColorClass(cell.count)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {tooltip && tooltip.count >= 0 && (
        <div className="mt-3 text-xs text-center text-textMuted bg-white/60 border border-muted rounded-lg py-1 px-3">
          <span className="font-bold text-primary">{tooltip.count === 0 ? 'No activity' : `${tooltip.count} session${tooltip.count > 1 ? 's' : ''}`}</span>
          {' '}on{' '}
          <span>{tooltip.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 mt-3 text-xs text-textMuted">
        <span>Less</span>
        <div className="flex gap-[3px]">
          {[0, 1, 2, 3, 4, 5].map(n => (
            <div key={n} className={`w-[10px] h-[10px] rounded-sm ${getColorClass(n)}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
