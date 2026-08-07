import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Send, Trash2, Sparkles, RefreshCw, ShoppingBag, ChevronRight } from 'lucide-react';
import { useToastStore } from '../common/Toast';
import QuickActionChips from './QuickActionChips';
import { useNavigate } from 'react-router-dom';

export default function ConversationWorkspace({ userName = 'Vijay' }) {
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
      content: `Welcome back, **${userName}**! Here's your AI telemetry briefing for today:

- 🔵 **Primary Focus**: You're 75% through *Dynamic Programming & Memoization*.
- 🟢 **Accuracy Target**: Your recent practice diagnostic scored **88.5%**.
- 🟣 **Action Item**: I recommend completing *Lesson 9: Memoization Basics* and tackling 1 CodeLab problem today to solidify your placement readiness.

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

    if (text.includes('study') || text.includes('today') || text.includes('learn') || text.includes('dp')) {
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
- Optimal O(N^2) space-time complexity balance`;
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

  const quickAsks = [
    'Explain Two Pointers',
    'DP State Design',
    'System Design Prep',
    'Mock Interview'
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Navigation */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex justify-between items-center">
          <div className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase border border-blue-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI MENTOR WORKSPACE</span>
          </div>

          <button
            onClick={handleClearHistory}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Session</span>
          </button>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
            {greeting}, {userName} 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
            Your personal AI Mentor tracks practice telemetry, proctoring gaze stability, and coding accuracy to deliver continuous strategic guidance.
          </p>
        </div>

        {/* Quick Action Navigation Chips */}
        <div className="pt-2">
          <QuickActionChips />
        </div>
      </div>

      {/* Messages Workspace */}
      <div className="space-y-6">
        <div className="space-y-6 max-h-[550px] overflow-y-auto">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              )}

              <div className={`p-6 md:p-8 rounded-3xl text-xs leading-relaxed max-w-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : 'bg-gradient-to-br from-[#F3F5FF] via-[#F7F6FF] to-[#F1F5FF] border border-blue-100/90 text-slate-900 font-medium shadow-xs'
              }`}>
                <div 
                  className="markdown-body space-y-2.5"
                  dangerouslySetInnerHTML={{ 
                    __html: msg.content
                      .replace(/### (.*?)\n/g, '<h3 class="font-bold text-sm text-slate-900 mb-2">$1</h3>')
                      .replace(/🔵 (.*?)\n/g, '<div class="flex items-center gap-2 text-slate-900 font-semibold"><span class="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>$1</div>')
                      .replace(/🟢 (.*?)\n/g, '<div class="flex items-center gap-2 text-slate-900 font-semibold"><span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>$1</div>')
                      .replace(/🟣 (.*?)\n/g, '<div class="flex items-center gap-2 text-slate-900 font-semibold"><span class="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>$1</div>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/\n/g, '<br/>')
                  }} 
                />

                {/* Quick Action Chips & CTA button */}
                {msg.role === 'assistant' && (
                  <div className="pt-4 mt-5 border-t border-slate-200/80 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button 
                        onClick={() => handleSend('Explain Memoization')}
                        className="bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-slate-700 shadow-2xs"
                      >
                        Explain Memoization
                      </button>
                      <button 
                        onClick={() => handleSend('Recommend Problems')}
                        className="bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-slate-700 shadow-2xs"
                      >
                        Recommend Problems
                      </button>
                      <button 
                        onClick={() => handleSend('Interview Tips')}
                        className="bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-slate-700 shadow-2xs"
                      >
                        Interview Tips
                      </button>
                      <button 
                        onClick={() => handleSend('Refresh Briefing')}
                        className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-2xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-semibold text-slate-600">Ready to start Lesson 9?</span>
                      <button
                        onClick={() => navigate('/learn/adv-algorithms/dynamic-programming/memoization-basics')}
                        className="px-5 py-2.5 rounded-full bg-black hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Open Lesson</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* AI Prompt Input Bar Container */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 md:p-6 space-y-3 shadow-2xs">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-2xs focus-within:border-blue-500 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 ml-1" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your AI Mentor for concept breakdowns, problem recommendations, or interview tips..."
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none py-1.5 font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs shrink-0 transition-all"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Asks Pills */}
          <div className="flex items-center gap-2 text-xs flex-wrap px-2">
            <span className="text-slate-400 font-semibold text-[11px]">Quick asks:</span>
            {quickAsks.map((ask, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(ask)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1 rounded-full text-xs transition-colors"
              >
                {ask}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
