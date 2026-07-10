import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ durationMinutes = 15, onTimeUp }) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp]);

  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center gap-2 text-xs font-black text-slate-700 bg-slate-50 border border-slate-200/50 px-4 py-2.5 rounded-2xl select-none w-fit">
      <Clock className="w-4 h-4 text-slate-500 shrink-0" />
      <span>{formatTime()}</span>
    </div>
  );
}
