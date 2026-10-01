import React from 'react';
import { User, FileText, Image as ImageIcon, Music, Film } from 'lucide-react';
import type { Message } from '../../shared/types.js';

interface UserMessageProps {
  message: Message;
}

export const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <div className="flex justify-end my-4 animate-slide-up">
      <div className="max-w-[85%] md:max-w-[75%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-brand-600 to-brand-700 text-white p-4 shadow-lg">
        {/* Attachments preview */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {message.attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-black/25 border border-white/10 text-xs backdrop-blur-sm"
              >
                {att.media_type === 'image' && <ImageIcon className="w-4 h-4 text-cyan-300" />}
                {att.media_type === 'audio' && <Music className="w-4 h-4 text-emerald-300" />}
                {att.media_type === 'video' && <Film className="w-4 h-4 text-rose-300" />}
                {att.media_type === 'document' && <FileText className="w-4 h-4 text-amber-300" />}
                <span className="font-medium max-w-[140px] truncate">{att.original_filename}</span>
              </div>
            ))}
          </div>
        )}

        {/* Content text */}
        <div className="text-sm md:text-base whitespace-pre-wrap leading-relaxed font-normal">
          {message.content}
        </div>

        {/* Timestamp */}
        <div className="text-[10px] text-brand-200/70 text-right mt-1.5 font-mono">
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
