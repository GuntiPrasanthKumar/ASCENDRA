import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Trash2, HelpCircle } from 'lucide-react';
import { useToastStore } from '../common/Toast';

export default function ConversationPanel() {
  const { addToast } = useToastStore();
  const messagesEndRef = useRef(null);

  const initialMessages = [
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I am your ASCENDRA AI Coach. I've analyzed your recent accuracy across learning paths and CodeLab practice. What would you like to focus on today?"
    }
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    "What should I study today?",
    "Show my weak topics.",
    "Recommend a coding problem.",
    "Prepare me for interviews.",
    "Track my progress."
  ];

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAIResponse = (userText) => {
    const text = userText.toLowerCase();
    
    if (text.includes('study') || text.includes('today')) {
      return "Based on your roadmap, I recommend resuming **Dynamic Programming & Memoization** (Lesson 9 of 12). Completing this module will boost your core algorithms mastery by **+12%**.";
    } else if (text.includes('weak') || text.includes('topic')) {
      return "Your recent practice diagnostics show an accuracy drop in **Heap Priority Queues (72%)** and **Graph BFS/DFS Traversal (78%)**. I recommend starting a targeted 15-minute practice set on Heaps today.";
    } else if (text.includes('coding') || text.includes('problem')) {
      return "I recommend solving **Longest Palindromic Substring** (Medium • String Processing) in CodeLab. It tests 3 core algorithm patterns frequently asked in technical interviews.";
    } else if (text.includes('interview') || text.includes('prepare')) {
      return "You are **85% ready** for technical placement rounds! Your gaze stability and proctoring metrics are fully verified. Try attempting the **System Design Mock Rehearsal** next.";
    } else if (text.includes('progress') || text.includes('track')) {
      return "You're doing great! Overall Progress is **74%**, with a **7-Day Learning Streak** and an average practice accuracy of **88.5%**. You're just 1 badge away from unlocking *Algorithm Grandmaster*!";
    } else {
      return `I've analyzed your request regarding "${userText}". Based on your learning telemetry, maintaining a steady daily 20-minute practice cycle will ensure continuous progress toward your career targets.`;
    }
  };

  const handleSend = (textToSend = input) => {
    const text = typeof textToSend === 'string' ? textToSend : input;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate realistic AI response timing
    setTimeout(() => {
      const aiReply = {
        id: Date.now() + 1,
        role: 'assistant',
        content: generateAIResponse(text)
      };
      setMessages(prev => [...prev, aiReply]);
      setIsTyping(false);
    }, 1200);
  };

  const handleClearHistory = () => {
    setMessages(initialMessages);
    addToast('Conversation reset', 'info');
  };

  return (
    <div className="glass rounded-[2.5rem] border border-slate-200/50 flex flex-col overflow-hidden shadow-sm mb-8 bg-white/70">
      
      {/* Panel Header */}
      <div className="p-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-slate-900 flex items-center gap-2 text-sm">
              ASCENDRA AI Coach <span className="text-[9px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full font-black uppercase">Live</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Real-time learning guidance & career advice</p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors text-xs flex items-center gap-1 font-semibold"
          title="Reset Conversation"
        >
          <Trash2 className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-600" /> Prompts:
        </span>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="text-xs font-bold text-slate-700 bg-white hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-xl border border-slate-200/60 hover:border-indigo-600 transition-all shrink-0 shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Stream Area */}
      <div className="p-6 h-[340px] overflow-y-auto space-y-4 custom-scrollbar bg-slate-50/30">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                  msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-indigo-600'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none shadow-sm font-medium'
                    : 'bg-white border border-slate-200/70 text-slate-800 rounded-tl-none shadow-2xs font-medium'
                }`}>
                  <p>{msg.content}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-indigo-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200/70 flex gap-1.5 items-center shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-slate-200/60">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your AI Coach about weak topics, roadmap items, or interview tips..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-4 pr-12 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-2xs"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="absolute right-2 w-9 h-9 bg-slate-900 text-white hover:bg-indigo-600 rounded-xl flex items-center justify-center disabled:opacity-30 transition-all shadow-sm"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
