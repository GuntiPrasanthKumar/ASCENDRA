import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Terminal, PieChart, BrainCircuit, Scale, FlaskConical, 
  Zap, Clock, Timer, Shield, CheckCircle, CheckCircle2, ChevronRight, 
  ArrowRight, FileText, Database, BarChart3, XCircle, Sparkles, Activity,
  Info, Globe, Cpu, Languages, BookOpen, Layers, Flame, RotateCcw, PlayCircle, User, X, FileDown
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import PageTransition from '../components/common/PageTransition';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useProctor } from '../hooks/useProctor';
import { useAssessmentEngine } from '../hooks/useAssessmentEngine';
import { useToastStore } from '../components/common/Toast';
import api from '../utils/api';

// ─────────────────────────────────────────────
// Initial Data
// ─────────────────────────────────────────────
const INITIAL_SUBJECTS = [
  { id: 'cs', name: 'Computer Science', icon: <Terminal />, color: '#6366f1', subtopics: ['Algorithms', 'Data Structures', 'Operating Systems', 'Networking'] },
  { id: 'fin', name: 'Finance', icon: <PieChart />, color: '#10b981', subtopics: ['Stock Market', 'Corporate Finance', 'Taxation', 'Wealth Management'] },
  { id: 'psy', name: 'Psychology', icon: <BrainCircuit />, color: '#8b5cf6', subtopics: ['Cognitive', 'Behavioral', 'Neuroscience', 'Social Psychology'] },
  { id: 'law', name: 'Law', icon: <Scale />, color: '#ef4444', subtopics: ['Constitutional', 'Criminal', 'Corporate Law', 'Human Rights'] },
  { id: 'phy', name: 'Physics', icon: <FlaskConical />, color: '#f59e0b', subtopics: ['Quantum', 'Mechanics', 'Thermodynamics', 'Astrophysics'] }
];

