import React, { useState } from 'react';
import { ExternalLink, Globe, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import type { SearchSource, Citation } from '../../shared/types.js';

interface SourceListProps {
  sources?: SearchSource[];
  citations?: Citation[];
}

export const SourceList: React.FC<SourceListProps> = ({ sources = [], citations = [] }) => {
  const [expanded, setExpanded] = useState(false);

  // Combine and deduplicate sources
  const allSources: Array<{ title: string; url: string; domain?: string; snippet?: string }> = [];

  for (const s of sources) {
    if (!allSources.some((item) => item.url === s.url)) {
      allSources.push({
        title: s.title || s.domain || 'External Source',
        url: s.url,
        domain: s.domain,
        snippet: s.snippet,
      });
    }
  }

  for (const c of citations) {
    if (!allSources.some((item) => item.url === c.url)) {
      allSources.push({
        title: c.title || c.domain || 'Reference Citation',
        url: c.url,
        domain: c.domain || undefined,
        snippet: c.citation_text || undefined,
      });
    }
  }

  if (allSources.length === 0) return null;

  const displayList = expanded ? allSources : allSources.slice(0, 3);

  return (
    <div className="my-3 p-3 rounded-xl bg-surface-900/80 border border-white/10 text-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <Globe className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Verified Sources & Grounded Citations ({allSources.length})</span>
        </div>
        {allSources.length > 3 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                +{allSources.length - 3} more <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {displayList.map((src, idx) => {
          let domain = src.domain;
          if (!domain) {
            try {
              domain = new URL(src.url).hostname.replace('www.', '');
            } catch {
              domain = 'external';
            }
          }

          return (
            <a
              key={idx}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-brand-500/30 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400 mb-1">
                  <span className="font-mono truncate">{domain}</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:text-brand-300 transition-opacity" />
                </div>
                <div className="font-medium text-slate-200 line-clamp-2 group-hover:text-white transition-colors">
                  {src.title}
                </div>
              </div>
              {src.snippet && (
                <div className="mt-1 text-[11px] text-slate-400 line-clamp-1 italic">
                  "{src.snippet}"
                </div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
};
