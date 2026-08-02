import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Trash2, HelpCircle } from 'lucide-react';
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
    <div className="rounded-[2.5rem] border border-slate-200/80 flex flex-col overflow-hidden mb-8 bg-white shadow-xs">
      
      {/* Panel Header */}
      <div className="p-5 border-b border-slate-200/60 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-black flex items-center gap-2 text-sm">
              ASCENDRA AI Coach <span className="text-[9px] bg-black text-white px-2 py-0.5 rounded-full font-black uppercase">Live</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Real-time learning guidance & career advice</p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition-colors text-xs flex items-center gap-1 font-semibold"
          title="Reset Conversation"
        >
          <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="p-6 overflow-y-auto max-h-[420px] min-h-[320px] flex flex-col gap-4 bg-white">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold ${
              msg.role === 'user' ? 'bg-black text-white' : 'bg-slate-100 border border-slate-200 text-black'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-black" />}
            </div>

            <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-black text-white'
                : 'bg-slate-50 border border-slate-200/60 text-black'
            }`}>
              <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-xs">
            <div className="w-8 h-8 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-black">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs flex items-center gap-1 text-slate-500 font-medium">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping" /> AI Coach analyzing telemetry...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 shrink-0">Quick Prompts:</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] font-medium text-black bg-white hover:bg-slate-100 border border-slate-200/80 px-3 py-1 rounded-full whitespace-nowrap transition-colors shadow-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 border-t border-slate-200/60 bg-white flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Coach anything about your syllabus, weak topics, or career strategy..."
          className="flex-1 px-5 py-3 rounded-full bg-slate-50 border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-black text-xs font-semibold text-black placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-6 py-3 rounded-full bg-black hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-2"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}
