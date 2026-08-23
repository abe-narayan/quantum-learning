import { euclideanFreePropagator, discretizedTwoSlicePropagator } from "@/lib/quantum/pathIntegral";
import type { NumericProblem } from "@/lib/problems/types";

const exact = euclideanFreePropagator(2, 0, 1.5);
const discretized = discretizedTwoSlicePropagator(2, 0, 1.5, { xRange: 25, steps: 10000 });
const relativeError = Math.abs(exact - discretized) / exact;
const value = Math.round(Math.log10(relativeError));

export const compositionLawRelativeError: NumericProblem = {
  meta: {
    slug: "composition-law-relative-error",
    title: "How Close Does the Discretized Sum Get?",
    course: "advanced-quantum-mechanics",
    lesson: "quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["path-integral"],
    prerequisites: ["quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation"],
  },
  question: {
    type: "numeric",
    prompt: "For xf=2, xi=0, τ=1.5, the relative error between the discretized two-slice path sum and the exact propagator is roughly 10^k, on a well-resolved grid. What is k (a negative integer)?",
    inputHint: "as a negative integer, e.g. -8",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 2,
    incorrectFeedback: "This lesson's worked example reports a relative error around 10⁻¹⁵ (machine precision) — expect a similarly extreme (large-magnitude negative) exponent here.",
  },
  hints: [
    { text: "The discretized sum reproduces the exact Gaussian convolution essentially exactly on a fine enough grid." },
    { text: "This lesson's worked example found ~1.3×10⁻¹⁵ for a different (xf,xi,τ)." },
    { text: "Expect a similarly tiny (near machine-precision) relative error here." },
  ],
  solution: {
    steps: [{ description: "The discretized two-slice sum matches the exact propagator to within floating-point precision (~10⁻¹⁵ relative error), since the underlying identity (Gaussian convolution) is mathematically exact." }],
    finalAnswer: "k ≈ -15 (machine precision)",
  },
  explanation: {
    correctIdea: "This reinforces that the near-exact numerical agreement isn't a fluke of one specific (xf,xi,τ) choice — it holds essentially everywhere, since it reflects an exact mathematical identity, not an approximation.",
    whyCorrect: "Matches the engine's own discretizedTwoSlicePropagator output compared to euclideanFreePropagator for this (xf,xi,τ).",
    whyWrong: ["A relative error anywhere near 0.01 or larger would suggest either too coarse a grid or too narrow an xRange — not what this platform's default parameters produce."],
  },
};
