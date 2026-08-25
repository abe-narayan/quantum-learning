import type { NumericProblem } from "@/lib/problems/types";

const r = 1;
const deltaX = Math.exp(-r) / Math.sqrt(2);

export const squeezedStateDeltaXAtR1: NumericProblem = {
  meta: {
    slug: "squeezed-state-delta-x-at-r-1",
    title: "Position Uncertainty of a Squeezed State at r=1",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["squeezed-states", "uncertainty"],
    prerequisites: ["quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states"],
  },
  question: {
    type: "numeric",
    prompt: "Using Δx = e^(−r)/√2, compute the position uncertainty of a squeezed state with squeeze parameter r=1.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: deltaX,
    tolerance: 0.002,
    incorrectFeedback: "Compute e^(−1) first, then divide by √2.",
  },
  hints: [
    { text: "e^(−1)≈0.3679." },
    { text: "Δx=0.3679/√2." },
  ],
  solution: {
    steps: [{ description: "Δx = e^(−1)/√2 ≈ 0.3679/1.4142 ≈ 0.2601." }],
    finalAnswer: "≈0.2601",
  },
  explanation: {
    correctIdea: "At r=1, position spread shrinks to about 37% of the coherent-state value (1/√2≈0.7071), while Δp grows by the reciprocal factor e^1, keeping the product exactly 1/2.",
    whyWrong: ["Using Δx=e^r/√2 instead of e^(−r)/√2 swaps which quadrature is squeezed versus anti-squeezed."],
  },
};
