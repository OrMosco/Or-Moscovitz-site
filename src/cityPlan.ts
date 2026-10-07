/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Delaunay } from 'd3-delaunay';
import type { Theme, ThemeMode } from './types.ts';

/**
 * City-plan background tuning.
 *
 * Distances are CSS pixels. Alphas are 0–1 before the per-theme ink scale
 * and the readability veil (center column + header). Geometry constants are
 * read when the plan is built (load and resize). Motion and ink constants
 * are read every frame.
 */
export const CITY_PLAN = {
  /** Coarse block spacing. Larger = fewer, bigger city blocks. */
  blockSpacing: 158,
  /** 0 = regular grid, ~0.45 = planned-but-organic. Keep below ~0.8. */
  jitter: 0.4,
  /** Deterministic plan. Change to reshuffle the city. */
  seed: 2026,
  /** District size, in multiples of blockSpacing. Boundaries become avenues. */
  avenueEvery: 4.4,
  /** Edges shorter than this are alleys. */
  alleyLength: 86,

  /** Property-line setback from the street centerline. */
  setback: 13,
  /** Target parcel area. Smaller = more lots per block. */
  lotArea: 5600,
  lotsMin: 2,
  lotsMax: 5,
  /** Chance a lot stays open (court / unbuilt). */
  openLot: 0.16,

  /** Outer radius of the cursor (or ambient) reveal. */
  radius: 280,
  /** Lot lines use this fraction of the radius. */
  lotRadius: 0.8,
  /** Property lines use this fraction of the radius. */
  propertyRadius: 0.94,
  /** Footprints use this fraction of the radius. */
  massRadius: 0.6,
  /** How quickly the focus follows the pointer. Higher = tighter. */
  follow: 0.14,
  /** How quickly the reveal blooms and settles. */
  revealEase: 0.075,
  /** Theme-color blend. Higher = snappier theme changes. */
  colorEase: 0.12,

  /** Resting / fully-revealed road styles. `body` is the thickened carriageway. */
  roads: {
    alley: { width: 0.45, alpha: 0.11, hot: 0.18, body: 2.4 },
    street: { width: 0.72, alpha: 0.16, hot: 0.3, body: 4.2 },
    avenue: { width: 1.05, alpha: 0.22, hot: 0.34, body: 6.4 },
  },
  /** Carriageway opacity at full reveal, multiplied by influence. */
  bodyAlpha: 0.055,

  propertyAlpha: 0.34,
  propertyWidth: 0.6,
  lotAlpha: 0.4,
  lotWidth: 0.55,
  /** Footprint fill at full reveal. */
  footprintAlpha: 0.075,
  footprintStroke: 0.34,
  footprintWidth: 0.65,
  /** Max extrusion offset, in px, before per-building variation. */
  lift: 2.6,
  /** Interior plan-line opacity. */
  seamAlpha: 0.28,

  /** Site red, used for the single parcel under the focus. */
  accent: '#f43f5e',
  accentAlpha: 0.72,
  accentWidth: 1.15,

  /**
   * Readability veil. The plan is drawn, then multiplied by this mask:
   * quieter through the text column, full strength in the margins.
   * columnHalf ≈ max-w-2xl / 2.
   */
  columnHalf: 348,
  columnFeather: 88,
  columnMute: 0.2,
  /** Flat multiplier when the viewport is too narrow to have margins. */
  narrowMute: 0.42,
  /** Extra mute behind the sticky header, fading out over headerFade px. */
  headerMute: 0.35,
  headerFade: 92,

  /** Cap backing-store resolution. */
  maxDpr: 2,

  /** Touch / small-screen drift. Speed is radians-ish per millisecond. */
  ambientSpeed: 0.00011,
  ambientStrength: 0.42,
  ambientDriftX: 0.2,
  ambientDriftY: 0.14,
  /** Minimum milliseconds between ambient frames. */
  ambientFrame: 34,
} as const;

const THEME_INK_SCALE: Record<ThemeMode, number> = {
  light: 1,
  dark: 0.88,
  yellow: 0.66,
  olive: 1.06,
};

const NARROW_BREAK = CITY_PLAN.columnHalf * 2 + 64;

type RGB = [number, number, number];
type Pt = [number, number];
type RoadKind = keyof typeof CITY_PLAN.roads;

interface Road {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  mx: number;
  my: number;
  kind: RoadKind;
}

interface Footprint {
  poly: Pt[];
  cx: number;
  cy: number;
  mass: number;
  lift: number;
  seam: [Pt, Pt] | null;
}

interface Lot {
  cx: number;
  cy: number;
  edges: { x1: number; y1: number; x2: number; y2: number; mx: number; my: number }[];
  footprint: Footprint | null;
}

interface Block {
  cx: number;
  cy: number;
  reach: number;
  property: Pt[] | null;
  lots: Lot[];
}

interface Geometry {
  roads: Road[];
  paths: Record<RoadKind, Path2D>;
  blocks: Block[];
}

