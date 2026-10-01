import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderArchive,
  Upload,
  FileText,
  Image as ImageIcon,
  Music,
  Film,
  Download,
  Trash2,
  Sparkles,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { api } from '../api/client.js';
import type { Attachment, MediaType } from '../../shared/types.js';

export const LibraryPage: React.FC = () => {
  const [uploads, setUploads] = useState<Attachment[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await api.listUploads();
      if (res.success && res.data) {
        setUploads(res.data);
      }
    } catch (err) {
      console.error('Failed to load uploads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const res = await api.uploadFile(files[i]);
        if (res.success && res.data) {
          setUploads((prev) => [res.data!, ...prev]);
        }
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      await api.deleteUpload(id);
      setUploads((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert('Failed to delete file: ' + err.message);
    }
  };

  const handleStartChatWithAttachment = async (attachment: Attachment) => {
    const convRes = await api.createConversation({
      title: `Analyze: ${attachment.original_filename}`,
      category: 'DOCUMENT_ANALYSIS',
    });

    if (convRes.success && convRes.data) {
      navigate(`/app/chat/${convRes.data.id}`);
    }
  };

  const filtered = uploads.filter((u) => {
    if (activeTab === 'all') return true;
    return u.media_type === activeTab;
  });

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-accent-cyan" />;
      case 'audio':
        return <Music className="w-5 h-5 text-accent-emerald" />;
      case 'video':
        return <Film className="w-5 h-5 text-accent-rose" />;
      case 'document':
      default:
        return <FileText className="w-5 h-5 text-brand-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-cyan-400" />
            <span>Uploaded Assets & Media Library</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Store, view, and inspect images, audio voice memos, video, and documents.
          </p>
        </div>

        {/* Upload Trigger Button */}
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-lg transition-all cursor-pointer w-fit">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>{uploading ? 'Processing File...' : 'Upload File'}</span>
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {['all', 'document', 'image', 'audio', 'video'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {tab === 'all' ? `All Files (${uploads.length})` : `${tab}s`}
          </button>
        ))}
      </div>

      {/* Grid of Files */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl glass-panel-subtle border border-white/5">
          <FolderArchive className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No files found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Upload images, documents, audio recordings, or videos using the button above or attach them directly in a chat.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((file) => (
            <div
              key={file.id}
              className="p-4 rounded-2xl glass-panel border border-white/5 hover:border-brand-500/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-white/5">{getMediaIcon(file.media_type)}</div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {file.processing_status}
                  </span>
                </div>

                <div className="font-semibold text-xs text-white truncate mb-1" title={file.original_filename}>
                  {file.original_filename}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mb-3">
                  {(file.file_size / 1024).toFixed(0)} KB • {new Date(file.created_at).toLocaleDateString()}
                </div>

                {file.extracted_text && (
                  <div className="p-2 rounded-lg bg-black/20 text-[11px] text-slate-400 line-clamp-3 mb-3 font-mono">
                    {file.extracted_text}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => handleStartChatWithAttachment(file)}
                  className="flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze in Chat</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={file.url || `/api/uploads/${file.id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Download / view file"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(file.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
