import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ limitString = '5 mins', onTimeUp }) {
  const limitMinutes = parseInt(limitString) || 5;
  const [secondsLeft, setSecondsLeft] = useState(limitMinutes * 60);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeUpRef.current) onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center gap-2 text-xs font-black text-slate-700 bg-slate-50 border border-slate-200/50 px-4 py-2.5 rounded-2xl select-none">
      <Clock className={`w-4 h-4 shrink-0 ${secondsLeft < 30 ? 'text-error animate-pulse' : 'text-slate-500'}`} />
      <span>{formatTime()}</span>
    </div>
  );
}
