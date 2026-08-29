import { qaoaCircuit, expectedCutSize, bruteForceMaxCut } from "@/lib/quantum/qaoa";
import type { NumericProblem } from "@/lib/problems/types";

const edges: [number, number][] = [[0, 1], [1, 2], [0, 2]];
const achieved = expectedCutSize(qaoaCircuit(3, edges, [0.6], [0.3]), edges);
const value = achieved / bruteForceMaxCut(3, edges);

export const qaoaApproximationRatio: NumericProblem = {
  meta: {
    slug: "qaoa-approximation-ratio",
    title: "QAOA's Approximation Ratio on the Triangle Graph",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/qaoa-a-worked-max-cut-example",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["qaoa"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/qaoa-a-worked-max-cut-example"],
  },
  question: {
    type: "numeric",
    prompt: "For the triangle graph at γ≈0.6, β≈0.3, compute the approximation ratio: QAOA's expected cut size divided by the true maximum cut (2).",
    inputHint: "as a decimal close to 1",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "The lesson states QAOA achieves approximately 1.999 out of a true maximum of 2 — divide the two.",
    nearMisses: [
      {
        value: achieved,
        tolerance: 0.05,
        feedback: "That is the expected cut size itself. The approximation ratio divides it by the true maximum cut, which the prompt gives as 2.",
      },
      { value: 0.75, feedback: "0.75 is the ratio of the untouched uniform superposition's baseline cut, |E|/2 = 1.5, against the maximum of 2. The QAOA layer at these tuned angles does considerably better." },
    ],
  },
  hints: [
    { text: "An approximation ratio compares what the algorithm achieves with the best possible, so it needs two numbers: QAOA's expected cut size at these angles, and the triangle's true maximum cut." },
    { text: "The triangle's maximum cut is 2: with three mutually adjacent nodes, any two-colouring must leave one edge with both ends the same colour." },
    { text: "Divide the expected cut size by that maximum. These angles came from a grid search, so expect a number just under 1 rather than well below it." },
  ],
  solution: {
    steps: [{ description: `Ratio ≈ ${achieved.toFixed(4)} / 2 ≈ ${value.toFixed(4)}.` }],
    finalAnswer: `≈${value.toFixed(4)}`,
  },
  explanation: {
    correctIdea: "The approximation ratio is the standard way to measure how close a heuristic optimization algorithm gets to the true optimum.",
    whyCorrect: "This matches the engine's own direct computation of both the achieved and true optimal cut sizes.",
    whyWrong: ["A ratio noticeably below 1 would indicate the chosen parameters are far from optimal — this example specifically used grid-searched, near-optimal parameters."],
  },
};
