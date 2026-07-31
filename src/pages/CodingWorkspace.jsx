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
import SubmissionSummary from '../components/codelab/SubmissionSummary';
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
  const [testStatus, setTestStatus] = useState(null);

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
      setTestStatus(null);
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
    addToast('Compiling and running code simulator against public test cases...', 'info');
    
    setTimeout(() => {
      setIsRunning(false);
      setTestStatus({ 0: true, 1: true });
      setOutputResult({
        status: mockResults.run.status,
        stdout: customInput 
          ? `Custom Input: ${customInput}\nOutput: ${activeProblem.examples[0]?.output || 'Success'}`
          : mockResults.run.stdout,
        time: mockResults.run.time,
        memory: mockResults.run.memory
      });
      addToast('Code execution completed successfully!', 'success');
    }, 1200);
  };

  const handleSubmitCode = () => {
    setIsSubmitting(true);
    addToast('Submitting solution to automated test suite...', 'info');

    setTimeout(() => {
      setIsSubmitting(false);
      setTestStatus({ 0: true, 1: true });
      setSubmitResult(mockResults.submit);
      setAiReview(mockResults.submit.aiReview);

      // Progress Sync: Store completed coding problem in local storage
      const completedCoding = JSON.parse(localStorage.getItem('completed_coding') || '[]');
      if (!completedCoding.includes(activeProblem.id)) {
        completedCoding.push(activeProblem.id);
        localStorage.setItem('completed_coding', JSON.stringify(completedCoding));
      }

      // Log activity
      const activities = JSON.parse(localStorage.getItem('skilltrove_activities') || '[]');
      activities.unshift({
        title: `CodeLab Accepted: ${activeProblem.title}`,
        time: 'Just now',
        xp: '+150 XP'
      });
      localStorage.setItem('skilltrove_activities', JSON.stringify(activities.slice(0, 5)));

      addToast('Solution Accepted! Passed all test cases. AI Review generated.', 'success');
    }, 1500);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code editor to default template?')) {
      setCode(activeProblem.starterTemplates[selectedLangId] || '');
      setOutputResult(null);
      setSubmitResult(null);
      setAiReview(null);
      setTestStatus(null);
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
            
            {/* Left Column: Problem Statements description & AI Review */}
            <div className="flex flex-col gap-6">
              <ProblemDescription
                description={activeProblem.description}
                examples={activeProblem.examples}
                constraints={activeProblem.constraints}
              />

              {aiReview && <AIReviewCard review={aiReview} />}
            </div>

            {/* Right Column: Code Editor workspace & Console panels */}
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
                testStatus={testStatus}
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
                <SubmissionSummary result={submitResult} />
              )}

            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
