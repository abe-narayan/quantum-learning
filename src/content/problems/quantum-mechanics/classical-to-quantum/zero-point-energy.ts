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
      c: "This is the spacing between consecutive levels, E_{n+1} − E_n = ħω, not the height of the lowest one. The ground state sits half a spacing above the bottom of the well.",
      d: "This is E_2 with the +1/2 dropped: ħω(2) rather than ħω(2+1/2). It also answers for the wrong level.",
    },
    defaultIncorrectFeedback: "Substitute n=0 into E_n = ħω(n+1/2) directly, and keep the +1/2.",
  },
  hints: [
    { text: "The oscillator's energy levels follow one formula in n. Write it down first." },
    { text: "E_n = ħω(n + 1/2), and the ground state is the n=0 level." },
    { text: "Substitute n=0 and keep the +1/2, which is the term that survives." },
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
    whyWrong: [
      { optionId: "b", text: "The classical expectation, a particle at rest with no energy. The +1/2 is what the ladder-operator derivation adds, and it never vanishes." },
      { optionId: "c", text: "The spacing between levels, E_{n+1} − E_n = ħω, rather than the height of the lowest one. The ground state sits half a spacing up." },
      { optionId: "d", text: "Drops the +1/2 and reads off n=2, so it misses both the level and the zero-point term." },
    ],
  },
};
