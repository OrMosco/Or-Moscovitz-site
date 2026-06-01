/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { Post } from '../types.ts';

interface BlogPostViewProps {
  post: Post;
  onBack: () => void;
}

export default function BlogPostView({ post, onBack }: BlogPostViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6 py-4"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="self-start font-mono text-xs text-neutral-400 hover:text-rose-500 flex items-center gap-2 cursor-pointer transition-colors focus:outline-none mb-2"
        id="post-back-btn"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Back to all writing</span>
      </button>

      {/* Article Header */}
      <header className="flex flex-col gap-3 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 font-mono text-xs text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {post.date}
          </span>
          <span className="opacity-40">•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            3 min read
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 leading-tight">
          {post.title}
        </h1>
        <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 font-light italic mt-1 leading-relaxed">
          {post.summary}
        </p>
      </header>

      {/* Article Body */}
      <article className="prose prose-neutral max-w-none dark:prose-invert">
        <div className="font-sans text-base leading-relaxed text-neutral-700 dark:text-neutral-300 font-light flex flex-col gap-6">
          {post.content.split('\n\n').map((paragraph, index) => {
            // Check for potential markdown headers
            if (paragraph.startsWith('### ')) {
              return (
                <h4 key={index} className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-50 mt-4 -mb-2">
                  {paragraph.replace('### ', '')}
                </h4>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h3 key={index} className="font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-50 mt-6 -mb-2">
                  {paragraph.replace('## ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('**') || paragraph.search(/\*(.*?)\*/) !== -1) {
              // Simple inline bold handling
              return (
                <p key={index} className="leading-relaxed font-light">
                  {paragraph.split('**').map((part, pIdx) => {
                    return pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-neutral-900 dark:text-neutral-150">{part}</strong> : part;
                  })}
                </p>
              );
            }

            // Normal paragraph
            return (
              <p key={index} className="leading-relaxed font-light">
                {paragraph}
              </p>
            );
          })}
        </div>
      </article>

      {/* Share / Footer block */}
      <footer className="mt-12 p-6 border border-neutral-200 dark:border-neutral-800 rounded bg-neutral-50/40 dark:bg-neutral-950/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-400">
        <span>© Or Moscovitz. Published initially on his blog.</span>
        <a
          href={`https://ormoscovitz.com/blog/${post.slug}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-rose-500 transition-colors underline underline-offset-4"
        >
          View original article ↗
        </a>
      </footer>
    </motion.div>
  );
}