export interface CityPlanHandle {
  redraw: () => void;
  destroy: () => void;
}

const EMPTY_PATHS = (): Record<RoadKind, Path2D> => ({
  alley: new Path2D(),
  street: new Path2D(),
  avenue: new Path2D(),
});

export function createCityPlan(canvas: HTMLCanvasElement, getTheme: () => Theme): CityPlanHandle {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    return { redraw: () => {}, destroy: () => {} };
  }

  let destroyed = false;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let geometry: Geometry = { roads: [], paths: EMPTY_PATHS(), blocks: [] };
  let raf = 0;
  let layoutRaf = 0;
  let lastAmbientDraw = 0;

  let mode = readMode();
  let pointerInside = false;
  let seenPointer = false;
  let focusX = 0;
  let focusY = 0;
  let targetX = 0;
  let targetY = 0;
  let reveal = 0;

  let ink: RGB = [0, 0, 0];
  let targetInk: RGB = [0, 0, 0];
  let accent: RGB = hexToRgb(CITY_PLAN.accent);
  let targetAccent: RGB = accent;
  let inkScale = 1;
  let targetScale = 1;
  let hasColor = false;

  let accentKey = '';

  const queries = [
    window.matchMedia('(prefers-reduced-motion: reduce)'),
    window.matchMedia('(hover: hover)'),
    window.matchMedia('(pointer: fine)'),
    window.matchMedia(`(max-width: 768px)`),
  ];

  function redraw() {
    syncTheme(mode === 'static');
    if (mode === 'static') {
      reveal = 0;
      draw();
      return;
    }
    kick();
  }

  function destroy() {
    destroyed = true;
    cancelAnimationFrame(raf);
    cancelAnimationFrame(layoutRaf);
    raf = 0;
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    window.removeEventListener('resize', scheduleLayout);
    document.removeEventListener('visibilitychange', onVisibility);
    observer.disconnect();
    for (const query of queries) query.removeEventListener('change', onMedia);
    dprQuery?.removeEventListener('change', scheduleLayout);
  }

  function syncTheme(snap: boolean) {
    const theme = getTheme();
    targetInk = hexToRgb(theme.text);
    targetAccent = hexToRgb(CITY_PLAN.accent);
    targetScale = THEME_INK_SCALE[theme.mode];
    if (snap || !hasColor) {
      ink = targetInk.slice() as RGB;
      accent = targetAccent.slice() as RGB;
      inkScale = targetScale;
      hasColor = true;
    }
  }

  function layout() {
    if (destroyed) return;
    const nextWidth = canvas.clientWidth || window.innerWidth;
    const nextHeight = canvas.clientHeight || window.innerHeight;
    if (nextWidth < 2 || nextHeight < 2) return;
    width = nextWidth;
    height = nextHeight;
    dpr = Math.min(window.devicePixelRatio || 1, CITY_PLAN.maxDpr);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bindDpr();
    try {
      geometry = buildGeometry(width, height);
    } catch {
      geometry = { roads: [], paths: EMPTY_PATHS(), blocks: [] };
    }
    if (!seenPointer) {
      focusX = targetX = width * 0.5;
      focusY = targetY = height * 0.5;
    }
    accentKey = '';
    if (mode === 'static') {
      reveal = 0;
      syncTheme(true);
      draw();
      return;
    }
    if (mode === 'ambient') placeAmbient(performance.now(), true);
    syncTheme(false);
    draw();
  }

  function scheduleLayout() {
    cancelAnimationFrame(layoutRaf);
    layoutRaf = requestAnimationFrame(() => {
      layoutRaf = 0;
      layout();
    });
  }

  let dprQuery: MediaQueryList | null = null;
  function bindDpr() {
    dprQuery?.removeEventListener('change', scheduleLayout);
    dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    dprQuery.addEventListener('change', scheduleLayout);
  }

  function onPointerMove(event: PointerEvent) {
    if (mode !== 'pointer' || event.pointerType === 'touch') return;
    targetX = event.clientX;
    targetY = event.clientY;
    pointerInside = true;
    if (!seenPointer) {
      focusX = targetX;
      focusY = targetY;
      seenPointer = true;
    }
    kick();
  }

  function onPointerLeave() {
    if (mode !== 'pointer') return;
    pointerInside = false;
    kick();
  }

  function onVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
      return;
    }
    if (mode === 'ambient') placeAmbient(performance.now(), true);
    kick();
  }

  function onMedia() {
    const next = readMode();
    if (next === mode) return;
    mode = next;
    accentKey = '';
    if (mode === 'static') {
      reveal = 0;
      cancelAnimationFrame(raf);
      raf = 0;
      syncTheme(true);
      draw();
      return;
    }
    if (mode === 'ambient') placeAmbient(performance.now(), true);
    kick();
  }

  function placeAmbient(now: number, snap: boolean) {
    const t = now * CITY_PLAN.ambientSpeed;
    targetX = width * (0.5 + Math.sin(t) * CITY_PLAN.ambientDriftX);
    targetY = height * (0.5 + Math.cos(t * 0.73) * CITY_PLAN.ambientDriftY);
    if (snap) {
      focusX = targetX;
      focusY = targetY;
    }
  }

  function kick() {
    if (destroyed || document.hidden || mode === 'static' || raf) return;
    raf = requestAnimationFrame(frame);
  }

  function frame(now: number) {
    raf = 0;
    if (destroyed || document.hidden || mode === 'static') return;
    if (mode === 'ambient' && now - lastAmbientDraw < CITY_PLAN.ambientFrame && !colorMoving()) {
      raf = requestAnimationFrame(frame);
      return;
    }
    lastAmbientDraw = now;
    step(now);
    draw();
    if (shouldContinue()) raf = requestAnimationFrame(frame);
  }

  function step(now: number) {
    if (mode === 'ambient') placeAmbient(now, false);
    const revealTarget = mode === 'ambient' ? CITY_PLAN.ambientStrength : pointerInside ? 1 : 0;
    focusX += (targetX - focusX) * CITY_PLAN.follow;
    focusY += (targetY - focusY) * CITY_PLAN.follow;
    reveal += (revealTarget - reveal) * CITY_PLAN.revealEase;
    const ease = CITY_PLAN.colorEase;
    ink[0] += (targetInk[0] - ink[0]) * ease;
    ink[1] += (targetInk[1] - ink[1]) * ease;
    ink[2] += (targetInk[2] - ink[2]) * ease;
    accent[0] += (targetAccent[0] - accent[0]) * ease;
    accent[1] += (targetAccent[1] - accent[1]) * ease;
    accent[2] += (targetAccent[2] - accent[2]) * ease;
    inkScale += (targetScale - inkScale) * ease;
  }

  function colorMoving() {
    return Math.abs(ink[0] - targetInk[0]) > 0.6
      || Math.abs(ink[1] - targetInk[1]) > 0.6
      || Math.abs(ink[2] - targetInk[2]) > 0.6
      || Math.abs(inkScale - targetScale) > 0.01;
  }

  function shouldContinue() {
    if (mode === 'ambient') return true;
    const dx = focusX - targetX;
    const dy = focusY - targetY;
    const revealTarget = pointerInside ? 1 : 0;
    return dx * dx + dy * dy > 0.08 || Math.abs(reveal - revealTarget) > 0.004 || colorMoving();
  }

  function draw() {
    if (width < 2 || height < 2) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const revealNow = mode === 'static' ? 0 : reveal;
    const radius = Math.min(CITY_PLAN.radius, Math.min(width, height) * 0.48);
    const inkCss = rgbCss(ink);
    const scale = inkScale;

    ctx.strokeStyle = inkCss;
    const kinds: RoadKind[] = ['alley', 'street', 'avenue'];
    if (revealNow > 0.01) {
      for (let i = 0; i < geometry.roads.length; i++) {
        const road = geometry.roads[i];
        const inf = falloff(dist(road.mx, road.my, focusX, focusY), radius) * revealNow;
        if (inf < 0.03) continue;
        const style = CITY_PLAN.roads[road.kind];
        ctx.globalAlpha = Math.min(1, inf * CITY_PLAN.bodyAlpha * scale * (road.kind === 'avenue' ? 1.25 : 1));
        ctx.lineWidth = style.body * inf;
        ctx.beginPath();
        ctx.moveTo(road.x1, road.y1);
        ctx.lineTo(road.x2, road.y2);
        ctx.stroke();
      }
    }

    for (let k = 0; k < kinds.length; k++) {
      const kind = kinds[k];
      const style = CITY_PLAN.roads[kind];
      ctx.globalAlpha = Math.min(1, style.alpha * scale);
      ctx.lineWidth = style.width;
      ctx.stroke(geometry.paths[kind]);
    }

    if (revealNow > 0.01) {
      ctx.strokeStyle = inkCss;
      for (let i = 0; i < geometry.roads.length; i++) {
        const road = geometry.roads[i];
        const inf = falloff(dist(road.mx, road.my, focusX, focusY), radius) * revealNow;
        if (inf < 0.04) continue;
        const style = CITY_PLAN.roads[road.kind];
        ctx.globalAlpha = Math.min(1, inf * style.hot * scale);
        ctx.lineWidth = style.width + inf * 0.45;
        ctx.beginPath();
        ctx.moveTo(road.x1, road.y1);
        ctx.lineTo(road.x2, road.y2);
        ctx.stroke();
      }
      drawBlocks(inkCss, scale, radius, revealNow);
    }

    ctx.globalAlpha = 1;
    applyVeil();
  }

  function drawBlocks(inkCss: string, scale: number, radius: number, revealNow: number) {
    const propertyR = radius * CITY_PLAN.propertyRadius;
    const lotR = radius * CITY_PLAN.lotRadius;
    const massR = radius * CITY_PLAN.massRadius;
    let bestKey = '';
    let bestDist = Infinity;
    let bestLot: Lot | null = null;

    ctx.lineJoin = 'miter';
    ctx.miterLimit = 2;

    for (let i = 0; i < geometry.blocks.length; i++) {
      const block = geometry.blocks[i];
      const blockDist = dist(block.cx, block.cy, focusX, focusY);
      if (blockDist - block.reach > propertyR) continue;
      const propertyInf = falloff(Math.max(0, blockDist - block.reach * 0.25), propertyR) * revealNow;
      if (propertyInf < 0.02 || !block.property) continue;

      ctx.strokeStyle = inkCss;
      ctx.globalAlpha = Math.min(1, propertyInf * CITY_PLAN.propertyAlpha * scale);
      ctx.lineWidth = CITY_PLAN.propertyWidth;
      trace(block.property);
      ctx.stroke();

      if (blockDist - block.reach > lotR) continue;

      for (let j = 0; j < block.lots.length; j++) {
        const lot = block.lots[j];
        const lotDist = dist(lot.cx, lot.cy, focusX, focusY);
        const lotInf = falloff(lotDist, lotR) * revealNow;
        if (lotInf > 0.03) {
          ctx.globalAlpha = Math.min(1, lotInf * CITY_PLAN.lotAlpha * scale);
          ctx.lineWidth = CITY_PLAN.lotWidth;
          ctx.beginPath();
          for (let e = 0; e < lot.edges.length; e++) {
            const edge = lot.edges[e];
            ctx.moveTo(edge.x1, edge.y1);
            ctx.lineTo(edge.x2, edge.y2);
          }
          ctx.stroke();
        }

        const footprint = lot.footprint;
        if (!footprint) continue;
        const massInf = falloff(lotDist, massR) * revealNow;
        if (massInf < 0.03) continue;

        const lift = footprint.lift * massInf;
        const fillAlpha = massInf * CITY_PLAN.footprintAlpha * scale * footprint.mass;
        ctx.globalAlpha = Math.min(1, fillAlpha * 0.55);
        trace(footprint.poly, lift * 0.45, lift);
        ctx.fill();
        ctx.globalAlpha = Math.min(1, fillAlpha);
        trace(footprint.poly);
        ctx.fill();
        ctx.globalAlpha = Math.min(1, massInf * CITY_PLAN.footprintStroke * scale * (0.65 + footprint.mass * 0.35));
        ctx.lineWidth = CITY_PLAN.footprintWidth;
        ctx.stroke();
        if (footprint.seam && massInf > 0.35) {
          ctx.globalAlpha = Math.min(1, massInf * CITY_PLAN.seamAlpha * scale);
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(footprint.seam[0][0], footprint.seam[0][1]);
          ctx.lineTo(footprint.seam[1][0], footprint.seam[1][1]);
          ctx.stroke();
        }

        if (lotDist < bestDist) {
          bestDist = lotDist;
          bestKey = `${i}:${j}`;
          bestLot = lot;
        }
      }
    }

    const accentLot = pickAccent(bestKey, bestDist, bestLot, massR);
    if (!accentLot) return;
    const accentInf = falloff(dist(accentLot.cx, accentLot.cy, focusX, focusY), massR) * revealNow;
    if (accentInf < 0.2) return;
    ctx.strokeStyle = rgbCss(accent);
    ctx.globalAlpha = Math.min(1, accentInf * CITY_PLAN.accentAlpha);
    ctx.lineWidth = CITY_PLAN.accentWidth;
    ctx.lineJoin = 'miter';
    if (accentLot.footprint) {
      trace(accentLot.footprint.poly);
      ctx.stroke();
    } else {
      ctx.beginPath();
      for (let e = 0; e < accentLot.edges.length; e++) {
        const edge = accentLot.edges[e];
        ctx.moveTo(edge.x1, edge.y1);
        ctx.lineTo(edge.x2, edge.y2);
      }
      ctx.stroke();
    }
  }

  function pickAccent(bestKey: string, bestDist: number, bestLot: Lot | null, massR: number): Lot | null {
    if (!bestLot || bestDist > massR * 0.72 || reveal < 0.25) {
      accentKey = '';
      return null;
    }
    if (accentKey && accentKey !== bestKey) {
      const current = findLot(accentKey);
      if (current) {
        const currentDist = dist(current.cx, current.cy, focusX, focusY);
        if (currentDist < massR * 0.85 && currentDist <= bestDist + 16) return current;
      }
    }
    accentKey = bestKey;
    return bestLot;
  }

  function findLot(key: string): Lot | null {
    const split = key.indexOf(':');
    if (split < 0) return null;
    const block = geometry.blocks[Number(key.slice(0, split))];
    return block?.lots[Number(key.slice(split + 1))] ?? null;
  }

  function applyVeil() {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = columnMask();
    ctx.fillRect(0, 0, width, height);
    const header = ctx.createLinearGradient(0, 0, 0, height);
    const headerEnd = Math.min(1, CITY_PLAN.headerFade / Math.max(height, 1));
    header.addColorStop(0, `rgba(0,0,0,${CITY_PLAN.headerMute})`);
    header.addColorStop(headerEnd, 'rgba(0,0,0,1)');
    if (headerEnd < 1) header.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = header;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  function columnMask(): string | CanvasGradient {
    const narrow = width < NARROW_BREAK;
    if (narrow) return `rgba(0,0,0,${CITY_PLAN.narrowMute})`;
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    const mute = CITY_PLAN.columnMute;
    const cx = width * 0.5;
    const inner = Math.max(0, CITY_PLAN.columnHalf - CITY_PLAN.columnFeather);
    const outer = CITY_PLAN.columnHalf + CITY_PLAN.columnFeather;
    const stops: [number, number][] = [];
    pushStop(stops, 0, 1);
    pushStop(stops, (cx - outer) / width, 1);
    pushStop(stops, (cx - inner) / width, mute);
    pushStop(stops, (cx + inner) / width, mute);
    pushStop(stops, (cx + outer) / width, 1);
    pushStop(stops, 1, 1);
    for (let i = 0; i < stops.length; i++) {
      gradient.addColorStop(stops[i][0], `rgba(0,0,0,${stops[i][1]})`);
    }
    return gradient;
  }

  function trace(poly: Pt[], ox = 0, oy = 0) {
    ctx.beginPath();
    ctx.moveTo(poly[0][0] + ox, poly[0][1] + oy);
    for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0] + ox, poly[i][1] + oy);
    ctx.closePath();
  }

  const observer = new ResizeObserver(() => scheduleLayout());
  observer.observe(document.documentElement);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('resize', scheduleLayout);
  document.addEventListener('visibilitychange', onVisibility);
  for (const query of queries) query.addEventListener('change', onMedia);

  syncTheme(true);
  layout();

  return { redraw, destroy };
}

