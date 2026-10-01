import React, { useEffect, useRef } from 'react';
import { Sparkles, FileSearch, Compass, Image, Mic } from 'lucide-react';
import { UserMessage } from './UserMessage.js';
import { AssistantMessage } from './AssistantMessage.js';
import { StreamingMessage } from './StreamingMessage.js';
import type { Message } from '../../shared/types.js';

interface MessageListProps {
  messages: Message[];
  streamingContent?: string;
  isStreaming?: boolean;
  onSuggestionClick?: (prompt: string) => void;
  onRegenerate?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  streamingContent,
  isStreaming,
  onSuggestionClick,
  onRegenerate,
  onDelete,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, isStreaming]);

  if (messages.length === 0 && !isStreaming) {
    const suggestions = [
      {
        icon: <FileSearch className="w-5 h-5 text-brand-400" />,
        title: 'Analyze & Summarize Documents',
        prompt: 'Please extract key facts, executive summary, and action items from this document.',
      },
      {
        icon: <Compass className="w-5 h-5 text-accent-cyan" />,
        title: 'Deep Research on Any Topic',
        prompt: 'Conduct a deep research report on the state of multimodal generative AI in 2026, comparing top architectures.',
      },
      {
        icon: <Image className="w-5 h-5 text-accent-gold" />,
        title: 'Visual Screenshot & Diagram Inspection',
        prompt: 'Analyze this UI screenshot: identify layout hierarchy, color palettes, and code improvement suggestions.',
      },
      {
        icon: <Mic className="w-5 h-5 text-rose-400" />,
        title: 'Audio Memo Transcription & Notes',
        prompt: 'Transcribe this voice recording, summarize the main talking points, and identify follow-up tasks.',
      },
    ];

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto my-auto animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-xl mb-4 border border-white/20">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
          How can Multi Mind AI help you today?
        </h2>
        <p className="text-sm text-slate-400 mb-8 max-w-md">
          Interact across text, documents, audio recordings, video, images, or live web search in one unified workspace.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSuggestionClick?.(s.prompt)}
              className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-brand-500/30 transition-all text-left group shadow-sm"
            >
              <div className="mb-2 p-2 w-fit rounded-lg bg-white/5 group-hover:scale-105 transition-transform">
                {s.icon}
              </div>
              <div className="text-xs font-semibold text-slate-200 group-hover:text-white mb-1">
                {s.title}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-2">
                {s.prompt}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-4xl mx-auto w-full">
      {messages.map((m) =>
        m.role === 'user' ? (
          <UserMessage key={m.id} message={m} />
        ) : (
          <AssistantMessage
            key={m.id}
            message={m}
            onRegenerate={onRegenerate}
            onDelete={onDelete}
          />
        )
      )}

      {isStreaming && <StreamingMessage content={streamingContent || ''} />}

      <div ref={bottomRef} />
    </div>
  );
};

