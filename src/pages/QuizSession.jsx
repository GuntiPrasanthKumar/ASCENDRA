import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockQuizzes } from '../features/quiz/mock/quiz';
import { mockQuizQuestions } from '../features/quiz/mock/questions';
import { useToastStore } from '../components/common/Toast';

// Reusable Components
import QuizLayout from '../components/quiz/QuizLayout';
import QuizHeader from '../components/quiz/QuizHeader';
import QuestionCard from '../components/quiz/QuestionCard';

// Icons
import { ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';

export default function QuizSession() {
  const { subjectId, quizId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});

  const navigate = useNavigate();
  const { addToast } = useToastStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeQuiz = mockQuizzes.find(q => q.id === quizId);
      const quizQuestions = mockQuizQuestions[quizId] || [];

      if (activeQuiz && quizQuestions.length > 0) {
        setData({ activeQuiz, quizQuestions });
      }
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [quizId]);

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
            <h2 className="text-xl font-bold text-primary mb-2">Quiz Session Not Found</h2>
            <p className="text-xs text-textMuted mb-6 leading-relaxed">
              We could not find the requested diagnostic quiz data.
            </p>
            <button onClick={() => navigate('/quiz')} className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all">
              Return to Quizzes List
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const { activeQuiz, quizQuestions } = data;
  const question = quizQuestions[currentIdx];

  const handleSelectOption = (idx) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: idx }));
  };

  const handleSubmitQuiz = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < quizQuestions.length) {
      addToast('Please answer all questions before submitting.', 'warning');
      return;
    }

    // Calculate score
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctIdx) score++;
    });

    // 1. Save scorecard results
    localStorage.setItem(`quiz_result_${subjectId}_${quizId}`, JSON.stringify({
      score,
      total: quizQuestions.length,
      timeTaken: '2m 10s'
    }));

    // 2. PROGRESS SYSTEM SYNC:
    // Update completed quizzes array
    const completedQuizzes = JSON.parse(localStorage.getItem('completed_quizzes') || '[]');
    if (!completedQuizzes.includes(quizId)) {
      completedQuizzes.push(quizId);
      localStorage.setItem('completed_quizzes', JSON.stringify(completedQuizzes));
    }

    // Update lesson completion mapping for DP Intro
    const completedLessons = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
    if (!completedLessons.includes('dp-introduction')) {
      completedLessons.push('dp-introduction');
      localStorage.setItem('completed_lessons', JSON.stringify(completedLessons));
    }

    // Increment learning streak
    const currentStreak = parseInt(localStorage.getItem('skilltrove_streak') || '7');
    localStorage.setItem('skilltrove_streak', currentStreak + 1);

    // Mark today's goals completed
    const goals = JSON.parse(localStorage.getItem('skilltrove_today_goals') || '[]');
    const updatedGoals = goals.map(g => {
      if (g.id === 'goal-1') return { ...g, done: true }; // solve daily challenge
      if (g.id === 'goal-3') return { ...g, done: true }; // discuss limits
      return g;
    });
    localStorage.setItem('skilltrove_today_goals', JSON.stringify(updatedGoals));

    // Save recent activity log
    const activities = JSON.parse(localStorage.getItem('skilltrove_activities') || '[]');
    activities.unshift({
      title: `Quiz Completed: Algorithms DP Final (${score}/${quizQuestions.length})`,
      time: 'Just now',
      xp: `+${score * 100} XP`
    });
    localStorage.setItem('skilltrove_activities', JSON.stringify(activities.slice(0, 5)));

    addToast('Quiz submitted successfully! Progress synced.', 'success');
    navigate(`/quiz/${subjectId}/${quizId}/results`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <QuizHeader 
            title={activeQuiz.title}
            subjectTitle={subjectId === 'adv-algorithms' ? 'Advanced Algorithms' : 'Quantitative Aptitude'}
            current={Object.keys(answers).length}
            total={quizQuestions.length}
            timeLimit={activeQuiz.timeLimit}
            onBack={() => navigate('/quiz')}
            onTimeUp={handleSubmitQuiz}
          />

          <QuizLayout
            sidebar={
              <div className="glass p-5 rounded-[2rem] border border-slate-200/50">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 pl-1">Quiz Progress Nav</h4>
                <div className="grid grid-cols-4 gap-2">
                  {quizQuestions.map((_, idx) => {
                    const isActive = idx === currentIdx;
                    const isAnswered = answers[idx] !== undefined;

                    let btnClass = 'border-slate-200 text-slate-655 bg-white';
                    if (isAnswered) btnClass = 'bg-primary/5 border-primary/20 text-primary';
                    if (isActive) btnClass = 'bg-primary border-primary text-white shadow-md';

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black border transition-all ${btnClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={handleSubmitQuiz}
                  className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all mt-6 shadow-md"
                >
                  Submit Quiz
                </button>
              </div>
            }
          >
            <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 min-h-[460px] flex flex-col justify-between">
              
              <QuestionCard
                question={question}
                selectedIdx={answers[currentIdx]}
                onSelectOption={handleSelectOption}
              />

              {/* Bottom Nav */}
              <div className="flex justify-between items-center w-full mt-8 pt-6 border-t border-slate-150">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-650 font-bold text-xs hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Prev Question
                </button>

                {currentIdx < quizQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-md"
                  >
                    Next Question <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-6 py-3.5 rounded-2xl bg-success text-white font-bold text-xs hover:bg-success/90 transition-all shadow-lg"
                  >
                    Submit Diagnostic
                  </button>
                )}
              </div>

            </div>
          </QuizLayout>

        </div>
      </div>
    </PageTransition>
  );
}
