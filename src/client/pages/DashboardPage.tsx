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
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl card-glass border border-white/10 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] text-[#D8D8D4] text-xs font-medium border border-white/10 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
            <span>Welcome back, {user?.name || 'Explorer'}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-100 tracking-tight mb-2">
            Multimodal Intelligence at Your Fingertips
          </h2>
          <p className="text-xs md:text-sm text-[#A0A09B] leading-relaxed mb-6">
            Combine text prompts with images, audio voice memos, video, and documents. Run live web search grounding or trigger multi-step deep research reports.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleStartNewChat}
              className="btn-primary-pill flex items-center gap-2 text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Start Multimodal Chat</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/research')}
              className="btn-secondary-pill flex items-center gap-2 text-xs"
            >
              <Compass className="w-4 h-4 text-white/80" />
              <span>Launch Deep Research</span>
            </button>
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-radial-glow pointer-events-none opacity-40" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-2xl card-glass-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#8E8E89] font-medium">Conversations</div>
            <div className="text-xl font-bold text-brand-100 mt-1">{conversations.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 text-white/80 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl card-glass-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#8E8E89] font-medium">Uploaded Files</div>
            <div className="text-xl font-bold text-brand-100 mt-1">{uploads.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 text-white/80 flex items-center justify-center">
            <FolderArchive className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl card-glass-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#8E8E89] font-medium">Deep Research</div>
            <div className="text-xl font-bold text-brand-100 mt-1">{research.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 text-white/80 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl card-glass-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#8E8E89] font-medium">Knowledge Items</div>
            <div className="text-xl font-bold text-brand-100 mt-1">{knowledge.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 text-white/80 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Quick Launchpad Actions */}
      <div>
        <h3 className="text-sm font-semibold text-brand-100 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={handleStartNewChat}
            className="p-4 rounded-2xl card-glass-subtle hover:border-white/20 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-brand-100 mb-1">New Multimodal Chat</div>
            <div className="text-[11px] text-[#8E8E89]">Ask questions, attach images, audio, or video</div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/research')}
            className="p-4 rounded-2xl card-glass-subtle hover:border-white/20 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-brand-100 mb-1">Deep Research</div>
            <div className="text-[11px] text-[#8E8E89]">Multi-query synthesis & contradiction analysis</div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/search')}
            className="p-4 rounded-2xl card-glass-subtle hover:border-white/20 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Search className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-brand-100 mb-1">Live Web Search</div>
            <div className="text-[11px] text-[#8E8E89]">Google Search grounded queries with citations</div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/library')}
            className="p-4 rounded-2xl card-glass-subtle hover:border-white/20 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-brand-100 mb-1">Upload Documents</div>
            <div className="text-[11px] text-[#8E8E89]">Process PDF, DOCX, CSV, and extract insights</div>
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
                  <span className="px-2 py-0.5 rounded text-[10px] bg-accent-bronze/10 text-accent-gold font-mono border border-accent-bronze/20">
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

