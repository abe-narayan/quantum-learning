import type { NumericProblem } from "@/lib/problems/types";

const iterations = 500;
const overheadPerIteration = 4;
const value = iterations * overheadPerIteration;

export const totalSwaps500Iterations: NumericProblem = {
  meta: {
    slug: "total-swaps-500-iterations",
    title: "Total SWAP Gates Across a 500-Iteration VQE Run",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["hybrid-workflows"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows"],
  },
  question: {
    type: "numeric",
    prompt: "For a VQE run with 500 iterations and 4 SWAP gates of overhead per iteration, what is the total SWAP-gate count across the full run?",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 5,
    incorrectFeedback: "Multiply 500 iterations by 4 SWAPs per iteration.",
    nearMisses: [
      { value: 4, tolerance: 0.5, feedback: "4 is the per-iteration overhead. Every one of the 500 iterations pays it again." },
      { value: 504, tolerance: 0.5, feedback: "504 adds the two figures. The overhead recurs each iteration, so the counts multiply." },
    ],
  },
  hints: [
    { text: "The overhead compounds: every one of the 500 iterations pays the same 4-SWAP cost." },
    { text: "Multiply the iteration count by the per-iteration overhead." },
  ],
  solution: {
    steps: [{ description: "500 × 4 = 2000 total SWAP gates." }],
    finalAnswer: "2000",
  },
  explanation: {
    correctIdea: "This directly applies the lesson's own worked-example methodology (200 iterations × 6 SWAPs = 1200) to a different iteration count and overhead.",
    whyCorrect: "Direct multiplication, matching the lesson's stated per-iteration compounding.",
    whyWrong: ["Reporting just the per-iteration overhead (4) instead of the full-run total misses the entire point of this lesson's compounding-cost argument."],
  },
};
