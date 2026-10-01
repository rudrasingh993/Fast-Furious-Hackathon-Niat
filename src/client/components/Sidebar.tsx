import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  Sparkles,
  Brain,
  Plus,
  MessageSquare,
  Search,
  Compass,
  Database,
  FolderArchive,
  History,
  Settings,
  Trash2,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react';
import { api } from '../api/client.js';
import type { Conversation } from '../../shared/types.js';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const fetchConversations = async () => {
    try {
      const res = await api.getConversations();
      if (res.success && res.data) {
        setConversations(res.data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchConversations();
  }, [conversationId]);

  const handleNewChat = async () => {
    setLoading(true);
    try {
      const res = await api.createConversation({ title: 'New Conversation' });
      if (res.success && res.data) {
        setConversations((prev) => [res.data!, ...prev]);
        navigate(`/app/chat/${res.data.id}`);
        onCloseMobile?.();
      }
    } catch (err) {
      console.error('Error creating chat:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      await api.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) {
        navigate('/app');
      }
    } catch {}
  };

  const navItems = [
    { to: '/app', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', exact: true },
    { to: '/app/chat', icon: <MessageSquare className="w-4 h-4" />, label: 'Multimodal Chat' },
    { to: '/app/search', icon: <Search className="w-4 h-4" />, label: 'Web & Deep Search' },
    { to: '/app/research', icon: <Compass className="w-4 h-4" />, label: 'Deep Research' },
    { to: '/app/knowledge', icon: <Database className="w-4 h-4" />, label: 'Knowledge Base' },
    { to: '/app/library', icon: <FolderArchive className="w-4 h-4" />, label: 'Upload Library' },
    { to: '/app/history', icon: <History className="w-4 h-4" />, label: 'Full History' },
    { to: '/app/settings', icon: <Settings className="w-4 h-4" />, label: 'Settings' },
  ];

  return (
    <aside className="w-64 h-full flex flex-col bg-[#0D0D0D] border-r border-white/[0.08] select-none text-[#B5B5B0]">
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/[0.08]">
        <NavLink
          to="/app"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 font-bold text-base text-white tracking-tight hover:opacity-90 transition-opacity"
        >
          <img src="/logo.svg" alt="Multi Mind AI" className="w-7 h-7 rounded-full shadow-inner border border-white/10" />
          <span>Multi Mind AI</span>
        </NavLink>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          type="button"
          onClick={handleNewChat}
          disabled={loading}
          className="btn-primary-pill w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold shadow-md active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Core Navigation Links */}
      <nav className="px-3 py-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white/[0.08] text-white border border-white/15 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Recent Chats Section */}
      <div className="flex-1 flex flex-col min-h-0 px-3 mt-4 border-t border-white/[0.06] pt-3">
        <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-neutral-400 uppercase px-2 mb-2">
          <span>Recent Chats</span>
          <span className="text-[10px] font-mono text-neutral-400 font-normal">
            {conversations.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {conversations.length === 0 ? (
            <div className="px-2 py-4 text-center text-xs text-neutral-400">
              No conversations yet. Start a new chat!
            </div>
          ) : (
            conversations.slice(0, 15).map((conv) => {
              const isActive = conversationId === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    navigate(`/app/chat/${conv.id}`);
                    onCloseMobile?.();
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-white/[0.08] text-white font-medium border border-white/15'
                      : 'text-neutral-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400 group-hover:text-white" />
                    <span className="truncate">{conv.title || 'Untitled Chat'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all"
                    title="Delete chat"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Gemini 2.5 Flash</span>
        </div>
        <span className="text-[10px] font-mono">v1.0.0</span>
      </div>
    </aside>
  );
};
