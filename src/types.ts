export type ActivePage = 'home' | 'blog' | 'about' | 'projects' | 'backlog';

export interface Post {
  id: string;
  title: string;
  date: string;
  summary: string;
  content?: string;
  tags?: string[];
  isExternal?: boolean;
  url?: string;
}

export interface Project {
  title: string;
  description: string;
  url: string;
  tag?: string;
}

export type ThemeMode = 'dark' | 'light' | 'yellow' | 'olive';

export interface Theme {
  mode: ThemeMode;
  label: string;
  bg: string;
  text: string;
  accent: string;
  border: string;
  muted: string;
  halfColor: string; // color of the half-circle icon
}
