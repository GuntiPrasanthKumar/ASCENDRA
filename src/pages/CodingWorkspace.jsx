import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockProblems } from '../features/codelab/mock/problems';
import { mockLanguages } from '../features/codelab/mock/languages';
import { mockResults } from '../features/codelab/mock/results';
import { useToastStore } from '../components/common/Toast';

// Reusable Components
import ProblemHeader from '../components/codelab/ProblemHeader';
import ProblemDescription from '../components/codelab/ProblemDescription';
import CodeEditor from '../components/codelab/CodeEditor';
import ConsolePanel from '../components/codelab/ConsolePanel';
import OutputPanel from '../components/codelab/OutputPanel';
import TestCasePanel from '../components/codelab/TestCasePanel';
import AIReviewCard from '../components/codelab/AIReviewCard';
import Toolbar from '../components/codelab/Toolbar';

// Icons
import { ShieldAlert } from 'lucide-react';

export default function CodingWorkspace() {
  const { problemId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Workspace States
  const [selectedLangId, setSelectedLangId] = useState('javascript');
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);

  // Execution States
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outputResult, setOutputResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [aiReview, setAiReview] = useState(null);

  const navigate = useNavigate();
  const { addToast } = useToastStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeProblem = mockProblems.find(p => p.id === problemId);
      if (activeProblem) {
        setData({ activeProblem });
        // Set default code from template
        setCode(activeProblem.starterTemplates[selectedLangId] || '');
      }
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [problemId, selectedLangId]);

  // Update code when language changes
  useEffect(() => {
    if (data?.activeProblem) {
      setCode(data.activeProblem.starterTemplates[selectedLangId] || '');
      setOutputResult(null);
      setSubmitResult(null);
      setAiReview(null);
    }
  }, [selectedLangId, data]);

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
            <ShieldAlert className="w-12 h-12 text-error mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-primary mb-2">Coding Workspace Not Found</h2>
            <p className="text-xs text-textMuted mb-6 leading-relaxed">
              We could not find details for the requested programming problem.
            </p>
            <button onClick={() => navigate('/codelab')} className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all">
              Return to CodeLab Home
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const { activeProblem } = data;

  const handleRunCode = () => {
    setIsRunning(true);
    addToast('Compiling and running against test cases...', 'info');
    
    setTimeout(() => {
      setIsRunning(false);
      setOutputResult({
        status: mockResults.run.status,
        stdout: customInput 
          ? `Input received: ${customInput}\nOutput: ["o","l","l","e","h"]`
          : mockResults.run.stdout,
        time: mockResults.run.time,
        memory: mockResults.run.memory
      });
      addToast('Code execution completed successfully!', 'success');
    }, 1500);
  };

  const handleSubmitCode = () => {
    setIsSubmitting(true);
    addToast('Submitting code to edge servers...', 'info');

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitResult(mockResults.submit);
      setAiReview(mockResults.submit.aiReview);
      addToast('Solution Accepted! Dynamic AI Review generated.', 'success');
    }, 2000);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code editor to default template?')) {
      setCode(activeProblem.starterTemplates[selectedLangId] || '');
      setOutputResult(null);
      setSubmitResult(null);
      setAiReview(null);
      addToast('Editor reset completed.', 'info');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <ProblemHeader
            title={activeProblem.title}
            difficulty={activeProblem.difficulty}
            onBack={() => navigate('/codelab')}
          />

          {/* Core Split Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Column: Problem Statements description */}
            <div className="flex flex-col gap-6">
              <ProblemDescription
                description={activeProblem.description}
                examples={activeProblem.examples}
                constraints={activeProblem.constraints}
              />

              {aiReview && <AIReviewCard review={aiReview} />}
            </div>

            {/* Right Column: Code Editor workspace */}
            <div className="flex flex-col gap-6">
              
              <Toolbar
                languages={mockLanguages}
                selectedLangId={selectedLangId}
                onSelectLang={setSelectedLangId}
                onRun={handleRunCode}
                onSubmit={handleSubmitCode}
                onReset={handleResetCode}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
              />

              <CodeEditor
                value={code}
                onChange={setCode}
                language={selectedLangId}
              />

              <TestCasePanel
                examples={activeProblem.examples}
                activeCaseIdx={activeCaseIdx}
                onSelectCase={setActiveCaseIdx}
              />

              <ConsolePanel
                value={customInput}
                onChange={setCustomInput}
              />

              {(outputResult || isRunning) && (
                <OutputPanel
                  result={outputResult}
                  isRunning={isRunning}
                />
              )}

              {submitResult && !isSubmitting && (
                <div className="p-5 rounded-2xl bg-success/5 border border-success/15 text-success text-[11px] font-bold">
                  <span className="block text-[8px] uppercase tracking-widest text-success mb-1">Submission Verdict</span>
                  Solution Accepted! Passed {submitResult.passedCount} of {submitResult.totalCount} tests. Runtime: {submitResult.runtime}. Memory: {submitResult.memory}.
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
