/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ActivePage, ThemeMode } from '../types.ts';
import ThemeToggle from './ThemeToggle.tsx';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  themeMode: ThemeMode;
  onThemeToggle: () => void;
}

export default function Header({ activePage, setActivePage, darkMode, setDarkMode, themeMode, onThemeToggle }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { number: '01', label: 'Writing', value: 'blog' as ActivePage },
    { number: '02', label: 'About', value: 'about' as ActivePage },
    { number: '03', label: 'Projects', value: 'projects' as ActivePage },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-[#FAF8F5]/80 dark:bg-[#121212]/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand logo/name */}
        <button
          onClick={() => handleNavClick('home')}
          className="font-mono text-sm tracking-tight cursor-pointer hover:opacity-80 flex items-center gap-1.5 focus:outline-none"
          id="brand-logo-btn"
        >
          <span className="font-bold text-neutral-900 dark:text-[#FAF8F5]">ormoscovitz</span>
          <span className="text-neutral-400 dark:text-neutral-600 font-light">.com</span>
          <span className="inline-block w-2 h-4 bg-rose-500 cursor-blink ml-0.5"></span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle themeMode={themeMode} onToggle={onThemeToggle} />
          {/* Retro Hamburger Toggle button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-md cursor-pointer hover:border-neutral-900 dark:hover:border-[#FAF8F5] transition-all duration-200 text-neutral-900 dark:text-[#FAF8F5] focus:outline-none flex items-center justify-center"
            id="menu-hamburger-btn"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <X className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <Menu className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Retro Drawer Fullscreen Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="w-full absolute left-0 right-0 bg-[#FAF8F5] dark:bg-[#121212] border-b border-neutral-300 dark:border-neutral-800 overflow-hidden shadow-2xl z-40"
          >
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Main links list list */}
                <div className="flex flex-col gap-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-600 block">
                    DIRECTORY INDEX
                  </span>
                  <nav className="flex flex-col gap-3">
                    {menuItems.map((item, idx) => (
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        key={item.value}
                        onClick={() => handleNavClick(item.value)}
                        className={`text-left group flex items-baseline gap-4 cursor-pointer focus:outline-none py-1 border-b border-transparent hover:border-neutral-300 dark:hover:border-neutral-800 transition-colors duration-150 ${
                          activePage === item.value 
                            ? 'text-rose-500' 
                            : 'text-neutral-800 dark:text-neutral-300'
                        }`}
                        id={`menu-item-${item.value}`}
                      >
                        <span className="font-mono text-sm font-semibold opacity-50 text-neutral-500 dark:text-neutral-400 group-hover:opacity-100 transition-opacity">
                          {item.number}
                        </span>
                        <span className="font-serif text-3xl font-semibold tracking-tight transition-all duration-200 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:pl-2">
                          {item.label}
                        </span>
                      </motion.button>
                    ))}
                  </nav>
                </div>

                {/* Meta details with bio shortcut */}
                <div className="flex flex-col h-full justify-between gap-8 md:border-l md:border-neutral-200 md:dark:border-neutral-800 md:pl-12">
                  <div className="flex flex-col gap-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-600 block">
                      CURRENT IN Haifa, Israel
                    </span>
                    <p className="font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      I build tools for the built environment. — spatial analysis, geometry processing, and agentic workflows that automate the complex stuff.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5 justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Ready to collaborate</span>
                    </div>
                    <div>IDT / Haifa</div>
                    <a
                      href="https://ormoscovitz.com"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick('home');
                      }}
                      className="group inline-flex items-center gap-1 mt-2 text-rose-500 hover:underline"
                    >
                      Return to overview <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
