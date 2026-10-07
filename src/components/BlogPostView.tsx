/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Fragment } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Clock, Calendar } from 'lucide-react';
import { Post } from '../types.ts';
import { parseArticle } from '../article.ts';

interface BlogPostViewProps {
  post: Post;
  onBack: () => void;
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter((part) => part !== '');
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-neutral-900 dark:text-neutral-50">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export default function BlogPostView({ post, onBack }: BlogPostViewProps) {
  const blocks = parseArticle(post.content ?? '');

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6 py-4"
    >
      <button
        onClick={onBack}
        className="self-start font-mono text-xs text-neutral-500 dark:text-neutral-400 hover:text-rose-500 flex items-center gap-2 cursor-pointer transition-colors focus:outline-none mb-2"
        id="post-back-btn"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to all writing</span>
      </button>

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
        <p className="font-sans text-sm text-neutral-600 dark:text-neutral-300 font-light italic mt-1 leading-relaxed">
          {post.summary}
        </p>
        {post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-rose-500 hover:underline inline-flex items-center gap-1 w-fit"
          >
            Read the paper
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
      </header>

      <article id="article-body" className="max-w-none">
        <div className="font-sans text-base leading-relaxed text-neutral-800 dark:text-neutral-200 font-light flex flex-col gap-6">
          {blocks.map((block, index) => {
            if (block.type === 'h3') {
              return (
                <h4 key={index} className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-50 mt-4 -mb-2">
                  {renderInline(block.text)}
                </h4>
              );
            }
            if (block.type === 'h2') {
              return (
                <h3 key={index} className="font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-50 mt-6 -mb-2">
                  {renderInline(block.text)}
                </h3>
              );
            }
            if (block.type === 'ol') {
              return (
                <div key={index} className="flex flex-col gap-4">
                  {block.intro && <p className="leading-relaxed font-light">{renderInline(block.intro)}</p>}
                  <ol className="list-decimal pl-5 space-y-3 marker:font-mono marker:text-rose-500">
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="pl-1 leading-relaxed">
                        {renderInline(item)}
                      </li>
                    ))}
                  </ol>
                </div>
              );
            }
            return (
              <p key={index} className="leading-relaxed font-light">
                {renderInline(block.text)}
              </p>
            );
          })}
        </div>
      </article>

      <footer className="mt-12 p-6 border border-neutral-200 dark:border-neutral-800 rounded bg-neutral-50/40 dark:bg-neutral-950/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
        <span>© Or Moscovitz.</span>
        {post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rose-500 transition-colors underline underline-offset-4"
          >
            Read the paper ↗
          </a>
        )}
      </footer>
    </motion.div>
  );
}
