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
  ChevronDown,
  Play,
  Copy,
  ExternalLink,
  Check,
  Cpu,
  Zap,
  Terminal,
  Code,
  Network,
  Menu,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Reveal } from '../components/motion/Reveal';
import { TextReveal } from '../components/motion/TextReveal';
import { Magnetic } from '../components/motion/Magnetic';

export const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'document' | 'voice' | 'research'>('chat');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Multi Mind AI process multiple modalities simultaneously?',
      a: 'Multi Mind AI utilizes a unified tensor-fusion architecture that embeds text, images, audio waveforms, video frames, and structured documents into a single high-dimensional context window. Cross-attention layers correlate visual landmarks with spoken words and textual references in real time.',
    },
    {
      q: 'What AI models power Multi Mind AI?',
      a: 'The platform integrates the latest Google Gemini 2.5 Pro and Gemini 2.5 Flash models with intelligent automatic fallback to Gemini 2.0 Flash and Imagen 3 for image generation, ensuring zero downtime and optimal cost-performance balance.',
    },
    {
      q: 'How does the Autonomous Deep Research engine operate?',
      a: 'When an objective is launched, the engine deconstructs it into orthogonal search queries, executes parallel multi-round web investigations with live Google grounding, extracts factual claims, detects contradictions across academic and industry sources, and compiles a comprehensive citation-backed report.',
    },
    {
      q: 'Is uploaded data and conversation history secure?',
      a: 'Yes. All user records, conversations, message embeddings, and uploaded assets are securely isolated with row-level security (RLS) in our Supabase PostgreSQL infrastructure, encrypted at rest and in transit.',
    },
    {
      q: 'Can I export research reports and structured knowledge cards?',
      a: 'Absolutely. Research reports can be copied in formatted GitHub-flavored Markdown or exported directly. Extracted knowledge cards are permanently retained in your personal knowledge base for cross-conversation queries.',
    },
  ];

  return (
    <div className="min-h-screen bg-[surface-950] text-brand-100 selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      {/* Background ambient lighting and technical grid */}
      <div className="fixed inset-0 bg-tech-grid opacity-60 pointer-events-none z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-radial-ambient pointer-events-none z-0" />

      {/* Floating Minimal Navigation Bar */}
      <nav className="fixed top-5 inset-x-0 z-50 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto h-14 rounded-full bg-surface-900/75 backdrop-blur-xl border border-white/[0.08] shadow-2xl px-4 sm:px-6 flex items-center justify-between transition-all">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.svg" alt="Multi Mind AI" className="w-7 h-7 rounded-full border border-white/15 shadow-inner group-hover:border-white/30 transition-colors" />
            <span className="font-semibold text-sm tracking-tight text-white/95">
              Multi Mind AI
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-brand-500">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#multimodal" className="hover:text-white transition-colors">Multimodal</a>
            <a href="#preview" className="hover:text-white transition-colors">Workspace</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          {/* Auth Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-medium text-brand-500 hover:text-white px-3 py-1.5 rounded-full transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="btn-primary-pill text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden max-w-md mx-auto mt-2 rounded-2xl bg-surface-800/95 backdrop-blur-2xl border border-white/10 p-4 shadow-2xl flex flex-col gap-3 text-xs font-medium text-brand-500">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white"
            >
              Features
            </a>
            <a
              href="#multimodal"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white"
            >
              Multimodal Engine
            </a>
            <a
              href="#preview"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white"
            >
              Workspace Preview
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white"
            >
              FAQ
            </a>
            <div className="pt-2 border-t border-white/10 flex gap-2">
              <Link
                to="/login"
                className="flex-1 py-2 rounded-full border border-white/15 text-center text-white"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="flex-1 btn-primary-pill py-2 text-center text-xs"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-36 sm:pt-44 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Eyebrow Pill */}
        <Reveal delay={0.2} direction="down">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] text-xs font-mono tracking-wider text-neutral-300 mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>THE FUTURE OF MULTIMODAL AI</span>
          </div>
        </Reveal>

        {/* Massive Editorial Headline */}
        <TextReveal delay={0.3}>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-editorial font-semibold text-gradient-champagne tracking-tight leading-[0.98] max-w-5xl mb-6">
            One Intelligent Platform.<br className="hidden sm:inline" />
            Every Modality.
          </h1>
        </TextReveal>

        {/* Short Description */}
        <Reveal delay={0.5}>
          <p className="text-sm sm:text-base md:text-lg text-brand-500 max-w-2xl mb-10 leading-relaxed font-normal">
            Understand, create, and synthesize across text, vision, audio waveforms, video files, and deep web research through one unified, persistent AI workspace.
          </p>
        </Reveal>

        {/* CTA Controls */}
        <Reveal delay={0.6}>
          <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-20 w-full sm:w-auto">
            <Magnetic>
              <Link
                to="/signup"
                className="btn-primary-pill w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                to="/app"
                className="btn-secondary-pill w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
              >
                <span>Explore Workspace</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </Magnetic>
          </div>
        </Reveal>

        {/* Hero Visual: Sophisticated AI Interface Preview (Inspired by Screenshot 2) */}
        <Reveal delay={0.8} direction="up" className="w-full">
          <div className="w-full rounded-[28px] card-glass p-3 sm:p-5 text-left relative overflow-hidden border border-white/[0.12] shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="ml-2 font-mono text-[11px] text-neutral-500 hidden sm:inline">
                multi-mind-workspace · v2.5.0
              </span>
            </div>

            {/* Interactive Mode Pills */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-black/40 border border-white/5 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  activeTab === 'chat'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Multimodal Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('document')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  activeTab === 'document'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Document & Voice
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('research')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  activeTab === 'research'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Deep Research
              </button>
            </div>

            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-accent-gold">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
              <span>ONLINE</span>
            </div>
          </div>

          {/* Interactive Workspace Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Main Conversation Canvas (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {activeTab === 'chat' && (
                <div className="space-y-3.5">
                  {/* User query card */}
                  <div className="flex justify-end">
                    <div className="max-w-xl p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-brand-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[10px]">
                          system_topology.png (1.4 MB)
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-neutral-300 font-mono text-[10px]">
                          Grounding: Active
                        </span>
                      </div>
                      Analyze this visual system architecture and benchmark cross-attention latency against decoupled OCR pipelines.
                    </div>
                  </div>

                  {/* AI Response Card */}
                  <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] space-y-3">
                    {/* Transparent reasoning summary */}
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-[11px] text-neutral-400">
                      <div className="flex items-center gap-1.5 text-neutral-300 font-mono text-[10px] uppercase tracking-wider mb-1">
                        <Sparkles className="w-3 h-3 text-white" />
                        <span>Transparent Reasoning Flow</span>
                      </div>
                      Extracted 4 node layers from topology diagram → Verified latency benchmarks from 3 research papers → Synthesized cross-modal throughput findings.
                    </div>

                    {/* AI Response text */}
                    <p className="text-xs text-brand-300 leading-relaxed">
                      Cross-attention multimodal tokenization bypasses decoupled OCR encoders entirely, resulting in an empirical <strong>3.2× speedup in time-to-first-token (TTFT)</strong> and a <strong>38% reduction in inference VRAM</strong> for dense visual schemas.
                    </p>

                    {/* Grounded Citation Badges */}
                    <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-neutral-300 flex items-center gap-1">
                        <ExternalLink className="w-2.5 h-2.5" /> arxiv.org/abs/multimodal-benchmark
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-neutral-300 flex items-center gap-1">
                        <ExternalLink className="w-2.5 h-2.5" /> deepmind.google/gemini-frontier
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'document' && (
                <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-neutral-300" />
                      <span className="font-semibold text-white">Q3_Financial_Audit_Report.pdf</span>
                      <span className="text-[10px] text-neutral-500 font-mono">48 pages · 2.4 MB</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-accent-bronze/10 text-accent-gold border border-accent-bronze/20 text-[10px]">
                      Extracted & Grounded
                    </span>
                  </div>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    "Multi Mind AI cross-referenced balance sheet lines with meeting audio notes: operating margins expanded 14.2% YoY, while recurring SaaS contracts represent 82% of top-line revenue."
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="text-[10px] text-neutral-400">Total Net Revenue</div>
                      <div className="text-sm font-bold text-white mt-1">$32.6M</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="text-[10px] text-neutral-400">Audio Sync Status</div>
                      <div className="text-sm font-bold text-accent-gold mt-1">100% Corroborated</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="text-[10px] text-neutral-400">Action Items Flagged</div>
                      <div className="text-sm font-bold text-white mt-1">5 Deliverables</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'research' && (
                <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-white animate-spin" />
                      <span className="font-semibold text-white">
                        Autonomous Investigation: Solid-State Battery Commercialization
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[10px]">
                      Round 3 of 4 · 22 Sources
                    </span>
                  </div>
                  <div className="space-y-2 text-neutral-400 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-accent-gold" />
                      <span>Formulated 4 orthogonal search angles across electrolyte chemistry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-accent-gold" />
                      <span>Evaluated 22 peer-reviewed journal papers and patent filings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-accent-gold" />
                      <span>Resolved conflicting cycle-life claims into unified executive synthesis</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Metric & Telemetry Strip (4 cols, inspired by Screenshot 2) */}
            <div className="lg:col-span-4 space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                  Active Model
                </div>
                <div className="text-sm font-semibold text-white mt-1 flex items-center justify-between">
                  <span>Gemini 2.5 Pro</span>
                  <span className="w-2 h-2 rounded-full bg-accent-gold" />
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">Multimodal Core Engine</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                  Context Window
                </div>
                <div className="text-sm font-semibold text-white mt-1">1,048,576 Tokens</div>
                <div className="text-[11px] text-neutral-400 mt-1">Native multimodal retention</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                  Web Grounding
                </div>
                <div className="text-sm font-semibold text-accent-gold mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Real-Time</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">Live Google Search grounding</div>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      {/* Trust & Model Compatibility Bar */}
      <section className="py-12 px-6 max-w-6xl mx-auto border-t border-white/[0.06] text-center relative z-10">
        <Reveal delay={0.2}>
          <p className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-6">
            Architected for frontier multimodal research & enterprise intelligence
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-40 hover:opacity-75 transition-opacity text-xs font-semibold tracking-wider text-neutral-300">
            <span>GEMINI 2.5 PRO</span>
            <span>GEMINI FLASH</span>
            <span>IMAGEN 3</span>
            <span>SUPABASE POSTGRES</span>
            <span>GOOGLE GROUNDING</span>
          </div>
        </Reveal>
      </section>

      {/* Bento Grid Features Section (Inspired by Reference Screenshot 3) */}
      <section id="features" className="py-24 sm:py-32 px-6 max-w-6xl mx-auto relative z-10">
        <Reveal delay={0.1}>
          <div className="max-w-2xl mb-16">
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
              Features & Capabilities
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Unified Multimodal Intelligence
            </h2>
            <p className="text-sm text-brand-500 leading-relaxed">
              Eliminate fragmented tools. Seamlessly correlate documents, spoken audio, visual charts, and autonomous research across a single cognitive canvas.
            </p>
          </div>
        </Reveal>

        {/* Editorial Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1: Large Feature Card (7 cols) with Orbital Rings (Inspired by Screenshot 3!) */}
          <Reveal delay={0.2} className="md:col-span-7 h-full">
            <div className="card-glass p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden group h-full">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mb-6">
                  <Network className="w-5 h-5 text-neutral-200" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2.5">
                  Autonomous Multimodal Engine
                </h3>
                <p className="text-xs sm:text-sm text-brand-500 max-w-md leading-relaxed">
                  Tokens from images, voice notes, PDFs, code files, and live web searches share a unified embedding space. Ask complex questions across multiple inputs simultaneously.
                </p>
              </div>

              {/* Subtle orbital ring graphic behind (matching reference screenshot 3) */}
              <div className="mt-10 sm:mt-16 relative h-40 flex items-center justify-center">
                <div className="absolute w-64 h-64 rounded-full border border-white/[0.06] animate-[spin_40s_linear_infinite]" />
                <div className="absolute w-44 h-44 rounded-full border border-white/[0.08]" />
                <div className="absolute w-24 h-24 rounded-full border border-white/[0.12] bg-white/[0.02]" />
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shadow-[0_0_30px_rgba(255,255,255,0.4)] z-10">
                  <Brain className="w-5 h-5" />
                </div>
                {/* Orbiting nodes */}
                <div className="absolute -top-1 left-1/4 p-2 rounded-xl bg-surface-200 border border-white/10 text-white shadow-lg">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="absolute bottom-2 right-1/4 p-2 rounded-xl bg-surface-200 border border-white/10 text-white shadow-lg">
                  <Mic className="w-4 h-4" />
                </div>
                <div className="absolute top-1/2 -right-2 p-2 rounded-xl bg-surface-200 border border-white/10 text-white shadow-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="absolute top-1/2 -left-2 p-2 rounded-xl bg-surface-200 border border-white/10 text-white shadow-lg">
                  <Compass className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Card 2: Right Card (5 cols) - Deep Autonomous Research */}
          <Reveal delay={0.3} className="md:col-span-5 h-full">
            <div className="card-glass p-7 sm:p-9 flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mb-6">
                  <Compass className="w-5 h-5 text-neutral-200" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2.5">
                  Multi-Round Deep Research
                </h3>
                <p className="text-xs sm:text-sm text-brand-500 leading-relaxed">
                  Deconstructs open-ended queries into targeted search rounds. Evaluates claims, flags contradictions, and synthesizes structured reports with citations.
                </p>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2 text-xs">
                <div className="text-[10px] font-mono text-neutral-400">RESEARCH PIPELINE</div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>1. Deconstruct Objective</span>
                  <span className="text-accent-gold font-mono text-[10px]">DONE</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>2. Multi-Round Search</span>
                  <span className="text-accent-gold font-mono text-[10px]">20 SOURCES</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>3. Detect Contradictions</span>
                  <span className="text-accent-gold font-mono text-[10px]">CORROBORATED</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>4. Synthesize Markdown</span>
                  <span className="text-white font-mono text-[10px]">READY</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Card 3: Bottom Left Card (5 cols) - Large Metric Typography */}
          <Reveal delay={0.4} className="md:col-span-5 h-full">
            <div className="card-glass p-7 sm:p-9 flex flex-col justify-between h-full">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">
                  SCALE & PERFORMANCE
                </div>
                <div className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight my-2">
                  10M+
                </div>
                <div className="text-base font-semibold text-neutral-200 mb-1">
                  AI Reasoning Requests
                </div>
                <p className="text-xs text-brand-500 leading-relaxed">
                  Powering rigorous analysis across enterprise research, legal audits, academic papers, and software architecture.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/[0.08] text-xs text-neutral-400">
                <Shield className="w-4 h-4 text-accent-gold" />
                <span>Full Supabase RLS isolation on every query</span>
              </div>
            </div>
          </Reveal>

          {/* Card 4: Bottom Right Card (7 cols) - Supported Modalities Dock */}
          <Reveal delay={0.5} className="md:col-span-7 h-full">
            <div className="card-glass p-7 sm:p-9 flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mb-6">
                  <Layers className="w-5 h-5 text-neutral-200" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2.5">
                  Every Modality. One Workspace.
                </h3>
                <p className="text-xs sm:text-sm text-brand-500 leading-relaxed">
                  Native support for PDFs, DOCX, CSVs, browser audio recordings, diagrams, screenshots, and structured knowledge extraction.
                </p>
              </div>

              {/* Monochrome Dock of Modalities (Inspired by Screenshot 3 bottom dock) */}
              <div className="mt-8 flex flex-wrap gap-2.5">
                <div className="p-3 rounded-2xl bg-surface-200 border border-white/10 flex items-center gap-2 text-xs font-medium text-white hover:border-white/20 transition-colors">
                  <FileText className="w-4 h-4 text-neutral-300" />
                  <span>PDF & Office Docs</span>
                </div>
                <div className="p-3 rounded-2xl bg-surface-200 border border-white/10 flex items-center gap-2 text-xs font-medium text-white hover:border-white/20 transition-colors">
                  <Mic className="w-4 h-4 text-neutral-300" />
                  <span>Voice & Audio Memos</span>
                </div>
                <div className="p-3 rounded-2xl bg-surface-200 border border-white/10 flex items-center gap-2 text-xs font-medium text-white hover:border-white/20 transition-colors">
                  <ImageIcon className="w-4 h-4 text-neutral-300" />
                  <span>Diagrams & Vision</span>
                </div>
                <div className="p-3 rounded-2xl bg-surface-200 border border-white/10 flex items-center gap-2 text-xs font-medium text-white hover:border-white/20 transition-colors">
                  <Globe className="w-4 h-4 text-neutral-300" />
                  <span>Google Search Grounding</span>
                </div>
                <div className="p-3 rounded-2xl bg-surface-200 border border-white/10 flex items-center gap-2 text-xs font-medium text-white hover:border-white/20 transition-colors">
                  <Database className="w-4 h-4 text-neutral-300" />
                  <span>Entity Knowledge Graph</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Multimodal Dataflow Section */}
      <section id="multimodal" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/[0.06] relative z-10">
        <Reveal delay={0.2} direction="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
              Tensor Pipeline
            </div>
            <h2 className="text-3xl sm:text-4xl font-editorial font-medium text-white tracking-tight mb-3">
              How Multimodal Processing Works
            </h2>
            <p className="text-xs sm:text-sm text-brand-500">
              Input diverse formats simultaneously. The core engine aligns multi-source tokens into unified reasoning.
            </p>
          </div>
        </Reveal>

        {/* Dataflow visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Inputs Column */}
          <Reveal delay={0.3} direction="right" className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
              <FileText className="w-4 h-4 text-neutral-300" />
              <div className="text-xs">
                <div className="font-semibold text-white">Documents & Code</div>
                <div className="text-neutral-400 text-[11px]">PDF, DOCX, CSV, MD</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
              <ImageIcon className="w-4 h-4 text-neutral-300" />
              <div className="text-xs">
                <div className="font-semibold text-white">Visuals & Diagrams</div>
                <div className="text-neutral-400 text-[11px]">PNG, JPEG, WebP, Schemas</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
              <Mic className="w-4 h-4 text-neutral-300" />
              <div className="text-xs">
                <div className="font-semibold text-white">Audio & Voice Notes</div>
                <div className="text-neutral-400 text-[11px]">MP3, WAV, Live Mic Recordings</div>
              </div>
            </div>
          </Reveal>

          {/* Central AI Engine */}
          <Reveal delay={0.5} direction="up">
            <div className="card-glass p-8 text-center border-white/20 shadow-2xl relative my-4 md:my-0">
              <div className="w-14 h-14 rounded-full bg-white text-black mx-auto flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                <Brain className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Multi Mind Core</h4>
              <p className="text-xs text-neutral-400 mb-4">
                Gemini 2.5 Pro + Cross-Attention Alignment
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
                <span>Real-Time Fusion</span>
              </div>
            </div>
          </Reveal>

          {/* Output Column */}
          <Reveal delay={0.7} direction="left" className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-accent-gold" />
              <div className="text-xs">
                <div className="font-semibold text-white">Verified Synthesis</div>
                <div className="text-neutral-400 text-[11px]">Audited against source grounding</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
              <Compass className="w-4 h-4 text-neutral-300" />
              <div className="text-xs">
                <div className="font-semibold text-white">Deep Research Dossier</div>
                <div className="text-neutral-400 text-[11px]">Structured reports with citation links</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
              <Database className="w-4 h-4 text-neutral-300" />
              <div className="text-xs">
                <div className="font-semibold text-white">Knowledge Extraction</div>
                <div className="text-neutral-400 text-[11px]">Persistent entity cards in DB</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Statistics Section (Editorial Numbers) */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-white/[0.06] relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Reveal delay={0.1}>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">10M+</div>
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mt-2">AI Requests</div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">120+</div>
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mt-2">Formats Supported</div>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">99.9%</div>
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mt-2">Platform Uptime</div>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">50+</div>
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mt-2">Frontier Models</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials Section (Directly Matching Reference Screenshot 1) */}
      <section id="testimonials" className="py-24 sm:py-32 px-6 max-w-6xl mx-auto border-t border-white/[0.06] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Title Column (Inspired by Screenshot 1) */}
          <Reveal className="lg:col-span-4 sticky top-28" direction="right" delay={0.2}>
            <h2 className="text-4xl sm:text-6xl font-editorial font-medium text-white tracking-tight leading-[1.0] mb-4">
              <TextReveal text={`What they\nsay about us`} />
            </h2>
            <p className="text-xs sm:text-sm text-brand-500 leading-relaxed max-w-xs">
              Researchers, engineers, and analysts share how Multi Mind AI transformed their multimodal knowledge synthesis.
            </p>
          </Reveal>

          {/* Right Asymmetric Testimonial Cards (Inspired by Screenshot 1) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Card 1 */}
            <Reveal delay={0.3} className="h-full">
              <div className="card-glass p-6 sm:p-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center font-bold text-sm text-white">
                      SJ
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Sarah Johnson</div>
                      <div className="text-xs text-neutral-400">AI Research Lead</div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-300 leading-relaxed">
                    "Multi Mind AI has completely transformed how I analyze multi-source technical whitepapers. Dropping a 40-page PDF and an audio lecture note into one unified chat feels like magic."
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Card 2 (Staggered offset) */}
            <Reveal delay={0.4} className="h-full sm:translate-y-6">
              <div className="card-glass p-6 sm:p-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center font-bold text-sm text-white">
                      MC
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Michael Chen</div>
                      <div className="text-xs text-neutral-400">Principal Systems Architect</div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-300 leading-relaxed">
                    "The transparent reasoning drawer and citation mapping give our engineering team total auditability. We can trace every single claim back to its primary source."
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Card 3 */}
            <Reveal delay={0.5} className="h-full">
              <div className="card-glass p-6 sm:p-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center font-bold text-sm text-white">
                      ED
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Emma Davis</div>
                      <div className="text-xs text-neutral-400">Autonomous Technology Lead</div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-300 leading-relaxed">
                    "The autonomous deep research engine deconstructed our competitive intelligence questions into 4 orthogonal search angles and flagged contradictions instantly."
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Card 4 (Staggered offset) */}
            <Reveal delay={0.6} className="h-full sm:translate-y-6">
              <div className="card-glass p-6 sm:p-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center font-bold text-sm text-white">
                      JW
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">James Wilson</div>
                      <div className="text-xs text-neutral-400">Bioinformatics Fellow</div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-300 leading-relaxed">
                    "I finally have one workspace for vision diagnostics, audio transcriptions, and live web grounding. The model resilience and fast latency are unmatched."
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 sm:py-32 px-6 max-w-6xl mx-auto border-t border-white/[0.06] relative z-10">
        <Reveal delay={0.1} direction="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
              Plans & Access
            </div>
            <h2 className="text-3xl sm:text-5xl font-editorial font-medium text-white tracking-tight mb-3">
              Transparent Pricing
            </h2>
            <p className="text-xs sm:text-sm text-brand-500">
              Start free with full multimodal intelligence. Scale as your research operations expand.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Starter Plan */}
          <Reveal delay={0.2} direction="up" className="h-full">
            <div className="card-glass p-7 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Starter
                </div>
                <div className="text-3xl font-bold text-white mb-2">$0</div>
                <p className="text-xs text-neutral-400 mb-6">
                  Perfect for personal research and exploring multimodal intelligence.
                </p>
                <div className="space-y-2.5 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>50 Multimodal queries / day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Gemini 2.5 Flash core model</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>PDF, DOCX & Image upload</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Standard web search grounding</span>
                  </div>
                </div>
              </div>

              <Link
                to="/signup"
                className="btn-secondary-pill w-full mt-8 py-2.5 text-center text-xs block"
              >
                Get Started Free
              </Link>
            </div>
          </Reveal>

          {/* Pro Plan (Featured with subtle silver elevation) */}
          <Reveal delay={0.3} direction="up" className="h-full">
            <div className="card-glass p-7 sm:p-8 flex flex-col justify-between border-white/30 shadow-[0_20px_80px_rgba(255,255,255,0.08)] relative h-full">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white text-black font-mono text-[10px] font-bold tracking-wider uppercase">
                Most Popular
              </div>

              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1">
                  Professional
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  $29 <span className="text-xs font-normal text-neutral-400">/ month</span>
                </div>
                <p className="text-xs text-neutral-400 mb-6">
                  For researchers, engineers, and analysts requiring frontier capabilities.
                </p>
                <div className="space-y-2.5 text-xs text-neutral-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Unlimited Multimodal queries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Gemini 2.5 Pro priority inference</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Autonomous Deep Research engine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Voice recordings & transcription</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Imagen 3 image generation</span>
                  </div>
                </div>
              </div>

              <Link
                to="/signup"
                className="btn-primary-pill w-full mt-8 py-2.5 text-center text-xs block font-semibold"
              >
                Start Pro Trial
              </Link>
            </div>
          </Reveal>

          {/* Enterprise Plan */}
          <Reveal delay={0.4} direction="up" className="h-full">
            <div className="card-glass p-7 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Enterprise
                </div>
                <div className="text-3xl font-bold text-white mb-2">Custom</div>
                <p className="text-xs text-neutral-400 mb-6">
                  Dedicated infrastructure, custom API quotas, and enterprise governance.
                </p>
                <div className="space-y-2.5 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Custom context rate limits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Dedicated VPC or on-prem deployment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Custom knowledge connectors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>99.99% Enterprise SLA</span>
                  </div>
                </div>
              </div>

              <a
                href="mailto:contact@multimind.ai"
                className="btn-secondary-pill w-full mt-8 py-2.5 text-center text-xs block"
              >
                Contact Sales
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto border-t border-white/[0.06] relative z-10">
        <Reveal delay={0.1}>
          <div className="text-center mb-14">
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
              Answers & Clarity
            </div>
            <h2 className="text-3xl sm:text-4xl font-editorial font-medium text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
        </Reveal>

        <div className="divide-y divide-white/[0.08]">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-5">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4 group"
              >
                <span className="text-sm sm:text-base font-medium text-white group-hover:text-neutral-300 transition-colors">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 transition-transform duration-200 flex-shrink-0 ${
                    openFaq === idx ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <p className="mt-3 text-xs sm:text-sm text-brand-500 leading-relaxed pr-8 animate-fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-t border-white/[0.06] text-center relative z-10">
        <Reveal delay={0.2} direction="up">
          <div className="card-glass p-10 sm:p-14 border-white/20 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl font-editorial font-medium text-white tracking-tight mb-4 relative z-10">
              Start Synthesizing Intelligence Today
            </h2>
            <p className="text-xs sm:text-sm text-brand-500 max-w-lg mx-auto mb-8 relative z-10">
              Join researchers and teams using Multi Mind AI to seamlessly bridge text, media, documents, and autonomous research.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
              <Link
                to="/signup"
                className="btn-primary-pill px-8 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/app"
                className="btn-secondary-pill px-6 py-3 text-xs sm:text-sm font-medium"
              >
                Open Live Demo
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Large Sophisticated Dark Footer */}
      <footer className="border-t border-white/[0.08] bg-surface-900 py-16 px-6 text-xs text-brand-700 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
              <img src="/logo.svg" alt="Multi Mind AI" className="w-6 h-6 rounded-full border border-white/20" />
              <span>Multi Mind AI</span>
            </div>
            <p className="text-[11px] text-neutral-400 max-w-xs leading-relaxed">
              Universal Multimodal Intelligence & Deep Research Platform. One unified cognitive workspace for text, vision, audio, documents, and web grounding.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
              <span className="text-[10px] font-mono text-neutral-400">All Systems Operational</span>
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-2">
            <div className="font-semibold text-white uppercase text-[10px] tracking-wider">Product</div>
            <div><Link to="/app" className="hover:text-white transition-colors">Workspace</Link></div>
            <div><Link to="/app/chat" className="hover:text-white transition-colors">Multimodal Chat</Link></div>
            <div><Link to="/app/research" className="hover:text-white transition-colors">Deep Research</Link></div>
            <div><Link to="/app/knowledge" className="hover:text-white transition-colors">Knowledge Base</Link></div>
            <div><Link to="/app/library" className="hover:text-white transition-colors">Asset Library</Link></div>
          </div>

          {/* Modalities */}
          <div className="space-y-2">
            <div className="font-semibold text-white uppercase text-[10px] tracking-wider">Modalities</div>
            <div><span className="hover:text-white transition-colors cursor-pointer">Text Intelligence</span></div>
            <div><span className="hover:text-white transition-colors cursor-pointer">Vision & Diagrams</span></div>
            <div><span className="hover:text-white transition-colors cursor-pointer">Audio & Voice Memos</span></div>
            <div><span className="hover:text-white transition-colors cursor-pointer">Document Parsing</span></div>
            <div><span className="hover:text-white transition-colors cursor-pointer">Web Grounding</span></div>
          </div>

          {/* Legal & Company */}
          <div className="space-y-2">
            <div className="font-semibold text-white uppercase text-[10px] tracking-wider">Platform</div>
            <div><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></div>
            <div><Link to="/signup" className="hover:text-white transition-colors">Register</Link></div>
            <div><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></div>
            <div><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></div>
            <div><a href="#security" className="hover:text-white transition-colors">Security</a></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>© 2026 Multi Mind AI Inc. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Powered by Gemini 2.5 & Supabase</span>
            <span>·</span>
            <span>Designed with Apple-like restraint & dark minimalism</span>
          </div>
        </div>
      </footer>
    </div>
  );
};



