/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Search, ArrowUpRight } from 'lucide-react';
import { Post } from '../types.ts';
import { blogPosts } from '../data.ts';
import BlogPostView from './BlogPostView.tsx';

interface BlogListViewProps {
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
}

export default function BlogListView({ selectedPost, setSelectedPost }: BlogListViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedPost) {
    return <BlogPostView post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8 py-4"
    >
      {/* Search Header and title */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-widest text-[#F43F5E] block font-semibold">
            01 / WRITING INDEX
          </span>
          <h1 className="font-serif text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight" id="blog-list-title">
            Essays & Dispatches
          </h1>
        </div>

        {/* Minimal Search input */}
        <div className="relative w-full sm:w-64 max-w-sm">
          <input
            type="text"
            placeholder="Search writing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950/40 text-xs text-neutral-900 dark:text-neutral-50 rounded bg-white focus:outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-colors"
            id="blog-search-field"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </section>

      {/* Essays list */}
      <section className="flex flex-col gap-8 border-t border-dashed border-neutral-200 dark:border-neutral-800 pt-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, idx) => (
            <motion.article
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={post.id}
              className="flex flex-col gap-2 group pb-8 border-b border-neutral-150 dark:border-neutral-800/50 last:border-0"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 dark:text-neutral-500">
                <Calendar className="w-3 h-3 text-rose-500/80" />
                <span>{post.date}</span>
                <span className="opacity-40">•</span>
                <span>Or Moscovitz</span>
              </div>
              
              {post.isExternal && post.url ? (
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-left font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50 hover:text-[#F43F5E] dark:hover:text-[#F43F5E] cursor-pointer transition-colors duration-150 focus:outline-none flex items-center gap-2 group/title"
                  id={`blog-post-title-${post.id}`}
                >
                  <span>{post.title}</span>
                  <ArrowUpRight className="w-5 h-5 text-rose-500 opacity-60 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all shrink-0" />
                </a>
              ) : (
                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-left font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50 hover:text-[#F43F5E] dark:hover:text-[#F43F5E] cursor-pointer transition-colors duration-150 focus:outline-none"
                  id={`blog-post-title-${post.id}`}
                >
                  {post.title}
                </button>
              )}
              
              <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                {post.summary}
              </p>

              {post.isExternal && post.url ? (
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start font-mono text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5 focus:outline-none cursor-pointer mt-1 group"
                  id={`read-article-link-${post.id}`}
                >
                  <span>Read paper</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              ) : (
                <button
                  onClick={() => setSelectedPost(post)}
                  className="self-start font-mono text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5 focus:outline-none cursor-pointer mt-1 group"
                  id={`read-article-link-${post.id}`}
                >
                  <span>Read article</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
              )}
            </motion.article>
          ))
        ) : (
          <div className="text-center py-12 font-mono text-neutral-500 dark:text-neutral-600 text-sm">
            No dispatches matching "{searchTerm}" found.
          </div>
        )}
      </section>
    </motion.div>
  );
}
