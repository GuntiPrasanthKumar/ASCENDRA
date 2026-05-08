import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { ShieldAlert, Maximize, Clock, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { useProctor } from '../hooks/useProctor';
import { useFullscreen } from '../hooks/useFullscreen';
import { useFaceDetection } from '../hooks/useFaceDetection';
import WebcamView from '../components/auth/WebcamView';
import { useToastStore } from '../components/common/Toast';

const sampleQuestions = [
  {
    id: 1,
    type: 'mcq',
    difficulty: 'Easy',
    question: 'What is the time complexity of binary search?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
    correct: 2,
    explanation: 'Binary search halves the search space at each step, resulting in logarithmic time complexity.'
  },
  {
    id: 2,
    type: 'code',
    difficulty: 'Medium',
    question: 'Write a function to reverse a string in JavaScript.',
    initialCode: 'function reverseString(str) {\n  // your code here\n}',
    explanation: 'You can split the string into an array, reverse the array, and join it back to a string.'
  }
];

export default function Quiz() {
  const [setupComplete, setSetupComplete] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [codeValue, setCodeValue] = useState('');
  
  const [strikes, setStrikes] = useState(0);
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen();
  const [videoRef, setVideoRef] = useState(null);
  const { isDetecting, faceData, startDetection, stopDetection } = useFaceDetection(videoRef);

  // Proctoring logic
  const handleStrike = useCallback((count, reason) => {
    setStrikes(count);
    if (count >= 3) {
      addToast('Maximum strikes reached. Assessment auto-submitted.', 'error');
      handleFinish();
    }
  }, []);

  useProctor(setupComplete && !isFinished, handleStrike);

  // Auto-fail if leaving fullscreen
  useEffect(() => {
    if (setupComplete && !isFinished && !isFullscreen) {
      handleStrike(strikes + 1, 'Exited fullscreen mode');
    }
  }, [isFullscreen, setupComplete, isFinished]);

  // Timer
  useEffect(() => {
    if (setupComplete && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished) {
      handleFinish();
    }
  }, [setupComplete, isFinished, timeLeft]);

  // Format time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    if (faceData.detected && !faceData.multiple) {
      await enterFullscreen();
      setSetupComplete(true);
      if (sampleQuestions[0].type === 'code') setCodeValue(sampleQuestions[0].initialCode);
    } else {
      addToast('Face verification failed. Please try again.', 'error');
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
    exitFullscreen();
    stopDetection();
    if (score > 50) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(s => s + 50);
      addToast('+50 Points', 'success');
    } else {
      setScore(s => Math.max(0, s - 10));
      addToast('-10 Points', 'error');
    }
    
    setShowExplanation(true);
    
    setTimeout(() => {
      setShowExplanation(false);
      if (currentQ < sampleQuestions.length - 1) {
        setCurrentQ(q => q + 1);
        if (sampleQuestions[currentQ + 1].type === 'code') {
          setCodeValue(sampleQuestions[currentQ + 1].initialCode);
        }
      } else {
        handleFinish();
      }
    }, 3000);
  };

  if (!setupComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pt-24">
        <div className="glass p-8 rounded-3xl max-w-lg w-full text-center">
          <ShieldAlert className="w-16 h-16 text-warning mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold text-primary mb-4">Assessment Setup</h2>
          
          <div className="space-y-4 text-left mb-8">
            <div className="flex items-start gap-3 bg-white/50 p-4 rounded-xl border border-muted">
              <Maximize className="w-6 h-6 text-accent shrink-0" />
              <div>
                <h4 className="font-bold text-primary text-sm">Fullscreen Required</h4>
                <p className="text-xs text-textMuted mt-1">Assessment runs in fullscreen. Exiting will result in a strike.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 bg-white/50 p-4 rounded-xl border border-muted">
              <ShieldAlert className="w-6 h-6 text-accent shrink-0" />
              <div>
                <h4 className="font-bold text-primary text-sm">Strict Proctoring</h4>
                <p className="text-xs text-textMuted mt-1">Face tracking, tab-switching, and clipboard are strictly monitored.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="scale-75 origin-top">
              <WebcamView 
                onVideoReady={setVideoRef} 
                isScanning={true} 
                faceStatus={faceData} 
              />
            </div>
          </div>

          {!isDetecting && (
            <button 
              onClick={startDetection}
              className="w-full bg-accent text-white py-4 rounded-xl font-medium hover:bg-primary transition-all mb-4"
            >
              Verify System & Identity
            </button>
          )}

          {isDetecting && (
            <button 
              onClick={handleStart}
              disabled={!faceData.detected || faceData.multiple}
              className={`w-full py-4 rounded-xl font-medium transition-all ${
                faceData.detected && !faceData.multiple 
                  ? 'bg-success text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30' 
                  : 'bg-muted text-textMuted cursor-not-allowed'
              }`}
            >
              Start Assessment
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isFinished) {
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
          
          <div className="bg-white/50 border border-muted rounded-2xl p-6 mb-8">
            <div className="text-sm text-textMuted font-medium uppercase tracking-widest mb-1">Total Score</div>
            <div className="text-5xl font-display font-bold text-accent">{score}</div>
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-primary text-white py-4 rounded-xl font-medium hover:bg-accent transition-all"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const question = sampleQuestions[currentQ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Proctoring Bar */}
      <div className="bg-primary text-white px-6 py-3 flex items-center justify-between shadow-lg relative z-50">
        <div className="flex items-center gap-4">
          <div className="font-display font-bold tracking-wide">SkillTrove Secure</div>
          <div className="w-px h-6 bg-white/20"></div>
          <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${strikes > 0 ? 'bg-error/20 text-error' : 'bg-success/20 text-success'}`}>
            <AlertTriangle className="w-4 h-4" />
            Strikes: {strikes}/3
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-white/70 text-sm">Question {currentQ + 1} of {sampleQuestions.length}</div>
          <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 60 ? 'text-error animate-pulse' : 'text-accent2'}`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Webcam pip */}
        <div className="absolute bottom-6 left-6 w-48 h-36 bg-black rounded-xl border-2 border-primary/20 overflow-hidden shadow-2xl z-40">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            className="w-full h-full object-cover transform -scale-x-100" 
          />
          {(!faceData.detected || faceData.multiple) && (
            <div className="absolute inset-0 bg-error/30 flex items-center justify-center">
              <span className="bg-error text-white text-xs px-2 py-1 rounded font-bold uppercase animate-pulse">Face Not Found</span>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-muted rounded-full mb-8 overflow-hidden">
              <motion.div 
                className="h-full bg-accent"
                initial={{ width: `${(currentQ / sampleQuestions.length) * 100}%` }}
                animate={{ width: `${((currentQ + 1) / sampleQuestions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="glass p-8 rounded-3xl relative">
              <div className="flex justify-between items-start mb-6">
                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                  question.difficulty === 'Easy' ? 'bg-success/10 text-success' :
                  question.difficulty === 'Medium' ? 'bg-warning/10 text-warning' :
                  'bg-error/10 text-error'
                }`}>
                  {question.difficulty}
                </span>
                <span className="text-accent font-bold">Score: {score}</span>
              </div>

              <h2 className="text-2xl font-display font-bold text-primary mb-8 leading-relaxed">
                {question.question}
              </h2>

              {question.type === 'mcq' && (
                <div className="space-y-4">
                  {question.options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={showExplanation}
                      onClick={() => handleAnswer(idx === question.correct)}
                      className="w-full text-left p-5 rounded-xl border-2 border-muted bg-white/50 hover:border-accent hover:bg-accent/5 transition-all text-lg font-medium group flex items-center justify-between"
                    >
                      <span>{opt}</span>
                      <div className="w-6 h-6 rounded-full border-2 border-muted group-hover:border-accent flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform"></div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {question.type === 'code' && (
                <div className="border border-muted rounded-xl overflow-hidden h-[400px]">
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    theme="light"
                    value={codeValue}
                    onChange={(val) => setCodeValue(val)}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: 'JetBrains Mono',
                      contextmenu: false, // strictly disable right click menu in editor
                    }}
                  />
                  <div className="p-4 bg-white border-t border-muted flex justify-end">
                    <button 
                      onClick={() => handleAnswer(true)} // Mocking code evaluation
                      className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-primary transition-colors flex items-center gap-2"
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
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
                      <h4 className="font-bold text-primary mb-2">Explanation</h4>
                      <p className="text-textMuted">{question.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
