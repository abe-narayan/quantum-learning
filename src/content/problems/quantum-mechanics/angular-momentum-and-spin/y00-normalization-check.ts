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
    incorrectFeedback: "Normalization is a definition, not a computation: a properly normalized angular function integrates its squared magnitude to a fixed value over the full sphere. If you integrated and got something else, the discrepancy is numerical error, not physics.",
    nearMisses: [
      { value: 4 * Math.PI, tolerance: 0.05, feedback: "4π is the total solid angle. It is what |Y₀⁰|² is divided by, since Y₀⁰ = 1/√(4π), so the integral comes back to 1." },
      { value: 1 / (4 * Math.PI), tolerance: 0.005, feedback: "1/(4π) is |Y₀⁰|² itself, a constant over the sphere. Integrating that constant over 4π steradians recovers the normalization." },
    ],
  },
  hints: [
    { text: "This question asks what normalization means, not for an integral you must grind out. What must the squared magnitude of a properly normalized angular function integrate to over the full solid angle?" },
    { text: "The normalization convention is the same for every valid Y_l^m; nothing about this particular harmonic changes it." },
    { text: "State the defining value of a normalized probability integral. The numerical check should reproduce it, up to tiny grid error." },
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
