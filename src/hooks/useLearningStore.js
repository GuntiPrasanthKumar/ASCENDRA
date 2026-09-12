import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockLessons } from '../features/learning/mock/lessons';
import { mockChapters } from '../features/learning/mock/chapters';
import { mockSubjects } from '../features/learning/mock/subjects';

export const useLearningStore = create(
  persist(
    (set, get) => ({
      completedLessonIds: [],
      bookmarkedLessonIds: [],
      studyStreak: 0,
      totalXP: 0,
      lastActiveSubjectId: null,
      lastActiveChapterId: null,
      lastActiveLessonId: null,

      // ── Actions ────────────────────────────────────────────────

      markComplete: (lessonId) => {
        const { completedLessonIds } = get();
        if (completedLessonIds.includes(lessonId)) return; // Already done

        const lesson = mockLessons.find(l => l.id === lessonId);
        const xp = lesson?.pointsAwarded || 50;

        set(state => ({
          completedLessonIds: [...state.completedLessonIds, lessonId],
          totalXP: state.totalXP + xp,
          studyStreak: state.studyStreak + 1,
        }));
      },

      unmarkComplete: (lessonId) => {
        const lesson = mockLessons.find(l => l.id === lessonId);
        const xp = lesson?.pointsAwarded || 50;

        set(state => ({
          completedLessonIds: state.completedLessonIds.filter(id => id !== lessonId),
          totalXP: Math.max(0, state.totalXP - xp),
        }));
      },

      toggleBookmark: (lessonId) => {
        const { bookmarkedLessonIds } = get();
        const isBookmarked = bookmarkedLessonIds.includes(lessonId);
        set({
          bookmarkedLessonIds: isBookmarked
            ? bookmarkedLessonIds.filter(id => id !== lessonId)
            : [...bookmarkedLessonIds, lessonId],
        });
        return !isBookmarked; // Return new state
      },

      setLastActive: (subjectId, chapterId, lessonId) => {
        set({ lastActiveSubjectId: subjectId, lastActiveChapterId: chapterId, lastActiveLessonId: lessonId });
      },

      // ── Selectors ──────────────────────────────────────────────

      isLessonCompleted: (lessonId) => {
        return get().completedLessonIds.includes(lessonId);
      },

      isLessonBookmarked: (lessonId) => {
        return get().bookmarkedLessonIds.includes(lessonId);
      },

      /** Returns 0-100 progress for a chapter */
      getChapterProgress: (chapterId) => {
        const chapter = mockChapters.find(c => c.id === chapterId);
        if (!chapter || chapter.lessonIds.length === 0) return 0;
        const { completedLessonIds } = get();
        const completed = chapter.lessonIds.filter(id => completedLessonIds.includes(id)).length;
        return Math.round((completed / chapter.lessonIds.length) * 100);
      },

      /** Returns { completed, total, progress } for a subject */
      getSubjectProgress: (subjectId) => {
        const subject = mockSubjects.find(s => s.id === subjectId);
        if (!subject) return { completed: 0, total: 0, progress: 0 };

        // Get all lessons that belong to this subject's chapters
        const subjectChapters = mockChapters.filter(c => c.subjectId === subjectId);
        const allLessonIds = subjectChapters.flatMap(c => c.lessonIds);
        const total = allLessonIds.length;
        if (total === 0) return { completed: 0, total: 0, progress: 0 };

        const { completedLessonIds } = get();
        const completed = allLessonIds.filter(id => completedLessonIds.includes(id)).length;
        return {
          completed,
          total,
          progress: Math.round((completed / total) * 100),
        };
      },

      /** Returns the total completed lessons count across all subjects */
      getTotalCompleted: () => get().completedLessonIds.length,

      /** Returns chapter progress details for lessons list */
      getChapterLessonStates: (chapterId) => {
        const { completedLessonIds } = get();
        const lessons = mockLessons.filter(l => l.chapterId === chapterId);
        return lessons.map(l => ({
          ...l,
          isCompleted: completedLessonIds.includes(l.id),
        }));
      },

      /** Gets subject the user was last working on */
      getLastActiveSubject: () => {
        const { lastActiveSubjectId } = get();
        if (!lastActiveSubjectId) return null;
        return mockSubjects.find(s => s.id === lastActiveSubjectId) || null;
      },

      /** Gets last active chapter */
      getLastActiveChapter: () => {
        const { lastActiveChapterId } = get();
        if (!lastActiveChapterId) return null;
        return mockChapters.find(c => c.id === lastActiveChapterId) || null;
      },

      /** Is the entire chapter complete? */
      isChapterComplete: (chapterId) => {
        const chapter = mockChapters.find(c => c.id === chapterId);
        if (!chapter || chapter.lessonIds.length === 0) return false;
        const { completedLessonIds } = get();
        return chapter.lessonIds.every(id => completedLessonIds.includes(id));
      },
    }),
    {
      name: 'ascendra-learning-progress',
    }
  )
);
