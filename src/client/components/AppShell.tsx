import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.js';
import { TopBar } from './TopBar.js';

export const AppShell: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith('/app/chat')) return 'Multimodal Conversation';
    if (pathname === '/app/search') return 'Search & Grounding';
    if (pathname === '/app/research') return 'Deep Research Engine';
    if (pathname === '/app/knowledge') return 'Knowledge Base';
    if (pathname === '/app/library') return 'Uploaded Assets & Files';
    if (pathname === '/app/history') return 'Conversation History';
    if (pathname === '/app/settings') return 'Settings & Preferences';
    if (pathname === '/app/profile') return 'User Profile';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-950 text-brand-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Subtle monochrome ambient light */}
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-radial-glow pointer-events-none" />

        <TopBar
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          title={getPageTitle(location.pathname)}
        />

        <main className="flex-1 overflow-y-auto flex flex-col relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

