import { uniformSuperposition, expectedCutSize } from "@/lib/quantum/qaoa";
import type { NumericProblem } from "@/lib/problems/types";

const edges: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 0]];
const value = expectedCutSize(uniformSuperposition(4), edges);

export const expectedCutFourEdges: NumericProblem = {
  meta: {
    slug: "expected-cut-four-edges",
    title: "Expected Cut Size for a 4-Edge Graph at Baseline",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/qaoa-and-combinatorial-optimization",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["qaoa"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/qaoa-and-combinatorial-optimization"],
  },
  question: {
    type: "numeric",
    prompt: "For a 4-node cycle graph (4 edges), what is the expected cut size of the plain uniform superposition (no QAOA layers applied)?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "The baseline rule says a uniform superposition cuts half of the edges on average. If you answered the full edge count, you assumed every edge is always cut; halve it instead.",
    nearMisses: [
      { value: 4, feedback: "4 is the total edge count, the cut you would get only if every edge were cut. A uniformly random colouring cuts each edge with probability 1/2." },
      { value: 1, feedback: "Each edge contributes 1/2 to the expectation, and there are four edges. Multiply rather than taking a single edge's contribution." },
    ],
  },
  hints: [
    { text: "With no QAOA layers applied, the state is the uniform superposition, which colors each node independently at random. Ask what fraction of edges a uniformly random coloring cuts on average." },
    { text: "The lesson's baseline rule: the expected cut size of the uniform superposition is half the total edge count |E|, on any graph." },
    { text: "Count the edges of the 4-node cycle, then halve that count." },
  ],
  solution: {
    steps: [{ description: "Expected cut size = |E|/2 = 4/2 = 2." }],
    finalAnswer: "2.0",
  },
  explanation: {
    correctIdea: "The |E|/2 baseline rule holds for any graph, not just the triangle and single-edge examples worked out in the lesson.",
    whyCorrect: "Confirmed directly against the engine for this specific 4-edge graph.",
    whyWrong: ["Answering 4 (the full edge count) would assume every edge is always cut, ignoring that a random coloring only cuts about half of them on average."],
  },
};
