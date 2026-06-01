/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Post, Project, BacklogItem } from './types.ts';

export const blogPosts: Post[] = [
  {
    id: 'ai-agents-aec-industry',
    title: 'Autonomous Agents in the AEC Industry: Beyond CAD Automation',
    slug: 'ai-agents-aec-industry',
    date: 'Jun 1, 2026',
    summary: 'An exploration of how agentic workflows are shifting the paradigm in Architecture, Engineering, and Construction—moving from rigid CAD scripts to autonomous spatial reasoners.',
    content: `The Architecture, Engineering, and Construction (AEC) industry has transitioned from paper drawings to computer-aided drafting (CAD), and then from CAD to Building Information Modeling (BIM). Today, we stand on the brink of the next paradigm shift: **agentic workflows**.

Unlike traditional CAD scripts or standard macros that execute fixed geometric sequences, AI agents can autonomously perceive, reason, and act within spatial databases, 3D models, and design systems. They do not just format data; they solve high-dimensional trade-offs.

### From Static Rules to Dynamic Reasoners

In traditional computational design, optimizing a neighborhood-scale master plan for environmental factors (like solar radiance or wind flow) required building complex, fragile parametric definitions. If minor parameters changed or custom boundary conditions were introduced, the entire calculation would frequently break.

An autonomous AI agent, powered by multimodal models and specialized geometric tools, can inspect a design file, identify non-manifold boundaries, compile spatial metrics, and reason through trade-offs like a human consultant:

1. **Intelligent Spatial Retrieval**: Parsing complex municipal zoning ordinances, local codebooks, and historical structural reports to automatically compile design constraints with absolute accuracy.
2. **Iterative Multi-Objective Design**: Instantly generating hundreds of spatial permutations, executing real-time structural load or solar radiance simulations, and selecting the optimal candidates.
3. **Automated System Integration**: Coordinating structural, mechanical, and architectural elements autonomously to identify conflict zones and synthesize engineered routing alternatives during early layout stages.

### The Human-Agent Partnership

In the AEC context, AI agents are not designed to replace architects, urban planners, or structural engineers. Rather, they act as specialized, highly cooperative co-designers. By delegating compliance checking, stress testing, and clash remediation to autonomous agents, human teams are liberated to focus on qualitative value: artistic vision, human scale, and beautiful design. The future of AEC design is highly collaborative, where human creativity is amplified by agentic execution.`,
  },
  {
    id: 'caadria-2022-urban-code',
    title: 'An Evolutionary Approach to Parametric Urban Design',
    slug: 'caadria-2022-urban-code',
    date: 'Apr 17, 2022',
    summary: 'Our peer-reviewed conference paper from the CAADRIA 2022 conference at TUM, establishing a rigorous computational framework to optimize neighborhood-scale master plans using genetic algorithms.',
    content: `Published in the *Proceedings of the 27th International Conference of the Association for Computer-Aided Architectural Design Research in Asia (CAADRIA) 2022*, hosted by the Technical University of Munich (TUM).

This academic paper introduces a generative optimization workflow developed during my thesis project. The system automatically constructs, simulates, and optimizes urban block structures under high-density environmental constraints, establishing complex fitness criteria over solar radiance, geometric density, and connectivity indexes.`,
    url: 'https://papers.cumincad.org/cgi-bin/works/paper/caadria2022_281',
    isExternal: true,
  }
];

