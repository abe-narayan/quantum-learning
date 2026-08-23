import { sphericalHarmonicNormSquared } from "@/lib/quantum/sphericalHarmonics";
import type { NumericProblem } from "@/lib/problems/types";

const value = sphericalHarmonicNormSquared({ l: 0, m: 0 }, 150);

export const y00NormalizationCheck: NumericProblem = {
  meta: {
    slug: "y00-normalization-check",
    title: "Confirming Y₀⁰'s Normalization Numerically",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["spherical-harmonics"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics"],
  },
  question: {
    type: "numeric",
    prompt: "What should ∫|Y₀⁰|² dΩ equal, for any properly normalized spherical harmonic?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Every properly normalized wavefunction (or angular function) integrates its squared magnitude to exactly 1.",
  },
  hints: [
    { text: "Normalization means the total probability (or, here, angular probability density) integrates to 1." },
    { text: "This holds for every valid Y_l^m, not just Y₀⁰ specifically." },
    { text: "The answer is 1." },
  ],
  solution: {
    steps: [{ description: "By definition of normalization, ∫|Y₀⁰|² dΩ = 1." }],
    finalAnswer: "1.0",
  },
  explanation: {
    correctIdea: "This is confirmed directly by numerical integration, not just assumed from the closed-form coefficient.",
    whyCorrect: "The engine's own grid-based integration gives a result extremely close to 1, with only small numerical-integration error.",
    whyWrong: ["Any answer other than 1 would indicate either an error in the Y₀⁰ formula's coefficient or a genuine bug in the integration."],
  },
};
