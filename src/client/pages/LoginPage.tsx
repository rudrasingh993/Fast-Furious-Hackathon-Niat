import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain,
  ArrowRight,
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../api/client.js';

export const LoginPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'magic_link' | 'password'>('magic_link');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // 1. Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/app');
    } else {
      setError(result.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  // 2. Send Magic Login Link to Email
  const handleSendMagicLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setInfo(null);
    const target = email.trim();

    if (!target) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.sendOtp('email', target, `${window.location.origin}/app`);
      setLoading(false);
      if (res.success && res.data) {
        setLinkSent(true);
        setInfo(res.data.message || `A sign-in link has been sent to ${target}.`);
      } else {
        setError(res.error?.message || 'Could not send sign-in link.');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to send sign-in link.');
    }
  };

  // 4. Simply Click Google Login (Opens Google OAuth with account selector prompt)
  const handleGoogleSignIn = () => {
    setError(null);
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://aidmkmtqovpvtbxrrrsl.supabase.co';
    const redirectUrl = encodeURIComponent(`${window.location.origin}/app`);
    // prompt=select_account forces Google to show its native account chooser popup/page
    window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&prompt=select_account&redirect_to=${redirectUrl}`;
  };

  return (
    <div className="min-h-screen bg-surface-950 text-brand-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background ambient lighting and technical grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-radial-ambient pointer-events-none" />

      {/* Header Logo */}
      <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-white tracking-tight mb-8 relative z-10 group">
        <img src="/logo.svg" alt="Multi Mind AI" className="w-8 h-8 rounded-full border border-white/15 shadow-inner group-hover:border-white/30 transition-colors" />
        <span>Multi Mind AI</span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md p-7 sm:p-8 card-glass shadow-2xl relative z-10 border border-white/[0.12]">
        <h2 className="text-xl font-bold text-white mb-1.5">Welcome Back</h2>
        <p className="text-xs text-brand-500 mb-6">
          Sign in to access your multimodal intelligence workspace.
        </p>

        {/* 1-Click Google Sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-neutral-200 text-neutral-900 font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2.5 mb-5 active:scale-95 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
            or continue with email
          </span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        {/* Method Switcher Tabs: Email Link vs Password */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-black/40 border border-white/[0.08] mb-5 text-[11px]">
          <button
            type="button"
            onClick={() => {
              setAuthMode('magic_link');
              setError(null);
            }}
            className={`py-1.5 rounded-full font-medium transition-all ${
              authMode === 'magic_link'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Email Link
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('password');
              setError(null);
            }}
            className={`py-1.5 rounded-full font-medium transition-all ${
              authMode === 'password'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Password
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {info && !linkSent && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-accent-bronze/10 border border-accent-bronze/20 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{info}</span>
          </div>
        )}

        {/* 1. Tab: Email Link (Magic Link) */}
        {authMode === 'magic_link' && (
          <div>
            {!linkSent ? (
              <form onSubmit={handleSendMagicLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs placeholder-neutral-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                    We'll email you a secure login link. Just click the link in your email to sign in instantly—no password or code needed.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="btn-primary-pill w-full mt-2 py-3 text-xs font-semibold shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Sign-In Link</span>}
                  {!loading && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </form>
            ) : (
              <div className="text-center py-2 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">Check Your Email</h3>
                <p className="text-xs text-brand-500 leading-relaxed mb-4">
                  We sent a sign-in link to <span className="font-semibold text-white">{email}</span>. Click the link in that email to log in directly.
                </p>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-neutral-400 mb-4 text-left">
                  💡 Tip: The email arrives from Supabase Auth within a few seconds. If you don't see it, check your spam or promotions folder.
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSendMagicLink()}
                    disabled={loading}
                    className="btn-secondary-pill w-full py-2.5 text-xs font-medium flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Resend Sign-In Link</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkSent(false);
                      setInfo(null);
                    }}
                    className="text-[11px] text-neutral-400 hover:text-white transition-colors py-1 block w-full"
                  >
                    Use a different email
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Tab: Email + Password */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs placeholder-neutral-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs placeholder-neutral-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-pill w-full mt-2 py-3 text-xs font-semibold shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
              {!loading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-brand-500 border-t border-white/[0.08] pt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-white hover:underline font-medium">
            Sign up free
          </Link>
        </div>
      </div>
    </div>
  );
};

