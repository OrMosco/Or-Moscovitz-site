/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Search } from 'lucide-react';
import { projectGroups, projectLinkBadge, projectLinkLabel, projectTags, projects } from '../data.ts';

export default function ProjectsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const allTags = [
    'All',
    ...Array.from(new Set(projects.flatMap((project) => projectTags(project)))),
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || projectTags(project).includes(selectedTag);
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
      <section className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-[#F43F5E] block font-semibold">
          03 / PROJECTS
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight" id="projects-main-title">
          Things I've built
        </h1>
        <p className="font-sans text-sm md:text-base text-neutral-700 dark:text-neutral-200 font-light leading-relaxed max-w-2xl">
          AEC, geometry, and computational-design tools come first. Product, web, and other work is grouped after that.
        </p>
      </section>

      <section className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-t border-b border-dashed border-neutral-200 dark:border-neutral-800 py-4">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded text-xs font-mono transition-all duration-250 border select-none cursor-pointer ${
                selectedTag === tag
                  ? 'bg-neutral-900 border-neutral-900 text-[#FAF8F5] dark:bg-rose-600 dark:border-rose-600 dark:text-white'
                  : 'bg-transparent border-neutral-200 text-neutral-600 hover:text-neutral-800 hover:border-neutral-400 dark:border-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100 dark:hover:border-neutral-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

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

      {filteredProjects.length > 0 ? (
        <div className="flex flex-col gap-10">
          {projectGroups.map((group) => {
            const items = filteredProjects.filter((project) => project.group === group.id);
            if (items.length === 0) return null;
            return (
              <section key={group.id} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                      {group.label}
                    </h2>
                    {group.id === 'aec' && (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-rose-500">Primary</span>
                    )}
                  </div>
                  <p className="font-sans text-sm text-neutral-600 dark:text-neutral-300 font-light">
                    {group.note}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {items.map((project, idx) => (
                    <motion.a
                      key={project.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-5 border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-solid hover:border-neutral-800 dark:hover:border-neutral-200 rounded-lg bg-[#FAF8F5]/30 dark:bg-[#121212]/30 hover:bg-[#FAF8F5]/80 dark:hover:bg-[#121212]/80 hover:shadow-xs transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      id={`project-view-item-${group.id}-${idx}`}
                    >
                      <div className="flex flex-col gap-1.5 max-w-xl">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 text-rose-600 dark:text-rose-300 border border-rose-500/40 rounded">
                            {projectLinkBadge(project)}
                          </span>
                          {projectTags(project).map((tagStr) => (
                            <span key={tagStr} className="font-mono text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded">
                              {tagStr}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-serif text-lg font-semibold text-neutral-950 dark:text-neutral-100 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="font-sans text-xs md:text-sm text-neutral-600 dark:text-neutral-200 font-light leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 self-end md:self-center font-mono text-xs text-rose-500 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0">
                        <span>{projectLinkLabel(project)}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md font-mono text-xs text-neutral-500 dark:text-neutral-400">
          No projects found matching current criteria.
        </div>
      )}
    </motion.div>
  );
}
