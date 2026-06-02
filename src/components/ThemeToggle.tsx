import React from 'react';
import { motion } from 'motion/react';
import { ThemeMode } from '../types.ts';
import { themes, nextTheme, getTheme } from '../theme.ts';

interface ThemeToggleProps {
  themeMode: ThemeMode;
  onToggle: () => void;
}

// Half-circle SVG that changes color based on theme
function HalfCircleIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Full circle outline */}
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Right half filled */}
      <path d="M10 2 A8 8 0 0 1 10 18 Z" fill={color} />
    </svg>
  );
}

export default function ThemeToggle({ themeMode, onToggle }: ThemeToggleProps) {
  const current = getTheme(themeMode);
  const next = getTheme(nextTheme(themeMode));

  return (
    <motion.button
      onClick={onToggle}
      title={`Switch to ${next.label} mode`}
      whileTap={{ scale: 0.9 }}
      className="flex items-center justify-center w-9 h-9 rounded-full cursor-pointer focus:outline-none transition-all duration-300"
      style={{ background: 'transparent' }}
      id="theme-toggle-circle"
    >
      <motion.div
        key={themeMode}
        initial={{ rotate: -60, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 60, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <HalfCircleIcon color={current.halfColor} />
      </motion.div>
    </motion.button>
  );
}
