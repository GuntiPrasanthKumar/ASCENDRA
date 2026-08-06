import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockPracticeSets } from '../features/practice/mock/practiceSets';
import { mockQuestions } from '../features/practice/mock/questions';
import { useToastStore } from '../components/common/Toast';

import PracticeHeader from '../components/practice/PracticeHeader';
import QuestionCard from '../components/practice/QuestionCard';
import QuestionNavigator from '../components/practice/QuestionNavigator';

import { ArrowLeft, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

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
          <div className="max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/80 bg-white text-center flex flex-col items-center">
            <ShieldAlert className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-display font-extrabold text-black mb-2">Assessment Not Found</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We could not find questions for the requested assessment set.
            </p>
            <button onClick={() => navigate('/practice')} className="w-full py-4 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all">
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
    addToast('Response saved.', 'info');
  };

  const handleSubmitSet = () => {
    const answeredCount = Object.keys(submittedAnswers).length;
    if (answeredCount < setQuestions.length) {
      addToast('Please confirm all question choices before submitting.', 'warning');
      return;
    }

    let correctCount = 0;
    setQuestions.forEach((q, idx) => {
      if (submittedAnswers[idx] === q.correctIdx) correctCount++;
    });

    localStorage.setItem(`result_${subjectId}_${setId}`, JSON.stringify({
      score: correctCount,
      total: setQuestions.length,
      timeTaken: '2m 15s'
    }));

    addToast('Assessment completed cleanly.', 'success');
    navigate(`/practice/${subjectId}/${setId}/results`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-slate-800 dark:text-slate-100 pb-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <PracticeHeader 
            title={activeSet.title}
            subjectTitle={subjectId === 'aptitude' ? 'Quantitative Aptitude' : 'Logical Reasoning'}
            answeredCount={Object.keys(submittedAnswers).length}
            totalCount={setQuestions.length}
            timeLimit={activeSet.timeLimit}
            onBack={() => navigate('/practice')}
            onTimeUp={handleSubmitSet}
          />

          {/* Google Forms Secure Mode Assessment Canvas */}
          <div className="p-8 md:p-12 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col gap-8">
            <QuestionCard
              question={question}
              selectedIdx={answers[currentIdx]}
              correctIdx={question.correctIdx}
              showResults={isQuestionSubmitted}
              onSelectOption={handleSelectOption}
            />

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              {!isQuestionSubmitted ? (
                <button
                  onClick={handleVerifyAnswer}
                  className="px-6 py-3.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-xs hover:opacity-90 transition-all shadow-xs"
                >
                  Save Response
                </button>
              ) : currentIdx < setQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-xs hover:opacity-90 transition-all shadow-xs"
                >
                  Next Question <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitSet}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" /> Submit Assessment
                </button>
              )}
            </div>
          </div>

          {/* Minimalist Question Navigator Footer */}
          <div className="p-4 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
            <QuestionNavigator
              totalCount={setQuestions.length}
              currentIdx={currentIdx}
              answers={submittedAnswers}
              onSelect={setCurrentIdx}
              onSubmit={handleSubmitSet}
            />
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
