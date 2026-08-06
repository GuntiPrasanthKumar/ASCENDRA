import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

import { ShieldAlert, Sparkles, Send } from 'lucide-react';

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
    }, 600);

    return () => clearTimeout(timer);
  }, [subjectId, chapterId, lessonId]);

  useEffect(() => {
    setAiContextText('');
  }, [lessonId]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6">
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
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 flex items-center justify-center">
          <div className="max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/80 bg-white text-center flex flex-col items-center">
            <ShieldAlert className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-display font-extrabold text-black mb-2">Lesson Workspace Not Found</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We could not find the requested lesson leaf details.
            </p>
            <button onClick={() => navigate('/learn')} className="w-full py-4 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all">
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

      const activities = JSON.parse(localStorage.getItem('skilltrove_activities') || '[]');
      activities.unshift({
        title: `Lesson Completed: ${lesson.title}`,
        time: 'Just now',
        xp: `+${lesson.pointsAwarded} XP`
      });
      localStorage.setItem('skilltrove_activities', JSON.stringify(activities.slice(0, 5)));

      addToast(`Lesson completed! +${lesson.pointsAwarded} points awarded.`, 'success');
    }
  };

  const handleSendPrompt = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setAiContextText(promptInput.trim());
    setPromptInput('');
  };

  const currentIndex = chapterLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? chapterLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < chapterLessons.length - 1 ? chapterLessons[currentIndex + 1] : null;

  const completedCountInChapter = chapterLessons.filter(l => completedLessonIds.includes(l.id)).length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-slate-800 dark:text-slate-100 pb-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Workspace Header */}
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
            
            {/* Panel 1: Learning Path Sources (Span 2) */}
            <div className="lg:col-span-2 p-5 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-6">
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

            {/* Panel 2: Core Reading Workspace (Span 5) */}
            <div className="lg:col-span-5 p-8 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[500px] flex flex-col justify-between">
              <LessonContent 
                contentBlocks={lesson.contentBlocks}
                onAskAI={(prompt) => setAiContextText(prompt)}
              />
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
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

          {/* NotebookLM Bottom Prompt Bar ("Ask Ascendra") */}
          <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-[600px] z-40">
            <form onSubmit={handleSendPrompt} className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-full shadow-2xl p-2 pl-4">
              <Sparkles className="w-4 h-4 text-black dark:text-white shrink-0 mr-2" />
              <input 
                type="text"
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                placeholder="Ask Ascendra about this lesson or concept..."
                className="w-full bg-transparent text-xs font-semibold text-black dark:text-white placeholder-slate-400 focus:outline-none pr-10"
              />
              <button 
                type="submit"
                className="absolute right-2 p-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity"
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
