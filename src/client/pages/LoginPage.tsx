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
  const [authMode, setAuthMode] = useState<'password' | 'email_otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, loginWithOtp } = useAuth();
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

  // 2. Request Email OTP Code
  const handleSendOtp = async () => {
    setError(null);
    setInfo(null);
    const target = email.trim();

    if (!target) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.sendOtp('email', target);
      setLoading(false);
      if (res.success && res.data) {
        setOtpSent(true);
        setInfo(res.data.message);
        if (res.data.devCode) {
          setDevCode(res.data.devCode);
        }
      } else {
        setError(res.error?.message || 'Could not send verification code.');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to send OTP code.');
    }
  };

  // 3. Verify Email OTP Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const target = email.trim();

    if (!target || !otpCode.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    const result = await loginWithOtp('email', target, otpCode.trim());
    setLoading(false);

    if (result.success) {
      navigate('/app');
    } else {
      setError(result.error || 'Invalid or expired verification code.');
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
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Logo */}
      <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-white tracking-tight mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-brand-500/20">
          <Brain className="w-5 h-5" />
        </div>
        <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
          Multi Mind AI
        </span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md p-7 sm:p-8 rounded-2xl glass-panel shadow-2xl relative z-10 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-1.5">Welcome Back</h2>
        <p className="text-xs text-slate-400 mb-6">
          Sign in to access your multimodal intelligence workspace.
        </p>

        {/* 1-Click Google Sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2.5 mb-5 active:scale-95 disabled:opacity-50"
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
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
            or continue with email
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Method Switcher Tabs: Password vs Email OTP */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/5 mb-5 text-[11px]">
          <button
            type="button"
            onClick={() => {
              setAuthMode('password');
              setError(null);
            }}
            className={`py-1.5 rounded-lg font-medium transition-all ${
              authMode === 'password'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('email_otp');
              setError(null);
            }}
            className={`py-1.5 rounded-lg font-medium transition-all ${
              authMode === 'email_otp'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Email OTP
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {info && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{info}</span>
          </div>
        )}

        {devCode && (
          <div className="p-2.5 mb-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 text-[11px] flex items-center justify-between">
            <span>Demo Verification Code:</span>
            <span className="font-mono font-bold tracking-widest text-white bg-brand-600/40 px-2 py-0.5 rounded">
              {devCode}
            </span>
          </div>
        )}

        {/* 1. Tab: Email + Password */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-white text-xs placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-white text-xs placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
              {!loading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>
        )}

        {/* 2. Tab: Email OTP */}
        {authMode === 'email_otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-white text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading || !email}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/10 transition-all disabled:opacity-40 whitespace-nowrap"
                >
                  {otpSent ? 'Resend' : 'Send Code'}
                </button>
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">6-Digit Email Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-white text-xs tracking-widest placeholder-slate-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !otpSent}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify & Sign In</span>}
              {!loading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-400 border-t border-white/5 pt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium">
            Sign up free
          </Link>
        </div>
      </div>
    </div>
  );
};
