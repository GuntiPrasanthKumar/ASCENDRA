import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockSubjects } from '../features/learning/mock/subjects';
import { mockChapters } from '../features/learning/mock/chapters';
import { mockLessons } from '../features/learning/mock/lessons';
import { useToastStore } from '../components/common/Toast';

// Reusable Learn Components
import LessonHeader from '../components/learn/LessonHeader';
import LessonContent from '../components/learn/LessonContent';
import LessonSidebar from '../components/learn/LessonSidebar';
import LessonNavigation from '../components/learn/LessonNavigation';
import LessonFooter from '../components/learn/LessonFooter';
import LessonProgress from '../components/learn/LessonProgress';

// Icons
import { ShieldAlert } from 'lucide-react';

export default function LessonPage() {
  const { subjectId, chapterId, lessonId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  
  // State for AI context
  const [aiContextText, setAiContextText] = useState('');

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
        
        // Load bookmark state
        const bookmarks = JSON.parse(localStorage.getItem('bookmarked_lessons') || '[]');
        setIsBookmarked(bookmarks.includes(lesson.id));

        // Load completed lessons list
        const completed = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
        setCompletedLessonIds(completed);
      } else {
        setData(null);
      }
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [subjectId, chapterId, lessonId]);

  // Reset states when changing lessons
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
          <div className="glass max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/50 text-center flex flex-col items-center">
            <ShieldAlert className="w-12 h-12 text-error mb-4" />
            <h2 className="text-xl font-bold text-primary mb-2">Lesson Workspace Not Found</h2>
            <p className="text-xs text-textMuted mb-6 leading-relaxed">
              We could not find the requested lesson leaf details.
            </p>
            <button onClick={() => navigate('/learn')} className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all">
              Return to Hub
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const { subject, chapter, lesson, chapterLessons } = data;
  const isLessonCompleted = completedLessonIds.includes(lesson.id);

  // Bookmark Toggle
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

  // Complete and Continue
  const handleComplete = () => {
    if (!isLessonCompleted) {
      const updated = [...completedLessonIds, lesson.id];
      setCompletedLessonIds(updated);
      localStorage.setItem('completed_lessons', JSON.stringify(updated));

      // 1. Increment streak
      const currentStreak = parseInt(localStorage.getItem('skilltrove_streak') || '7');
      localStorage.setItem('skilltrove_streak', currentStreak + 1);

      // 2. Log recent activity
      const activities = JSON.parse(localStorage.getItem('skilltrove_activities') || '[]');
      activities.unshift({
        title: `Lesson Completed: ${lesson.title}`,
        time: 'Just now',
        xp: `+${lesson.pointsAwarded} XP`
      });
      localStorage.setItem('skilltrove_activities', JSON.stringify(activities.slice(0, 5)));

      // 3. Mark goal checklist item completed
      const savedGoals = JSON.parse(localStorage.getItem('skilltrove_today_goals') || '[]');
      if (savedGoals.length > 0) {
        const updatedGoals = savedGoals.map(g => g.id === 'goal-2' ? { ...g, done: true } : g);
        localStorage.setItem('skilltrove_today_goals', JSON.stringify(updatedGoals));
      }

      addToast(`Lesson completed! +${lesson.pointsAwarded} points awarded.`, 'success');
    }
  };

  const currentIndex = chapterLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? chapterLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < chapterLessons.length - 1 ? chapterLessons[currentIndex + 1] : null;

  const completedCountInChapter = chapterLessons.filter(l => completedLessonIds.includes(l.id)).length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <LessonHeader 
            title={lesson.title}
            subjectTitle={subject.title}
            readingTime={lesson.estimatedMinutes}
            isBookmarked={isBookmarked}
            onBookmarkToggle={toggleBookmark}
            onBack={() => navigate(`/learn/${subject.id}/${chapter.id}`)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Collapsible Lesson Navigation menu (Left Column, span 1) */}
            <div className="glass p-5 rounded-[2rem] border border-slate-200/50 flex flex-col gap-6">
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

            {/* Content Pane (Middle Columns, span 2) */}
            <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-slate-200/50 min-h-[460px] flex flex-col justify-between">
              
              {/* Block Based Learning Workspace */}
              <LessonContent 
                contentBlocks={lesson.contentBlocks}
                onAskAI={(prompt) => setAiContextText(prompt)}
              />

              {/* Bottom Nav controls */}
              <LessonFooter 
                onPrev={prevLesson ? () => navigate(`/learn/${subject.id}/${chapter.id}/${prevLesson.id}`) : null}
                onNext={nextLesson ? () => navigate(`/learn/${subject.id}/${chapter.id}/${nextLesson.id}`) : null}
                isCompleted={isLessonCompleted}
                onComplete={handleComplete}
              />
            </div>

            {/* Workspace Sidebar (Right Column, span 1) */}
            <div className="flex flex-col gap-6">
              <LessonSidebar 
                lessonId={lesson.id}
                aiContext={aiContextText}
                onActionTrigger={() => {}}
              />
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
