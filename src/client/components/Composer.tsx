import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  Globe,
  Compass,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  X,
  Loader2,
  StopCircle,
} from 'lucide-react';
import { AudioRecorder } from './AudioRecorder.js';
import { api } from '../api/client.js';
import type { Attachment } from '../../shared/types.js';

interface ComposerProps {
  onSend: (data: {
    content: string;
    attachmentIds: string[];
    enableWebSearch: boolean;
    enableDeepResearch: boolean;
  }) => void;
  isLoading?: boolean;
  onStopGeneration?: () => void;
  conversationId?: string;
}

export const Composer: React.FC<ComposerProps> = ({
  onSend,
  isLoading = false,
  onStopGeneration,
  conversationId,
}) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [enableDeepResearch, setEnableDeepResearch] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileFilterAccept, setFileFilterAccept] = useState<string>('*');

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [content]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingFiles(true);
    setShowAttachMenu(false);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await api.uploadFile(file, conversationId);
        if (res.success && res.data) {
          setAttachments((prev) => [...prev, res.data!]);
        } else {
          alert(`Failed to upload ${file.name}: ${res.error?.message}`);
        }
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingFiles(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAudioRecordingComplete = async (audioFile: File) => {
    setShowRecorder(false);
    setUploadingFiles(true);
    try {
      const res = await api.uploadFile(audioFile, conversationId);
      if (res.success && res.data) {
        setAttachments((prev) => [...prev, res.data!]);
      }
    } catch (err: any) {
      alert('Failed to upload recording: ' + err.message);
    } finally {
      setUploadingFiles(false);
    }
  };

  const triggerFileInput = (accept: string) => {
    setFileFilterAccept(accept);
    setShowAttachMenu(false);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    if (!content.trim() && attachments.length === 0) return;

    onSend({
      content: content.trim(),
      attachmentIds: attachments.map((a) => a.id),
      enableWebSearch,
      enableDeepResearch,
    });

    setContent('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-accent-cyan" />;
      case 'audio':
        return <Music className="w-3.5 h-3.5 text-accent-emerald" />;
      case 'video':
        return <Film className="w-3.5 h-3.5 text-accent-rose" />;
      case 'document':
      default:
        return <FileText className="w-3.5 h-3.5 text-brand-400" />;
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Audio Recorder Drawer */}
      {showRecorder && (
        <div className="mb-3">
          <AudioRecorder
            onRecordingComplete={handleAudioRecordingComplete}
            onCancel={() => setShowRecorder(false)}
          />
        </div>
      )}

      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-surface-900/60 rounded-xl border border-white/5">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-lg bg-surface-800 border border-white/10 text-xs text-slate-200"
            >
              {getMediaIcon(att.media_type)}
              <span className="font-medium max-w-[150px] truncate" title={att.original_filename}>
                {att.original_filename}
              </span>
              <span className="text-[10px] text-slate-400">
                ({(att.file_size / 1024).toFixed(0)} KB)
              </span>
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                title="Remove attachment"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={fileFilterAccept}
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* Main Composer Box */}
      <div className="glass-panel rounded-2xl p-2.5 shadow-2xl transition-all border border-white/10 focus-within:border-brand-500/50 focus-within:ring-2 focus-within:ring-brand-500/20">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything, upload docs, audio, video, images, or research..."
          rows={1}
          className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm md:text-base resize-none focus:outline-none px-3 pt-2 pb-1 max-h-[180px] leading-relaxed"
        />

        {/* Toolbar Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
          {/* Left Controls: Attachments, Mic, Search & Deep Research Toggles */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Attachment Button & Popup Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                disabled={uploadingFiles}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/5"
                title="Attach files"
              >
                {uploadingFiles ? (
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                ) : (
                  <Paperclip className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Attach</span>
              </button>

              {showAttachMenu && (
                <div className="absolute left-0 bottom-full mb-2 w-48 p-1 rounded-xl bg-surface-900 border border-white/10 shadow-2xl z-30 animate-fade-in text-xs">
                  <button
                    type="button"
                    onClick={() => triggerFileInput('image/*')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <span>Upload Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerFileInput('.pdf,.doc,.docx,.txt,.csv,.json,.md')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4 text-brand-400" />
                    <span>Upload Document</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerFileInput('audio/*')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Music className="w-4 h-4 text-emerald-400" />
                    <span>Upload Audio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerFileInput('video/*')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Film className="w-4 h-4 text-rose-400" />
                    <span>Upload Video</span>
                  </button>
                </div>
              )}
            </div>

            {/* Microphone Button */}
            <button
              type="button"
              onClick={() => setShowRecorder(!showRecorder)}
              className={`p-2 text-xs rounded-lg transition-all border ${
                showRecorder
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/5'
              }`}
              title="Record voice"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Web Search Toggle */}
            <button
              type="button"
              onClick={() => {
                setEnableWebSearch(!enableWebSearch);
                if (!enableWebSearch) setEnableDeepResearch(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all border ${
                enableWebSearch
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 border-white/5'
              }`}
              title="Enable live Google Search grounding"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Search</span>
            </button>

            {/* Deep Research Toggle */}
            <button
              type="button"
              onClick={() => {
                setEnableDeepResearch(!enableDeepResearch);
                if (!enableDeepResearch) setEnableWebSearch(true);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all border ${
                enableDeepResearch
                  ? 'bg-brand-500/25 text-brand-300 border-brand-500/50 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 border-white/5'
              }`}
              title="Activate multi-stage Deep Research engine"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Deep Research</span>
            </button>
          </div>

          {/* Right Controls: Send / Stop */}
          <div className="flex items-center gap-2">
            {isLoading && onStopGeneration ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="flex items-center gap-1 px-3 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all shadow-lg"
              >
                <StopCircle className="w-4 h-4" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={(!content.trim() && attachments.length === 0) || uploadingFiles}
                className="flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed group"
                title="Send message (Enter)"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
