import React, { useState, useEffect } from 'react';
import { Mail, Plus, X, Trash2, ArrowRight, Loader2, Sparkles, ExternalLink } from 'lucide-react';

export interface KnownAccount {
  email: string;
  name: string;
  avatarUrl?: string;
  provider?: 'google' | 'email';
  lastUsed?: number;
}

const STORAGE_KEY = 'multimind_known_accounts';

export function getStoredAccounts(): KnownAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAccountToStorage(account: { email: string; name?: string; avatarUrl?: string; provider?: 'google' | 'email' }) {
  try {
    const current = getStoredAccounts();
    const emailNorm = account.email.trim().toLowerCase();
    const filtered = current.filter((a) => a.email.toLowerCase() !== emailNorm);
    filtered.unshift({
      email: emailNorm,
      name: account.name?.trim() || emailNorm.split('@')[0],
      avatarUrl: account.avatarUrl,
      provider: account.provider || (emailNorm.includes('gmail') ? 'google' : 'email'),
      lastUsed: Date.now(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 6)));
  } catch {}
}

export function removeStoredAccount(email: string): KnownAccount[] {
  try {
    const current = getStoredAccounts();
    const updated = current.filter((a) => a.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

interface AccountChooserModalProps {
  isOpen: boolean;
  initialMode?: 'google' | 'email';
  onClose: () => void;
  onSelectAccount: (account: { email: string; name: string; avatarUrl?: string; provider: 'google' | 'email' }) => Promise<void> | void;
  onUseCustomEmail?: (email: string) => void;
}

export const AccountChooserModal: React.FC<AccountChooserModalProps> = ({
  isOpen,
  initialMode = 'google',
  onClose,
  onSelectAccount,
  onUseCustomEmail,
}) => {
  const [mode, setMode] = useState<'google' | 'email'>(initialMode);
  const [accounts, setAccounts] = useState<KnownAccount[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setAccounts(getStoredAccounts());
      setShowAddForm(false);
      setError(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSelect = async (acc: KnownAccount) => {
    setError(null);
    setLoadingEmail(acc.email);
    try {
      saveAccountToStorage(acc);
      await onSelectAccount({
        email: acc.email,
        name: acc.name,
        avatarUrl: acc.avatarUrl,
        provider: mode,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate selected account.');
    } finally {
      setLoadingEmail(null);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const email = customEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    const name = customName.trim() || email.split('@')[0];
    const newAcc: KnownAccount = {
      email,
      name,
      provider: mode,
      lastUsed: Date.now(),
    };

    if (mode === 'email' && onUseCustomEmail) {
      saveAccountToStorage(newAcc);
      onUseCustomEmail(email);
      onClose();
      return;
    }

    setLoadingEmail(email);
    try {
      saveAccountToStorage(newAcc);
      await onSelectAccount({
        email,
        name,
        provider: mode,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed.');
    } finally {
      setLoadingEmail(null);
    }
  };

  const handleRemoveAccount = (e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    const updated = removeStoredAccount(email);
    setAccounts(updated);
  };

  const handleSupabaseOAuthPopup = () => {
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://aidmkmtqovpvtbxrrrsl.supabase.co';
    const redirectUrl = encodeURIComponent(`${window.location.origin}/app`);
    const authUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&prompt=select_account&redirect_to=${redirectUrl}`;
    
    // Open in standard centered popup window
    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    window.open(
      authUrl,
      'GoogleOAuthPopup',
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
    );
  };

  // Color generator for avatar initials
  const getAvatarColor = (str: string) => {
    const colors = [
      'from-blue-600 to-indigo-600',
      'from-purple-600 to-pink-600',
      'from-emerald-600 to-teal-600',
      'from-amber-600 to-orange-600',
      'from-cyan-600 to-blue-600',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md rounded-2xl glass-panel border border-white/10 shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/5 mb-5 w-fit">
          <button
            type="button"
            onClick={() => {
              setMode('google');
              setError(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              mode === 'google' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Accounts</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('email');
              setError(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              mode === 'email' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Accounts</span>
          </button>
        </div>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          {mode === 'google' ? (
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shadow-md flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {mode === 'google' ? 'Choose a Google Account' : 'Choose an Email Account'}
            </h3>
            <p className="text-xs text-slate-400">to continue to Multi Mind AI</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs animate-shake">
            {error}
          </div>
        )}

        {/* Known Accounts List */}
        <div className="space-y-2 mb-4 max-h-56 overflow-y-auto pr-1">
          {accounts.length > 0 ? (
            accounts.map((acc) => {
              const isLoading = loadingEmail === acc.email;
              return (
                <div
                  key={acc.email}
                  onClick={() => !isLoading && handleSelect(acc)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-tr ${getAvatarColor(
                        acc.name || acc.email
                      )} flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0`}
                    >
                      {(acc.name || acc.email)[0].toUpperCase()}
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-xs font-semibold text-white truncate group-hover:text-brand-300 transition-colors">
                        {acc.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{acc.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 ml-2">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveAccount(e, acc.email)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-all"
                          title="Remove from device"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 px-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
              <Sparkles className="w-5 h-5 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No saved accounts yet on this browser.</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Use the form below to choose an account.</p>
            </div>
          )}
        </div>

        {/* Toggle Form to Add / Use Another Account */}
        {!showAddForm ? (
          <div className="space-y-2 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-medium border border-white/5 flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Use another account</span>
            </button>

            {mode === 'google' && (
              <button
                type="button"
                onClick={handleSupabaseOAuthPopup}
                className="w-full py-2.5 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-brand-300 text-xs border border-white/5 flex items-center justify-center gap-1.5 transition-all"
                title="Opens official Google login prompt with account chooser"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Google OAuth Dialog</span>
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="space-y-3 pt-3 border-t border-white/5 animate-fade-in">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                {mode === 'google' ? 'Google Email' : 'Email Address'}
              </label>
              <input
                type="email"
                required
                autoFocus
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder={mode === 'google' ? 'user@gmail.com' : 'user@example.com'}
                className="w-full px-3 py-2 rounded-xl glass-input text-white text-xs placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Display Name (Optional)</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 rounded-xl glass-input text-white text-xs placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-medium transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={Boolean(loadingEmail)}
                className="flex-[2] py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loadingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Continue</span>}
                {!loadingEmail && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
