declare module 'd3-delaunay' {
  export class Delaunay<T = number[]> {
    static from(points: ArrayLike<ArrayLike<number>>): Delaunay<number[]>;
    voronoi(bounds: [number, number, number, number]): Voronoi<T>;
  }

  export class Voronoi<T = number[]> {
    cellPolygon(i: number): [number, number][] | null;
  }
}