function readMode(): 'pointer' | 'ambient' | 'static' {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static';
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const small = window.matchMedia('(max-width: 768px)').matches;
  if (!fine || small) return 'ambient';
  return 'pointer';
}

function buildGeometry(width: number, height: number): Geometry {
  const spacing = CITY_PLAN.blockSpacing;
  const points: Pt[] = [];
  const cols = Math.ceil(width / spacing) + 3;
  const rows = Math.ceil(height / spacing) + 3;
  for (let gy = -1; gy < rows; gy++) {
    for (let gx = -1; gx < cols; gx++) {
      const jx = hash(gx, gy, CITY_PLAN.seed) - 0.5;
      const jy = hash(gx, gy, CITY_PLAN.seed + 17) - 0.5;
      points.push([
        gx * spacing + jx * spacing * CITY_PLAN.jitter,
        gy * spacing + jy * spacing * CITY_PLAN.jitter,
      ]);
    }
  }

  const delaunay = Delaunay.from(points);
  const pad = 8;
  const bounds: [number, number, number, number] = [-pad, -pad, width + pad, height + pad];
  const voronoi = delaunay.voronoi(bounds);
  const districtScale = spacing * CITY_PLAN.avenueEvery;

  const edgeMap = new Map<string, Road & { left: number; right: number }>();
  const blocks: Block[] = [];

  for (let i = 0; i < points.length; i++) {
    const ring = openRing(voronoi.cellPolygon(i));
    if (!ring || ring.length < 3) continue;
    if (!intersectsViewport(ring, width, height)) continue;

    for (let e = 0; e < ring.length; e++) {
      const a = ring[e];
      const b = ring[(e + 1) % ring.length];
      if (isFrameEdge(a, b, bounds)) continue;
      const key = edgeKey(a, b);
      const existing = edgeMap.get(key);
      if (existing) {
        existing.right = i;
        continue;
      }
      const x1 = a[0];
      const y1 = a[1];
      const x2 = b[0];
      const y2 = b[1];
      edgeMap.set(key, {
        x1, y1, x2, y2,
        mx: (x1 + x2) * 0.5,
        my: (y1 + y2) * 0.5,
        kind: 'street',
        left: i,
        right: -1,
      });
    }

    const [cx, cy] = centroid(ring);
    let reach = 0;
    for (let p = 0; p < ring.length; p++) {
      reach = Math.max(reach, dist(ring[p][0], ring[p][1], cx, cy));
    }
    const property = insetConvex(ring, CITY_PLAN.setback) ?? (areaOf(ring) > 900 ? scalePoly(ring, 0.8) : null);
    blocks.push({
      cx,
      cy,
      reach,
      property,
      lots: property ? subdivide(property, i) : [],
    });
  }

  const roads: Road[] = [];
  const paths = EMPTY_PATHS();
  for (const edge of edgeMap.values()) {
    if (edge.right < 0 && isFrameEdge([edge.x1, edge.y1], [edge.x2, edge.y2], bounds)) continue;
    const len = dist(edge.x1, edge.y1, edge.x2, edge.y2);
    if (len < 2) continue;
    let kind: RoadKind = 'street';
    if (edge.right >= 0 && len > 36) {
      const a = points[edge.left];
      const b = points[edge.right];
      const da = (Math.floor(a[0] / districtScale) << 8) ^ Math.floor(a[1] / districtScale);
      const db = (Math.floor(b[0] / districtScale) << 8) ^ Math.floor(b[1] / districtScale);
      if (da !== db) kind = 'avenue';
    }
    if (kind !== 'avenue' && len < CITY_PLAN.alleyLength) kind = 'alley';
    const road: Road = {
      x1: edge.x1,
      y1: edge.y1,
      x2: edge.x2,
      y2: edge.y2,
      mx: edge.mx,
      my: edge.my,
      kind,
    };
    roads.push(road);
    paths[kind].moveTo(road.x1, road.y1);
    paths[kind].lineTo(road.x2, road.y2);
  }

  return { roads, paths, blocks };
}

