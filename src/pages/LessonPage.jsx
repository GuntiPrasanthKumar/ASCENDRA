import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockSubjects } from '../features/learning/mock/subjects';
import { mockChapters } from '../features/learning/mock/chapters';
import { mockLessons } from '../features/learning/mock/lessons';
import { useToastStore } from '../components/common/Toast';

import LessonHeader from '../components/learn/LessonHeader';
import LessonContent from '../components/learn/LessonContent';
import LessonSidebar from '../components/learn/LessonSidebar';
import LessonNavigation from '../components/learn/LessonNavigation';
import LessonFooter from '../components/learn/LessonFooter';
import LessonProgress from '../components/learn/LessonProgress';

import { ShieldAlert, Sparkles, Send, HelpCircle, FileText, Lightbulb } from 'lucide-react';

export default function LessonPage() {
  const { subjectId, chapterId, lessonId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  
  const [aiContextText, setAiContextText] = useState('');
  const [promptInput, setPromptInput] = useState('');

  const navigate = useNavigate();
  const { addToast } = useToastStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      const subject = mockSubjects.find(s => s.id === subjectId);
      const chapter = mockChapters.find(c => c.id === chapterId);
      const lesson = mockLessons.find(l => l.id === lessonId);
      const chapterLessons = mockLessons.filter(l => l.chapterId === chapterId);

      if (subject && chapter && lesson) {
        setData({ subject, chapter, lesson, chapterLessons });
        
        const bookmarks = JSON.parse(localStorage.getItem('bookmarked_lessons') || '[]');
        setIsBookmarked(bookmarks.includes(lesson.id));

        const completed = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
        setCompletedLessonIds(completed);
      } else {
        setData(null);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [subjectId, chapterId, lessonId]);

  useEffect(() => {
    setAiContextText('');
  }, [lessonId]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#131314] pt-8 pb-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!data) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#131314] pt-8 pb-20 px-4 md:px-6 flex items-center justify-center">
          <div className="google-card max-w-md w-full p-8 text-center flex flex-col items-center">
            <ShieldAlert className="w-12 h-12 text-[#D93025] mb-4" />
            <h2 className="text-xl font-display font-bold text-[#1F1F1F] dark:text-[#E3E3E3] mb-2">
              Lesson Workspace Not Found
            </h2>
            <p className="text-xs text-[#5F6368] dark:text-[#8E918F] mb-6 leading-relaxed">
              We could not find the requested lesson leaf details.
            </p>
            <button onClick={() => navigate('/learn')} className="w-full py-3.5 rounded-full bg-[#1A73E8] text-white font-bold text-xs hover:bg-[#1557B0] transition-all shadow-xs">
              Return to Hub
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const { subject, chapter, lesson, chapterLessons } = data;
  const isLessonCompleted = completedLessonIds.includes(lesson.id);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_lessons') || '[]');
    let updated;
    if (isBookmarked) {
      updated = bookmarks.filter(id => id !== lesson.id);
      addToast('Bookmark removed.', 'info');
    } else {
      updated = [...bookmarks, lesson.id];
      addToast('Bookmark saved in workspace!', 'success');
    }
    localStorage.setItem('bookmarked_lessons', JSON.stringify(updated));
    setIsBookmarked(!isBookmarked);
  };

  const handleComplete = () => {
    if (!isLessonCompleted) {
      const updated = [...completedLessonIds, lesson.id];
      setCompletedLessonIds(updated);
      localStorage.setItem('completed_lessons', JSON.stringify(updated));

      const currentStreak = parseInt(localStorage.getItem('skilltrove_streak') || '7');
      localStorage.setItem('skilltrove_streak', currentStreak + 1);

      addToast(`Lesson completed! +${lesson.pointsAwarded} points awarded.`, 'success');
    }
  };

  const handleSendPrompt = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setAiContextText(promptInput.trim());
    setPromptInput('');
  };

  const quickPrompts = [
    { label: 'Summarize Key Takeaways', icon: <FileText className="w-3 h-3" /> },
    { label: 'Explain with Intuitive Analogy', icon: <Lightbulb className="w-3 h-3" /> },
    { label: 'Generate Self-Check Quiz', icon: <HelpCircle className="w-3 h-3" /> }
  ];

  const currentIndex = chapterLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? chapterLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < chapterLessons.length - 1 ? chapterLessons[currentIndex + 1] : null;

  const completedCountInChapter = chapterLessons.filter(l => completedLessonIds.includes(l.id)).length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#131314] text-[#1F1F1F] dark:text-[#E3E3E3] pb-28 px-4 md:px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* NotebookLM Header */}
          <LessonHeader 
            title={lesson.title}
            subjectTitle={subject.title}
            readingTime={lesson.estimatedMinutes}
            isBookmarked={isBookmarked}
            onBookmarkToggle={toggleBookmark}
            onBack={() => navigate(`/learn/${subject.id}/${chapter.id}`)}
          />

          {/* NotebookLM 3-Panel Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
            
            {/* Panel 1: Sources & Navigation (Span 2) */}
            <div className="lg:col-span-2 google-card p-5 flex flex-col gap-6">
              <LessonProgress 
                completedCount={completedCountInChapter}
                totalCount={chapterLessons.length}
              />
              <LessonNavigation 
                lessons={chapterLessons}
                activeLessonId={lesson.id}
                completedLessonIds={completedLessonIds}
                onSelectLesson={(id) => navigate(`/learn/${subject.id}/${chapter.id}/${id}`)}
              />
            </div>

            {/* Panel 2: Core Workspace Reading Document (Span 5) */}
            <div className="lg:col-span-5 google-card p-8 min-h-[520px] flex flex-col justify-between">
              <LessonContent 
                contentBlocks={lesson.contentBlocks}
                onAskAI={(prompt) => setAiContextText(prompt)}
              />
              <div className="pt-6 border-t border-[#E3E3E3] dark:border-[#2E2F31] mt-6">
                <LessonFooter 
                  onPrev={prevLesson ? () => navigate(`/learn/${subject.id}/${chapter.id}/${prevLesson.id}`) : null}
                  onNext={nextLesson ? () => navigate(`/learn/${subject.id}/${chapter.id}/${nextLesson.id}`) : null}
                  isCompleted={isLessonCompleted}
                  onComplete={handleComplete}
                />
              </div>
            </div>

            {/* Panel 3: AI Synthesis & Notes Workspace (Span 3) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <LessonSidebar 
                lessonId={lesson.id}
                aiContext={aiContextText}
                onActionTrigger={() => {}}
              />
            </div>

          </div>

          {/* NotebookLM Floating Interactive Prompt Capsule */}
          <div className="fixed bottom-5 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[680px] z-40 space-y-2">
            
            {/* Quick Prompt Pills */}
            <div className="hidden sm:flex items-center justify-center gap-2">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setAiContextText(item.label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#1E1E20]/90 backdrop-blur-md border border-[#E3E3E3] dark:border-[#2E2F31] text-[11px] font-bold text-[#5F6368] dark:text-[#C4C7C5] hover:text-[#1A73E8] dark:hover:text-[#A8C7FA] hover:border-[#1A73E8] transition-all shadow-xs"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Main Prompt Bar */}
            <form onSubmit={handleSendPrompt} className="relative flex items-center bg-white/95 dark:bg-[#1E1E20]/95 backdrop-blur-xl border border-[#E3E3E3] dark:border-[#2E2F31] rounded-full shadow-2xl p-2 pl-5">
              <Sparkles className="w-4 h-4 text-[#1A73E8] dark:text-[#A8C7FA] shrink-0 mr-3 animate-pulse" />
              <input 
                type="text"
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                placeholder="Ask Ascendra about this lesson or concept..."
                className="w-full bg-transparent text-xs font-semibold text-[#1F1F1F] dark:text-[#E3E3E3] placeholder-[#5F6368] dark:placeholder-[#8E918F] focus:outline-none pr-12"
              />
              <button 
                type="submit"
                className="absolute right-2.5 p-2 rounded-full bg-[#1A73E8] dark:bg-[#A8C7FA] text-white dark:text-[#041E49] hover:bg-[#1557B0] transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
