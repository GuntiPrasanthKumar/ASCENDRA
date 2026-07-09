import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Sparkles, Code, BookOpen, BrainCircuit, 
  History, Trash2, Cpu, Database, Network, Globe, MessageSquare, Zap
} from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import { useToastStore } from '../components/common/Toast';
import api from '../utils/api';

// ─────────────────────────────────────────────
// Simple Markdown Renderer
// ─────────────────────────────────────────────
function SimpleMarkdown({ content }) {
  const lines = content.split('\n');
  const rendered = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      rendered.push(
        <div key={i} className="group relative my-3">
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-[10px] font-bold text-accent2 uppercase tracking-widest">{lang || 'code'}</span>
          </div>
          <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto shadow-inner border border-white/5">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // Blank line
    if (line.trim() === '') { rendered.push(<div key={i} className="h-2" />); i++; continue; }

    // Parse inline
    const parseInline = (text) => {
      const parts = [];
      let remaining = text;
      let key = 0;
      while (remaining.length > 0) {
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        const codeMatch = remaining.match(/`(.+?)`/);
        
        const boldIdx = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
        const codeIdx = codeMatch ? remaining.indexOf(codeMatch[0]) : Infinity;

        if (boldIdx === Infinity && codeIdx === Infinity) {
          parts.push(<span key={key++}>{remaining}</span>);
          break;
        }
        if (boldIdx <= codeIdx) {
          if (boldIdx > 0) parts.push(<span key={key++}>{remaining.slice(0, boldIdx)}</span>);
          parts.push(<strong key={key++} className="text-primary font-bold">{boldMatch[1]}</strong>);
          remaining = remaining.slice(boldIdx + boldMatch[0].length);
        } else {
          if (codeIdx > 0) parts.push(<span key={key++}>{remaining.slice(0, codeIdx)}</span>);
          parts.push(<code key={key++} className="bg-accent/10 text-accent px-1.5 py-0.5 rounded-md font-mono text-xs border border-accent/20">{codeMatch[1]}</code>);
          remaining = remaining.slice(codeIdx + codeMatch[0].length);
        }
      }
      return parts;
    };

    rendered.push(<p key={i} className="mb-2 last:mb-0 leading-relaxed text-[15px]">{parseInline(line)}</p>);
    i++;
  }

  return <div className="text-textSecondary">{rendered}</div>;
}

// ─────────────────────────────────────────────
// AIAssistant Component
// ─────────────────────────────────────────────
const SKILLS = [
  { id: 'general', name: 'General Tutor', icon: <Sparkles className="w-4 h-4" />, color: 'text-accent' },
  { id: 'science', name: 'Science & Nature', icon: <Globe className="w-4 h-4" />, color: 'text-accent2' },
  { id: 'math', name: 'Mathematics', icon: <BrainCircuit className="w-4 h-4" />, color: 'text-success' },
  { id: 'english', name: 'English & Grammar', icon: <BookOpen className="w-4 h-4" />, color: 'text-warning' },
  { id: 'history', name: 'History & Geography', icon: <Network className="w-4 h-4" />, color: 'text-error' },
];

