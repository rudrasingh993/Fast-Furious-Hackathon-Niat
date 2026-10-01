import React from 'react';
import { Menu, Sun, Moon, Sparkles, ShieldCheck } from 'lucide-react';
import { UserMenu } from './UserMenu.js';
import { useTheme } from '../context/ThemeContext.js';

interface TopBarProps {
  onToggleMobileMenu: () => void;
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleMobileMenu, title = 'Multi Mind AI' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-white/[0.08] bg-surface-900/80 backdrop-blur-xl sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 hover:text-white transition-colors"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-sm md:text-base font-semibold text-white tracking-tight truncate max-w-[200px] md:max-w-md">
            {title}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-bronze/10 text-accent-gold border border-accent-bronze/20 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse"></span>
            Online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Capability Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-neutral-300 font-medium">
          <Sparkles className="w-3 h-3 text-white" />
          <span>Multimodal Intelligence</span>
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Account Menu */}
        <UserMenu />
      </div>
    </header>
  );
};

