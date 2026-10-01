import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  MessageSquare,
  Compass,
  Search,
  FileText,
  Mic,
  Database,
  ArrowRight,
  FolderArchive,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../api/client.js';
import type { Conversation, Attachment, ResearchSession, KnowledgeItem } from '../../shared/types.js';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [uploads, setUploads] = useState<Attachment[]>([]);
  const [research, setResearch] = useState<ResearchSession[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [convRes, upRes, resRes, knRes] = await Promise.all([
          api.getConversations(),
          api.listUploads(),
          api.listResearch(),
          api.listKnowledge(),
        ]);

        if (convRes.success && convRes.data) setConversations(convRes.data);
        if (upRes.success && upRes.data) setUploads(upRes.data);
        if (resRes.success && resRes.data) setResearch(resRes.data);
        if (knRes.success && knRes.data) setKnowledge(knRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const handleStartNewChat = async () => {
    const res = await api.createConversation({ title: 'New Conversation' });
    if (res.success && res.data) {
      navigate(`/app/chat/${res.data.id}`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl glass-panel border border-brand-500/20 bg-gradient-to-r from-brand-950/40 via-surface-900/60 to-indigo-950/30 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-medium border border-brand-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back, {user?.name || 'Explorer'}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
            Multimodal Intelligence at Your Fingertips
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6">
            Combine text prompts with images, audio voice memos, video, and documents. Run live web search grounding or trigger multi-step deep research reports.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleStartNewChat}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium text-xs shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Start Multimodal Chat</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/research')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium transition-all"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Launch Deep Research</span>
            </button>
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-brand-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-2xl glass-panel-subtle border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Conversations</div>
            <div className="text-xl font-bold text-white mt-1">{conversations.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel-subtle border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Uploaded Files</div>
            <div className="text-xl font-bold text-white mt-1">{uploads.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <FolderArchive className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel-subtle border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Deep Research</div>
            <div className="text-xl font-bold text-white mt-1">{research.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel-subtle border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Knowledge Items</div>
            <div className="text-xl font-bold text-white mt-1">{knowledge.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Quick Launchpad Actions */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={handleStartNewChat}
            className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-brand-500/30 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-white mb-1">New Multimodal Chat</div>
            <div className="text-[11px] text-slate-400">Ask questions, attach images, audio, or video</div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/research')}
            className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-indigo-500/30 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-white mb-1">Deep Research</div>
            <div className="text-[11px] text-slate-400">Multi-query synthesis & contradiction analysis</div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/search')}
            className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-cyan-500/30 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Search className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-white mb-1">Live Web Search</div>
            <div className="text-[11px] text-slate-400">Google Search grounded queries with citations</div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/library')}
            className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/30 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-white mb-1">Upload Documents</div>
            <div className="text-[11px] text-slate-400">Process PDF, DOCX, CSV, and extract insights</div>
          </button>
        </div>
      </div>

      {/* Two Column Section: Recent Chats & Recent Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Chats */}
        <div className="p-5 rounded-2xl glass-panel border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-400" />
              <span>Recent Conversations</span>
            </h3>
            <button
              onClick={() => navigate('/app/history')}
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {conversations.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">No conversations yet.</div>
            ) : (
              conversations.slice(0, 5).map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => navigate(`/app/chat/${conv.id}`)}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors"
                >
                  <div className="truncate pr-2">
                    <div className="text-xs font-medium text-slate-200 truncate">
                      {conv.title || 'Untitled Chat'}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                      <span>{conv.category}</span>
                      <span>•</span>
                      <span>{new Date(conv.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="p-5 rounded-2xl glass-panel border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-cyan-400" />
              <span>Recent Uploaded Assets</span>
            </h3>
            <button
              onClick={() => navigate('/app/library')}
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium"
            >
              <span>Library</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {uploads.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">
                No uploads yet. Drag & drop or attach files in chat!
              </div>
            ) : (
              uploads.slice(0, 5).map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-colors"
                >
                  <div className="truncate pr-2">
                    <div className="text-xs font-medium text-slate-200 truncate">
                      {att.original_filename}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {att.media_type.toUpperCase()} • {(att.file_size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                    {att.processing_status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
