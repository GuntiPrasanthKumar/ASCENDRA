import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockPracticeSets } from '../features/practice/mock/practiceSets';

// Reusable Practice Components
import ResultCard from '../components/practice/ResultCard';
import ScoreCard from '../components/practice/ScoreCard';
import RetryButton from '../components/practice/RetryButton';
import ContinueLearningButton from '../components/practice/ContinueLearningButton';

// Icons
import { ShieldAlert, BookOpen, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function PracticeResults() {
  const { subjectId, setId } = useParams();
  const [data, setData] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeSet = mockPracticeSets.find(s => s.id === setId);

      if (activeSet) {
        setData({ activeSet });
        const savedResult = JSON.parse(localStorage.getItem(`result_${subjectId}_${setId}`) || '{"score":0,"total":3,"timeTaken":"0m"}');
        setResult(savedResult);
      }
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [subjectId, setId]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!data || !result) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 flex items-center justify-center">
          <div className="bg-white max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/80 text-center flex flex-col items-center shadow-xs">
            <ShieldAlert className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-display font-extrabold text-black mb-2">Scorecard Logs Not Found</h2>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              We could not find the result database for the requested practice session.
            </p>
            <button onClick={() => navigate('/practice')} className="w-full py-3.5 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all">
              Return to Practice Hub
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const { activeSet } = data;
  const incorrectCount = result.total - result.score;
  const accuracyPercent = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Result card summary header */}
          <div className="mb-10">
            <ResultCard score={result.score} totalQuestions={result.total} timeTaken={result.timeTaken} />
          </div>

          {/* Results Score Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <ScoreCard 
              label="Total Questions" 
              value={result.total} 
              icon={<BookOpen className="w-5 h-5 text-black" />} 
            />
            <ScoreCard 
              label="Correct Answers" 
              value={result.score} 
              icon={<CheckCircle className="w-5 h-5 text-black" />} 
            />
            <ScoreCard 
              label="Incorrect Answers" 
              value={incorrectCount} 
              icon={<XCircle className="w-5 h-5 text-black" />} 
            />
            <ScoreCard 
              label="Focus Accuracy" 
              value={`${accuracyPercent}%`} 
              icon={<AlertTriangle className="w-5 h-5 text-black" />} 
            />
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RetryButton onClick={() => navigate(`/practice/${subjectId}/${setId}`)} />
            <ContinueLearningButton onClick={() => navigate('/learn')} />
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
