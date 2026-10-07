/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeMode } from '../types.ts';
import { getTheme } from '../theme.ts';
import ThemeToggle from './ThemeToggle.tsx';

interface HeaderProps {
  themeMode: ThemeMode;
  onThemeToggle: () => void;
}

const menuItems = [
  { number: '01', label: 'Writing', to: '/writing' },
  { number: '02', label: 'About', to: '/about' },
  { number: '03', label: 'Projects', to: '/projects' },
];

function isItemActive(to: string, pathname: string) {
  if (to === '/writing') return pathname === '/writing' || pathname.startsWith('/writing/');
  return pathname === to;
}

export default function Header({ themeMode, onThemeToggle }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const theme = getTheme(themeMode);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-[#FAF8F5]/80 dark:bg-[#121212]/80 backdrop-blur-md transition-colors duration-300"
      style={isOpen ? { backgroundColor: theme.bg } : undefined}
    >
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-mono text-sm tracking-tight hover:opacity-80 flex items-center gap-1.5 focus:outline-none"
          id="brand-logo-btn"
        >
          <span className="font-bold text-neutral-900 dark:text-[#FAF8F5]">ormoscovitz</span>
          <span className="text-neutral-400 dark:text-neutral-600 font-light">.com</span>
          <span className="inline-block w-2 h-4 bg-rose-500 cursor-blink ml-0.5"></span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle themeMode={themeMode} onToggle={onThemeToggle} />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="directory-overlay"
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="directory-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-40 h-[calc(100dvh-4rem)] w-full overflow-y-auto border-t"
            style={{ backgroundColor: theme.bg, borderColor: theme.border }}
          >
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-400 block">
                    DIRECTORY INDEX
                  </span>
                  <nav className="flex flex-col gap-3">
                    {menuItems.map((item, idx) => {
                      const active = isItemActive(item.to, pathname);
                      return (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          key={item.to}
                        >
                          <Link
                            to={item.to}
                            onClick={() => setIsOpen(false)}
                            className={`text-left group flex items-baseline gap-4 py-1 border-b border-transparent hover:border-neutral-300 dark:hover:border-neutral-800 transition-colors duration-150 ${
                              active ? 'text-rose-500' : 'text-neutral-800 dark:text-neutral-200'
                            }`}
                            id={`menu-item-${item.to.slice(1)}`}
                          >
                            <span className="font-mono text-sm font-semibold text-neutral-500 dark:text-neutral-400 group-hover:opacity-100 transition-opacity">
                              {item.number}
                            </span>
                            <span className="font-serif text-3xl font-semibold tracking-tight transition-all duration-200 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:pl-2">
                              {item.label}
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
                </div>

                <div className="flex flex-col h-full justify-between gap-8 md:border-l md:border-neutral-200 md:dark:border-neutral-800 md:pl-12">
                  <div className="flex flex-col gap-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-400 block">
                      CURRENT IN Haifa, Israel
                    </span>
                    <p className="font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-200">
                      I build tools for the built environment — spatial analysis, geometry processing, and agentic workflows that automate the complex stuff.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 font-mono text-xs text-neutral-500 dark:text-neutral-300">
                    <div className="flex items-start gap-1.5 justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-1 shrink-0"></span>
                      <span>Available for AEC, product, and computational design work.</span>
                    </div>
                    <a href="mailto:ormosco41@gmail.com" className="text-rose-500 hover:underline w-fit">
                      ormosco41@gmail.com
                    </a>
                    <div>IDT / Haifa</div>
                    <Link
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className="group inline-flex items-center gap-1 mt-2 text-rose-500 hover:underline w-fit"
                    >
                      Return to overview <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
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
