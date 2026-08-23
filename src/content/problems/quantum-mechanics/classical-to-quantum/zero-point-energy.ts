import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const zeroPointEnergy: MultipleChoiceProblem = {
  meta: {
    slug: "zero-point-energy",
    title: "The Ground-State (Zero-Point) Energy",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["harmonic-oscillator", "zero-point-energy"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What is $E_0$, the ground-state energy of a quantum harmonic oscillator, in terms of $\\hbar\\omega$?",
    options: [
      { id: "a", text: "$\\hbar\\omega/2$" },
      { id: "b", text: "$0$" },
      { id: "c", text: "$\\hbar\\omega$" },
      { id: "d", text: "$2\\hbar\\omega$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This is the classical expectation (a particle at rest has zero energy), but it's not what quantum mechanics gives — the +1/2 term never vanishes.",
      c: "This would be E_1, not E_0 — check the formula E_n = ħω(n+1/2) at n=0.",
      d: "This is too large by a factor of 4 — check the formula at n=0.",
    },
    defaultIncorrectFeedback: "Substitute n=0 into E_n = ħω(n+1/2) directly.",
  },
  hints: [
    { text: "E_n = ħω(n + 1/2). Set n=0." },
  ],
  solution: {
    steps: [
      { description: "Substitute $n=0$ into $E_n=\\hbar\\omega(n+\\tfrac12)$.", latex: "E_0 = \\hbar\\omega\\left(0+\\tfrac12\\right) = \\frac{\\hbar\\omega}{2}" },
    ],
    finalAnswer: "$E_0 = \\hbar\\omega/2$.",
  },
  explanation: {
    correctIdea: "The ground state is never at zero energy — this is the zero-point energy, a genuine, measurable quantum effect.",
    whyCorrect: "Direct substitution of n=0 into the derived energy formula.",
    whyWrong: ["Answering 0 assumes the ground state behaves like a classical particle at rest, which the ladder-operator derivation explicitly rules out."],
  },
};
