/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, Plus, Search, Filter, Compass, Settings, ShieldCheck, Cpu } from 'lucide-react';
import { BacklogItem } from '../types.ts';
import { backlogItems as initialBacklogItems } from '../data.ts';

export default function BacklogView() {
  const [items, setItems] = useState<BacklogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [votedIds, setVotedIds] = useState<string[]>([]);

  // Form Fields
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<BacklogItem['category']>('Spatial Analysis');

  // Load from local storage
  useEffect(() => {
    const savedItems = localStorage.getItem('or_portfolio_backlog');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      setItems(initialBacklogItems);
    }

    const savedVotes = localStorage.getItem('or_portfolio_votes');
    if (savedVotes) {
      setVotedIds(JSON.parse(savedVotes));
    }
  }, []);

  // Sync to local storage
  const saveItems = (updatedItems: BacklogItem[]) => {
    setItems(updatedItems);
    localStorage.setItem('or_portfolio_backlog', JSON.stringify(updatedItems));
  };

  const handleUpvote = (id: string) => {
    if (votedIds.includes(id)) {
      // Undo upvote
      const updatedVotes = votedIds.filter((vId) => vId !== id);
      setVotedIds(updatedVotes);
      localStorage.setItem('or_portfolio_votes', JSON.stringify(updatedVotes));

      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, votes: Math.max(0, item.votes - 1) } : item
      );
      saveItems(updatedItems);
    } else {
      // Upvote
      const updatedVotes = [...votedIds, id];
      setVotedIds(updatedVotes);
      localStorage.setItem('or_portfolio_votes', JSON.stringify(updatedVotes));

      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      );
      saveItems(updatedItems);
    }
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newItem: BacklogItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      status: 'backlog',
      category: newCategory,
      votes: 1
    };

    const updated = [newItem, ...items];
    saveItems(updated);

    // Clear form
    setNewTitle('');
    setNewDesc('');
    setIsAdding(false);
  };

  const categories = ['All', 'Spatial Analysis', 'Geometry Processing', 'Agentic Workflows', 'General'];

  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    // Sort primarily by votes descending, unless custom sort is applied later
    .sort((a, b) => b.votes - a.votes);

  const getStatusComponent = (status: BacklogItem['status']) => {
    switch (status) {
      case 'released':
        return (
          <span className="text-[10px] uppercase font-mono font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 bg-emerald-500/5 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Released
          </span>
        );
      case 'in-progress':
        return (
          <span className="text-[10px] uppercase font-mono font-bold text-amber-600 dark:text-amber-400 border border-amber-500/30 bg-amber-500/5 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            In Progress
          </span>
        );
      case 'planning':
        return (
          <span className="text-[10px] uppercase font-mono font-bold text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 bg-cyan-500/5 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
            Planning
          </span>
        );
      default:
        return (
          <span className="text-[10px] uppercase font-mono font-semibold text-neutral-400 dark:text-neutral-500 border border-neutral-300 dark:border-neutral-800 bg-neutral-150/10 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
            Backlog
          </span>
        );
    }
  };

  const getCategoryIcon = (category: BacklogItem['category']) => {
    switch (category) {
      case 'Spatial Analysis':
        return <Compass className="w-3.5 h-3.5 text-rose-500" />;
      case 'Geometry Processing':
        return <Cpu className="w-3.5 h-3.5 text-blue-500" />;
      case 'Agentic Workflows':
        return <Settings className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-10 py-4"
    >
      {/* Editorial Title Header */}
      <section className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-[#F43F5E] block font-semibold">
          04 / ROADMAP & BACKLOG
        </span>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight" id="backlog-main-title">
              Active backlog
            </h1>
            <p className="font-sans text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl mt-1">
              Interactive board representing current research priorities, features in development, and long-term planning vectors. Use the upvote metrics to suggest alignment.
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 dark:bg-rose-600 text-white dark:text-white rounded hover:bg-neutral-800 dark:hover:bg-rose-500 transition-all cursor-pointer font-mono text-xs font-semibold focus:outline-none"
            id="backlog-add-btn"
          >
            <Plus className="w-4 h-4" />
            {isAdding ? 'Close Form' : 'Propose Idea'}
          </button>
        </div>
      </section>

      {/* Propose Form Panel */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateItem}
            className="p-6 border border-solid border-neutral-300 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-950/20 rounded-lg flex flex-col gap-4 overflow-hidden"
          >
            <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              Propose a new spatial tool or agentic workflow
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] uppercase font-bold text-neutral-400">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IFC Geolocation Anchorer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 text-xs font-mono text-neutral-800 dark:text-neutral-200 rounded focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] uppercase font-bold text-neutral-400">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as BacklogItem['category'])}
                  className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 text-xs font-mono text-neutral-800 dark:text-neutral-200 rounded focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="Spatial Analysis">Spatial Analysis</option>
                  <option value="Geometry Processing">Geometry Processing</option>
                  <option value="Agentic Workflows">Agentic Workflows</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] uppercase font-bold text-neutral-400">Description</label>
              <textarea
                required
                rows={3}
                placeholder="Detail the built environment scope, automation target, or geometric parameters..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 text-xs font-mono text-neutral-800 dark:text-neutral-200 rounded focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold rounded cursor-pointer self-start focus:outline-none transition-colors"
            >
              Submit to Local Backlog
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Filter and Toolbars */}
      <section className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-t border-b border-dashed border-neutral-200 dark:border-neutral-800 py-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-[11px] font-mono transition-all border select-none cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-900 border-neutral-900 text-[#FAF8F5] dark:bg-rose-600 dark:border-rose-600 dark:text-white'
                  : 'bg-transparent border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-400 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:border-neutral-600'
              }`}
            >
              {cat === 'All' ? 'All Frameworks' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search backlog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950/60 rounded text-xs font-mono text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-rose-500"
          />
        </div>
      </section>

      {/* Grid List */}
      <section className="flex flex-col gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, idx) => {
            const hasVoted = votedIds.includes(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="p-5 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg bg-[#FAF8F5]/30 dark:bg-[#121212]/30 flex gap-4 items-start justify-between hover:border-solid hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200"
                id={`backlog-item-${item.id}`}
              >
                <div className="flex flex-col gap-2 flex-grow">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {getStatusComponent(item.status)}
                    <span className="flex items-center gap-1 font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-2xl">
                    {item.description}
                  </p>
                </div>

                {/* Tactile Retro Counter Switch */}
                <button
                  type="button"
                  onClick={() => handleUpvote(item.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded border w-11 focus:outline-none transition-all cursor-pointer ${
                    hasVoted
                      ? 'bg-rose-500/10 border-rose-500 text-rose-500 font-bold'
                      : 'bg-neutral-100 dark:bg-neutral-950 border-neutral-250 dark:border-neutral-750 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-neutral-400'
                  }`}
                  id={`upvote-btn-${item.id}`}
                >
                  <ChevronUp className={`w-4 h-4 transition-transform duration-200 ${hasVoted ? 'translate-y-[-1px]' : ''}`} />
                  <span className="font-mono text-xs mt-0.5">{item.votes}</span>
                </button>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md font-mono text-xs text-neutral-400">
            No backlog items found matches current filter.
          </div>
        )}
      </section>
    </motion.div>
  );
}
