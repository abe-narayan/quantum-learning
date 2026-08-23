import { radialNormSquared, radial1s } from "@/lib/quantum/hydrogenAtom";
import { sphericalHarmonicNormSquared } from "@/lib/quantum/sphericalHarmonics";
import type { NumericProblem } from "@/lib/problems/types";

const value = radialNormSquared(radial1s) * sphericalHarmonicNormSquared({ l: 0, m: 0 }, 120);

export const psi1sNormalizationFromFactors: NumericProblem = {
  meta: {
    slug: "psi-1s-normalization-from-factors",
    title: "The 1s Orbital's Full 3D Normalization",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["orbitals", "normalization"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers"],
  },
  question: {
    type: "numeric",
    prompt: "Multiplying the verified radial normalization integral for the 1s state by the verified angular normalization integral for Y₀⁰, what is the resulting full 3D normalization of ψ₁₀₀?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Each factor (radial and angular) is separately normalized to 1 — multiplying two numbers each ≈1 gives a result ≈1.",
  },
  hints: [
    { text: "radialNormSquared(radial1s) ≈ 1, verified in a previous lesson." },
    { text: "sphericalHarmonicNormSquared({l:0,m:0}) ≈ 1, verified in Angular Momentum & Spin." },
    { text: "1 × 1 = 1." },
  ],
  solution: {
    steps: [{ description: "1 (radial norm) × 1 (angular norm) = 1 — the full 3D wavefunction is automatically normalized." }],
    finalAnswer: "≈1.0",
  },
  explanation: {
    correctIdea: "This confirms directly, using both already-independently-verified engine functions, that ψ=R·Y needs no additional normalization work.",
    whyCorrect: "Both factors were separately verified to normalize to 1 in earlier lessons; their product does too.",
    whyWrong: ["A result far from 1 would indicate one of the two underlying normalization checks (radial or angular) has a real error."],
  },
};
