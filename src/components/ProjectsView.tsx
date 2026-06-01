/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Search, Code, Layout, Globe, Star } from 'lucide-react';
import { projects } from '../data.ts';

export default function ProjectsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Gather unique tags from single and multiple tags dynamically
  const allTags = [
    'All',
    ...Array.from(
      new Set(
        projects.flatMap((p) => {
          const list = [...(p.tags || [])];
          if (p.tag) {
            list.push(p.tag);
          }
          return list.length > 0 ? list : ['Project'];
        })
      )
    )
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check tags safely
    const projectTags = [...(project.tags || [])];
    if (project.tag && !projectTags.includes(project.tag)) {
      projectTags.push(project.tag);
    }
    const actualTags = projectTags.length > 0 ? projectTags : ['Project'];
    
    const matchesTag = selectedTag === 'All' || actualTags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-10 py-4"
    >
      {/* Header */}
      <section className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-[#F43F5E] block font-semibold">
          03 / PROJECTS
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight" id="projects-main-title">
          Things I've built
        </h1>
        <p className="font-sans text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl">
          A collection of digital twins, geometry systems, open-source libraries, and SaaS tools built for speed, offline reliability, and precise spatial workflows.
        </p>
      </section>

      {/* Interactive Toolbar */}
      <section className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-t border-b border-dashed border-neutral-200 dark:border-neutral-800 py-4">
        {/* Filter tags */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded text-xs font-mono transition-all duration-250 border select-none cursor-pointer ${
                selectedTag === tag
                  ? 'bg-neutral-900 border-neutral-900 text-[#FAF8F5] dark:bg-rose-600 dark:border-rose-600 dark:text-white'
                  : 'bg-transparent border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-400 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:border-neutral-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950/60 rounded text-xs font-mono text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-colors"
          />
        </div>
      </section>

      {/* Grid of Projects */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map((project, idx) => (
            <motion.a
              key={project.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="group p-5 border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-solid hover:border-neutral-800 dark:hover:border-neutral-200 rounded-lg bg-[#FAF8F5]/30 dark:bg-[#121212]/30 hover:bg-[#FAF8F5]/80 dark:hover:bg-[#121212]/80 hover:shadow-xs transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
              id={`project-view-item-${idx}`}
            >
              <div className="flex flex-col gap-1.5 max-w-xl">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(() => {
                    const projectTags = [...(project.tags || [])];
                    if (project.tag && !projectTags.includes(project.tag)) {
                      projectTags.unshift(project.tag);
                    }
                    const finalTags = projectTags.length > 0 ? projectTags : ['Project'];
                    return finalTags.map((tagStr) => (
                      <span key={tagStr} className="font-mono text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded">
                        {tagStr}
                      </span>
                    ));
                  })()}
                </div>
                <h3 className="font-serif text-lg font-semibold text-neutral-950 dark:text-neutral-100 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
                  {project.title.replace(' ↗', '')}
                </h3>
                <p className="font-sans text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-end md:self-center font-mono text-xs text-rose-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <span>View Source</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </motion.a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md font-mono text-xs text-neutral-400">
          No projects found matching current criteria.
        </div>
      )}
    </motion.div>
  );
}
