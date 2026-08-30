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
    nearMisses: [
      { value: 2, tolerance: 0.02, feedback: "2 adds the two normalization integrals. The 3D integral factorizes into a product of the radial and angular pieces, not a sum of them." },
      { value: 12.566370614359172, tolerance: 0.05, feedback: "4π is the total solid angle. Y₀⁰ carries the 1/√(4π) that cancels it, which is exactly why the angular integral comes out at 1 rather than 4π." },
      { value: 0.5, tolerance: 0.01, feedback: "0.5 would leave the state half-normalized. Each factor is separately normalized to 1, so their product cannot come out below either of them." },
    ],
    incorrectFeedback: "The radial and angular factors are each separately normalized, and the full 3D norm is their product. A result far from that product points at one of the underlying checks, not at ψ = R·Y itself.",
  },
  hints: [
    { text: "No new integral is needed here: both factors were normalized separately in earlier lessons. The question is what happens to normalization when two independently normalized factors are multiplied." },
    { text: "The 3D integral factorizes into the radial integral times the angular integral, so the full norm is the product of the two verified norms." },
    { text: "Multiply the two verified norms together. Each sits as close to its ideal value as numerical integration allows, and so does their product." },
  ],
  solution: {
    steps: [{ description: "1 (radial norm) × 1 (angular norm) = 1: the full 3D wavefunction is automatically normalized." }],
    finalAnswer: "≈1.0",
  },
  explanation: {
    correctIdea: "This confirms directly, using both already-independently-verified engine functions, that ψ=R·Y needs no additional normalization work.",
    whyCorrect: "Both factors were separately verified to normalize to 1 in earlier lessons; their product does too.",
    whyWrong: ["A result far from 1 would indicate one of the two underlying normalization checks (radial or angular) has a real error."],
  },
};
