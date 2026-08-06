import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockProblems } from '../features/codelab/mock/problems';
import { mockLanguages } from '../features/codelab/mock/languages';
import { mockResults } from '../features/codelab/mock/results';
import { useToastStore } from '../components/common/Toast';

import ProblemHeader from '../components/codelab/ProblemHeader';
import ProblemDescription from '../components/codelab/ProblemDescription';
import CodeEditor from '../components/codelab/CodeEditor';
import ConsolePanel from '../components/codelab/ConsolePanel';
import OutputPanel from '../components/codelab/OutputPanel';
import TestCasePanel from '../components/codelab/TestCasePanel';
import AIReviewCard from '../components/codelab/AIReviewCard';
import SubmissionSummary from '../components/codelab/SubmissionSummary';
import Toolbar from '../components/codelab/Toolbar';

import { ShieldAlert, Sparkles, Terminal } from 'lucide-react';

export default function CodingWorkspace() {
  const { problemId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedLangId, setSelectedLangId] = useState('javascript');
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outputResult, setOutputResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [aiReview, setAiReview] = useState(null);
  const [testStatus, setTestStatus] = useState(null);

  const navigate = useNavigate();
  const { addToast } = useToastStore();

  useEffect(() => {
    const activeProblem = mockProblems.find(p => p.id === problemId);
    if (activeProblem) {
      setData({ activeProblem });
      setCode(activeProblem.starterTemplates[selectedLangId] || '');
    }
    setIsLoading(false);
  }, [problemId, selectedLangId]);

  const handleSelectLanguage = (langId) => {
    setSelectedLangId(langId);
    if (data?.activeProblem) {
      setCode(data.activeProblem.starterTemplates[langId] || '');
      setOutputResult(null);
      setSubmitResult(null);
      setAiReview(null);
      setTestStatus(null);
    }
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#131314] pt-8 pb-20 px-4 md:px-6">
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
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#131314] pt-8 pb-20 px-4 md:px-6 flex items-center justify-center">
          <div className="google-card max-w-md w-full p-8 text-center flex flex-col items-center">
            <ShieldAlert className="w-12 h-12 text-[#D93025] mb-4 animate-pulse" />
            <h2 className="text-xl font-display font-bold text-[#1F1F1F] dark:text-[#E3E3E3] mb-2">
              Coding Workspace Not Found
            </h2>
            <p className="text-xs font-medium text-[#5F6368] dark:text-[#8E918F] mb-6 leading-relaxed">
              We could not find details for the requested programming problem.
            </p>
            <button onClick={() => navigate('/codelab')} className="w-full py-3.5 rounded-full bg-[#1A73E8] text-white font-bold text-xs hover:bg-[#1557B0] transition-all">
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

      const completedCoding = JSON.parse(localStorage.getItem('completed_coding') || '[]');
      if (!completedCoding.includes(activeProblem.id)) {
        completedCoding.push(activeProblem.id);
        localStorage.setItem('completed_coding', JSON.stringify(completedCoding));
      }

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
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] pb-20 w-full transition-colors duration-300">
        <div className="w-full space-y-6">
          
          <ProblemHeader
            title={activeProblem.title}
            difficulty={activeProblem.difficulty}
            onBack={() => navigate('/codelab')}
          />

          {/* Cursor Inspired 3-Pane Studio Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Pane 1: Problem Specifications (Span 4) */}
            <div className="lg:col-span-4 google-card p-6 h-[720px] overflow-y-auto">
              <ProblemDescription
                description={activeProblem.description}
                examples={activeProblem.examples}
                constraints={activeProblem.constraints}
              />
            </div>

            {/* Pane 2: Monaco Code Editor & Integrated Execution Console (Span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="google-card p-4 flex flex-col gap-4">
                <Toolbar
                  languages={mockLanguages}
                  selectedLangId={selectedLangId}
                  onSelectLang={handleSelectLanguage}
                  onRun={handleRunCode}
                  onSubmit={handleSubmitCode}
                  onReset={handleResetCode}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                />
                <div className="rounded-[1.75rem] border border-[#E3E3E3] overflow-hidden bg-[#1E1E20] shadow-xs">
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    language={selectedLangId}
                  />
                </div>
              </div>

              <div className="google-card p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E3E3E3]">
                  <Terminal className="w-4 h-4 text-[#000000]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Execution Terminal</span>
                </div>
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

            {/* Pane 3: Cursor AI Reviewer & Assistant (Span 3) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="google-card p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E3E3E3]">
                  <Sparkles className="w-4 h-4 text-[#000000]" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F1F1F]">
                    Cursor AI Intelligence
                  </h4>
                </div>
                {aiReview ? (
                  <AIReviewCard review={aiReview} />
                ) : (
                  <p className="text-xs font-medium text-[#5F6368] dark:text-[#8E918F] leading-relaxed">
                    Submit your code solution to receive real-time Cursor AI complexity analysis, optimization suggestions, and memory footprint breakdown.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
