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
