import React, { useState } from 'react';
import { Copy, Check, Bookmark, BookmarkCheck, RotateCcw, Trash2, Bot, Sparkles } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer.js';
import { ReasoningSummary } from './ReasoningSummary.js';
import { SourceList } from './SourceList.js';
import { api } from '../api/client.js';
import type { Message } from '../../shared/types.js';

interface AssistantMessageProps {
  message: Message;
  onRegenerate?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({
  message,
  onRegenerate,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleSave = async () => {
    try {
      if (isSaved) {
        await api.unsaveResponse(message.id);
        setIsSaved(false);
      } else {
        await api.saveResponse(message.id);
        setIsSaved(true);
      }
    } catch {}
  };

  const sources = message.metadata?.sources || [];

  return (
    <div className="flex gap-3 my-4 animate-slide-up group">
      {/* Bot Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md border border-white/10 mt-1">
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="flex-1 max-w-[92%] md:max-w-[85%]">
        {/* Transparent Reasoning Summary Drawer */}
        {message.reasoning_summary && (
          <ReasoningSummary summary={message.reasoning_summary} />
        )}

        {/* Message Bubble */}
        <div className="rounded-2xl rounded-tl-sm p-4 bg-surface-900/90 border border-white/10 text-slate-100 shadow-md">
          <MarkdownRenderer content={message.content || ''} />

          {/* Sources and Citations list */}
          {(sources.length > 0 || (message.citations && message.citations.length > 0)) && (
            <SourceList sources={sources} citations={message.citations} />
          )}

          {/* Actions & Timestamp */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5 text-xs text-slate-400">
            <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/5 hover:text-white transition-colors"
                title="Copy response"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleSave}
                className={`flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/5 transition-colors ${
                  isSaved ? 'text-amber-400 font-medium' : 'hover:text-white'
                }`}
                title={isSaved ? 'Saved in library' : 'Save response'}
              >
                {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 fill-current" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              {onRegenerate && (
                <button
                  type="button"
                  onClick={() => onRegenerate(message.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/5 hover:text-white transition-colors"
                  title="Regenerate answer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Regenerate</span>
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(message.id)}
                  className="p-1 rounded-md hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-[10px] text-slate-500 font-mono">
              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
