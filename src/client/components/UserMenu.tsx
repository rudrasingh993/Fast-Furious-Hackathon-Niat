import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 text-white font-semibold text-xs flex items-center justify-center shadow-md">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-xs font-medium text-slate-200 leading-tight">{user.name}</div>
          <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.email}</div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 p-1.5 rounded-xl bg-surface-900 border border-white/10 shadow-2xl z-50 animate-fade-in text-xs">
          <div className="px-3 py-2 border-b border-white/5 mb-1">
            <div className="font-semibold text-slate-200">{user.name}</div>
            <div className="text-slate-400 text-[11px] truncate">{user.email}</div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-brand-300 font-mono">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>JWT Authenticated</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              navigate('/app/profile');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile & Account</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              navigate('/app/settings');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences & Settings</span>
          </button>

          <div className="border-t border-white/5 my-1" />

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