function subdivide(property: Pt[], blockIndex: number): Lot[] {
  const propArea = areaOf(property);
  if (propArea < 700) return [];
  const count = clamp(
    Math.round(propArea / CITY_PLAN.lotArea),
    CITY_PLAN.lotsMin,
    CITY_PLAN.lotsMax,
  );
  const rnd = mulberry32((Math.imul(blockIndex + 1, 0x9e3779b1) ^ Math.imul(CITY_PLAN.seed, 0x85ebca6b)) >>> 0);
  const box = boundsOf(property);
  const minSep = Math.sqrt(propArea / count) * 0.45;
  const sites: Pt[] = [];
  const attempts = count * 14;
  for (let n = 0; n < attempts && sites.length < count; n++) {
    const x = box.minX + rnd() * (box.maxX - box.minX);
    const y = box.minY + rnd() * (box.maxY - box.minY);
    if (!inside(property, x, y)) continue;
    let far = true;
    for (let s = 0; s < sites.length; s++) {
      if (dist(sites[s][0], sites[s][1], x, y) < minSep) {
        far = false;
        break;
      }
    }
    if (far) sites.push([x, y]);
  }
  if (sites.length === 0) sites.push(centroid(property));

  const parcels = sites.length < 2 ? [property] : clipParcels(sites, property, box);
  const lots: Lot[] = [];
  for (let i = 0; i < parcels.length; i++) {
    const poly = clean(parcels[i]);
    if (poly.length < 3 || areaOf(poly) < 80) continue;
    const [cx, cy] = centroid(poly);
    const edges = interiorEdges(poly, property);
    const salt = hash(blockIndex + 1, i + 3, CITY_PLAN.seed + 3);
    const footprint = salt < CITY_PLAN.openLot ? null : makeFootprint(poly, salt);
    lots.push({ cx, cy, edges, footprint });
  }
  return lots;
}

