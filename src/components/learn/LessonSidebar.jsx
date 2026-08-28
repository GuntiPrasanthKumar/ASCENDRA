import React, { useState, useEffect, useRef } from 'react';
import NotesPanel from './NotesPanel';
import { Sparkles, FileText, Send, User, Bot, HelpCircle, ClipboardList, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askLessonCoach, getLessonSummary, generateLessonQuiz } from '../../services/geminiService';

const QUICK_PROMPTS = [
  { label: 'Summarize Key Takeaways', icon: <FileText className="w-3.5 h-3.5" />, action: 'summary' },
  { label: 'Explain with Analogy', icon: <Lightbulb className="w-3.5 h-3.5" />, action: 'analogy' },
  { label: 'Generate Self-Check Quiz', icon: <HelpCircle className="w-3.5 h-3.5" />, action: 'quiz' },
];

export default function LessonSidebar({ lessonId, lessonTitle, contentBlocks, aiContext, onActionTrigger }) {
  const [activeTab, setActiveTab] = useState('assistant');
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', text: '👋 Hi! I\'m your ASCENDRA AI Coach. I\'m grounded in this lesson\'s content. Ask me to explain concepts, generate quiz questions, give analogies, or summarize the key takeaways!' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const handleSendRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isTyping]);

  // Reset chat when lesson changes
  useEffect(() => {
    setChatLog([
      { role: 'assistant', text: '👋 Hi! I\'m your ASCENDRA AI Coach. I\'m grounded in this lesson\'s content. Ask me to explain concepts, generate quiz questions, give analogies, or summarize the key takeaways!' }
    ]);
    setChatInput('');
  }, [lessonId]);

  const handleSendPrompt = async (promptText) => {
    const text = (promptText || chatInput).trim();
    if (!text || isTyping) return;

    setChatLog(prev => [...prev, { role: 'user', text }]);
    setChatInput('');
    setIsTyping(true);

    try {
      let aiResponse;
      if (promptText === 'summary') {
        aiResponse = await getLessonSummary(lessonTitle, contentBlocks);
      } else if (promptText === 'quiz') {
        aiResponse = await generateLessonQuiz(lessonTitle, contentBlocks);
      } else {
        aiResponse = await askLessonCoach(lessonTitle, contentBlocks, text);
      }
      setChatLog(prev => [...prev, { role: 'assistant', text: aiResponse }]);
    } catch (err) {
      setChatLog(prev => [...prev, {
        role: 'assistant',
        text: '⚠️ Something went wrong connecting to AI Coach. Please check your internet connection and try again.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Keep ref in sync for aiContext effect
  useEffect(() => { handleSendRef.current = handleSendPrompt; });

  // Auto-trigger when user asks AI from content selection
  useEffect(() => {
    if (aiContext && handleSendRef.current) {
      setActiveTab('assistant');
      handleSendRef.current(aiContext);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiContext]);

  const handleQuickPrompt = (action, label) => {
    if (action === 'summary') {
      setChatLog(prev => [...prev, { role: 'user', text: 'Summarize the key takeaways of this lesson.' }]);
      setIsTyping(true);
      getLessonSummary(lessonTitle, contentBlocks).then(resp => {
        setChatLog(prev => [...prev, { role: 'assistant', text: resp }]);
        setIsTyping(false);
      });
    } else if (action === 'quiz') {
      setChatLog(prev => [...prev, { role: 'user', text: 'Generate a self-check quiz for this lesson.' }]);
      setIsTyping(true);
      generateLessonQuiz(lessonTitle, contentBlocks).then(resp => {
        setChatLog(prev => [...prev, { role: 'assistant', text: resp }]);
        setIsTyping(false);
      });
    } else {
      handleSendPrompt(`Explain the core concepts of "${lessonTitle}" using a simple real-world analogy.`);
    }
  };

  const renderMessageContent = (text) => {
    // Simple code block detection
    if (text.includes('```')) {
      const parts = text.split(/(```[\s\S]*?```)/g);
      return parts.map((part, i) => {
        if (part.startsWith('```')) {
          const code = part.replace(/```\w*\n?/, '').replace(/```$/, '');
          return (
            <pre key={i} className="bg-slate-950 text-emerald-300 p-3 rounded-xl text-[10px] font-mono overflow-x-auto my-2 border border-white/5 leading-relaxed">
              <code>{code.trim()}</code>
            </pre>
          );
        }
        return <span key={i}>{part}</span>;
      });
    }
    return text;
  };

  return (
    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col min-h-[500px] shadow-xs">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 pb-3 mb-4 gap-2">
        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'assistant'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
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
          <ClipboardList className="w-3.5 h-3.5" /> Notes
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'assistant' ? (
            <motion.div
              key="assistant"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex flex-col h-full"
            >
              {/* Quick Prompts */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {QUICK_PROMPTS.map((qp) => (
                  <button
                    key={qp.action}
                    onClick={() => handleQuickPrompt(qp.action, qp.label)}
                    disabled={isTyping}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                  >
                    {qp.icon}
                    <span>{qp.label}</span>
                  </button>
                ))}
              </div>

              {/* Chat log */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-3 mb-3" style={{ maxHeight: '340px' }}>
                {chatLog.map((chat, idx) => (
                  <div key={idx} className={`flex gap-2 items-start ${chat.role === 'user' ? 'justify-end' : ''}`}>
                    {chat.role !== 'user' && (
                      <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                    )}
                    <div className={`px-3 py-2.5 rounded-2xl text-xs leading-relaxed max-w-[88%] ${
                      chat.role === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-none font-medium'
                        : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none font-medium'
                    }`}>
                      {renderMessageContent(chat.text)}
                    </div>
                    {chat.role === 'user' && (
                      <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex gap-2 items-start">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div className="px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 rounded-tl-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendPrompt()}
                  placeholder="Ask about this lesson..."
                  disabled={isTyping}
                  className="flex-1 px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-semibold text-slate-700 placeholder:font-medium placeholder:text-slate-400 disabled:opacity-60"
                />
                <button
                  onClick={() => handleSendPrompt()}
                  disabled={isTyping || !chatInput.trim()}
                  className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
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
