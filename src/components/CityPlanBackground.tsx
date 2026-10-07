/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLayoutEffect, useRef } from 'react';
import type { Theme } from '../types.ts';
import { createCityPlan, type CityPlanHandle } from '../cityPlan.ts';

interface CityPlanBackgroundProps {
  theme: Theme;
}

export default function CityPlanBackground({ theme }: CityPlanBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  const planRef = useRef<CityPlanHandle | null>(null);
  themeRef.current = theme;

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const plan = createCityPlan(canvas, () => themeRef.current);
    planRef.current = plan;
    return () => {
      plan.destroy();
      planRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    themeRef.current = theme;
    planRef.current?.redraw();
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