function clipParcels(
  sites: Pt[],
  property: Pt[],
  box: { minX: number; minY: number; maxX: number; maxY: number },
): Pt[][] {
  const local = Delaunay.from(sites);
  const voronoi = local.voronoi([box.minX - 20, box.minY - 20, box.maxX + 20, box.maxY + 20]);
  const parcels: Pt[][] = [];
  for (let i = 0; i < sites.length; i++) {
    const ring = openRing(voronoi.cellPolygon(i));
    if (!ring) continue;
    parcels.push(clipPolygon(ring, property));
  }
  return parcels;
}

function interiorEdges(poly: Pt[], property: Pt[]) {
  const edges: Lot['edges'] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const mx = (a[0] + b[0]) * 0.5;
    const my = (a[1] + b[1]) * 0.5;
    if (distToPolygon(mx, my, property) < 1.4) continue;
    edges.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1], mx, my });
  }
  return edges;
}

function makeFootprint(poly: Pt[], salt: number): Footprint | null {
  const vary = fract(salt * 17.13);
  const target = 0.56 + vary * 0.22;
  let rect: Pt[] | null = null;
  const scales = [target, target * 0.84, target * 0.7, 0.48];
  for (let i = 0; i < scales.length; i++) {
    const candidate = orientedRect(poly, scales[i]);
    if (candidate && candidate.every((point) => inside(poly, point[0], point[1]))) {
      rect = candidate;
      break;
    }
  }
  if (!rect) {
    const scaled = scalePoly(poly, 0.62);
    if (areaOf(scaled) < 36) return null;
    rect = scaled;
  }
  if (areaOf(rect) < 36) return null;
  const [cx, cy] = centroid(rect);
  const mass = 0.55 + fract(salt * 9.1) * 0.45;
  const tall = fract(salt * 4.7);
  const lift = CITY_PLAN.lift * (0.35 + tall * (tall > 0.9 ? 1.15 : 0.7));
  const seam = rect.length === 4 && vary > 0.62 ? seamAcross(rect, 0.38 + vary * 0.18) : null;
  return { poly: rect, cx, cy, mass, lift, seam };
}

