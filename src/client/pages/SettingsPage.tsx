import React, { useState } from 'react';
import { Settings, Sparkles, Sliders, ShieldCheck, Check, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [responseStyle, setResponseStyle] = useState<'concise' | 'balanced' | 'detailed'>(
    user?.response_style || 'balanced'
  );
  const [responseLength, setResponseLength] = useState<'short' | 'medium' | 'long'>(
    user?.response_length || 'medium'
  );
  const [preferredLanguage, setPreferredLanguage] = useState(
    user?.preferred_language || 'en'
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await updateUser({
        response_style: responseStyle,
        response_length: responseLength,
        preferred_language: preferredLanguage,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert('Failed to update settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-400" />
          <span>Assistant Settings & Personalization</span>
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Customize how Multi Mind AI tailors explanations, summaries, and responses to your workflow.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personalization Section */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-sm font-semibold text-white">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>AI Response Preferences</span>
          </div>

          {/* Response Style */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              Preferred Response Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'concise', label: 'Concise & Direct', desc: 'Brief, high-impact bulleted answers' },
                { id: 'balanced', label: 'Balanced (Default)', desc: 'Clear overview with supporting details' },
                { id: 'detailed', label: 'Detailed & Rigorous', desc: 'Exhaustive analysis with deep breakdowns' },
              ].map((style) => (
                <div
                  key={style.id}
                  onClick={() => setResponseStyle(style.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    responseStyle === style.id
                      ? 'bg-brand-500/15 border-brand-500/50 text-white'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-xs text-white mb-1">{style.label}</div>
                  <div className="text-[11px] text-slate-400">{style.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Length */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              Default Response Depth
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'short', label: 'Short', desc: '1-2 concise paragraphs' },
                { id: 'medium', label: 'Medium', desc: 'Standard comprehensive responses' },
                { id: 'long', label: 'Long', desc: 'In-depth multi-section reports' },
              ].map((len) => (
                <div
                  key={len.id}
                  onClick={() => setResponseLength(len.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    responseLength === len.id
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-white'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-xs text-white mb-1">{len.label}</div>
                  <div className="text-[11px] text-slate-400">{len.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Preferred Language
            </label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full sm:w-64 p-2.5 rounded-xl glass-input text-white text-xs focus:outline-none"
            >
              <option value="en" className="bg-surface-900">English (en)</option>
              <option value="es" className="bg-surface-900">Spanish (es)</option>
              <option value="fr" className="bg-surface-900">French (fr)</option>
              <option value="de" className="bg-surface-900">German (de)</option>
              <option value="zh" className="bg-surface-900">Chinese (zh)</option>
              <option value="ja" className="bg-surface-900">Japanese (ja)</option>
              <option value="hi" className="bg-surface-900">Hindi (hi)</option>
            </select>
          </div>
        </div>

        {/* Security & System Transparency Box */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-sm font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-accent-gold" />
            <span>Architecture & Security Guarantees</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="font-semibold text-white mb-1">Server-Side Gemini SDK</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Gemini API keys and sensitive tokens are strictly isolated in Node.js serverless handlers and never leaked to the client browser.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="font-semibold text-white mb-1">Supabase Row-Level Security</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                All database rows (conversations, messages, attachments, knowledge items) are strictly guarded with user-level JWT tenant isolation.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <div className="flex items-center gap-1.5 text-xs text-accent-gold font-medium animate-fade-in">
              <Check className="w-4 h-4" />
              <span>Preferences saved successfully!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

