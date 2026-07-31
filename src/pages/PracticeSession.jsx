import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockPracticeSets } from '../features/practice/mock/practiceSets';
import { mockQuestions } from '../features/practice/mock/questions';
import { useToastStore } from '../components/common/Toast';

// Reusable Practice Components
import PracticeLayout from '../components/practice/PracticeLayout';
import PracticeHeader from '../components/practice/PracticeHeader';
import QuestionCard from '../components/practice/QuestionCard';
import HintPanel from '../components/practice/HintPanel';
import ExplanationPanel from '../components/practice/ExplanationPanel';
import FeedbackPanel from '../components/practice/FeedbackPanel';
import QuestionNavigator from '../components/practice/QuestionNavigator';

// Icons
import { ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';

export default function PracticeSession() {
  const { subjectId, setId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});

  const navigate = useNavigate();
  const { addToast } = useToastStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeSet = mockPracticeSets.find(s => s.id === setId);
      const setQuestions = mockQuestions[setId] || [];

      if (activeSet && setQuestions.length > 0) {
        setData({ activeSet, setQuestions });
      }
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [setId]);

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
            <h2 className="text-xl font-bold text-primary mb-2">Practice Session Not Found</h2>
            <p className="text-xs text-textMuted mb-6 leading-relaxed">
              We could not find the requested practice set questions.
            </p>
            <button onClick={() => navigate('/practice')} className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all">
              Return to Hub
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const { activeSet, setQuestions } = data;
  const question = setQuestions[currentIdx];
  const isQuestionSubmitted = submittedAnswers[currentIdx] !== undefined;

  const handleSelectOption = (idx) => {
    if (isQuestionSubmitted) return;
    setAnswers(prev => ({ ...prev, [currentIdx]: idx }));
  };

  const handleVerifyAnswer = () => {
    if (answers[currentIdx] === undefined) {
      addToast('Please select an option first.', 'warning');
      return;
    }
    setSubmittedAnswers(prev => ({ ...prev, [currentIdx]: answers[currentIdx] }));
    addToast('Answer choice recorded!', 'info');
  };

  const handleRetry = () => {
    setAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentIdx];
      return copy;
    });
    setSubmittedAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentIdx];
      return copy;
    });
  };

  const handleSubmitSet = () => {
    const answeredCount = Object.keys(submittedAnswers).length;
    if (answeredCount < setQuestions.length) {
      addToast('Please verify all questions before submitting.', 'warning');
      return;
    }

    // Calculate score
    let correctCount = 0;
    setQuestions.forEach((q, idx) => {
      if (submittedAnswers[idx] === q.correctIdx) correctCount++;
    });

    // Save results locally
    localStorage.setItem(`result_${subjectId}_${setId}`, JSON.stringify({
      score: correctCount,
      total: setQuestions.length,
      timeTaken: '2m 15s'
    }));

    // Progress System Sync:
    const completedSets = JSON.parse(localStorage.getItem('completed_practice') || '[]');
    if (!completedSets.includes(setId)) {
      completedSets.push(setId);
      localStorage.setItem('completed_practice', JSON.stringify(completedSets));
    }

    // Increment streak
    const currentStreak = parseInt(localStorage.getItem('skilltrove_streak') || '7');
    localStorage.setItem('skilltrove_streak', currentStreak + 1);

    // Mark today's goals completed
    const savedGoals = JSON.parse(localStorage.getItem('skilltrove_today_goals') || '[]');
    if (savedGoals.length > 0) {
      const updatedGoals = savedGoals.map(g => g.id === 'goal-2' ? { ...g, done: true } : g);
      localStorage.setItem('skilltrove_today_goals', JSON.stringify(updatedGoals));
    }

    // Log recent activity
    const activities = JSON.parse(localStorage.getItem('skilltrove_activities') || '[]');
    activities.unshift({
      title: `Practice Completed: ${activeSet.title} (${correctCount}/${setQuestions.length})`,
      time: 'Just now',
      xp: `+${correctCount * 50} XP`
    });
    localStorage.setItem('skilltrove_activities', JSON.stringify(activities.slice(0, 5)));

    addToast('Practice set assessment complete!', 'success');
    navigate(`/practice/${subjectId}/${setId}/results`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <PracticeHeader 
            title={activeSet.title}
            subjectTitle={subjectId === 'aptitude' ? 'Quantitative Aptitude' : 'Logical Reasoning'}
            answeredCount={Object.keys(submittedAnswers).length}
            totalCount={setQuestions.length}
            timeLimit={activeSet.timeLimit}
            onBack={() => navigate('/practice')}
            onTimeUp={handleSubmitSet}
          />

          <PracticeLayout
            sidebar={
              <>
                <HintPanel hints={question.aiHints} questionId={question.id} />
                
                {isQuestionSubmitted && (
                  <ExplanationPanel explanation={question.explanation} />
                )}

                <div className="glass p-5 rounded-[2rem] border border-slate-200/50">
                  <QuestionNavigator
                    totalCount={setQuestions.length}
                    currentIdx={currentIdx}
                    answers={submittedAnswers}
                    onSelect={setCurrentIdx}
                    onSubmit={handleSubmitSet}
                  />
                </div>
              </>
            }
          >
            <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 min-h-[460px] flex flex-col justify-between">
              
              <QuestionCard
                question={question}
                selectedIdx={answers[currentIdx]}
                correctIdx={question.correctIdx}
                showResults={isQuestionSubmitted}
                onSelectOption={handleSelectOption}
              />

              {/* Bottom Nav indicators */}
              <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-slate-150">
                {isQuestionSubmitted && (
                  <FeedbackPanel
                    isCorrect={submittedAnswers[currentIdx] === question.correctIdx}
                    onRetry={handleRetry}
                  />
                )}

                <div className="flex justify-between items-center w-full">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(prev => prev - 1)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-650 font-bold text-xs hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> Prev
                  </button>

                  {!isQuestionSubmitted ? (
                    <button
                      onClick={handleVerifyAnswer}
                      className="px-6 py-3.5 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all shadow-lg shadow-primary/15"
                    >
                      Verify Answer
                    </button>
                  ) : (
                    currentIdx < setQuestions.length - 1 ? (
                      <button
                        onClick={() => setCurrentIdx(prev => prev + 1)}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-md"
                      >
                        Next <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitSet}
                        className="px-6 py-3.5 rounded-2xl bg-success text-white font-bold text-xs hover:bg-success/90 transition-all shadow-lg"
                      >
                        Submit Practice Set
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </PracticeLayout>

        </div>
      </div>
    </PageTransition>
  );
}
