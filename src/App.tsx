/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header.tsx';
import HomeView from './components/HomeView.tsx';
import AboutView from './components/AboutView.tsx';
import BlogListView from './components/BlogListView.tsx';
import BlogPostView from './components/BlogPostView.tsx';
import ProjectsView from './components/ProjectsView.tsx';
import { ThemeMode } from './types.ts';
import { getTheme, nextTheme, applyTheme } from './theme.ts';
import { blogPosts } from './data.ts';
import CityPlanBackground from './components/CityPlanBackground.tsx';

function RouteEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const slug = pathname.startsWith('/writing/') ? decodeURIComponent(pathname.slice('/writing/'.length)) : '';
    const post = slug ? blogPosts.find((entry) => entry.slug === slug) : undefined;
    if (post) {
      document.title = `${post.title} — Or Moscovitz`;
    } else if (pathname === '/about') {
      document.title = 'About — Or Moscovitz';
    } else if (pathname === '/projects') {
      document.title = 'Projects — Or Moscovitz';
    } else if (pathname === '/writing') {
      document.title = 'Writing — Or Moscovitz';
    } else {
      document.title = 'Or Moscovitz';
    }
  }, [pathname]);

  return null;
}

function WritingPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find((entry) => entry.slug === slug);
  if (!post?.content) {
    return <Navigate to="/writing" replace />;
  }
  return <BlogPostView post={post} onBack={() => navigate('/writing')} />;
}

function NotFound() {
  return (
    <div className="flex flex-col gap-4 py-8">
      <span className="font-mono text-xs uppercase tracking-widest text-rose-500 font-semibold">404</span>
      <h1 className="font-serif text-3xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">
        This page is not on the index.
      </h1>
      <Link to="/" className="font-mono text-sm text-rose-500 hover:underline w-fit">
        Return to overview →
      </Link>
    </div>
  );
}

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme') as ThemeMode | null;
    if (saved && ['dark', 'light', 'yellow', 'olive'].includes(saved)) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    applyTheme(getTheme(themeMode));
  }, [themeMode]);

  const handleThemeToggle = () => {
    setThemeMode((prev) => nextTheme(prev));
  };

  const theme = getTheme(themeMode);

  return (
    <div
      className="relative z-0 min-h-screen transition-colors duration-300 flex flex-col antialiased"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <CityPlanBackground theme={theme} />
      <RouteEffects />
      <Header themeMode={themeMode} onThemeToggle={handleThemeToggle} />

      <main className="flex-grow max-w-2xl mx-auto px-6 py-12 md:py-16 w-full">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/projects" element={<ProjectsView />} />
          <Route path="/writing" element={<BlogListView />} />
          <Route path="/writing/:slug" element={<WritingPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer
        className="border-t py-8 transition-colors duration-300"
        style={{ borderColor: theme.border }}
      >
        <div className="max-w-2xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono" style={{ color: theme.muted }}>
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span>© 2026 OR MOSCOVITZ. HAIFA, ISRAEL.</span>
            <span>Built with React, TypeScript, and Vite</span>
          </div>
          <div className="flex items-center gap-3">
            <span>HFA • UTC+3 (IDT)</span>
            <span className="opacity-40">|</span>
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:opacity-80 text-[11px] font-mono"
              style={{ color: theme.muted }}
            >
              INDEX INDEX
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
