import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  ArrowRight,
  Compass,
  Globe,
  FileText,
  Mic,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  Shield,
  Layers,
  Database,
  Search,
  ChevronRight,
  Play,
  Copy,
  ExternalLink,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'document' | 'voice' | 'research'>('chat');

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-brand-500/30 selection:text-brand-200">
      {/* Navigation Header */}
      <header className="fixed top-0 inset-x-0 h-16 border-b border-white/5 bg-[#070b12]/80 backdrop-blur-md z-50 flex items-center justify-between px-6 md:px-12">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-white tracking-tight">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <Brain className="w-4 h-4" />
          </div>
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Multi Mind AI
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-xs md:text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-xl shadow-lg transition-all active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Universal Multimodal Intelligence & Deep Research Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight max-w-4xl leading-[1.15] mb-6">
          One unified workspace for <br />
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Text, Vision, Voice, Video & Deep Research
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Interact seamlessly across seven information modalities in one coherent conversation canvas. Grounded with live web search, deep research synthesis, and persistent knowledge extraction.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link
            to="/signup"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-medium text-sm shadow-xl transition-all active:scale-95"
          >
            <span>Launch Multi Mind AI Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/app"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-sm font-medium transition-all"
          >
            <span>Open Workspace Demo</span>
          </Link>
        </div>

        {/* Live Interactive Multimodal Demo Showcase Preview */}
        <div className="w-full max-w-5xl mx-auto rounded-2xl glass-panel border border-white/10 shadow-2xl p-4 sm:p-6 text-left relative overflow-hidden">
          {/* Top Mock Window Bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-slate-500">
                Multi Mind AI Workspace · Multimodal Canvas
              </span>
            </div>
            {/* Interactive Showcase Tabs */}
            <div className="flex gap-1.5 p-1 rounded-lg bg-white/5 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeTab === 'chat' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Multimodal Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('document')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeTab === 'document' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Document & Voice
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('research')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeTab === 'research' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Deep Research
              </button>
            </div>
          </div>

          {/* Interactive Showcase Content */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {/* User Message */}
              <div className="flex gap-3 justify-end">
                <div className="max-w-xl p-3.5 rounded-2xl rounded-tr-sm bg-brand-600/30 border border-brand-500/30 text-xs text-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono text-[10px]">
                      📷 architecture_diagram.png (1.2 MB)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                      🌐 Grounded Search ON
                    </span>
                  </div>
                  Can you inspect this system topology and cross-reference latest frontier multimodal models to evaluate cross-attention throughput?
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-semibold text-slate-300 flex-shrink-0">
                  U
                </div>
              </div>

              {/* Assistant Message with Reasoning Summary & Citations */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-3">
                  {/* Transparent Reasoning Drawer */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                    <div className="flex items-center gap-2 text-brand-300 font-medium mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Transparent Reasoning Summary</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      • Intent: Multimodal architecture evaluation & benchmarking<br />
                      • Inputs: 1 PNG image analyzed (3 sub-modules identified) + 4 Google Search grounded sources<br />
                      • Method: Extracted visual tensor flow → Cross-referenced Gemini multimodal embedding benchmarks → Synthesized cross-attention findings
                    </p>
                  </div>

                  {/* AI Response Text */}
                  <div className="p-4 rounded-2xl rounded-tl-sm bg-white/[0.03] border border-white/10 text-xs text-slate-300 leading-relaxed space-y-2">
                    <p>
                      Based on visual inspection of your topology diagram, the bottleneck occurs at the late-fusion projection layer. Multi Mind AI cross-referenced current benchmark reports:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                      <li><strong>Cross-Attention Throughput:</strong> Direct multimodal cross-attention outperforms late-fusion OCR pipelines by <strong>3.2×</strong> in latency.</li>
                      <li><strong>Memory Footprint:</strong> Native multimodal tokenization saves approximately 40% VRAM over decoupled vision encoders.</li>
                    </ul>
                  </div>

                  {/* Grounded Citations */}
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
                      <ExternalLink className="w-3 h-3 text-cyan-400" />
                      arxiv.org/abs/multimodal-frontier
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
                      <ExternalLink className="w-3 h-3 text-brand-400" />
                      deepmind.google/research/gemini
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'document' && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="font-medium text-white">Q3_Quarterly_Financial_Report.pdf</span>
                  <span className="text-[10px] text-slate-500 font-mono">1.8 MB · 42 pages</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Document Extracted</span>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                "Multi Mind AI parsed 42 pages, extracted balance sheet tables, identified key margin variances, and correlated them with your voice note transcript from the board meeting."
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-[10px] text-slate-400">Operating Revenue</div>
                  <div className="text-sm font-semibold text-white mt-0.5">$28.4M (+18% YoY)</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-[10px] text-slate-400">Audio Meeting Action Items</div>
                  <div className="text-sm font-semibold text-emerald-400 mt-0.5">4 Tasks Assigned</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-[10px] text-slate-400">Contradictions Detected</div>
                  <div className="text-sm font-semibold text-amber-400 mt-0.5">1 Discrepancy Flagged</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'research' && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span className="font-medium text-white">
                    Deep Research: Next-Gen Solid State Battery Commercialization
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono text-[10px]">
                  Round 3 of 4 · 18 Sources
                </span>
              </div>
              <div className="space-y-1.5 text-slate-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Decomposed objective into 4 orthogonal search angles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Evaluated electrolyte degradation claims across Nature Materials & IEEE journals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Generated comprehensive 12-page executive synthesis with source citations</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Multimodal Pillars Grid */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
            Designed for Universal Multimodal Intelligence
          </h2>
          <p className="text-sm text-slate-400">
            Multi Mind AI unifies seven distinct information modalities into one intuitive interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Contextual Memory */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Contextual Memory & Chat</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintains full conversation history with transparent reasoning summaries, personalized tone adjustments, and persistent Supabase PostgreSQL storage.
            </p>
          </div>

          {/* Card 2: Document Intelligence */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Document Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload PDFs, Word DOCX, CSVs, and Markdown. Ask the assistant to summarize, extract facts, identify contradictions, and cite specific passages.
            </p>
          </div>

          {/* Card 3: Deep Research Engine */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Autonomous Deep Research</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deconstructs complex research objectives into multi-round queries, evaluates competing claims, detects contradictions, and synthesizes structured reports.
            </p>
          </div>

          {/* Card 4: Voice & Audio Understanding */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Microphone & Audio Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Record voice memos directly with the built-in browser recorder or upload MP3/WAV/WebM audio for transcription, meeting summaries, and action items.
            </p>
          </div>

          {/* Card 5: Image & Screenshot Vision */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-rose-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Visual Inspection & Vision</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect diagrams, photographed notes, screenshots, and visual charts with precise object grounding and layout analysis.
            </p>
          </div>

          {/* Card 6: Knowledge Base & Entities */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Structured Knowledge Cards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatically extract entities, people, organizations, dates, and conceptual relationships into persistent cards for long-term discovery.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 px-6 md:px-12 border-t border-white/5 bg-gradient-to-b from-transparent to-brand-950/20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
          Ready to experience true multimodal assistance?
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto mb-8">
          Join Multi Mind AI today and explore knowledge across text, media, documents, and web research.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm shadow-xl transition-all active:scale-95"
        >
          <span>Get Started with Multi Mind AI</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
