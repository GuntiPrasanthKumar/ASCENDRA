import React, { useState, useEffect } from 'react';
import FloatingAIHelper from './FloatingAIHelper';
import InfoBlock from './InfoBlock';
import ExampleBlock from './ExampleBlock';
import KeyPointCard from './KeyPointCard';
import SummaryCard from './SummaryCard';
import KeyTakeawayCard from './KeyTakeawayCard';
import { Image, Copy, Check, CheckCircle2 } from 'lucide-react';

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[10px] font-bold transition-all"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function LessonContent({ contentBlocks = [], onAskAI }) {
  const [selectedText, setSelectedText] = useState('');
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, visible: false });

  const handleSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (!text) {
      setMenuPos(prev => ({ ...prev, visible: false }));
      return;
    }

    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setMenuPos({
        top: window.scrollY + rect.top - 70,
        left: window.scrollX + rect.left + rect.width / 2 - 120,
        visible: true,
      });
      setSelectedText(text);
    } catch {
      setMenuPos(prev => ({ ...prev, visible: false }));
    }
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  const renderBlock = (block) => {
    switch (block.type) {
      case 'heading':
        return (
          <h3 key={block.id} className="text-base md:text-lg font-display font-extrabold text-slate-900 pt-4 pb-1 border-b border-slate-100">
            {block.value}
          </h3>
        );

      case 'paragraph':
        return (
          <p key={block.id} className="text-sm font-medium text-slate-600 leading-relaxed">
            {block.value}
          </p>
        );

      case 'list':
        return (
          <ul key={block.id} className="space-y-2 pl-1">
            {(Array.isArray(block.value) ? block.value : [block.value]).map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        );

      case 'info_card':
        return <InfoBlock key={block.id} value={block.value} />;

      case 'example_card':
      case 'code_block': {
        const isSQL = block.language === 'sql';
        const isText = block.language === 'text';
        return (
          <div key={block.id} className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs">
            {/* Language label */}
            <div className={`flex items-center justify-between px-4 py-2 ${isText ? 'bg-slate-100' : 'bg-slate-900'}`}>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isText ? 'text-slate-500' : 'text-slate-400'}`}>
                {block.language || 'code'}
              </span>
              {!isText && <CopyButton code={block.value} />}
            </div>
            <pre className={`p-4 text-[12px] font-mono leading-relaxed overflow-x-auto ${
              isText
                ? 'bg-slate-50 text-slate-700'
                : 'bg-slate-950 text-emerald-300'
            }`}>
              <code>{block.value}</code>
            </pre>
          </div>
        );
      }

      case 'important_note':
        return (
          <div key={block.id} className="p-4 rounded-2xl bg-amber-500/8 border border-amber-400/30">
            <span className="block text-[9px] font-black uppercase tracking-widest text-amber-600 mb-1.5">⚠️ Important Note</span>
            <p className="text-xs font-semibold text-amber-800 leading-relaxed">{block.value}</p>
          </div>
        );

      case 'image_placeholder':
        return (
          <div key={block.id} className="p-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center my-2 select-none">
            <Image className="w-8 h-8 text-slate-300 mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{block.value}</span>
          </div>
        );

      case 'summary':
        return <SummaryCard key={block.id} value={block.value} />;

      case 'key_takeaway':
        return <KeyTakeawayCard key={block.id} value={block.value} />;

      default:
        return null;
    }
  };

  return (
    <div className="relative flex flex-col gap-5 select-text">
      {/* Floating AI Helper menu on text selection */}
      {menuPos.visible && (
        <FloatingAIHelper
          top={menuPos.top}
          left={menuPos.left}
          selectedText={selectedText}
          onAction={(query) => {
            onAskAI(query);
            setMenuPos(prev => ({ ...prev, visible: false }));
          }}
        />
      )}

      {contentBlocks.map(renderBlock)}
    </div>
  );
}