function orientedRect(poly: Pt[], scale: number): Pt[] | null {
  let best = 0;
  let ang = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const len = dist(a[0], a[1], b[0], b[1]);
    if (len > best) {
      best = len;
      ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    }
  }
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);
  const [cx, cy] = centroid(poly);
  let minU = Infinity;
  let maxU = -Infinity;
  let minV = Infinity;
  let maxV = -Infinity;
  for (let i = 0; i < poly.length; i++) {
    const dx = poly[i][0] - cx;
    const dy = poly[i][1] - cy;
    const u = dx * cos + dy * sin;
    const v = -dx * sin + dy * cos;
    if (u < minU) minU = u;
    if (u > maxU) maxU = u;
    if (v < minV) minV = v;
    if (v > maxV) maxV = v;
  }
  const uc = (minU + maxU) * 0.5;
  const vc = (minV + maxV) * 0.5;
  const hu = (maxU - minU) * 0.5 * scale;
  const hv = (maxV - minV) * 0.5 * scale;
  if (hu < 3.5 || hv < 3.5) return null;
  const corners: [number, number][] = [
    [uc - hu, vc - hv],
    [uc + hu, vc - hv],
    [uc + hu, vc + hv],
    [uc - hu, vc + hv],
  ];
  return corners.map(([u, v]) => [cx + u * cos - v * sin, cy + u * sin + v * cos]);
}

