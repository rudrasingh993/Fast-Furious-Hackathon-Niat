import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Loader2,
  Layers,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { api } from '../api/client.js';
import { MarkdownRenderer } from '../components/MarkdownRenderer.js';
import type { ResearchSession } from '../../shared/types.js';

export const ResearchPage: React.FC = () => {
  const [objective, setObjective] = useState('');
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [activeSession, setActiveSession] = useState<ResearchSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const res = await api.listResearch();
      if (res.success && res.data) {
        setSessions(res.data);
        if (res.data.length > 0 && !activeSession) {
          setActiveSession(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Error loading research sessions:', err);
    }
  };

  const handleStartResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim()) return;

    setLoading(true);
    try {
      const res = await api.createResearch(objective.trim());
      if (res.success && res.data) {
        setSessions((prev) => [res.data!, ...prev]);
        setActiveSession(res.data!);
        setObjective('');

        // Poll for completion or updates with timeout and error handling
        let pollCount = 0;
        let consecutiveErrors = 0;
        const interval = setInterval(async () => {
          pollCount++;
          try {
            const check = await api.getResearch(res.data!.id);
            if (check.success && check.data) {
              consecutiveErrors = 0;
              setActiveSession(check.data);
              if (check.data.status === 'completed' || check.data.status === 'failed') {
                clearInterval(interval);
                loadSessions();
              }
            } else {
              consecutiveErrors++;
              if (consecutiveErrors >= 5) {
                clearInterval(interval);
              }
            }
          } catch {
            consecutiveErrors++;
            if (consecutiveErrors >= 5) {
              clearInterval(interval);
            }
          }
          if (pollCount >= 90) {
            clearInterval(interval);
          }
        }, 2000);
      }
    } catch (err: any) {
      alert('Failed to launch deep research: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (activeSession?.synthesis) {
      navigator.clipboard.writeText(activeSession.synthesis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
      {/* Left Sidebar: Sessions List */}
      <div className="w-full md:w-80 border-r border-white/5 bg-[#0B0B0B]/80 p-4 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-semibold text-brand-100 text-sm">
            <Compass className="w-4 h-4 text-white/80" />
            <span>Research Sessions</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#8E8E89]">
            {sessions.length}
          </span>
        </div>

        {/* New Research Input Form */}
        <form onSubmit={handleStartResearch} className="mb-4">
          <div className="p-3 rounded-2xl card-glass-subtle border border-white/10 space-y-2">
            <label className="text-[11px] font-medium text-[#D8D8D4] block">
              Launch Deep Investigation
            </label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="e.g. Comparative analysis of multimodal AI architectures in 2026..."
              rows={2}
              className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-brand-100 placeholder-[#666] focus:outline-none focus:border-white/30 resize-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !objective.trim()}
              className="btn-primary-pill w-full py-2 flex items-center justify-center gap-1.5 text-xs font-semibold disabled:opacity-40"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Start Research</span>
            </button>
          </div>
        </form>

        {/* Sessions list */}
        <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {sessions.length === 0 ? (
            <div className="text-xs text-[#666] text-center py-8">
              No research sessions yet. Enter an objective above!
            </div>
          ) : (
            sessions.map((s) => {
              const isSelected = activeSession?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setActiveSession(s)}
                  className={`p-3 rounded-xl text-xs cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-white/10 border-white/20 text-brand-100 shadow-sm'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-[#A0A09B]'
                  }`}
                >
                  <div className="font-medium line-clamp-1 mb-1">{s.title || s.objective}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span
                      className={`capitalize ${
                        s.status === 'completed'
                          ? 'text-accent-gold'
                          : s.status === 'failed'
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {s.status}
                    </span>
                    <span>{new Date(s.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Area: Active Research Session Details */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {!activeSession ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Compass className="w-12 h-12 text-brand-400 mb-3 opacity-60 animate-pulse" />
            <h3 className="text-lg font-semibold text-white mb-1">Deep Research Workspace</h3>
            <p className="text-xs text-slate-400 max-w-md">
              Select an existing research session on the left or enter a new research objective to decompose sub-problems, verify facts across web sources, and synthesize an authoritative report.
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Session Header Card */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 text-[10px] font-mono border border-brand-500/30 uppercase">
                    Status: {activeSession.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(activeSession.created_at).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {activeSession.objective}
                </h2>
              </div>

              {activeSession.synthesis && (
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-accent-gold" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied Report' : 'Copy Report'}</span>
                </button>
              )}
            </div>

            {/* Research Progress Pipeline */}
            <div className="p-4 rounded-xl glass-panel-subtle border border-white/5">
              <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-400" />
                <span>Deep Research Progress & Decomposition</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div
                  className={`p-2.5 rounded-lg border ${
                    activeSession.research_plan
                      ? 'bg-accent-bronze/10 border-accent-bronze/30 text-emerald-300'
                      : 'bg-white/5 border-white/5 text-slate-500'
                  }`}
                >
                  ✓ Intent Decomposed
                </div>
                <div
                  className={`p-2.5 rounded-lg border ${
                    activeSession.sources && activeSession.sources.length > 0
                      ? 'bg-accent-bronze/10 border-accent-bronze/30 text-emerald-300'
                      : 'bg-white/5 border-white/5 text-slate-500'
                  }`}
                >
                  ✓ {activeSession.sources?.length || 0} Sources Queried
                </div>
                <div
                  className={`p-2.5 rounded-lg border ${
                    activeSession.findings && activeSession.findings.length > 0
                      ? 'bg-accent-bronze/10 border-accent-bronze/30 text-emerald-300'
                      : 'bg-white/5 border-white/5 text-slate-500'
                  }`}
                >
                  ✓ Claims Compared
                </div>
                <div
                  className={`p-2.5 rounded-lg border ${
                    activeSession.synthesis
                      ? 'bg-accent-bronze/10 border-accent-bronze/30 text-emerald-300'
                      : 'bg-white/5 border-white/5 text-slate-500'
                  }`}
                >
                  {activeSession.synthesis ? '✓ Report Synthesized' : 'Synthesizing...'}
                </div>
              </div>
            </div>

            {/* Sub Questions & Search Queries */}
            {activeSession.research_plan && (
              <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Deconstructed Research Plan</h3>
                <div>
                  <div className="text-xs text-slate-400 mb-2">Target Sub-Questions:</div>
                  <ul className="space-y-1 pl-4 list-disc text-xs text-slate-300">
                    {activeSession.research_plan.sub_questions?.map((sq, idx) => (
                      <li key={idx}>{sq}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs text-slate-400 mb-2">Search Queries Formulated:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSession.research_plan.search_queries?.map((q, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-cyan-300"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Corroborated Findings & Contradictions */}
            {activeSession.findings && activeSession.findings.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Corroborated Findings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeSession.findings.map((f, idx) => (
                    <div key={idx} className="p-4 rounded-xl glass-panel-subtle border border-white/5">
                      <div className="flex items-center justify-between text-[10px] text-accent-gold font-mono mb-2">
                        <span>Finding #{idx + 1}</span>
                        <span>Confidence: {((f.confidence || 0.9) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="text-xs font-medium text-slate-100 mb-2">{f.claim}</div>
                      <div className="text-[11px] text-slate-400 italic mb-3">"{f.evidence}"</div>
                      {f.source_urls && f.source_urls.length > 0 && (
                        <div className="text-[10px] text-slate-500 truncate font-mono">
                          Source: {f.source_urls[0]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Identified Contradictions / Debates */}
            {activeSession.contradictions && activeSession.contradictions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Conflicting Evidence & Points of Contention</span>
                </h3>
                {activeSession.contradictions.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-2"
                  >
                    <div className="font-semibold text-amber-200">{c.topic}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-300">
                      <div className="p-2.5 rounded-lg bg-black/20">
                        <span className="text-[10px] font-mono text-cyan-400 block mb-1">
                          Perspective A:
                        </span>
                        {c.position_a}
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/20">
                        <span className="text-[10px] font-mono text-rose-400 block mb-1">
                          Perspective B:
                        </span>
                        {c.position_b}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Final Synthesized Research Report */}
            {activeSession.synthesis && (
              <div className="p-6 md:p-8 rounded-2xl glass-panel border border-brand-500/30">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10 text-brand-300 font-semibold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Synthesized Deep Research Report</span>
                </div>
                <MarkdownRenderer content={activeSession.synthesis} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

