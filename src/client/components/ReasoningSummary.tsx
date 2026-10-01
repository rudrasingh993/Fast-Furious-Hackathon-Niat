import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, CheckCircle2, AlertTriangle, Layers, Search, ShieldCheck } from 'lucide-react';
import type { ReasoningSummary as ReasoningSummaryType } from '../../shared/types.js';

interface ReasoningSummaryProps {
  summary: ReasoningSummaryType;
}

export const ReasoningSummary: React.FC<ReasoningSummaryProps> = ({ summary }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!summary) return null;

  return (
    <div className="my-3 rounded-xl border border-brand-500/20 bg-brand-950/20 backdrop-blur-md overflow-hidden text-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left text-slate-300 hover:text-white hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-brand-500/20 text-brand-400 flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="font-medium text-slate-200">Reasoning & Synthesis Summary</span>
          <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 text-[10px] font-mono border border-brand-500/20">
            {summary.intent || 'Analysis'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[11px] hidden sm:inline">
            {isOpen ? 'Hide breakdown' : 'View inputs & verification'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 py-3 border-t border-brand-500/15 bg-black/20 space-y-3 animate-fade-in">
          {/* Inputs Considered */}
          {summary.inputs && summary.inputs.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 font-medium mb-1">
                <Layers className="w-3.5 h-3.5 text-brand-400" />
                <span>Modalities & Inputs Analyzed</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pl-5">
                {summary.inputs.map((inp, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 text-[11px]"
                  >
                    {inp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Methodological Steps */}
          {summary.method && summary.method.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 font-medium mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Methodology & Evidence Evaluation</span>
              </div>
              <ul className="pl-5 space-y-1 text-slate-300 list-disc">
                {summary.method.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Observations */}
          {summary.key_observations && summary.key_observations.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 font-medium mb-1">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>Key Contextual Observations</span>
              </div>
              <ul className="pl-5 space-y-1 text-slate-300 list-disc">
                {summary.key_observations.map((obs, idx) => (
                  <li key={idx}>{obs}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Limitations / Transparency */}
          {summary.limitations && summary.limitations.length > 0 && (
            <div className="pt-1 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-amber-400/90 font-medium mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Scope, Boundaries & Transparency</span>
              </div>
              <ul className="pl-5 space-y-1 text-slate-400 list-disc text-[11px]">
                {summary.limitations.map((lim, idx) => (
                  <li key={idx}>{lim}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-white/5 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Factual integrity verified
            </span>
            <span>Private chain-of-thought protected</span>
          </div>
        </div>
      )}
    </div>
  );
};
