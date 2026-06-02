import { Theme, ThemeMode } from './types.ts';

export const themes: Theme[] = [
  {
    mode: 'dark',
    label: 'Dark',
    bg: '#0f0f0f',
    text: '#f0ece4',
    accent: '#f0ece4',
    border: '#2a2a2a',
    muted: '#666666',
    halfColor: '#f0ece4',
  },
  {
    mode: 'light',
    label: 'Light',
    bg: '#FAF8F5',
    text: '#111111',
    accent: '#111111',
    border: '#e0dcd6',
    muted: '#999999',
    halfColor: '#111111',
  },
  {
    mode: 'yellow',
    label: 'Yellow',
    bg: '#1a1a14',
    text: '#e8e000',
    accent: '#e8e000',
    border: '#2e2e1a',
    muted: '#7a7a40',
    halfColor: '#e8e000',
  },
  {
    mode: 'olive',
    label: 'Olive',
    bg: '#4a5230',
    text: '#f0ece4',
    accent: '#ff4da6',
    border: '#5a6238',
    muted: '#8a9260',
    halfColor: '#ff4da6',
  },
];

export function getTheme(mode: ThemeMode): Theme {
  return themes.find(t => t.mode === mode) || themes[0];
}

export function nextTheme(current: ThemeMode): ThemeMode {
  const idx = themes.findIndex(t => t.mode === current);
  return themes[(idx + 1) % themes.length].mode;
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty('--theme-bg', theme.bg);
  root.style.setProperty('--theme-text', theme.text);
  root.style.setProperty('--theme-accent', theme.accent);
  root.style.setProperty('--theme-border', theme.border);
  root.style.setProperty('--theme-muted', theme.muted);

  // toggle dark class for tailwind dark: utilities
  if (theme.mode === 'dark' || theme.mode === 'yellow' || theme.mode === 'olive') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // set data-theme for CSS targeting
  root.setAttribute('data-theme', theme.mode);

  localStorage.setItem('theme', theme.mode);
}
