import React, { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  Trash2,
  Tag,
  CheckCircle2,
  Users,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { api } from '../api/client.js';
import type { KnowledgeItem } from '../../shared/types.js';

export const KnowledgePage: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [extractText, setExtractText] = useState('');
  const [extracting, setExtracting] = useState(false);

  useEffect(() => {
    loadKnowledge();
  }, []);

  const loadKnowledge = async () => {
    setLoading(true);
    try {
      const res = await api.listKnowledge();
      if (res.success && res.data) {
        setItems(res.data);
      }
    } catch (err) {
      console.error('Failed to load knowledge:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractText.trim()) return;

    setExtracting(true);
    try {
      const res = await api.extractKnowledge({
        source_type: 'text',
        text_content: extractText.trim(),
      });
      if (res.success && res.data) {
        setItems((prev) => [...res.data!, ...prev]);
        setExtractText('');
        setShowExtractModal(false);
      }
    } catch (err: any) {
      alert('Extraction failed: ' + err.message);
    } finally {
      setExtracting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this knowledge item?')) return;
    try {
      await api.deleteKnowledge(id);
      setItems((prev) => prev.filter((k) => k.id !== id));
    } catch (err: any) {
      alert('Failed to delete item: ' + err.message);
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'entities':
        return <Users className="w-4 h-4 text-accent-cyan" />;
      case 'facts':
        return <CheckCircle2 className="w-4 h-4 text-accent-emerald" />;
      case 'tasks':
        return <Calendar className="w-4 h-4 text-accent-rose" />;
      case 'topics':
      default:
        return <Tag className="w-4 h-4 text-brand-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>Extracted Knowledge Base</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Structured entities, verified facts, tasks, and conceptual relationships extracted from conversations and documents.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowExtractModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-lg transition-all w-fit"
        >
          <Sparkles className="w-4 h-4" />
          <span>Extract From Text</span>
        </button>
      </div>

      {/* Extract Modal */}
      {showExtractModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl glass-panel shadow-2xl border border-white/10 animate-fade-in">
            <h3 className="text-base font-semibold text-white mb-2">
              Extract Structured Knowledge
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Paste articles, notes, or documentation to automatically extract people, organizations, dates, key facts, and tasks into permanent knowledge cards.
            </p>

            <form onSubmit={handleExtract} className="space-y-4">
              <textarea
                value={extractText}
                onChange={(e) => setExtractText(e.target.value)}
                placeholder="Paste text content here..."
                rows={6}
                required
                className="w-full p-3 rounded-xl glass-input text-white text-xs placeholder-slate-500 focus:outline-none resize-none"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExtractModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={extracting || !extractText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium transition-all shadow-md disabled:opacity-50"
                >
                  {extracting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Extract Knowledge</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Knowledge Cards Grid */}
      {items.length === 0 ? (
        <div className="text-center py-16 rounded-2xl glass-panel-subtle border border-white/5">
          <Database className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No knowledge items yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Extract knowledge from your conversations or documents using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl glass-panel border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-white/5">{getCategoryIcon(item.knowledge_type)}</div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.knowledge_type.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all"
                      title="Delete card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-semibold text-xs text-white mb-2 leading-snug">{item.title}</h4>

                {/* Structured contents rendering */}
                <div className="space-y-1.5 text-xs text-slate-300">
                  {item.content.items && Array.isArray(item.content.items) && (
                    <ul className="space-y-1 list-disc pl-4 text-[11px] text-slate-400">
                      {item.content.items.map((it: string, idx: number) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                  )}

                  {item.content.people && Array.isArray(item.content.people) && item.content.people.length > 0 && (
                    <div className="text-[11px] text-slate-400">
                      <span className="text-cyan-400 font-medium">People: </span>
                      {item.content.people.join(', ')}
                    </div>
                  )}

                  {item.content.organizations && Array.isArray(item.content.organizations) && item.content.organizations.length > 0 && (
                    <div className="text-[11px] text-slate-400">
                      <span className="text-brand-300 font-medium">Organizations: </span>
                      {item.content.organizations.join(', ')}
                    </div>
                  )}

                  {item.content.tasks && Array.isArray(item.content.tasks) && (
                    <ul className="space-y-1 list-disc pl-4 text-[11px] text-rose-300">
                      {item.content.tasks.map((t: string, idx: number) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                <span>Confidence: {((item.confidence || 0.95) * 100).toFixed(0)}%</span>
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
