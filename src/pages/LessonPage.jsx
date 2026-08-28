import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockSubjects } from '../features/learning/mock/subjects';
import { mockChapters } from '../features/learning/mock/chapters';
import { mockLessons } from '../features/learning/mock/lessons';
import { useToastStore } from '../components/common/Toast';
import { useLearningStore } from '../hooks/useLearningStore';

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
  const [aiContextText, setAiContextText] = useState('');
  const [promptInput, setPromptInput] = useState('');

  const navigate = useNavigate();
  const { addToast } = useToastStore();

  // Learning store
  const {
    markComplete,
    toggleBookmark,
    isLessonCompleted,
    isLessonBookmarked,
    isChapterComplete,
    setLastActive,
    getChapterProgress,
  } = useLearningStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      const subject = mockSubjects.find(s => s.id === subjectId);
      const chapter = mockChapters.find(c => c.id === chapterId);
      const lesson = mockLessons.find(l => l.id === lessonId);
      const chapterLessons = mockLessons.filter(l => l.chapterId === chapterId);

      if (subject && chapter && lesson) {
        setData({ subject, chapter, lesson, chapterLessons });
        // Track last active
        setLastActive(subjectId, chapterId, lessonId);
      } else {
        setData(null);
      }
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [subjectId, chapterId, lessonId, setLastActive]);

  useEffect(() => {
    setAiContextText('');
  }, [lessonId]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#F8F9FA] pt-8 pb-20 px-4 md:px-6">
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
        <div className="min-h-screen bg-[#F8F9FA] pt-8 pb-20 px-4 md:px-6 flex items-center justify-center">
          <div className="max-w-md w-full p-8 rounded-3xl border border-slate-200/80 bg-white text-center flex flex-col items-center shadow-xs">
            <ShieldAlert className="w-12 h-12 text-slate-300 mb-4" />
            <h2 className="text-xl font-display font-extrabold text-slate-900 mb-2">Lesson Not Found</h2>
            <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
              We could not find the requested lesson. It may not have content yet.
            </p>
            <button
              onClick={() => navigate('/learn')}
              className="w-full py-3.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
            >
              Return to Learning Hub
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const { subject, chapter, lesson, chapterLessons } = data;

  const lessonCompleted = isLessonCompleted(lesson.id);
  const lessonBookmarked = isLessonBookmarked(lesson.id);

  const currentIndex = chapterLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? chapterLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < chapterLessons.length - 1 ? chapterLessons[currentIndex + 1] : null;
  const isLastLesson = currentIndex === chapterLessons.length - 1;

  // Calculate XP for whole chapter
  const chapterXP = chapterLessons.reduce((sum, l) => sum + (l.pointsAwarded || 0), 0);

  // Count completed in chapter for progress panel
  const completedCountInChapter = chapterLessons.filter(l => isLessonCompleted(l.id)).length;

  const handleComplete = () => {
    if (!lessonCompleted) {
      markComplete(lesson.id);
      addToast(`+${lesson.pointsAwarded} XP — Lesson Complete! 🎉`, 'success');
    }
  };

  const handleToggleBookmark = () => {
    const nowBookmarked = toggleBookmark(lesson.id);
    addToast(
      nowBookmarked ? 'Lesson bookmarked!' : 'Bookmark removed.',
      nowBookmarked ? 'success' : 'info'
    );
  };

  const handleSendPrompt = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setAiContextText(promptInput.trim());
    setPromptInput('');
  };

  // Navigate to first lesson of next chapter
  const handleNextChapter = () => {
    const allChapters = mockChapters.filter(c => c.subjectId === subjectId);
    const currChapterIdx = allChapters.findIndex(c => c.id === chapterId);
    const nextChapter = currChapterIdx < allChapters.length - 1 ? allChapters[currChapterIdx + 1] : null;
    if (nextChapter && nextChapter.lessonIds.length > 0) {
      navigate(`/learn/${subjectId}/${nextChapter.id}/${nextChapter.lessonIds[0]}`);
    } else {
      navigate(`/learn/${subjectId}`);
    }
  };

  const quickPrompts = [
    { label: 'Summarize Key Takeaways', icon: <FileText className="w-3 h-3" /> },
    { label: 'Explain with Intuitive Analogy', icon: <Lightbulb className="w-3 h-3" /> },
    { label: 'Generate Self-Check Quiz', icon: <HelpCircle className="w-3 h-3" /> }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] pb-28 w-full transition-colors duration-300">
        <div className="w-full space-y-6">

          {/* Lesson Header */}
          <LessonHeader
            title={lesson.title}
            subjectTitle={subject.title}
            chapterTitle={chapter.title}
            readingTime={lesson.estimatedMinutes}
            xp={lesson.pointsAwarded}
            isBookmarked={lessonBookmarked}
            onBookmarkToggle={handleToggleBookmark}
            onBack={() => navigate(`/learn/${subject.id}/${chapter.id}`)}
          />

          {/* 3-Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">

            {/* Panel 1: Navigation Sidebar */}
            <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col gap-5 shadow-xs">
              <LessonProgress
                completedCount={completedCountInChapter}
                totalCount={chapterLessons.length}
              />
              <LessonNavigation
                lessons={chapterLessons}
                activeLessonId={lesson.id}
                completedLessonIds={useLearningStore.getState().completedLessonIds}
                onSelectLesson={(id) => navigate(`/learn/${subject.id}/${chapter.id}/${id}`)}
              />
            </div>

            {/* Panel 2: Main Lesson Content */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-8 min-h-[520px] flex flex-col shadow-xs">
              {/* Lesson meta */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {subject.title}
                </span>
                <span className="text-slate-300">›</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {chapter.title}
                </span>
                <span className="text-slate-300">›</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                  Lesson {currentIndex + 1} of {chapterLessons.length}
                </span>
              </div>

              <LessonContent
                contentBlocks={lesson.contentBlocks}
                onAskAI={(prompt) => setAiContextText(prompt)}
              />

              <LessonFooter
                onPrev={prevLesson ? () => navigate(`/learn/${subject.id}/${chapter.id}/${prevLesson.id}`) : null}
                onNext={nextLesson ? () => navigate(`/learn/${subject.id}/${chapter.id}/${nextLesson.id}`) : null}
                isCompleted={lessonCompleted}
                onComplete={handleComplete}
                isLastLesson={isLastLesson}
                chapterXP={chapterXP}
                onNextChapter={handleNextChapter}
              />
            </div>

            {/* Panel 3: AI Coach Sidebar */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <LessonSidebar
                lessonId={lesson.id}
                lessonTitle={lesson.title}
                contentBlocks={lesson.contentBlocks}
                aiContext={aiContextText}
                onActionTrigger={() => {}}
              />
            </div>

          </div>

          {/* Floating AI Prompt Bar */}
          <div className="fixed bottom-5 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[680px] z-40 space-y-2">
            {/* Quick Prompt Pills */}
            <div className="hidden sm:flex items-center justify-center gap-2">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setAiContextText(item.label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-[11px] font-bold text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Main Prompt Bar */}
            <form
              onSubmit={handleSendPrompt}
              className="relative flex items-center bg-white/95 backdrop-blur-xl border border-slate-200 rounded-full shadow-xl p-2 pl-5"
            >
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mr-3" />
              <input
                type="text"
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                placeholder="Ask ASCENDRA AI about this lesson..."
                className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none pr-12"
              />
              <button
                type="submit"
                className="absolute right-2.5 p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
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
