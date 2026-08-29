import type { NumericProblem } from "@/lib/problems/types";

export const harmonicGroundStateEnergy: NumericProblem = {
  meta: {
    slug: "harmonic-ground-state-energy",
    title: "Harmonic Oscillator Ground State Energy",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/the-harmonic-oscillator-in-position-space",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["harmonic-oscillator", "energy-levels"],
    prerequisites: ["quantum-mechanics/wave-mechanics/the-harmonic-oscillator-in-position-space"],
  },
  question: {
    type: "numeric",
    prompt: "For a harmonic oscillator with angular frequency omega = 3 (natural units, hbar = 1), find the ground state energy E_0.",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 1.5,
    tolerance: 0.01,
    incorrectFeedback: "E_0 = hbar*omega/2. With hbar=1, E_0 = omega/2.",
    nearMisses: [
      { value: 3, feedback: "3 is ħω, the spacing between levels. The ground state sits half a spacing above the potential minimum." },
      { value: 0, feedback: "0 would mean the oscillator can be at rest at the bottom of the well. The uncertainty principle forbids that, leaving ħω/2." },
    ],
  },
  hints: [{ text: "Use E_0 = omega/2 directly (hbar=1)." }],
  solution: {
    steps: [{ description: "$E_0 = \\dfrac{\\omega}{2} = \\dfrac{3}{2} = 1.5$." }],
    finalAnswer: "$E_0 = 1.5$",
  },
  explanation: {
    correctIdea: "The harmonic oscillator's ground state has nonzero zero-point energy, hbar*omega/2.",
    whyCorrect: "This matches the direct-substitution derivation from the Gaussian ansatz, and the ladder-operator result from the last course.",
    whyWrong: ["Reporting E_0=0 forgets the zero-point energy — the ground state is never exactly at rest quantum mechanically."],
  },
};
