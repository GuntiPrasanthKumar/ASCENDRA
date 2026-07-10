import React, { useState, useEffect } from 'react';
import FloatingAIHelper from './FloatingAIHelper';
import InfoBlock from './InfoBlock';
import ExampleBlock from './ExampleBlock';
import KeyPointCard from './KeyPointCard';
import SummaryCard from './SummaryCard';
import KeyTakeawayCard from './KeyTakeawayCard';
import { Image } from 'lucide-react';

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
        visible: true
      });
      setSelectedText(text);
    } catch (e) {
      setMenuPos(prev => ({ ...prev, visible: false }));
    }
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    return () => {
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, []);

  return (
    <div className="relative flex flex-col gap-6 select-text">
      {/* Floating AI Helper menu */}
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

      {/* Structured Content Blocks mapper */}
      {contentBlocks.map((block) => {
        switch (block.type) {
          case 'heading':
            return (
              <h3 key={block.id} className="text-lg md:text-xl font-display font-extrabold text-primary pt-3 pb-1 border-b border-slate-100">
                {block.value}
              </h3>
            );
          case 'paragraph':
            return (
              <p key={block.id} className="text-xs font-semibold text-slate-655 leading-relaxed">
                {block.value}
              </p>
            );
          case 'info_card':
            return <InfoBlock key={block.id} value={block.value} />;
          case 'example_card':
            return <ExampleBlock key={block.id} value={block.value} language={block.language} />;
          case 'important_note':
            return (
              <div key={block.id} className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-amber-800 text-[11px] font-bold">
                <span className="block text-[8px] uppercase tracking-widest text-amber-600 mb-1">Important Note</span>
                {block.value}
              </div>
            );
          case 'code_block':
            return <ExampleBlock key={block.id} value={block.value} language={block.language} />;
          case 'image_placeholder':
            return (
              <div key={block.id} className="p-8 rounded-[2rem] border border-dashed border-slate-200/50 bg-slate-50 flex flex-col items-center justify-center text-center my-4 select-none">
                <Image className="w-8 h-8 text-slate-350 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{block.value}</span>
              </div>
            );
          case 'summary':
            return <SummaryCard key={block.id} value={block.value} />;
          case 'key_takeaway':
            return <KeyTakeawayCard key={block.id} value={block.value} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
