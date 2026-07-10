import React, { useState, useEffect, useRef } from 'react';
import NotesPanel from './NotesPanel';
import { Sparkles, FileText, Send, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LessonSidebar({ lessonId, aiContext, onActionTrigger }) {
  const [activeTab, setActiveTab] = useState('assistant');
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', text: 'Hello! I am your contextual AI Coach. Ask me to explain concepts, generate flashcards, or create quick examples based on the lesson!' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendPromptRef = useRef(null);

  const handleSendPrompt = (promptText) => {
    const text = promptText || chatInput;
    if (!text.trim()) return;

    setChatLog(prev => [...prev, { role: 'user', text }]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "I've analyzed the request. Dynamic programming optimizes recursive steps by ensuring that overlapping subproblems are computed only once.";
      if (text.toLowerCase().includes('example')) {
        aiResponse = "Here is a classic tabulation implementation:\n```javascript\nfunction fib(n) {\n  let dp = [0, 1];\n  for (let i = 2; i <= n; i++) {\n    dp[i] = dp[i-1] + dp[i-2];\n  }\n  return dp[n];\n}\n```";
      }
      setChatLog(prev => [...prev, { role: 'assistant', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    handleSendPromptRef.current = handleSendPrompt;
  });

  // Auto-fill prompt if aiContext changes (e.g. from float selection explain trigger)
  useEffect(() => {
    if (aiContext && handleSendPromptRef.current) {
      handleSendPromptRef.current(aiContext);
    }
  }, [aiContext]);


  return (
    <div className="glass p-6 rounded-[2rem] border border-slate-200/50 flex flex-col h-full min-h-[500px]">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 pb-3 mb-4 gap-2">
        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'assistant'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> AI Coach
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'notes'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Workspace Notes
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'assistant' ? (
            <motion.div
              key="assistant"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex flex-col h-full justify-between"
            >
              {/* Chat bubbles */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 max-h-[340px]">
                {chatLog.map((chat, idx) => (
                  <div key={idx} className={`flex gap-3 items-start ${chat.role === 'user' ? 'justify-end' : ''}`}>
                    {chat.role !== 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-indigo-600" />
                      </div>
                    )}
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                      chat.role === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none font-medium'
                    }`}>
                      {chat.text.includes('```') ? (
                        <pre className="bg-slate-950 text-slate-200 p-3 rounded-xl text-[10px] font-mono overflow-x-auto my-1.5 border border-white/5">
                          <code>{chat.text.replace(/```javascript|```/g, '')}</code>
                        </pre>
                      ) : (
                        chat.text
                      )}
                    </div>
                    {chat.role === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-indigo-600 animate-bounce" />
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 text-xs rounded-tl-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                  placeholder="Ask a question about this lesson..."
                  className="flex-1 px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs font-semibold text-slate-700"
                />
                <button
                  onClick={() => handleSendPrompt()}
                  className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="h-full"
            >
              <NotesPanel lessonId={lessonId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
