import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client.js';
import type { User } from '../../shared/types.js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOtp: (type: 'email' | 'phone', target: string, code: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (profile: { email: string; name?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      // 1. Detect OAuth access_token from Supabase / Google redirect hash
      if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('access_token')) {
        try {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          if (accessToken) {
            const payloadBase64 = accessToken.split('.')[1];
            const jsonStr = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
            const payload = JSON.parse(jsonStr);
            const email = payload.email || payload.user_metadata?.email;
            const name = payload.user_metadata?.full_name || payload.user_metadata?.name || email?.split('@')[0];
            const avatarUrl = payload.user_metadata?.avatar_url;

            if (email) {
              const res = await api.googleAuth({ email, name, avatarUrl });
              if (res.success && res.data?.user) {
                setUser(res.data.user);
                window.history.replaceState(null, '', window.location.pathname);
                setLoading(false);
                return;
              }
            }
          }
        } catch (err) {
          console.error('Failed to parse OAuth redirect hash:', err);
        }
      }

      if (api.isAuthenticated()) {
        try {
          const res = await api.getMe();
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            api.clearTokens();
          }
        } catch {
          api.clearTokens();
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login({ email, password });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: res.error?.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await api.signup({ name, email, password });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: res.error?.message || 'Signup failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const loginWithOtp = async (type: 'email' | 'phone', target: string, code: string, name?: string) => {
    try {
      const res = await api.verifyOtp(type, target, code, name);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: res.error?.message || 'Verification failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const loginWithGoogle = async (profile: { email: string; name?: string; avatarUrl?: string }) => {
    try {
      const res = await api.googleAuth(profile);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: res.error?.message || 'Google authentication failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    const res = await api.updateProfile(updates);
    if (res.success && res.data) {
      setUser(res.data);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, loginWithOtp, loginWithGoogle, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
