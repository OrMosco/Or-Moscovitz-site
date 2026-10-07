/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { blogPosts, projectBadge, projectGroups, projectLinkLabel, projects } from '../data.ts';

export default function HomeView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-12 py-4"
    >
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
          className="font-mono text-base text-neutral-700 dark:text-neutral-200 font-normal leading-snug"
          id="home-hero-roles"
        >
          Software Developer / Computational Design / AEC Tools
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.13 }}
          className="font-mono text-sm text-neutral-500 dark:text-neutral-400 font-normal"
          id="home-hero-location"
        >
          Haifa, Israel
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.17 }}
          className="font-mono text-sm text-neutral-600 dark:text-neutral-200 font-light leading-relaxed max-w-2xl mt-2"
          id="home-hero-bio"
        >
          I build tools for the built environment — spatial analysis, geometry processing, and agentic workflows that automate the complex stuff.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.21 }}
          className="mt-4 flex flex-col items-start gap-3"
          id="home-hero-cta"
        >
          <a
            href="mailto:ormosco41@gmail.com"
            className="inline-flex items-center gap-2 font-mono text-sm font-medium text-neutral-900 dark:text-neutral-100 border border-neutral-900 dark:border-neutral-200 px-3 py-2 hover:border-rose-500 hover:text-rose-500 dark:hover:border-rose-500 dark:hover:text-rose-400 transition-colors"
            id="home-hero-email"
          >
            <Mail className="w-4 h-4" />
            ormosco41@gmail.com
          </a>
          <p className="font-mono text-sm text-neutral-700 dark:text-neutral-200 flex items-start gap-2 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <span>Available for AEC, product, and computational design work.</span>
          </p>
        </motion.div>
      </section>

      <section className="flex flex-col gap-4">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest"
        >
          Work
        </motion.h2>
        <div className="flex flex-col gap-3">
          {[
            { years: '2025 — 2026', role: 'Software Engineer', company: 'DalusAI' },
            { years: '2024 — 2025', role: 'Developer', company: 'Derman Verbakl' },
            { years: '2023 — 2026', role: 'Lecturer of Computational Design', company: 'Haifa University' },
            { years: '2021 — 2024', role: 'Developer & Product Owner', company: 'URBAN-DASHBOARD (PAZ Group)' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22 + idx * 0.05 }}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-2 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0"
            >
              <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap min-w-[100px]">
                {item.years}
              </span>
              <span className="font-mono text-sm text-neutral-800 dark:text-neutral-200">
                {item.role} <span className="text-neutral-500 dark:text-neutral-400">@ {item.company}</span>
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            Latest writing
          </h2>
          <Link
            to="/writing"
            className="font-mono text-xs text-neutral-500 dark:text-neutral-400 hover:text-rose-500 font-semibold underline underline-offset-4 decoration-neutral-300 hover:decoration-rose-500 transition-all"
            id="view-all-posts-btn"
          >
            View all posts →
          </Link>
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
                <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 block">
                  {post.date}
                </span>
                {post.url && (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-rose-500 hover:underline"
                  >
                    Paper ↗
                  </a>
                )}
              </div>
              <Link
                to={`/writing/${post.slug}`}
                className="text-left font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-100 hover:text-rose-500 transition-colors"
                id={`latest-post-link-${post.id}`}
              >
                {post.title}
              </Link>
              <p className="font-sans text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed font-light line-clamp-2">
                {post.summary}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="font-serif text-2xl font-semibold text-neutral-900 dark:text-neutral-50 border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-2">
          Things I've built
        </h2>
        {projectGroups.map((group) => {
          const items = projects.filter((project) => project.group === group.id);
          if (items.length === 0) return null;
          return (
            <div key={group.id} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                    {group.label}
                  </h3>
                  {group.id === 'aec' && (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-rose-500">Primary</span>
                  )}
                </div>
                <p className="font-sans text-sm text-neutral-600 dark:text-neutral-300 font-light">
                  {group.note}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((project, idx) => (
                  <motion.a
                    key={project.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 + idx * 0.04 }}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-5 border border-neutral-200 dark:border-neutral-800 rounded-md bg-[#FAF8F5]/30 dark:bg-[#121212]/30 hover:bg-[#FAF8F5]/80 dark:hover:bg-[#121212]/80 hover:border-neutral-900 dark:hover:border-neutral-200 hover:shadow-sm transition-all duration-200 flex flex-col gap-1.5"
                    id={`project-link-${group.id}-${idx}`}
                  >
                    <div className="flex items-center justify-between gap-3 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="font-semibold text-rose-500/80 bg-rose-500/10 dark:bg-rose-500/15 px-2 py-0.5 rounded-full text-[10px]">
                        {projectBadge(project)}
                      </span>
                      <span className="inline-flex items-center gap-1 shrink-0 group-hover:text-rose-500 transition-colors">
                        {projectLinkLabel(project)}
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </div>
                    <h3 className="font-serif text-md font-semibold text-neutral-800 dark:text-neutral-100 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                      {project.title}
                    </h3>
                    <p className="font-sans text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                      {project.description}
                    </p>
                  </motion.a>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="flex flex-wrap items-center gap-6 font-mono text-xs text-neutral-500 dark:text-neutral-400 border-t border-dashed border-neutral-200 dark:border-neutral-800/60 pt-6">
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
