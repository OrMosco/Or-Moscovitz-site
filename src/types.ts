/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  summary: string;
  content: string;
  url?: string;
  isExternal?: boolean;
}

export interface Project {
  title: string;
  description: string;
  url: string;
  tag?: string;
  tags?: string[];
  isExternal: boolean;
}

export type ActivePage = 'home' | 'about' | 'blog' | 'projects' | 'backlog';

export interface BacklogItem {
  id: string;
  title: string;
  description: string;
  status: 'released' | 'in-progress' | 'planning' | 'backlog';
  category: 'Spatial Analysis' | 'Geometry Processing' | 'Agentic Workflows' | 'General';
  votes: number;
}
