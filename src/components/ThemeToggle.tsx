import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeMode } from '../types.ts';
import { themes, nextTheme, getTheme } from '../theme.ts';

interface ThemeToggleProps {
  themeMode: ThemeMode;
  onToggle: () => void;
}

// Different circle shapes per theme — like Ismail Seleit
function ThemeIcon({ mode, color }: { mode: ThemeMode; color: string }) {
  switch (mode) {
    case 'light':
      // Full circle (filled)
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="9" fill={color} />
        </svg>
      );
    case 'dark':
      // Empty circle (outline only)
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8.5" stroke={color} strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 'yellow':
      // Half circle (right half filled) — like Ismail
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8.5" stroke={color} strokeWidth="1.5" fill="none" />
          <path d="M11 2.5 A8.5 8.5 0 0 1 11 19.5 Z" fill={color} />
        </svg>
      );
    case 'olive':
      // Three-quarter circle filled
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8.5" stroke={color} strokeWidth="1.5" fill="none" />
          <path d="M11 2.5 A8.5 8.5 0 1 1 2.5 11 Z" fill={color} />
        </svg>
      );
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8.5" stroke={color} strokeWidth="1.5" fill="none" />
        </svg>
      );
  }
}

export default function ThemeToggle({ themeMode, onToggle }: ThemeToggleProps) {
  const current = getTheme(themeMode);

  return (
    <motion.button
      onClick={onToggle}
      title={`Switch theme`}
      whileTap={{ scale: 0.85, rotate: 15 }}
      className="flex items-center justify-center w-10 h-10 cursor-pointer focus:outline-none"
      style={{ background: 'transparent', border: 'none' }}
      id="theme-toggle-circle"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={themeMode}
          initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.6, rotate: 30 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <ThemeIcon mode={themeMode} color={current.halfColor} />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
