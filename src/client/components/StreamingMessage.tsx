import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer.js';

interface StreamingMessageProps {
  content: string;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({ content }) => {
  return (
    <div className="flex gap-3 my-4 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md border border-white/10 mt-1">
        <Sparkles className="w-4 h-4 animate-pulse" />
      </div>

      <div className="flex-1 max-w-[92%] md:max-w-[85%] rounded-2xl rounded-tl-sm p-4 bg-surface-900/90 border border-brand-500/30 text-slate-100 shadow-md">
        {content ? (
          <div>
            <MarkdownRenderer content={content} />
            <span className="inline-block w-2 h-4 ml-1 bg-brand-400 animate-pulse align-middle" />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
            <span>Multi Mind AI is analyzing and synthesizing response...</span>
          </div>
        )}
      </div>
    </div>
  );
};