function seamAcross(rect: Pt[], t: number): [Pt, Pt] {
  return [
    [rect[0][0] + (rect[1][0] - rect[0][0]) * t, rect[0][1] + (rect[1][1] - rect[0][1]) * t],
    [rect[3][0] + (rect[2][0] - rect[3][0]) * t, rect[3][1] + (rect[2][1] - rect[3][1]) * t],
  ];
}

function insetConvex(poly: Pt[], distance: number): Pt[] | null {
  if (poly.length < 3 || distance <= 0) return poly.slice();
  const ccw = signedArea(poly) > 0;
  const lines: { nx: number; ny: number; c: number }[] = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const dx = q[0] - p[0];
    const dy = q[1] - p[1];
    const len = Math.hypot(dx, dy);
    if (len < 1e-4) continue;
    const nx = ccw ? -dy / len : dy / len;
    const ny = ccw ? dx / len : -dx / len;
    const px = p[0] + nx * distance;
    const py = p[1] + ny * distance;
    lines.push({ nx, ny, c: nx * px + ny * py });
  }
  const out: Pt[] = [];
  for (let i = 0; i < lines.length; i++) {
    const a = lines[i];
    const b = lines[(i + 1) % lines.length];
    const det = a.nx * b.ny - b.nx * a.ny;
    if (Math.abs(det) < 1e-8) continue;
    out.push([(a.c * b.ny - b.c * a.ny) / det, (a.nx * b.c - b.nx * a.c) / det]);
  }
  if (out.length < 3) return null;
  if ((signedArea(out) > 0) !== ccw) return null;
  if (!out.every((point) => inside(poly, point[0], point[1], 0.8))) return null;
  if (areaOf(out) < 80) return null;
  return out;
}

function clipPolygon(subject: Pt[], clip: Pt[]): Pt[] {
  let output = subject;
  if (clip.length < 3) return [];
  const ccw = signedArea(clip) > 0;
  for (let i = 0; i < clip.length; i++) {
    const input = output;
    output = [];
    if (input.length === 0) break;
    const ax = clip[i][0];
    const ay = clip[i][1];
    const bx = clip[(i + 1) % clip.length][0];
    const by = clip[(i + 1) % clip.length][1];
    const ex = bx - ax;
    const ey = by - ay;
    const insidePoint = (x: number, y: number) => {
      const cross = ex * (y - ay) - ey * (x - ax);
      return ccw ? cross >= -1e-6 : cross <= 1e-6;
    };
    const intersect = (px: number, py: number, qx: number, qy: number): Pt => {
      const rx = qx - px;
      const ry = qy - py;
      const den = rx * ey - ry * ex;
      if (Math.abs(den) < 1e-12) return [qx, qy];
      const t = ((ax - px) * ey - (ay - py) * ex) / den;
      return [px + rx * t, py + ry * t];
    };
    let sx = input[input.length - 1][0];
    let sy = input[input.length - 1][1];
    let sIn = insidePoint(sx, sy);
    for (let j = 0; j < input.length; j++) {
      const exx = input[j][0];
      const eyy = input[j][1];
      const eIn = insidePoint(exx, eyy);
      if (eIn) {
        if (!sIn) output.push(intersect(sx, sy, exx, eyy));
        output.push([exx, eyy]);
      } else if (sIn) {
        output.push(intersect(sx, sy, exx, eyy));
      }
      sx = exx;
      sy = eyy;
      sIn = eIn;
    }
  }
  return output;
}

