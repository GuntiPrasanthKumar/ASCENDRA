import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot, Send, X, Compass, Target, Play, BookOpen, FileCode, Users, ChevronRight, Zap } from 'lucide-react';
import { useWorkspaceController } from '../../hooks/useWorkspaceController';
import api from '../../utils/api';

export default function GlobalAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 'm1', role: 'assistant', text: 'Hello! I am ASCENDRA AI Copilot. I can drive your learning, schedule practice sets, set up interviews, or generate your daily plan. How can I help?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [memory, setMemory] = useState(null);
  const [dailyPlan, setDailyPlan] = useState(null);

  const { currentContext, dispatchAIAction, dispatchActionChain } = useWorkspaceController();
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Keyboard shortcut Cmd/Ctrl + J
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && !memory) {
      api.get('/ai/memory')
        .then(res => setMemory(res.data?.data))
        .catch(() => setMemory({ currentGoal: 'Software Engineer', targetCompany: 'Tier 1' }));

      api.get('/ai/planner')
        .then(res => setDailyPlan(res.data?.data))
        .catch(() => setDailyPlan(null));
    }
  }, [isOpen, memory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Direct intent routing matching
      if (userMsg.toLowerCase().includes('google interview') || userMsg.toLowerCase().includes('interview prep')) {
        const chain = [
          { action: 'updateUserGoal', params: { currentGoal: 'Senior Software Engineer', targetCompany: 'Google' } },
          { action: 'openCodeLabProblem', params: { problemId: 'knapsack-01' } }
        ];
        await dispatchActionChain(chain);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          text: '🚀 Configured Google Interview Prep workflow! Updated your target goal to Senior Software Engineer at Google and opened recommended CodeLab challenge.'
        }]);
      } else if (userMsg.toLowerCase().includes('continue learning') || userMsg.toLowerCase().includes('resume lesson')) {
        await dispatchAIAction('openLearningModule', { subjectId: 'cs-101', chapterId: 'ch-2', lessonId: 'les-1' });
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          text: '📖 Resuming active lesson: Dynamic Programming Memoization!'
        }]);
      } else {
        const res = await api.post('/ai/chat', { content: `${userMsg} (Current Page: ${currentContext.pathname}, Module: ${currentContext.module})` });
        const reply = res.data?.data?.text || res.data?.text || 'I have updated your AI OS workspace context.';
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: 'Encountered AI workspace connection issue. Standing by.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full bg-black text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border border-slate-700 ${isOpen ? 'hidden' : 'flex'}`}
        title="Open AI Copilot (Ctrl + J)"
      >
        <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
        <span className="text-xs font-bold font-display pr-1 hidden sm:inline">AI Copilot</span>
      </button>

      {/* Floating AI Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-2xl flex flex-col h-[560px] overflow-hidden font-body"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-display flex items-center gap-1.5">
                    ASCENDRA AI OS
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full border border-emerald-500/30">ACTIVE</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">Context: {currentContext.module} ({currentContext.pathname})</span>
                </div>
              </div>

              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Goals & Actions Bar */}
            <div className="p-3 bg-slate-50 border-b border-slate-200/80 text-[11px] space-y-2">
              <div className="flex items-center justify-between text-slate-600 font-semibold">
                <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5 text-indigo-600" /> Goal: {memory?.currentGoal || 'Software Engineer'}</span>
                <span className="text-slate-400 text-[10px]">{memory?.targetCompany || 'Tier 1'}</span>
              </div>

              {/* Action Trigger Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() => dispatchAIAction('openLearningModule', { subjectId: 'cs-101', chapterId: 'ch-2', lessonId: 'les-1' })}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center gap-1 text-[10px]"
                >
                  <BookOpen className="w-3 h-3 text-indigo-600" /> Resume Lesson
                </button>
                <button
                  onClick={() => dispatchAIAction('openCodeLabProblem', { problemId: 'knapsack-01' })}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center gap-1 text-[10px]"
                >
                  <FileCode className="w-3 h-3 text-emerald-600" /> Solve DP Problem
                </button>
                <button
                  onClick={() => dispatchAIAction('scheduleInterview', { role: 'Full Stack', company: 'Google' })}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center gap-1 text-[10px]"
                >
                  <Users className="w-3 h-3 text-purple-600" /> Mock Interview
                </button>
              </div>
            </div>

            {/* Chat Conversation Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white text-xs">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-black text-white rounded-br-none' 
                      : 'bg-slate-100 text-slate-800 border border-slate-200/60 rounded-bl-none'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-slate-100 text-slate-500 font-medium flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 animate-spin text-indigo-600" /> Thinking &amp; Command Resolution...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Daily Planner Nudge */}
            {dailyPlan?.dailyGoal && (
              <div className="px-4 py-2 bg-indigo-50/70 border-t border-indigo-100 flex items-center justify-between text-[11px]">
                <span className="truncate text-indigo-950 font-medium">🎯 Today: {dailyPlan.dailyGoal}</span>
                <button 
                  onClick={() => dispatchAIAction('openLearningModule', { subjectId: 'cs-101', chapterId: 'ch-2', lessonId: 'les-1' })} 
                  className="text-indigo-600 font-bold shrink-0 flex items-center gap-0.5 ml-2"
                >
                  Execute <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask AI Copilot or run action (e.g. Prep Google Interview)..."
                className="flex-1 p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-black text-white font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
