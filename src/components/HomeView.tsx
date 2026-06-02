/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { ActivePage, Post, Project } from '../types.ts';
import { blogPosts, projects } from '../data.ts';

interface HomeViewProps {
  setActivePage: (page: ActivePage) => void;
  setSelectedPost: (post: Post) => void;
}

export default function HomeView({ setActivePage, setSelectedPost }: HomeViewProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const navigationShortcuts = [
    { number: '01', name: 'Writing', page: 'blog' as ActivePage },
    { number: '02', name: 'About', page: 'about' as ActivePage },
    { number: '03', name: 'Projects', page: 'projects' as ActivePage },
    { number: '04', name: 'Backlog', page: 'backlog' as ActivePage },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setActivePage('blog');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-12 py-4"
    >
      {/* Intro hero Section */}
      <section className="flex flex-col gap-3">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="font-mono text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight"
          id="home-hero-greeting"
        >
          Or Moscovitz
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.09 }}
          className="font-mono text-base text-neutral-700 dark:text-neutral-300 font-normal leading-snug"
          id="home-hero-roles"
        >
          Software Developer / Computational Design / AEC Tools
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.13 }}
          className="font-mono text-sm text-neutral-500 dark:text-neutral-500 font-normal"
          id="home-hero-location"
        >
          Haifa, Israel
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.17 }}
          className="font-mono text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-2xl mt-2"
          id="home-hero-bio"
        >
          I build tools for the built environment — spatial analysis, geometry processing, and agentic workflows that automate the complex stuff.
        </motion.p>
      </section>

      {/* Retro Numbered Grid shortcuts */}
      <section className="border-t border-b border-neutral-200 dark:border-neutral-800 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {navigationShortcuts.map((shortcut, idx) => (
            <motion.button
              key={shortcut.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.04 }}
              onClick={() => setActivePage(shortcut.page)}
              className="group text-left p-3 border border-neutral-200 dark:border-neutral-800 rounded-md bg-[#FAF8F5]/40 dark:bg-[#121212]/40 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:border-neutral-800 dark:hover:border-neutral-200 transition-all duration-200 cursor-pointer focus:outline-none"
              id={`shortcut-${shortcut.page}`}
            >
              <span className="font-mono text-xs text-neutral-400 dark:text-neutral-600 block mb-1">
                {shortcut.number}
              </span>
              <span className="font-serif text-lg font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-rose-500 transition-colors flex items-center justify-between">
                {shortcut.name}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Latest Writing layout */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            Latest writing
          </h2>
          <button
            onClick={() => setActivePage('blog')}
            className="font-mono text-xs text-neutral-400 hover:text-rose-500 font-semibold cursor-pointer underline underline-offset-4 decoration-neutral-300 hover:decoration-rose-500 transition-all"
            id="view-all-posts-btn"
          >
            View all posts →
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {blogPosts.slice(0, 3).map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + idx * 0.08 }}
              className="p-5 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col gap-2 hover:border-solid hover:border-rose-500/50 dark:hover:border-rose-500/40 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-400 dark:text-neutral-600 block">
                  {post.date}
                </span>
              </div>
              {post.isExternal && post.url ? (
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-left font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-100 hover:text-rose-500 transition-colors focus:outline-none cursor-pointer flex items-center gap-1.5 group/title"
                  id={`latest-post-link-${post.id}`}
                >
                  <span>{post.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-rose-500 opacity-60 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all shrink-0" />
                </a>
              ) : (
                <button
                  onClick={() => handlePostClick(post)}
                  className="text-left font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-100 hover:text-rose-500 transition-colors focus:outline-none cursor-pointer"
                  id={`latest-post-link-${post.id}`}
                >
                  {post.title}
                </button>
              )}
              <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light line-clamp-2">
                {post.summary}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Things I've built Section */}
      <section className="flex flex-col gap-6">
        <h2 className="font-serif text-2xl font-semibold text-neutral-900 dark:text-neutral-50 border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-2">
          Things I've built
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, idx) => (
            <motion.a
              key={project.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 + idx * 0.05 }}
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="group p-5 border border-neutral-200 dark:border-neutral-800 rounded-md bg-[#FAF8F5]/30 dark:bg-[#121212]/30 hover:bg-[#FAF8F5]/80 dark:hover:bg-[#121212]/80 hover:border-neutral-900 dark:hover:border-neutral-200 hover:shadow-sm transition-all duration-200 flex flex-col gap-1.5 cursor-pointer col-span-1"
              id={`project-link-${idx}`}
            >
              <div className="flex items-center justify-between font-mono text-xs text-neutral-400 dark:text-neutral-500">
                <span className="font-semibold text-rose-500/80 bg-rose-500/10 dark:bg-rose-500/15 px-2 py-0.5 rounded-full text-[10px]">
                  {project.tag || 'Project'}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-serif text-md font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                {project.title}
              </h3>
              <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                {project.description}
              </p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Stay in the Loop Newsletter Card */}
      <section className="bg-neutral-100 dark:bg-neutral-900/40 p-6 md:p-8 rounded-lg border border-neutral-200 dark:border-neutral-800/80 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex flex-col gap-1.5 max-w-sm">
          <h3 className="font-serif text-xl font-semibold text-neutral-950 dark:text-neutral-50">
            Stay in the loop
          </h3>
          <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
            Occasional updates on what I'm building and thoughts. No spam.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto md:min-w-[280px]">
          <div className="relative flex-grow">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950/60 text-sm text-neutral-900 dark:text-neutral-50 rounded bg-white focus:outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-colors"
              id="newsletter-email-input"
            />
          </div>
          <button
            type="submit"
            disabled={subscribed}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 dark:bg-rose-600 dark:hover:bg-rose-500 text-white rounded text-sm font-mono cursor-pointer transition-colors flex items-center justify-center gap-1.5 shrink-0 focus:outline-none"
            id="newsletter-submit-btn"
          >
            {subscribed ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Joined
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      </section>

      {/* Subtle Archive Links */}
      <section className="flex flex-wrap items-center gap-6 font-mono text-xs text-neutral-500 dark:text-neutral-600 border-t border-dashed border-neutral-250 dark:border-neutral-800/60 pt-6">
        <span>ARCHIVE:</span>
        <a href="https://ormoscovitz.com/contests" target="_blank" rel="noreferrer" className="hover:text-rose-500 transition-colors">Contests ↗</a>
        <span className="opacity-40">•</span>
        <a href="https://ormoscovitz.com/then" target="_blank" rel="noreferrer" className="hover:text-rose-500 transition-colors">Then ↗</a>
        <span className="opacity-40">•</span>
        <a href="https://ormoscovitz.com/dated-posts" target="_blank" rel="noreferrer" className="hover:text-rose-500 transition-colors">Dated posts ↗</a>
      </section>
    </motion.div>
  );
}
