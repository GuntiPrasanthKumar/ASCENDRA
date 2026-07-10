import React from 'react';
import { BookOpen, CheckCircle, Circle, PlayCircle } from 'lucide-react';

export default function LessonNavigation({ lessons = [], activeLessonId, onSelectLesson, completedLessonIds = [] }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 pl-2">Lessons in Chapter</h4>
      <div className="flex flex-col gap-1">
        {lessons.map((lesson) => {
          const isActive = lesson.id === activeLessonId;
          const isCompleted = completedLessonIds.includes(lesson.id);

          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl text-left text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary/5 text-primary border border-primary/10 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-success shrink-0" />
                ) : isActive ? (
                  <PlayCircle className="w-4 h-4 text-primary shrink-0 animate-pulse" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                )}
                <span className="truncate">{lesson.title}</span>
              </div>
              <span className="text-[10px] text-textMuted shrink-0 font-medium ml-2">
                {lesson.estimatedMinutes}m
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
