import { euclideanFreePropagator } from "@/lib/quantum/pathIntegral";
import type { NumericProblem } from "@/lib/problems/types";

const value = euclideanFreePropagator(0, 0, 1, 1, 1);

export const euclideanPropagatorAtOrigin: NumericProblem = {
  meta: {
    slug: "euclidean-propagator-at-origin",
    title: "The Euclidean Propagator for No Net Motion",
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
    prompt: "Using K_E(xf,xi;τ)=√(m/2πħτ)exp(-m(xf-xi)²/2ħτ) with xf=xi=0, τ=1, m=ħ=1, what is K_E(0,0;1)?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "With xf=xi, the exponential factor is exp(0)=1, leaving just the prefactor √(1/2π).",
    nearMisses: [
      { value: 1 / (2 * Math.PI), tolerance: 0.002, feedback: "1/(2π) is the prefactor before the square root. The normalization carries a √ over the whole m/(2πħτ) factor." },
      { value: 0, feedback: "The exponential is exp(0) = 1, not 0, so nothing zeroes the prefactor. Zero separation gives the propagator its largest value, not its smallest." },
    ],
  },
  hints: [
    { text: "xf-xi=0, so the exponential term is exp(0)=1." },
    { text: "K_E(0,0;1) = √(1/(2π×1)) × 1." },
    { text: "Evaluate √(1/2π) as a decimal. The exponential contributed only a factor of one, so the prefactor is the whole answer." },
  ],
  solution: {
    steps: [{ description: "With xf=xi=0: K_E = √(1/2π) × exp(0) = √(1/2π) ≈ 0.3989." }],
    finalAnswer: "≈0.399",
  },
  explanation: {
    correctIdea: "This is the propagator's maximum value (over xf, at fixed xi and τ), consistent with the lesson's claim that K_E peaks at xf=xi.",
    whyCorrect: "Direct substitution into the closed-form formula, matching euclideanFreePropagator(0,0,1,1,1).",
    whyWrong: ["Forgetting that exp(0)=1 (not 0) would incorrectly zero out the whole expression."],
  },
};
