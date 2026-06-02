/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import HomeView from './components/HomeView.tsx';
import AboutView from './components/AboutView.tsx';
import BlogListView from './components/BlogListView.tsx';
import ProjectsView from './components/ProjectsView.tsx';
import BacklogView from './components/BacklogView.tsx';
import ThemeToggle from './components/ThemeToggle.tsx';
import { ActivePage, Post, ThemeMode } from './types.ts';
import { getTheme, nextTheme, applyTheme } from './theme.ts';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme') as ThemeMode | null;
    if (saved && ['dark', 'light', 'yellow', 'olive'].includes(saved)) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    applyTheme(getTheme(themeMode));
  }, [themeMode]);

  const handleThemeToggle = () => {
    setThemeMode(prev => nextTheme(prev));
  };

  // darkMode boolean for Header backwards compat
  const darkMode = themeMode !== 'light';

  const renderCurrentView = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomeView
            setActivePage={(page) => { setActivePage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            setSelectedPost={(post) => { setSelectedPost(post); setActivePage('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        );
      case 'blog':
        return (
          <BlogListView
            selectedPost={selectedPost}
            setSelectedPost={(post) => { setSelectedPost(post); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        );
      case 'about':
        return <AboutView />;
      case 'projects':
        return <ProjectsView />;
      case 'backlog':
        return <BacklogView />;
      default:
        return (
          <HomeView
            setActivePage={(page) => { setActivePage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            setSelectedPost={(post) => { setSelectedPost(post); setActivePage('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        );
    }
  };

  const theme = getTheme(themeMode);

  return (
    <div
      className="min-h-screen transition-colors duration-300 flex flex-col antialiased"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* Theme toggle circle — fixed top right */}
      <div className="fixed top-4 right-4 z-[60]">
        <ThemeToggle themeMode={themeMode} onToggle={handleThemeToggle} />
      </div>

      <Header
        activePage={activePage}
        setActivePage={(page) => { setActivePage(page); setSelectedPost(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        darkMode={darkMode}
        setDarkMode={() => {}} // handled by ThemeToggle now
      />

      <main className="flex-grow max-w-2xl mx-auto px-6 py-12 md:py-16 w-full">
        {renderCurrentView()}
      </main>

      <footer
        className="border-t py-8 transition-colors duration-300"
        style={{ borderColor: theme.border }}
      >
        <div className="max-w-2xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono" style={{ color: theme.muted }}>
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span>© 2026 OR MOSCOVITZ. HAIFA, ISRAEL.</span>
            <span>BUILT WITH PREMIUM MINIMAL DESIGN</span>
          </div>
          <div className="flex items-center gap-3">
            <span>HFA • UTC+3 (IDT)</span>
            <span className="opacity-40">|</span>
            <button
              onClick={() => { setActivePage('home'); setSelectedPost(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:opacity-80 text-[11px] font-mono cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
              style={{ color: theme.muted }}
            >
              INDEX INDEX
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