export default function AIMentor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeSkill, setActiveSkill] = useState('general');
  const [history, setHistory] = useState([]);
  
  const endRef = useRef(null);
  const { addToast } = useToastStore();

  const fetchChatHistory = async () => {
    try {
      const response = await api.get('/chat');
      if (response.data) {
        setMessages(response.data.messages.map(m => ({
          id: m._id,
          role: m.role,
          content: m.content
        })));
        setActiveSkill(response.data.activeSkill || 'general');
      }
    } catch (err) {
      console.error("Fetch chat history error:", err);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text = input) => {
    const messageText = typeof text === 'string' ? text : input;
    if (!messageText.trim()) return;

    // Optimistic UI update
    const userMsg = { id: Date.now(), role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    if (typeof text !== 'string') setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('/chat', {
        content: messageText,
        activeSkill: activeSkill
      });

      if (response.data) {
        // Update messages from server response
        setMessages(response.data.messages.map(m => ({
          id: m._id,
          role: m.role,
          content: m.content
        })));
        
        // Add to history list (client side for UI)
        const firstWords = messageText.split(' ').slice(0, 3).join(' ');
        if (!history.includes(firstWords)) {
          setHistory(prev => [firstWords, ...prev.slice(0, 9)]);
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      addToast('Failed to connect to AI Tutor', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await api.delete('/chat');
      setMessages([]);
      setHistory([]);
      addToast('Chat history cleared', 'success');
      // Re-fetch to get the welcome message
      fetchChatHistory();
    } catch (err) {
      addToast('Failed to clear history', 'error');
    }
  };

  const suggestions = [
    { text: "Explain the Water Cycle", icon: <Globe className="w-4 h-4" /> },
    { text: "How to add fractions?", icon: <BrainCircuit className="w-4 h-4" /> },
    { text: "Nouns vs Adjectives", icon: <BookOpen className="w-4 h-4" /> }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-24 pb-6 px-4 md:px-6">
        <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar — Knowledge Cores */}
          <div className="lg:w-72 flex flex-col gap-6">
            <div className="glass p-5 rounded-3xl flex flex-col shadow-sm border border-muted">
              <h3 className="font-display font-bold text-primary mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <BrainCircuit className="w-5 h-5 text-accent" /> Knowledge Cores
              </h3>
              <div className="space-y-2">
                {SKILLS.map((skill) => (
                  <button 
                    key={skill.id}
                    onClick={() => {
                      setActiveSkill(skill.id);
                      addToast(`Switched to ${skill.name}`, 'info');
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl text-sm font-bold transition-all border ${
                      activeSkill === skill.id 
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]' 
                        : 'bg-white/50 text-textMuted border-muted hover:border-accent hover:text-accent'
                    }`}
                  >
                    <span className={activeSkill === skill.id ? 'text-white' : skill.color}>{skill.icon}</span>
                    {skill.name}
                  </button>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="glass p-5 rounded-3xl flex-1 flex flex-col shadow-sm border border-muted hidden lg:flex overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-primary flex items-center gap-2 text-sm uppercase tracking-wider">
                  <History className="w-4 h-4 text-textMuted" /> Recent
                </h3>
                <button onClick={handleClearHistory} className="text-textMuted hover:text-error transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {history.map((topic, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(topic)}
                    className="w-full text-left p-3 rounded-xl text-xs font-bold text-textSecondary bg-white/30 border border-transparent hover:border-accent/30 hover:bg-white/60 hover:text-primary transition-all truncate"
                  >
                    {topic}...
                  </button>
                ))}
                {history.length === 0 && (
                  <p className="text-center text-xs text-textMuted mt-8 italic">No recent chats</p>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 glass rounded-[2.5rem] flex flex-col overflow-hidden relative border-accent/20 border-2 shadow-2xl">
            
            {/* Header */}
            <div className="bg-white/80 p-5 border-b border-muted flex items-center justify-between backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="relative">
                   <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-white shadow-lg">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-primary flex items-center gap-2">
                    SkillTrove AI <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full uppercase tracking-tighter">Pro</span>
                  </h2>
                  <p className="text-xs font-bold text-success flex items-center gap-1">
                    Active Core: {SKILLS.find(s => s.id === activeSkill)?.name}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-xl bg-muted/30 text-textMuted hover:bg-muted/50 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-white/20">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-4 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-muted text-accent'
                      }`}>
                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <div className={`p-5 rounded-[1.5rem] shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-white border border-muted text-textPrimary rounded-tl-none'
                      }`}>
                        <SimpleMarkdown content={msg.content} />
                        <p className={`text-[10px] mt-3 opacity-40 font-bold uppercase tracking-widest ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-start">
                    <div className="flex gap-4">
                      <div className="w-9 h-9 rounded-xl bg-white border border-muted text-accent flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="px-6 py-4 rounded-[1.5rem] bg-white border border-muted rounded-tl-none flex gap-2 items-center shadow-sm">
                        <span className="w-2 h-2 bg-accent rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/80 border-t border-muted backdrop-blur-md">
              <AnimatePresence>
                {messages.length < 5 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 mb-4 overflow-hidden"
                  >
                    {suggestions.map((s, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          setInput(s.text);
                          handleSend(s.text);
                        }}
                        className="text-xs font-bold flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-muted hover:border-accent hover:text-accent hover:bg-accent/5 transition-all shadow-sm"
                      >
                        {s.icon} {s.text}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="relative flex items-center group">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={`Message SkillTrove AI (${SKILLS.find(s => s.id === activeSkill)?.name})...`}
                  className="w-full bg-white border-2 border-muted rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-accent transition-all shadow-sm group-hover:border-muted/80"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="absolute right-2 w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-accent transition-all shadow-lg hover:scale-105"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </div>
              <p className="text-[10px] text-center text-textMuted mt-4 font-medium">
                AI may produce inaccurate information about campus events. Always verify with official portals.
              </p>
            </div>
            
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
      `}} />
    </PageTransition>
  );
}
