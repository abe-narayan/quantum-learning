import type { NumericProblem } from "@/lib/problems/types";

const p = 0.1;
const expectationAtLambda1 = Math.pow(1 - p, 1);
const expectationAtLambda3 = Math.pow(1 - p, 3);
const extrapolatedToZeroNoise = 1.5 * expectationAtLambda1 - 0.5 * expectationAtLambda3;

export const zeroNoiseExtrapolationAtP01: NumericProblem = {
  meta: {
    slug: "zero-noise-extrapolation-at-p-0-1",
    title: "Zero-Noise Extrapolation at p = 0.1",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["quantum-error-mitigation", "zero-noise-extrapolation"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation"],
  },
  question: {
    type: "numeric",
    prompt:
      "For a traceless observable under a per-unit depolarizing noise strength $p=0.1$, $\\langle O\\rangle(\\lambda)=(1-p)^\\lambda\\langle O\\rangle_{\\text{ideal}}$ with $\\langle O\\rangle_{\\text{ideal}}=1$. Using the two measured noise levels $\\lambda=1$ and $\\lambda=3$, apply the two-point extrapolation formula $\\langle O\\rangle(0)\\approx\\frac32\\langle O\\rangle(1)-\\frac12\\langle O\\rangle(3)$. What is the extrapolated zero-noise estimate?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: extrapolatedToZeroNoise,
    tolerance: 0.001,
    incorrectFeedback:
      "First compute ⟨O⟩(1)=(0.9)^1 and ⟨O⟩(3)=(0.9)^3, then plug both into (3⟨O⟩(1)-⟨O⟩(3))/2.",
    nearMisses: [
      { value: 1, feedback: "The true ideal value is 1, but a two-point linear fit to an exponential decay cannot reach it exactly. The small shortfall is the O(p²) curvature the fit discards." },
      { value: 0.9, tolerance: 0.002, feedback: "0.9 is the raw λ=1 measurement, before any extrapolation." },
      { value: 0.729, tolerance: 0.002, feedback: "0.729 is the λ=3 measurement, the deliberately noisier one. Extrapolation combines both to reach back toward λ=0." },
    ],
  },
  hints: [
    { text: "⟨O⟩(1) = (1-0.1)^1 = 0.9." },
    { text: "⟨O⟩(3) = (1-0.1)^3 = 0.729." },
    { text: "Extrapolated value = (3 × 0.9 − 0.729) / 2 = (2.7 − 0.729) / 2." },
  ],
  solution: {
    steps: [
      { description: "Compute the two noisy measurements from the exponential decay formula.", latex: "\\langle O\\rangle(1)=(0.9)^1=0.9,\\qquad \\langle O\\rangle(3)=(0.9)^3=0.729" },
      { description: "Apply the two-point linear extrapolation formula to those two values.", latex: "\\langle O\\rangle(0) \\approx \\tfrac32(0.9) - \\tfrac12(0.729) = 1.35 - 0.3645 = 0.9855" },
      { description: "This lands close to, but not exactly at, the true ideal value 1 — the residual (≈1.45%) is the O(p²) curvature the linear fit drops, larger than the lesson's own p=0.05 case (≈0.37%) because the residual scales roughly with p², and (0.1/0.05)²=4." },
    ],
    finalAnswer: `≈ ${extrapolatedToZeroNoise.toFixed(4)}`,
  },
  explanation: {
    correctIdea:
      "This applies the lesson's own zero-noise extrapolation formula to a larger noise strength (p=0.1 instead of p=0.05), using the same two-point linear fit at λ=1 and λ=3.",
    whyCorrect: "Direct substitution into (1-p)^λ for λ=1,3, then the standard two-point extrapolation to λ=0, exactly mirroring the lesson's own worked p=0.05 calculation with a different p.",
    whyWrong: [
      "Answering exactly 1 forgets that the two-point formula is only a linear approximation to the true exponential decay — it gets close, not exact, and the gap grows as p grows.",
      "Answering 0.9 (just ⟨O⟩(1), the raw unmitigated measurement) skips the extrapolation step entirely.",
    ],
  },
};
