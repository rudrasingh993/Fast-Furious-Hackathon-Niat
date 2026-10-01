import React, { useState } from 'react';
import { Search, Globe, MessageSquare, Database, ExternalLink, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../api/client.js';
import { MarkdownRenderer } from '../components/MarkdownRenderer.js';
import { useNavigate } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'web' | 'conversations' | 'knowledge'>('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    web?: any;
    conversations?: any[];
    knowledge?: any[];
  } | null>(null);

  const navigate = useNavigate();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await api.unifiedSearch(query.trim());
      if (res.success && res.data) {
        setResults(res.data);
      }
    } catch (err) {
      console.error('Unified search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-5xl mx-auto w-full space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Search className="w-5 h-5 text-accent-cyan" />
          <span>Unified Web & Workspace Search</span>
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Search the live web with Google Search grounding, your conversation history, and extracted knowledge base.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="relative">
        <div className="glass-panel rounded-2xl p-2 flex items-center shadow-xl border border-white/10 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20">
          <div className="pl-3 pr-2 text-slate-400">
            <Search className="w-5 h-5 text-accent-cyan" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across web grounding, conversations, facts, and documents..."
            className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none px-2 py-1.5"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-brand-600 hover:opacity-95 text-white font-medium text-xs shadow-md transition-all disabled:opacity-40"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Search</span>}
          </button>
        </div>
      </form>

      {/* Tabs */}
      {results && (
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Results
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('web')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'web'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web Grounded ({results.web?.sources?.length || 0})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('conversations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'conversations'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chats ({results.conversations?.length || 0})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('knowledge')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'knowledge'
                ? 'bg-accent-bronze/20 text-emerald-300 border border-accent-bronze/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Knowledge ({results.knowledge?.length || 0})</span>
          </button>
        </div>
      )}

      {/* Results Container */}
      {results && (
        <div className="space-y-6">
          {/* Web Search Section */}
          {(activeTab === 'all' || activeTab === 'web') && results.web && (
            <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Live Grounded Web Synthesis</h3>
              </div>

              <div className="text-slate-200 text-sm mb-4">
                <MarkdownRenderer content={results.web.answer} />
              </div>

              {/* Source Cards */}
              {results.web.sources && results.web.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="text-xs font-medium text-slate-400 mb-2">Sources Consulted:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {results.web.sources.map((s: any, idx: number) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all text-xs group"
                      >
                        <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono mb-1">
                          <span className="truncate">{s.domain || 'Source'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                        <div className="font-medium text-slate-200 group-hover:text-white line-clamp-2">
                          {s.title}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Conversations Section */}
          {(activeTab === 'all' || activeTab === 'conversations') && results.conversations && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-semibold text-white">Matching Conversations</h3>
              </div>

              {results.conversations.length === 0 ? (
                <div className="text-xs text-slate-400 p-4 rounded-xl bg-white/[0.02]">
                  No matching chat titles found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.conversations.map((c: any) => (
                    <div
                      key={c.id}
                      onClick={() => navigate(`/app/chat/${c.id}`)}
                      className="p-3.5 rounded-xl glass-panel-subtle border border-white/5 hover:border-brand-500/30 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-medium text-xs text-slate-200 group-hover:text-white">
                          {c.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          {c.category} • {new Date(c.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Knowledge Section */}
          {(activeTab === 'all' || activeTab === 'knowledge') && results.knowledge && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-accent-gold" />
                <h3 className="text-sm font-semibold text-white">Extracted Knowledge Items</h3>
              </div>

              {results.knowledge.length === 0 ? (
                <div className="text-xs text-slate-400 p-4 rounded-xl bg-white/[0.02]">
                  No matching knowledge entities found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.knowledge.map((k: any) => (
                    <div key={k.id} className="p-3.5 rounded-xl glass-panel-subtle border border-white/5">
                      <div className="flex items-center justify-between text-[10px] text-accent-gold font-mono mb-1">
                        <span>{k.knowledge_type.toUpperCase()}</span>
                        <span>Confidence: {((k.confidence || 0.9) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="font-semibold text-xs text-slate-200 mb-1">{k.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-2">
                        {JSON.stringify(k.content)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

