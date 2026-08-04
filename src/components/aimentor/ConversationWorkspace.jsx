import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Trash2, Sparkles, ArrowRight, Zap, Target, BookOpen } from 'lucide-react';
import { useToastStore } from '../common/Toast';
import QuickActionChips from './QuickActionChips';
import { useNavigate } from 'react-router-dom';

export default function ConversationWorkspace({ userName = 'Scholar' }) {
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const initialMessages = [
    {
      id: 1,
      role: 'assistant',
      content: `Welcome back, **${userName}**! Here is your AI telemetry briefing for today:

- **Primary Focus**: You're 75% through *Dynamic Programming & Memoization*.
- **Accuracy Target**: Your recent practice diagnostic scored **88.5%**.
- **Action Item**: I recommend completing *Lesson 9: Memoization Basics* and tackling 1 CodeLab problem today to solidify your placement readiness.

How can I assist your learning path right now?`
    }
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateMentorResponse = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes('study') || text.includes('today') || text.includes('learn')) {
      return `### 🎯 Today's Recommended Learning Path

Based on your telemetry, you should focus on **Dynamic Programming & Memoization** (Lesson 9).

- **Estimated Time**: 20 minutes
- **Expected Mastery Gain**: +12%
- **Target Outcome**: Solidify 1D & 2D lookup table memoization patterns for technical interviews.`;
    } else if (text.includes('weak') || text.includes('topic') || text.includes('practice')) {
      return `### 📊 Diagnostic Analysis: Priority Focus Areas

Your recent accuracy metrics highlight two specific areas for improvement:

1. **Heap Priority Queues**: Current Accuracy **72%** *(Recommended: 15-min practice set)*
2. **Graph Traversal (BFS/DFS)**: Current Accuracy **78%**

Focusing 15 minutes on Heap practice today will bring your overall accuracy above **90%**.`;
    } else if (text.includes('interview') || text.includes('mock') || text.includes('rehearse')) {
      return `### 🛡️ Placement Interview Readiness Check

You are **85% ready** for upcoming placement benchmark rounds!

- **Gaze Stability Metric**: Verified 94% focus retention
- **Proctoring Compliance**: Zero integrity flags
- **Recommended Action**: Complete a 10-minute **System Design Rehearsal** in Interview Studio.`;
    } else if (text.includes('code') || text.includes('codelab') || text.includes('problem')) {
      return `### 💻 CodeLab Problem Recommendation

I suggest attempting **Longest Palindromic Substring** (Medium difficulty • Dynamic Programming).

This problem evaluates:
- Expanded center string traversal
- 2D memoization table lookup
- Optimal $O(N^2)$ space-time complexity balance`;
    } else {
      return `I've analyzed your prompt regarding **"${userText}"**. Maintaining a consistent 20-minute daily practice block will ensure optimal retention and steady growth toward your career benchmarks. Let me know if you'd like a specific problem or concept breakdown!`;
    }
  };

  const handleSend = (textToSend = input) => {
    const text = typeof textToSend === 'string' ? textToSend : input;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = {
        id: Date.now() + 1,
        role: 'assistant',
        content: generateMentorResponse(text)
      };
      setMessages(prev => [...prev, aiReply]);
      setIsTyping(false);
    }, 1000);
  };

  const handleClearHistory = () => {
    setMessages(initialMessages);
    addToast('Conversation reset', 'info');
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Header & AI Daily Briefing Banner */}
      <div className="p-8 rounded-[2.5rem] border border-slate-200/80 bg-white shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-black uppercase tracking-wider text-black mb-3">
              <Zap className="w-3.5 h-3.5" /> AI Mentor Workspace
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-black tracking-tight">
              {greeting}, <span className="text-slate-700">{userName}</span>
            </h1>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-2.5 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition-colors text-xs flex items-center gap-1.5 font-bold border border-slate-200/60"
            title="Reset Workspace"
          >
            <Trash2 className="w-3.5 h-3.5" /> Reset Session
          </button>
        </div>

        <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">
          Your personal AI Mentor tracks practice telemetry, proctoring gaze stability, and coding accuracy to deliver continuous strategic guidance.
        </p>

        {/* Quick Action Chips Integration */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <QuickActionChips />
        </div>
      </div>

      {/* 2. Conversation & Execution Workspace */}
      <div className="rounded-[2.5rem] border border-slate-200/80 bg-white overflow-hidden shadow-xs flex flex-col">
        
        {/* Messages Container */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[500px] min-h-[380px] flex flex-col gap-6 bg-white">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === 'user' ? 'bg-black text-white' : 'bg-slate-100 border border-slate-200 text-black'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-5 rounded-[1.75rem] text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-black text-white font-medium'
                  : 'bg-slate-50 border border-slate-200/60 text-black font-medium'
              }`}>
                <div 
                  className="markdown-body"
                  dangerouslySetInnerHTML={{ 
                    __html: msg.content
                      .replace(/### (.*?)\n/g, '<h3 class="font-bold text-sm text-black mb-2">$1</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/\n/g, '<br/>')
                  }} 
                />

                {/* Structured CTA inside assistant responses where meaningful */}
                {msg.role === 'assistant' && msg.content.includes('Dynamic Programming') && (
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500">Ready to start Lesson 9?</span>
                    <button
                      onClick={() => navigate('/learn/adv-algorithms/dynamic-programming/memoization-basics')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white font-bold text-[10px] hover:bg-slate-800 transition-all"
                    >
                      Open Lesson <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-xs">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-black">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs flex items-center gap-2 text-slate-500 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-black animate-spin" /> AI Mentor evaluating learning telemetry...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Form Command Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
          className="p-4 md:p-5 border-t border-slate-200/60 bg-slate-50/50 flex gap-3 items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI Mentor for concept breakdowns, problem recommendations, or interview tips..."
            className="flex-1 px-6 py-3.5 rounded-full bg-white border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-black text-xs font-semibold text-black placeholder-slate-400 shadow-xs"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-6 py-3.5 rounded-full bg-black hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-2 shrink-0 shadow-xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
}
