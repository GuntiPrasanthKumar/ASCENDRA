import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import {
  ShieldAlert, Maximize, Clock, CheckCircle, AlertTriangle, ChevronRight,
  Code, BookOpen, Binary, Database, Cpu, Network, FlaskConical, X, Play, Loader2
} from 'lucide-react';
import { useProctor } from '../hooks/useProctor';
import { useFullscreen } from '../hooks/useFullscreen';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useAssessmentEngine } from '../hooks/useAssessmentEngine';
import WebcamView from '../components/auth/WebcamView';
import { useToastStore } from '../components/common/Toast';
import api from '../utils/api';

// Subject icons
const subjectIcons = {
  'DSA': <Binary className="w-4 h-4" />,
  'Operating Systems': <Cpu className="w-4 h-4" />,
  'DBMS': <Database className="w-4 h-4" />,
  'Networks': <Network className="w-4 h-4" />,
};

// Difficulty colors
const difficultyColors = {
  'Easy': 'bg-success/10 text-success',
  'Medium': 'bg-warning/10 text-warning',
  'Hard': 'bg-error/10 text-error',
};

// ─────────────────────────────────────────────
// Quiz Component
// ─────────────────────────────────────────────
export default function Quiz() {
  const [setupComplete, setSetupComplete] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('DSA');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [codeValue, setCodeValue] = useState('');
  const [answerResult, setAnswerResult] = useState(null); 
  const [strikes, setStrikes] = useState(0);

  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen();
  const [videoRef, setVideoRef] = useState(null);
  const { isDetecting, faceData, startDetection, stopDetection } = useFaceDetection(videoRef);
  
  const { 
    questions, currentQ, setCurrentQ, userAnswers, timeLeft, isFinished, isGenerating, 
    score, evaluation, generateAssessment, handleAnswer: engineHandleAnswer, finishAssessment 
  } = useAssessmentEngine({ subject: selectedSubject, topic: selectedTopic });

  const handleStart = async () => {
    if (faceData.detected && !faceData.multiple) {
      const success = await generateAssessment(selectedSubject, selectedTopic);
      if (success) {
        await enterFullscreen();
        setSetupComplete(true);
      }
    } else {
      addToast('Face verification required to start assessment.', 'error');
    }
  };

  const handleFinish = async () => {
    stopDetection();
    await finishAssessment(strikes);
    exitFullscreen();
    if (score > (questions.length * 0.7)) { 
      confetti({ particleCount: 180, spread: 90, origin: { y: 0.6 }, colors: ['#6C63FF', '#10B981', '#FF6584'] });
    }
  };

  const handleStrike = useCallback((count) => {
    setStrikes(count);
    if (count >= 3) {
      addToast('Maximum strikes reached. Auto-submitting.', 'error');
      handleFinish();
    }
  }, [strikes]); // eslint-disable-line

  useProctor(setupComplete && !isFinished, handleStrike);

  // Auto-strike on fullscreen exit
  useEffect(() => {
    if (setupComplete && !isFinished && !isFullscreen) {
      handleStrike(strikes + 1);
    }
  }, [isFullscreen, setupComplete, isFinished]); // eslint-disable-line

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (isCorrect, optionIdx = null) => {
    setSelectedOption(optionIdx);
    setAnswerResult(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore(s => s + 50);
      addToast('✓ Correct! +50 pts', 'success');
    } else {
      setScore(s => Math.max(0, s - 10));
      addToast('✗ Wrong! -10 pts', 'error');
    }

    setShowExplanation(true);

    setTimeout(() => {
      setShowExplanation(false);
      setSelectedOption(null);
      setAnswerResult(null);
      setTextAnswer('');

      if (currentQ < questions.length - 1) {
        const nextQ = questions[currentQ + 1];
        setCurrentQ(q => q + 1);
        if (nextQ?.type === 'code') setCodeValue(nextQ.initialCode);
      } else {
        handleFinish();
      }
    }, 3000);
  };

  // ──────── SETUP SCREEN ────────
  if (!setupComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-3xl max-w-2xl w-full"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-warning" />
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-primary">Assessment Setup</h2>
              <p className="text-textMuted">Configure and verify before starting.</p>
            </div>
          </div>

          {/* Topic & Subject Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-widest">Target Subject</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-white/50 border border-muted rounded-xl py-3 px-4 focus:outline-none focus:border-accent"
              >
                {['DSA', 'DBMS', 'Operating Systems', 'Networks', 'Software Engineering'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-widest">Specific Topic</label>
              <input 
                type="text"
                placeholder="e.g. React Hooks, Normalization, TCP/IP"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-white/50 border border-muted rounded-xl py-3 px-4 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { icon: <Maximize className="w-5 h-5 text-accent" />, title: 'Fullscreen Required', desc: 'Exiting fullscreen triggers a strike.' },
              { icon: <ShieldAlert className="w-5 h-5 text-accent" />, title: 'Face Tracking Active', desc: '3 strikes = auto-submit.' },
              { icon: <Code className="w-5 h-5 text-accent" />, title: 'Monaco Code Editor', desc: 'Write & submit real code challenges.' },
              { icon: <Clock className="w-5 h-5 text-accent" />, title: '30 Minute Timer', desc: 'All questions must be answered in time.' },
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/50 p-4 rounded-xl border border-muted">
                {rule.icon}
                <div>
                  <h4 className="font-bold text-primary text-sm">{rule.title}</h4>
                  <p className="text-xs text-textMuted mt-1">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Webcam Verification */}
          <div className="flex justify-center mb-6">
            <div className="scale-75 origin-top">
              <WebcamView
                onVideoReady={setVideoRef}
                isScanning={isDetecting}
                faceStatus={faceData}
              />
            </div>
          </div>

          {!isDetecting && (
            <button
              onClick={startDetection}
              className="w-full bg-accent text-white py-4 rounded-xl font-medium hover:bg-primary transition-all mb-4"
            >
              Verify Identity
            </button>
          )}

            <button
              onClick={handleStart}
              disabled={isGenerating || !faceData.detected || faceData.multiple || !selectedTopic}
              className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                !isGenerating && faceData.detected && !faceData.multiple && selectedTopic
                  ? 'bg-success text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30'
                  : 'bg-muted text-textMuted cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Paper...
                </>
              ) : !selectedTopic ? 'Enter a topic' : 'Start Assessment'}
            </button>
        </motion.div>
      </div>
    );
  }

  // ──────── RESULTS SCREEN ────────
  if (isFinished) {
    const pct = Math.round((score / (questions.length * 50)) * 100);
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-10 rounded-3xl max-w-lg w-full text-center"
        >
          <div className="w-24 h-24 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h2 className="text-4xl font-display font-bold text-primary mb-2">Assessment Complete</h2>
          <p className="text-textMuted mb-8">Your results have been securely recorded.</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/50 border border-muted rounded-2xl p-4">
              <div className="text-xs text-textMuted uppercase tracking-widest mb-1">Score</div>
              <div className="text-3xl font-display font-bold text-accent">{score}</div>
            </div>
            <div className="bg-white/50 border border-muted rounded-2xl p-4">
              <div className="text-xs text-textMuted uppercase tracking-widest mb-1">Accuracy</div>
              <div className="text-3xl font-display font-bold text-success">{pct}%</div>
            </div>
            <div className="bg-white/50 border border-muted rounded-2xl p-4">
              <div className="text-xs text-textMuted uppercase tracking-widest mb-1">Strikes</div>
              <div className="text-3xl font-display font-bold text-error">{strikes}</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsFinished(false); setSetupComplete(false); setScore(0);
                setCurrentQ(0); setStrikes(0); setTimeLeft(1800);
              }}
              className="flex-1 py-3 rounded-xl border border-muted bg-white/50 text-primary font-medium hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Retry
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-accent transition-all"
            >
              Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentQ];

  // ──────── QUIZ SCREEN ────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Proctoring Bar */}
      <div className="bg-primary text-white px-6 py-3 flex items-center justify-between shadow-lg relative z-50">
        <div className="flex items-center gap-4">
          <div className="font-display font-bold tracking-wide">SkillTrove Secure</div>
          <div className="w-px h-6 bg-white/20" />
          <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${strikes > 0 ? 'bg-error/20 text-error' : 'bg-success/20 text-success'}`}>
            <AlertTriangle className="w-4 h-4" />
            Strikes: {strikes}/3
          </div>
          {question && (
            <span className="text-xs text-white/50 px-2 py-1 rounded-md bg-white/10">
              {question.subject}
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="text-white/70 text-sm">Q {currentQ + 1}/{questions.length}</div>
          <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 60 ? 'text-error animate-pulse' : 'text-accent2'}`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Webcam PIP */}
        <div className="absolute bottom-6 left-6 w-48 h-36 bg-black rounded-xl border-2 border-primary/20 overflow-hidden shadow-2xl z-40">
          {videoRef && (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          )}
          {(!faceData.detected || faceData.multiple) && (
            <div className="absolute inset-0 bg-error/30 flex items-center justify-center">
              <span className="bg-error text-white text-xs px-2 py-1 rounded font-bold uppercase animate-pulse">Face Alert</span>
            </div>
          )}
        </div>

        {/* Main */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-muted rounded-full mb-8 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-accent2"
                initial={{ width: `${(currentQ / questions.length) * 100}%` }}
                animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="glass p-8 rounded-3xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${difficultyColors[question?.difficulty] || 'bg-accent/10 text-accent'}`}>
                      {question?.bloomsLevel || 'Remember'}
                    </span>
                    {subjectIcons[question?.subject] && (
                      <span className="flex items-center gap-1 text-textMuted text-xs font-medium">
                        {subjectIcons[question?.subject]} {question?.subject}
                      </span>
                    )}
                  </div>
                  <span className="text-accent font-bold font-mono">Score: {score}</span>
                </div>

                <h2 className="text-2xl font-display font-bold text-primary mb-8 leading-relaxed">
                  {question?.text || question?.question}
                </h2>

                {(question?.type === 'mcq' || question?.type === 'multiple_choice') && (
                  <div className="space-y-4">
                    {question.options.map((opt, idx) => {
                      let optClass = 'border-muted bg-white/50 hover:border-accent hover:bg-accent/5';
                      if (showExplanation && selectedOption !== null) {
                        if (idx === question.correctOptionIndex || idx === question.correct) optClass = 'border-success bg-success/10 text-success';
                        else if (idx === selectedOption && idx !== question.correctOptionIndex && idx !== question.correct) optClass = 'border-error bg-error/10 text-error';
                      }
                      return (
                        <button
                          key={idx}
                          disabled={showExplanation}
                          onClick={() => handleAnswer((idx === question.correctOptionIndex || idx === question.correct), idx)}
                          className={`w-full text-left p-5 rounded-xl border-2 transition-all text-base font-medium flex items-center justify-between ${optClass}`}
                        >
                          <span>{opt}</span>
                          <div className="w-6 h-6 rounded-full border-2 border-current opacity-40 flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {question?.type === 'fill_in_the_blanks' && (
                  <div className="space-y-6">
                    <div className="relative group">
                      <input 
                        type="text"
                        placeholder="Type your answer here..."
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        disabled={showExplanation}
                        className="w-full bg-white/50 border-2 border-muted rounded-2xl py-5 px-6 focus:outline-none focus:border-accent transition-all text-lg font-medium"
                      />
                    </div>
                    <button 
                      onClick={() => handleAnswer(textAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim())}
                      disabled={!textAnswer.trim() || showExplanation}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-accent transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      Submit Answer
                    </button>
                  </div>
                )}

                {question?.type === 'short_answer' && (
                  <div className="space-y-6">
                    <div className="relative group">
                      <textarea 
                        rows={3}
                        placeholder="Enter your explanation (Max 2 lines)..."
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        disabled={showExplanation}
                        className="w-full bg-white/50 border-2 border-muted rounded-2xl py-5 px-6 focus:outline-none focus:border-accent transition-all text-base font-medium resize-none"
                      />
                    </div>
                    <button 
                      onClick={() => handleAnswer(textAnswer.length > 20)} // Mock validation for short answer
                      disabled={!textAnswer.trim() || showExplanation}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-accent transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      Submit Evaluation
                    </button>
                  </div>
                )}

                {question?.type === 'code' && (
                  <div className="border border-muted rounded-xl overflow-hidden">
                    <div className="bg-primary/5 px-4 py-2 flex items-center gap-2 border-b border-muted">
                      <Code className="w-4 h-4 text-accent" />
                      <span className="text-xs font-mono font-medium text-textMuted">JavaScript</span>
                    </div>
                    <div className="h-[360px]">
                      <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        theme="light"
                        value={codeValue}
                        onChange={(val) => setCodeValue(val)}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          fontFamily: 'JetBrains Mono, monospace',
                          contextmenu: false,
                          scrollBeyondLastLine: false,
                        }}
                      />
                    </div>
                    <div className="p-4 bg-white border-t border-muted flex justify-end gap-3">
                      <button
                        onClick={() => handleAnswer(false)}
                        disabled={showExplanation}
                        className="px-4 py-2 rounded-lg border border-muted text-textMuted hover:text-primary transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <X className="w-4 h-4" /> Skip
                      </button>
                      <button
                        onClick={() => handleAnswer(true)}
                        disabled={showExplanation}
                        className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-primary transition-colors flex items-center gap-2 text-sm"
                      >
                        Submit Code <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`border rounded-xl p-6 ${answerResult === 'correct' ? 'bg-success/5 border-success/20' : 'bg-error/5 border-error/20'}`}>
                        <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                          {answerResult === 'correct' ? '✓ Correct!' : '✗ Incorrect'} — Explanation
                        </h4>
                        <p className="text-textMuted">{question?.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
