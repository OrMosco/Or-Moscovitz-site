export type ActivePage = 'home' | 'blog' | 'about' | 'projects' | 'backlog';

export type ProjectGroupId = 'aec' | 'product' | 'other';

/** What the project URL actually opens. Source is reserved for code repositories. */
export type ProjectLinkKind = 'site' | 'source' | 'video';

export interface Post {
  id: string;
  title: string;
  slug: string;
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
  tags?: string[];
  isExternal?: boolean;
  group: ProjectGroupId;
  linkKind: ProjectLinkKind;
  /** Short type label for the home card. Falls back to tag. */
  badge?: string;
}

export interface BacklogItem {
  id: string;
  title: string;
  description: string;
  status: 'released' | 'in-progress' | 'planning' | 'backlog';
  category: 'Spatial Analysis' | 'Geometry Processing' | 'Agentic Workflows' | 'General';
  votes: number;
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