function openRing(poly: [number, number][] | null): Pt[] | null {
  if (!poly || poly.length < 3) return null;
  const last = poly.length - 1;
  if (poly[0][0] === poly[last][0] && poly[0][1] === poly[last][1]) {
    return poly.slice(0, last) as Pt[];
  }
  return poly as Pt[];
}

function clean(poly: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const point = poly[i];
    const prev = out[out.length - 1];
    if (!prev || dist(prev[0], prev[1], point[0], point[1]) > 0.35) out.push(point);
  }
  if (out.length > 2 && dist(out[0][0], out[0][1], out[out.length - 1][0], out[out.length - 1][1]) <= 0.35) {
    out.pop();
  }
  return out;
}

function scalePoly(poly: Pt[], factor: number): Pt[] {
  const [cx, cy] = centroid(poly);
  return poly.map(([x, y]) => [cx + (x - cx) * factor, cy + (y - cy) * factor]);
}

function centroid(poly: Pt[]): Pt {
  let sum = 0;
  let sx = 0;
  let sy = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const cross = p[0] * q[1] - q[0] * p[1];
    sum += cross;
    sx += (p[0] + q[0]) * cross;
    sy += (p[1] + q[1]) * cross;
  }
  if (Math.abs(sum) < 1e-5) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < poly.length; i++) {
      x += poly[i][0];
      y += poly[i][1];
    }
    return [x / poly.length, y / poly.length];
  }
  return [sx / (3 * sum), sy / (3 * sum)];
}

function signedArea(poly: Pt[]): number {
  let sum = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    sum += p[0] * q[1] - q[0] * p[1];
  }
  return sum * 0.5;
}

function areaOf(poly: Pt[]): number {
  return Math.abs(signedArea(poly));
}

function inside(poly: Pt[], x: number, y: number, eps = 1e-3): boolean {
  const ccw = signedArea(poly) >= 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const cross = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
    if (ccw ? cross < -eps : cross > eps) return false;
  }
  return true;
}

function distToPolygon(x: number, y: number, poly: Pt[]): number {
  let min = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    min = Math.min(min, distToSegment(x, y, a[0], a[1], b[0], b[1]));
  }
  return min;
}

function distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-8) return dist(px, py, x1, y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return dist(px, py, x1 + dx * t, y1 + dy * t);
}

function boundsOf(poly: Pt[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < poly.length; i++) {
    const x = poly[i][0];
    const y = poly[i][1];
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

function intersectsViewport(poly: Pt[], width: number, height: number): boolean {
  const box = boundsOf(poly);
  return box.maxX >= -20 && box.minX <= width + 20 && box.maxY >= -20 && box.minY <= height + 20;
}

function isFrameEdge(a: Pt, b: Pt, bounds: [number, number, number, number]): boolean {
  const [x0, y0, x1, y1] = bounds;
  const eps = 0.9;
  const horizontal = Math.abs(a[1] - b[1]) < eps && (Math.abs(a[1] - y0) < eps || Math.abs(a[1] - y1) < eps);
  const vertical = Math.abs(a[0] - b[0]) < eps && (Math.abs(a[0] - x0) < eps || Math.abs(a[0] - x1) < eps);
  return horizontal || vertical;
}

function edgeKey(a: Pt, b: Pt): string {
  const q = (value: number) => Math.round(value * 10);
  let ax = q(a[0]);
  let ay = q(a[1]);
  let bx = q(b[0]);
  let by = q(b[1]);
  if (ax > bx || (ax === bx && ay > by)) {
    const tx = ax;
    ax = bx;
    bx = tx;
    const ty = ay;
    ay = by;
    by = ty;
  }
  return `${ax},${ay},${bx},${by}`;
}

function falloff(distance: number, radius: number): number {
  if (distance >= radius || radius <= 0) return 0;
  const t = distance / radius;
  return 1 - t * t * (3 - 2 * t);
}

function dist(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function fract(value: number): number {
  return value - Math.floor(value);
}

function pushStop(stops: [number, number][], at: number, alpha: number) {
  const t = Math.min(1, Math.max(0, at));
  const last = stops[stops.length - 1];
  if (last && t <= last[0] + 1e-4) {
    last[1] = alpha;
    return;
  }
  stops.push([t, alpha]);
}

function hash(ix: number, iy: number, salt: number): number {
  let n = Math.imul(ix | 0, 374761393) + Math.imul(iy | 0, 668265263) + Math.imul(salt | 0, 1442695041);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex: string): RGB {
  const value = hex.replace('#', '').trim();
  const full = value.length === 3
    ? value.split('').map((channel) => channel + channel).join('')
    : value;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function rgbCss(rgb: RGB): string {
  return `rgb(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0})`;
}
