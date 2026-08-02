import React from 'react';
import { BookOpen, Activity, Award, Code, Video, Clock } from 'lucide-react';

export default function ActivityTimeline({ completedLessons = 8, completedQuizzes = 3, completedCoding = 1, completedInterviews = 1 }) {
  const activities = [
    {
      id: 'act-1',
      title: 'Solved Coding Problem',
      subtitle: 'Longest Palindromic Substring',
      time: '2 hours ago',
      type: 'code',
      icon: <Code className="w-3.5 h-3.5 text-black" />,
      color: 'bg-slate-50 border-slate-200'
    },
    {
      id: 'act-2',
      title: 'Completed Quiz Diagnostic',
      subtitle: 'Algorithms & Complexity • 92% Score',
      time: 'Yesterday',
      type: 'quiz',
      icon: <Award className="w-3.5 h-3.5 text-black" />,
      color: 'bg-slate-50 border-slate-200'
    },
    {
      id: 'act-3',
      title: 'Completed Practice Set',
      subtitle: 'Quantitative Aptitude Prep',
      time: '2 days ago',
      type: 'practice',
      icon: <Activity className="w-3.5 h-3.5 text-black" />,
      color: 'bg-slate-50 border-slate-200'
    },
    {
      id: 'act-4',
      title: 'Interview Rehearsal Completed',
      subtitle: 'System Design Mock • 100% Gaze Accuracy',
      time: '3 days ago',
      type: 'interview',
      icon: <Video className="w-3.5 h-3.5 text-black" />,
      color: 'bg-slate-50 border-slate-200'
    },
    {
      id: 'act-5',
      title: 'Completed Lesson',
      subtitle: 'Introduction to Dynamic Programming',
      time: '4 days ago',
      type: 'lesson',
      icon: <BookOpen className="w-3.5 h-3.5 text-black" />,
      color: 'bg-slate-50 border-slate-200'
    }
  ];

  return (
    <div className="p-6 md:p-8 rounded-[2.5rem] border border-slate-200/80 mb-6 bg-white shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-bold font-display text-black flex items-center gap-2">
          <Clock className="w-4 h-4 text-black" /> Recent Activity Timeline
        </h3>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {activities.map((act) => (
          <div key={act.id} className="relative flex items-start justify-between gap-3 group">
            <div className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border flex items-center justify-center bg-white ${act.color}`}>
              {act.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-black group-hover:text-slate-600 transition-colors">
                  {act.title}
                </h4>
                <span className="text-[10px] text-slate-400 font-medium">{act.time}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {act.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
