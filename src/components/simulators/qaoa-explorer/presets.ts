import type { Edge } from "@/lib/quantum/qaoa";

export type QaoaGraphPreset = {
  id: string;
  label: string;
  n: number;
  edges: Edge[];
  positions: { x: number; y: number }[];
};

/**
 * A small handful of graphs, matched exactly to the ones the QAOA lessons
 * already work through by hand (single edge, triangle) plus one new one
 * (4-cycle) big enough to make brute force start to feel like the thing
 * that won't scale, small enough (2^4=16 states) to still check instantly.
 */
export const QAOA_GRAPH_PRESETS: QaoaGraphPreset[] = [
  {
    id: "single-edge",
    label: "Single edge (2 nodes)",
    n: 2,
    edges: [[0, 1]],
    positions: [
      { x: 0.25, y: 0.5 },
      { x: 0.75, y: 0.5 },
    ],
  },
  {
    id: "triangle",
    label: "Triangle (3 nodes)",
    n: 3,
    edges: [
      [0, 1],
      [1, 2],
      [0, 2],
    ],
    positions: [
      { x: 0.5, y: 0.1 },
      { x: 0.15, y: 0.9 },
      { x: 0.85, y: 0.9 },
    ],
  },
  {
    id: "square",
    label: "4-cycle (4 nodes)",
    n: 4,
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ],
    positions: [
      { x: 0.15, y: 0.15 },
      { x: 0.85, y: 0.15 },
      { x: 0.85, y: 0.85 },
      { x: 0.15, y: 0.85 },
    ],
  },
];