export default function Assessment() {
  const [step, setStep] = useState('config');
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [config, setConfig] = useState({ subject: '', topic: '', level: 'Medium' });
  const [mainSearch, setMainSearch] = useState('');
  const [subSearch, setSubSearch] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);
  
  const [strikesCount, setStrikesCount] = useState(0);
  const [selectedReviewQ, setSelectedReviewQ] = useState(null);

  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { 
    canvasRef, 
    faceData, 
    isModelLoaded,
    startCamera, 
    startDetection, 
    stopDetection 
  } = useFaceDetection();

  const [generationPhase, setGenerationPhase] = useState('Initializing AI...');

  // ─────────────────────────────────────────────
  // Logic
  // ─────────────────────────────────────────────

  const { 
    questions, currentQ, setCurrentQ, userAnswers, timeLeft, isFinished, isGenerating, 
    score, evaluation, discoverTopics, generateAssessment, handleAnswer: engineHandleAnswer, finishAssessment 
  } = useAssessmentEngine(config);

  // AI DISCOVERY FUNCTION
  const handleDiscover = async () => {
    if (mainSearch.trim().length < 2) return;
    setIsDiscovering(true);
    setGenerationPhase('Analyzing Query...');
    
    // Simulate phases for UI effect
    const phaseInterval = setInterval(() => {
      setGenerationPhase(prev => 
        prev === 'Analyzing Query...' ? 'Extracting Domain...' : 
        prev === 'Extracting Domain...' ? 'Mapping Knowledge Graph...' : 
        'Discovering Subtopics...'
      );
    }, 800);

    const result = await discoverTopics(mainSearch);
    clearInterval(phaseInterval);
    
    if (result && result.domain && result.subtopics) {
      const newDomain = { 
        id: `gen-${Date.now()}`, 
        name: result.domain, 
        icon: <Sparkles />, 
        color: '#6366f1', 
        subtopics: result.subtopics
      };
      
      // Check if domain exists
      setSubjects(prev => {
        const existing = prev.find(s => s.name.toLowerCase() === result.domain.toLowerCase());
        if (existing) {
          // Merge subtopics
          const merged = [...new Set([...result.subtopics, ...existing.subtopics])];
          return prev.map(s => s.name.toLowerCase() === result.domain.toLowerCase() ? { ...s, subtopics: merged } : s);
        }
        return [newDomain, ...prev];
      });
      
      setConfig({ ...config, subject: result.domain });
      setStep('subtopic');
      addToast(`AI Discovered Domain: ${result.domain}`, 'success');
    } else {
      addToast('Could not discover topics for this query.', 'error');
    }
    setIsDiscovering(false);
  };

  const handleStartGeneration = async () => {
    setStep('generating');
    setGenerationPhase('Building Factual Baseline...');
    
    // Simulate phases
    let count = 0;
    const phaseInterval = setInterval(() => {
      count++;
      if (count === 1) setGenerationPhase('Synthesizing Concepts...');
      if (count === 2) setGenerationPhase("Applying Bloom's Taxonomy...");
      if (count === 3) setGenerationPhase('Formulating Unique Questions...');
    }, 1500);

    const success = await generateAssessment(config.subject, config.topic);
    clearInterval(phaseInterval);
    
    if (success) {
      setStep('active');
    } else {
      setStep('subtopic');
    }
  };

  const isSubmitting = useRef(false);

  const handleComplete = useCallback(async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    
    stopDetection();
    setStep('finished'); // Immediate step change to stop proctoring
    
    try {
      await finishAssessment(strikesCount);
    } catch (err) {
      console.error('Final Submit Error:', err);
    } finally {
      isSubmitting.current = false;
    }
  }, [finishAssessment, strikesCount, stopDetection]);

  const { strikes } = useProctor(step === 'active', faceData, (count) => {
    setStrikesCount(count);
    if (count >= 3) {
      addToast('Proctoring Strike Limit Reached!', 'error');
      handleComplete();
    }
  });

  useEffect(() => {
    if (isFinished && step === 'active') {
      setStep('finished');
    }
  }, [isFinished, step]);

  // ─────────────────────────────────────────────
  // Proctoring Lifecycle
  // ─────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    if (step === 'active') {
      const initProctoring = async () => {
        if (!videoRef.current) {
          setTimeout(initProctoring, 100);
          return;
        }
        
        if (!isModelLoaded) {
          setTimeout(initProctoring, 500);
          return;
        }

        try {
          const ok = await startCamera(videoRef.current);
          if (ok && active) {
            startDetection();
            addToast('Proctoring Active: Identity Verified', 'success');
          } else if (!ok) {
            addToast('Camera Error: Please allow camera access.', 'error');
          }
        } catch (err) {
          console.error('Proctoring Error:', err);
        }
      };
      initProctoring();
    }
    return () => {
      active = false;
      if (step !== 'active') stopDetection();
    };
  }, [step, isModelLoaded, startCamera, startDetection, stopDetection, addToast]);

  const handleAnswer = (idx) => {
    engineHandleAnswer(idx);
  };

  const generateReportPDF = () => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const mistakes = evaluation.filter(q => !q.isCorrect);
      
      doc.setFontSize(22); doc.text("Improvement Report", 20, 20);
      doc.setFontSize(14); doc.text(`Topic: ${config.topic} | Accuracy: ${Math.round((score/questions.length)*100)}%`, 20, 35);
      
      let y = 55;
      doc.setFontSize(16); doc.text("Review of Mistaken Concepts", 20, y);
      y += 15;

      mistakes.forEach((q, i) => {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(10);
        doc.setTextColor(200, 0, 0); doc.text(`Q: ${q.question}`, 20, y, { maxWidth: 170 });
        y += 10;
        doc.setTextColor(0); doc.text(`Your Answer: ${q.userAnswer}`, 25, y);
        y += 6;
        doc.text(`Correct Solution: ${q.correctAnswer}`, 25, y);
        y += 10;
        doc.text("AI Explanation:", 25, y);
        y += 6;
        doc.text(q.explanation, 25, y, { maxWidth: 165 });
        y += 20;
      });
      doc.save(`Result_${config.topic}.pdf`);
    };
    document.body.appendChild(script);
  };

  const accuracyPercent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const incorrectCount = questions.length - score;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F0F2F5] text-[#334155] font-sans">
        <AnimatePresence mode="wait">
          
          {step === 'config' && (
            <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-20 max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h1 className="text-5xl font-display font-extrabold tracking-tight mb-4 text-slate-900">Neural Academy <span className="text-accent">Validator</span></h1>
                <p className="text-slate-500 text-lg">Search for any domain to activate AI discovery.</p>
              </div>
              <div className="max-w-2xl mx-auto relative mb-16">
                <div className="relative bg-white border border-slate-200 rounded-3xl py-1 px-1 flex items-center shadow-lg group">
                  <div className="pl-6 pr-4">{isDiscovering ? <Activity className="w-6 h-6 text-accent animate-spin" /> : <Search className="w-6 h-6 text-slate-300" />}</div>
                  <input 
                    type="text" 
                    placeholder="Search any topic (e.g. Cryptography, Newton Rings...)" 
                    className="flex-1 bg-transparent border-none outline-none text-xl py-4" 
                    value={mainSearch} 
                    onChange={(e) => setMainSearch(e.target.value)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') handleDiscover(); }}
                  />
                  <button 
                    onClick={handleDiscover}
                    disabled={isDiscovering || mainSearch.trim().length < 2}
                    className={`mr-2 px-6 py-3 rounded-2xl font-bold transition-all ${mainSearch.trim().length >= 2 ? 'bg-accent text-white hover:bg-slate-900' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {isDiscovering ? generationPhase : 'Discover'}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.filter(s => s.name.toLowerCase().includes(mainSearch.toLowerCase())).map((sub, i) => (
                  <motion.div key={sub.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => { setConfig({...config, subject: sub.name}); setStep('subtopic'); }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-accent hover:shadow-2xl transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${sub.color}15`, color: sub.color }}>{sub.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{sub.name}</h3>
                    <p className="text-slate-400 text-sm font-medium">{sub.subtopics.length} specialized sub-modules</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'subtopic' && (
            <motion.div key="subtopic" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="pt-32 pb-20 max-w-4xl mx-auto px-6">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100">
                <button onClick={() => setStep('config')} className="text-slate-400 text-xs font-bold mb-8 hover:text-accent transition-colors">← Back to Domains</button>
                <h2 className="text-4xl font-black text-slate-900 mb-2">Configure {config.subject}</h2>
                <div className="relative my-8">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input type="text" placeholder={`Search specialized topics in ${config.subject}...`} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-6 pl-16 pr-6 focus:bg-white outline-none transition-all text-lg" value={subSearch} onChange={(e) => setSubSearch(e.target.value)} />
                  {isDiscovering && <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-accent animate-pulse">AI Neural Link...</div>}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-10">
                  {subjects.find(s => s.name === config.subject)?.subtopics.filter(t => t.toLowerCase().includes(subSearch.toLowerCase())).map(t => (
                    <button key={t} onClick={() => setConfig({...config, topic: t})} className={`p-6 rounded-2xl border-2 transition-all ${config.topic === t ? 'border-accent bg-accent/5 text-accent font-black' : 'border-slate-50 hover:border-slate-200'}`}>{t}</button>
                  ))}
                </div>
                <button onClick={handleStartGeneration} disabled={!config.topic} className={`w-full py-6 rounded-3xl font-bold text-xl transition-all shadow-xl ${config.topic ? 'bg-accent text-white hover:bg-slate-900 shadow-accent/20' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>Start Assessment</button>
              </div>
            </motion.div>
          )}

          {step === 'generating' && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen flex flex-col items-center justify-center bg-white p-6">
              <div className="relative w-32 h-32 mb-8">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-slate-100 border-t-accent rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-accent animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Neural Brain Syncing...</h2>
              <p className="text-accent font-bold uppercase tracking-widest text-sm mb-4">{generationPhase}</p>
              <p className="text-slate-400 font-medium text-xs">Generating 20 Unique Factual Questions</p>
            </motion.div>
          )}

          {step === 'active' && (
            <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex flex-col bg-white">
              <div className="px-8 py-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-6">
                  <div className="font-bold text-slate-900 tracking-tight">Neural Proctor <span className="text-accent">Active</span></div>
                </div>
                <div className="flex items-center gap-2 text-slate-900 font-mono text-xl font-bold">
                  <Timer className="w-5 h-5 text-accent" /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 p-12 overflow-y-auto">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                      <span className="px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-black uppercase tracking-widest">
                        {questions[currentQ]?.bloomsLevel || 'Remember'}
                      </span>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Question {currentQ + 1} of {questions.length}</span>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-12 leading-tight">
                      {questions[currentQ]?.text || questions[currentQ]?.question}
                    </h2>

                    {(questions[currentQ]?.type === 'multiple_choice' || !questions[currentQ]?.type) && (
                      <div className="grid grid-cols-1 gap-4">
                        {questions[currentQ]?.options?.map((opt, i) => (
                          <button key={i} onClick={() => handleAnswer(i)} className="w-full text-left p-6 rounded-2xl border-2 border-slate-100 hover:border-accent hover:bg-accent/[0.02] transition-all text-slate-700 font-bold group flex justify-between items-center">
                            <span className="text-lg">{opt}</span>
                            <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-accent flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}

                    {questions[currentQ]?.type === 'fill_in_the_blanks' && (
                      <div className="space-y-6">
                        <input 
                          type="text" 
                          placeholder="Type the missing word..."
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-8 px-10 text-2xl font-black outline-none focus:border-accent focus:bg-white transition-all"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAnswer(e.target.value);
                          }}
                        />
                        <p className="text-slate-400 text-sm font-bold text-center">Press Enter to submit your answer</p>
                      </div>
                    )}

                    {questions[currentQ]?.type === 'short_answer' && (
                      <div className="space-y-6">
                        <textarea 
                          rows={4}
                          placeholder="Explain your answer in 2 lines..."
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-8 px-10 text-xl font-bold outline-none focus:border-accent focus:bg-white transition-all resize-none"
                        />
                        <button 
                          onClick={(e) => handleAnswer(e.currentTarget.previousSibling.value)}
                          className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-lg hover:bg-accent transition-all shadow-xl"
                        >
                          Submit Response
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-80 border-l border-slate-100 p-8 flex flex-col gap-6 bg-slate-50/50">
                  <div className="rounded-[2rem] overflow-hidden shadow-sm border-2 border-slate-200 aspect-video relative bg-black">
                    <video ref={videoRef} autoPlay muted className="w-full h-full object-cover transform -scale-x-100" />
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100">
                    <h4 className="text-xs font-black text-slate-400 uppercase mb-4">Proctoring Stats</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-600">Strikes</span>
                        <span className={`text-xs font-black ${strikesCount > 0 ? 'text-red-500' : 'text-green-500'}`}>{strikesCount}/3</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full transition-all" style={{ width: `${(strikesCount/3)*100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'finished' && (
            <motion.div key="finished" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-20 px-6 max-w-[1200px] mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div><h1 className="text-4xl font-black text-[#1E293B]">Quiz Results</h1><p className="text-slate-500 font-bold mt-1">Topic: {config.topic}</p></div>
                <div className="flex gap-4">
                  <button onClick={generateReportPDF} className="flex items-center gap-2 bg-[#1E293B] text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:bg-black transition-all">
                    <FileDown className="w-5 h-5" /> Download Improvement Report
                  </button>
                  <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold shadow-sm"><User className="w-4 h-4" /> Sarah Evaluation</button>
                </div>
              </div>

              {/* Accuracy & Strikes Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex items-center gap-16">
                  <div className="relative w-48 h-28">
                    <svg viewBox="0 0 100 50" className="w-full h-full"><path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F1F5F9" strokeWidth="10" strokeLinecap="round" /><motion.path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#10B981" strokeWidth="10" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: accuracyPercent / 100 }} transition={{ duration: 1.5 }} /></svg>
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-center"><span className="text-5xl font-black text-slate-900">{accuracyPercent}%</span><span className="text-[10px] text-slate-400 font-bold uppercase">(out of 100)</span></div>
                  </div>
                  <div className="flex-1 w-full"><div className="flex justify-between mb-4"><h3 className="text-xl font-bold">Accuracy Score</h3><span className="text-green-500 font-black text-sm uppercase tracking-widest">{accuracyPercent > 80 ? 'Excellent!' : 'Good!'}</span></div><div className="grid grid-cols-3 gap-6"><div className="text-center"><div className="text-3xl font-black">{score}</div><div className="text-[10px] text-slate-400 font-bold uppercase">Correct</div></div><div className="text-center"><div className="text-3xl font-black text-red-500">{incorrectCount}</div><div className="text-[10px] text-slate-400 font-bold uppercase">Incorrect</div></div><div className="text-center"><div className="text-3xl font-black text-slate-300">{questions.length}</div><div className="text-[10px] text-slate-400 font-bold uppercase">Total</div></div></div></div>
                </div>
                <div className="bg-[#FFF7ED] p-10 rounded-[3rem] border border-[#FFEDD5] flex flex-col items-center justify-center text-center">
                  <Flame className="w-12 h-12 text-orange-500 fill-orange-500 mb-4" />
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">Current Strike</div>
                  <div className="bg-orange-500 text-white w-full py-3 rounded-2xl font-black text-3xl shadow-xl shadow-orange-500/20 mb-6">{strikesCount}</div>
                  <div className="flex justify-between w-full text-[10px] font-bold text-slate-400 uppercase border-t border-orange-200 pt-6"><span>Long Strike: {strikesCount}</span><span>Grade: {accuracyPercent > 80 ? 'A-' : 'B'}</span></div>
                </div>
              </div>

              {/* Table with Review logic */}
              <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
                <h3 className="p-8 text-xl font-bold border-b border-slate-50">Question Summary</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase"><tr><th className="px-8 py-6">Question</th><th className="px-6 py-6 text-center">Status</th><th className="px-6 py-6 text-center">Result</th><th className="px-6 py-6 text-center">Time</th><th className="px-8 py-6 text-right">Action</th></tr></thead>
                    <tbody className="divide-y divide-slate-50">
                      {evaluation.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 font-bold text-slate-700 text-sm">Q{item.id}: {item.question}</td>
                          <td className="px-6 py-6 text-center">{item.isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <XCircle className="w-5 h-5 text-red-500 mx-auto" />}</td>
                          <td className="px-6 py-6 text-center"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{item.isCorrect ? 'Correct' : 'Incorrect'}</span></td>
                          <td className="px-6 py-6 text-center text-xs text-slate-400">{item.time}</td>
                          <td className="px-8 py-6 text-right"><button onClick={() => setSelectedReviewQ(item)} className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-accent hover:text-white transition-all">Review Explanation</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-between items-center">
                <button className="bg-white border border-slate-200 px-10 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50">Overall Analysis</button>
                <div className="flex gap-4">
                  <button onClick={() => setStep('config')} className="bg-white border border-slate-200 px-10 py-4 rounded-2xl font-bold text-slate-500 flex items-center gap-3"><RotateCcw className="w-5 h-5" /> Retry Assessment</button>
                  <button onClick={() => setStep('config')} className="bg-accent text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-accent/20 flex items-center gap-3">Next Domain <ArrowRight className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Review Modal */}
              <AnimatePresence>
                {selectedReviewQ && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
                      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h4 className="text-xl font-black text-slate-900">Question Review</h4>
                        <button onClick={() => setSelectedReviewQ(null)} className="p-2 hover:bg-white rounded-full transition-all"><X className="w-6 h-6 text-slate-400" /></button>
                      </div>
                      <div className="p-10 space-y-8">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">The Question</div>
                          <p className="text-lg font-bold text-slate-800 leading-relaxed">{selectedReviewQ.question}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                            <div className="text-[10px] font-bold text-red-400 uppercase mb-2">Your Answer</div>
                            <div className="text-sm font-black text-red-600">{selectedReviewQ.userAnswer}</div>
                          </div>
                          <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                            <div className="text-[10px] font-bold text-green-400 uppercase mb-2">Correct Answer</div>
                            <div className="text-sm font-black text-green-600">{selectedReviewQ.correctAnswer}</div>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                          <div className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest mb-4"><Sparkles className="w-5 h-5" /> Neural Brain Explanation</div>
                          <p className="text-slate-600 leading-relaxed font-medium">{selectedReviewQ.explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
