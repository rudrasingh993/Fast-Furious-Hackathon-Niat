import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Shield, Save, Check, MessageSquare, FolderArchive, Compass, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../api/client.js';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [counts, setCounts] = useState({
    conversations: 0,
    uploads: 0,
    research: 0,
    knowledge: 0,
  });

  useEffect(() => {
    if (user) setName(user.name);

    async function loadStats() {
      try {
        const [c, u, r, k] = await Promise.all([
          api.getConversations(),
          api.listUploads(),
          api.listResearch(),
          api.listKnowledge(),
        ]);
        setCounts({
          conversations: c.data?.length || 0,
          uploads: u.data?.length || 0,
          research: r.data?.length || 0,
          knowledge: k.data?.length || 0,
        });
      } catch {}
    }
    loadStats();
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await updateUser({ name: name.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <User className="w-5 h-5 text-brand-400" />
          <span>User Profile & Workspace Account</span>
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Manage your account credentials, display name, and inspect workspace resource utilization.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-white/5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-400 text-white font-bold text-xl flex items-center justify-center shadow-xl border border-white/20">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user.name}</h3>
            <div className="text-xs text-slate-400 flex items-center gap-2 font-mono mt-0.5">
              <span>{user.email}</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Active Session
              </span>
            </div>
          </div>
        </div>

        {/* Edit Name Form */}
        <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2.5 rounded-xl glass-input text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-slate-500 text-xs cursor-not-allowed"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium transition-all shadow-md disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Update Name'}</span>
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <Check className="w-4 h-4" /> Updated!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Workspace Activity Stats */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Workspace Activity & Resource Attribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl glass-panel-subtle border border-white/5">
            <div className="flex items-center gap-2 text-brand-400 text-xs mb-1">
              <MessageSquare className="w-4 h-4" />
              <span>Total Chats</span>
            </div>
            <div className="text-xl font-bold text-white">{counts.conversations}</div>
          </div>

          <div className="p-4 rounded-xl glass-panel-subtle border border-white/5">
            <div className="flex items-center gap-2 text-cyan-400 text-xs mb-1">
              <FolderArchive className="w-4 h-4" />
              <span>Files Stored</span>
            </div>
            <div className="text-xl font-bold text-white">{counts.uploads}</div>
          </div>

          <div className="p-4 rounded-xl glass-panel-subtle border border-white/5">
            <div className="flex items-center gap-2 text-indigo-400 text-xs mb-1">
              <Compass className="w-4 h-4" />
              <span>Research Runs</span>
            </div>
            <div className="text-xl font-bold text-white">{counts.research}</div>
          </div>

          <div className="p-4 rounded-xl glass-panel-subtle border border-white/5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs mb-1">
              <Database className="w-4 h-4" />
              <span>Knowledge Items</span>
            </div>
            <div className="text-xl font-bold text-white">{counts.knowledge}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
