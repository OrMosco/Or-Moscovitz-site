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
import { ActivePage, Post } from './types.ts';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // Persist night-mode theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Route page routing
  const renderCurrentView = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomeView
            setActivePage={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            setSelectedPost={(post) => {
              setSelectedPost(post);
              setActivePage('blog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
      case 'blog':
        return (
          <BlogListView
            selectedPost={selectedPost}
            setSelectedPost={(post) => {
              setSelectedPost(post);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
            setActivePage={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            setSelectedPost={(post) => {
              setSelectedPost(post);
              setActivePage('blog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121212] transition-colors duration-300 flex flex-col antialiased">
      {/* Header bar containing hamburger + theme togglers */}
      <Header
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          setSelectedPost(null); // Clear selected article post when navigating elsewhere
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-2xl mx-auto px-6 py-12 md:py-16 w-full">
        {renderCurrentView()}
      </main>

      {/* Retro Simple Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-[#FAF8F5]/60 dark:bg-[#121212]/60 py-8 transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span>© 2026 OR MOSCOVITZ. HAIFA, ISRAEL.</span>
            <span>BUILT WITH PREMIUM MINIMAL DESIGN</span>
          </div>

          <div className="flex items-center gap-3">
            <span>HFA • UTC+3 (IDT)</span>
            <span className="opacity-40">|</span>
            <button
              onClick={() => {
                setActivePage('home');
                setSelectedPost(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-rose-500 text-[11px] font-mono cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
            >
              INDEX INDEX
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