export const projects: Project[] = [
  {
    title: 'Urban Code: Parametric Urban Design ↗',
    description: 'My computational thesis project establishing parametric urban design methodologies, morphological simulations, and genetic algorithm optimization inside CAD/Grasshopper environments.',
    url: 'https://www.grasshopper3d.com/video/parametirc-urban-design-urban-code-project?id=2985220%3AVideo%3A1937272&page=2',
    tags: ['Computational Design', 'Geometry'],
    isExternal: true,
  },
  {
    title: '3D Bin Packing Problem Solver ↗',
    description: 'An interactive heuristic 3D bin packing solver and visualizer designed to optimize spatial arrangements, container layout density, and geometric package distribution.',
    url: 'https://ormosco.github.io/3d-bin-3695packing-problem/',
    tag: 'Geometry',
    isExternal: true,
  },
  {
    title: 'Shein Career Anchors ↗',
    description: 'An interactive self-assessment application mapping core professional values, motives, and career anchors based on Edgar Schein’s classic career development model.',
    url: 'https://shein-career-anchors.vercel.app/',
    tag: 'Web Tool',
    isExternal: true,
  },
  {
    title: 'Triage ↗',
    description: 'A clinical analytics platform for codebase health. Monitoring technical debt, churn metrics, and legacy code risk factors with clean reporting screens.',
    url: 'https://triage.codebasehealth.com',
    tag: 'SaaS',
    isExternal: true,
  },
  {
    title: 'DeployCast ↗',
    description: 'A podcast streaming application built around automated containerized pushes, offering low-latency, real-time audio distribution feeds to listener channels.',
    url: 'https://deploycast.app',
    tag: 'Web App',
    isExternal: true,
  },
  {
    title: 'Driftless ↗',
    description: 'Elegant, light-weight, and highly customizable contact and inquiry forms designed specifically for statically hosted blogs and marketer portfolios.',
    url: 'https://usedriftless.com',
    tag: 'Product',
    isExternal: true,
  },
  {
    title: 'Homedays ↗',
    description: 'Haifa, Israel indie rock band. Creating melodic hooks, warm guitars, and custom lighting designs synced over local MIDI bridges.',
    url: 'https://homedaysband.com',
    tag: 'Music',
    isExternal: true,
  },
  {
    title: 'Real ID',
    description: 'A high-converting identity verification and age gate platform for online Shopify stores. Helping merchants satisfy regulations smoothly.',
    url: 'https://apps.shopify.com/real-id/',
    tag: 'Shopify App',
    isExternal: true,
  },
  {
    title: 'Vimeography',
    description: 'A popular WordPress plugin that allows developers and creators to curate and showcase beautiful Vimeo video galleries on their sites instantly.',
    url: 'https://vimeography.com/',
    tag: 'WordPress',
    isExternal: true,
  },
  {
    title: 'EDD Mailchimp',
    description: 'Automatic mailing list integration for digital eCommerce stores operating on Easy Digital Downloads. Synchronizing buyers dynamically.',
    url: 'https://easydigitaldownloads.com/downloads/mailchimp/',
    tag: 'WordPress Extension',
    isExternal: true,
  }
];

export const backlogItems: BacklogItem[] = [
  {
    id: 'spatial-simulation',
    title: 'Real-time Solar Radiance Simulator',
    description: 'A client-side voxel grid analyzer mapping sunlight vectors onto 3D building massings dynamically within browser canvas threads.',
    status: 'released',
    category: 'Spatial Analysis',
    votes: 48
  },
  {
    id: 'bim-webgl-graph',
    title: 'BIM to Interactive WebGL Topology Graph',
    description: 'Extracting structural topological paths and load patterns from IFC files, rendering them as navigable node-networks for remote validation.',
    status: 'in-progress',
    category: 'Geometry Processing',
    votes: 35
  },
  {
    id: 'construction-logs-agent',
    title: 'Agentic Construction-Log Automated Parser',
    description: 'Autonomous LLM-agent tool executing structural anomaly detection by cross-referencing on-site daily PDFs and photo logs against construction blueprints.',
    status: 'planning',
    category: 'Agentic Workflows',
    votes: 29
  },
  {
    id: 'gltf-decimation',
    title: 'GLTF Triangulation Optimizer',
    description: 'Automated mesh decimation of complex architectural elements for ultra-high-efficiency loading and smooth rendering on low-spec mobile hardware.',
    status: 'backlog',
    category: 'Geometry Processing',
    votes: 12
  },
  {
    id: 'hvac-agent-stress-test',
    title: 'Occupancy Schedule Agentic Synthesizer',
    description: 'Synthesizing adaptive agent schedules and localized behavioral models to stress-test HVAC zone boundaries inside high-fidelity digital replicas.',
    status: 'planning',
    category: 'Agentic Workflows',
    votes: 18
  },
  {
    id: 'gis-manifold-cleanup',
    title: 'GIS Boundary Vector Manifold Repair',
    description: 'A lightweight geometric cleanup utility automatically resolving intersecting polygons and non-manifold edges in complex municipal shapefiles.',
    status: 'released',
    category: 'Spatial Analysis',
    votes: 24
  }
];
