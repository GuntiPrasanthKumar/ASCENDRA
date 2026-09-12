import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, X, Zap } from 'lucide-react';
import api from '../../utils/api';
import { useToastStore } from '../common/Toast';

const DOMAINS = [
  { id: 'Java', name: 'Java & Object Oriented Systems', icon: '☕' },
  { id: 'Python', name: 'Python & Data Engineering', icon: '🐍' },
  { id: 'DSA', name: 'Data Structures & Algorithms', icon: '⚡' },
  { id: 'System Design', name: 'Distributed System Design', icon: '🌐' },
  { id: 'DevOps', name: 'Cloud Native & DevOps Architecture', icon: '☁️' },
  { id: 'ML/GenAI', name: 'Machine Learning & Generative AI', icon: '🧠' },
  { id: 'Aptitude', name: 'Quantitative & Logical Reasoning', icon: '📊' }
];

export default function DiagnosticModal({ isOpen, onClose, onComplete }) {
  const [selectedDomain, setSelectedDomain] = useState('Java');
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);

  const { addToast } = useToastStore();

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/learning/diagnostic/start', { domain: selectedDomain, totalQuestions: 5 });
      const data = res.data?.data;
      setSession(data);
      setCurrentQuestion(data.question);
      setSelectedOption(null);
      addToast(`Diagnostic Assessment Launched for ${selectedDomain}`, 'info');
    } catch (err) {
      addToast(`Failed to start diagnostic: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || isLoading) return;
    setIsLoading(true);

    try {
      const res = await api.post('/learning/diagnostic/answer', {
        assessmentId: session.assessmentId,
        questionIndex: currentQuestion.index - 1,
        answerIndex: selectedOption,
        timeSpentSeconds: 15
      });

      const data = res.data?.data;

      if (data.isCompleted) {
        setReport(data.resultSummary);
        addToast(`Diagnostic Completed! Assigned Skill Level: ${data.resultSummary.assignedSkillLevel}`, 'success');
        if (onComplete) onComplete(data.resultSummary);
      } else {
        setCurrentQuestion(data.nextQuestion);
        setSelectedOption(null);
        if (data.lastAnswerResult?.isCorrect) {
          addToast('Correct! Difficulty auto-escalated.', 'success');
        } else {
          addToast('Incorrect. Adjusting difficulty...', 'warning');
        }
      }
    } catch (err) {
      addToast(`Submission error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-body">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display flex items-center gap-2">
                  AI Diagnostic Placement Engine
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">ADAPTIVE</span>
                </h3>
                <p className="text-xs text-slate-400">Classifying candidate skill level &amp; weak subtopics</p>
              </div>
            </div>

            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {!session && !report && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Select Target Engineering Domain</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {DOMAINS.map(d => (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDomain(d.id)}
                        className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                          selectedDomain === d.id
                            ? 'bg-black text-white border-black shadow-md'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-2xl">{d.icon}</span>
                        <div>
                          <p className="text-xs font-bold font-display">{d.name}</p>
                          <span className="text-[10px] opacity-80">5 Adaptive Questions</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Our AI Gateway will dynamically generate questions and auto-scale difficulty based on your answers to calculate your placement score (Beginner / Intermediate / Advanced).
                  </p>
                </div>

                <button
                  onClick={handleStart}
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-black text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isLoading ? <Zap className="w-4 h-4 animate-spin text-indigo-400" /> : <Compass className="w-4 h-4 text-indigo-400" />}
                  Launch Diagnostic Test →
                </button>
              </div>
            )}

            {session && !report && currentQuestion && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <span>Question {currentQuestion.index} of {session.totalQuestions}</span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-indigo-600">
                    Difficulty: {currentQuestion.difficulty} ({currentQuestion.bloomsLevel})
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 leading-relaxed">{currentQuestion.text}</h4>
                </div>

                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                        selectedOption === idx
                          ? 'bg-black text-white border-black shadow-md'
                          : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt}</span>
                      {selectedOption === idx && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null || isLoading}
                  className="w-full py-4 rounded-2xl bg-black text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isLoading ? <Zap className="w-4 h-4 animate-spin text-indigo-400" /> : <ArrowRight className="w-4 h-4" />}
                  Submit &amp; Next Question
                </button>
              </div>
            )}

            {report && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Diagnostic Result</span>
                  <h3 className="text-xl font-bold font-display text-slate-900 mt-1">{report.domain} Placement Score</h3>
                  <div className="inline-block mt-3 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-black">
                    ASSIGNED LEVEL: {report.assignedSkillLevel.toUpperCase()} ({report.accuracyPercentage}% ACCURACY)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Strong Areas</span>
                    <ul className="text-xs font-semibold text-slate-800 mt-1 space-y-1">
                      {report.identifiedStrongTopics?.length > 0 ? (
                        report.identifiedStrongTopics.map((t, i) => <li key={i}>• {t}</li>)
                      ) : (
                        <li className="text-slate-400 font-normal">None identified</li>
                      )}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-800 uppercase">Weak Subtopics</span>
                    <ul className="text-xs font-semibold text-amber-900 mt-1 space-y-1">
                      {report.identifiedWeakTopics?.length > 0 ? (
                        report.identifiedWeakTopics.map((t, i) => <li key={i}>• {t}</li>)
                      ) : (
                        <li className="text-emerald-700 font-normal">No weak areas!</li>
                      )}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl bg-black text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-lg"
                >
                  Continue to Personal Roadmap →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
