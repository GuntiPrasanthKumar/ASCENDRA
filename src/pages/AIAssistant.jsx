import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Code, BookOpen, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import PageTransition from '../components/common/PageTransition';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: 'Hello! I am your SkillTrove AI Tutor. How can I help you with your studies today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      const aiMsg = { 
        id: Date.now() + 1, 
        role: 'ai', 
        content: "Here's a quick explanation:\n\n```javascript\nconst isLearning = true;\nif(isLearning) {\n  console.log('You are doing great!');\n}\n```\n\nKeep up the good work! Do you want to try a practice question?"
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestions = [
    { text: "Explain React Hooks", icon: <Code className="w-4 h-4" /> },
    { text: "Generate a quiz on Thermodynamics", icon: <BookOpen className="w-4 h-4" /> },
    { text: "Help me understand Big O", icon: <BrainCircuit className="w-4 h-4" /> }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-24 pb-6 px-6">
        <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex gap-6">
          
          {/* Sidebar */}
          <div className="hidden lg:flex w-64 flex-col gap-4">
            <div className="glass p-6 rounded-3xl flex-1 flex flex-col">
              <h3 className="font-display font-bold text-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" /> History
              </h3>
              <div className="flex-1 overflow-y-auto space-y-2">
                {['React basics', 'Data Structures prep', 'Physics doubts'].map((topic, i) => (
                  <button key={i} className="w-full text-left p-3 rounded-xl text-sm font-medium text-textMuted hover:bg-white/50 hover:text-primary transition-colors truncate">
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 glass rounded-3xl flex flex-col overflow-hidden relative border-accent/20 border-2">
            
            {/* Header */}
            <div className="bg-white/60 p-4 border-b border-muted flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-primary">AI Tutor</h2>
                  <p className="text-xs text-success flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> Online
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? 'bg-primary text-white' : 'bg-accent/10 text-accent'
                      }`}>
                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-white/80 border border-muted text-textPrimary rounded-tl-none'
                      }`}>
                        <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="p-4 rounded-2xl bg-white/80 border border-muted rounded-tl-none flex gap-1 items-center">
                        <span className="w-2 h-2 bg-textMuted rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-textMuted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-textMuted rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/60 border-t border-muted">
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {suggestions.map((s, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(s.text)}
                      className="text-xs flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-muted hover:border-accent hover:text-accent transition-colors"
                    >
                      {s.icon} {s.text}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full bg-white border border-muted rounded-full py-4 pl-6 pr-16 focus:outline-none focus:border-accent transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute right-2 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-primary transition-colors"
                >
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
