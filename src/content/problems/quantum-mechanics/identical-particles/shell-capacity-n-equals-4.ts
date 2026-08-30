import type { NumericProblem } from "@/lib/problems/types";

const n = 4;
const value = 2 * n * n;

export const shellCapacityNEquals4: NumericProblem = {
  meta: {
    slug: "shell-capacity-n-equals-4",
    title: "Maximum Electron Capacity of the n=4 Shell",
    course: "identical-particles",
    lesson: "quantum-mechanics/identical-particles/multi-electron-atoms-introduction",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["shell-filling"],
    prerequisites: ["quantum-mechanics/identical-particles/multi-electron-atoms-introduction"],
  },
  question: {
    type: "numeric",
    prompt: "Using the 2n² formula, what is the maximum number of electrons the n=4 shell can hold?",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback: "If you got 16, you counted the orbitals but forgot that each one holds two electrons of opposite spin. Also check the order of operations: square n first, then multiply by 2.",
    nearMisses: [
      { value: 16, feedback: "16 is n², the orbital count. Each orbital takes two electrons of opposite spin." },
      { value: 64, feedback: "64 is (2n)², doubling before squaring. Square n first, then double." },
      { value: 8, feedback: "8 is 2n. The degeneracy of a shell grows as n², not linearly." },
    ],
  },
  hints: [
    { text: "The formula is named in the prompt, so the real work is understanding what it encodes: a shell with principal quantum number n contains n² orbitals, and the exclusion principle lets each orbital hold two electrons of opposite spin." },
    { text: "Substitute n = 4 and respect the order the formula sets: the square acts on n alone, and the factor of 2 is applied to the result." },
    { text: "If your answer came out as 64, the doubling was pulled inside the square instead of staying outside it." },
  ],
  solution: {
    steps: [
      { description: "The n=4 shell contains n² = 4² = 16 orbitals." },
      { description: "Each orbital holds 2 electrons (spin up and spin down), so the capacity is 2×16 = 32." },
    ],
    finalAnswer: "32",
  },
  explanation: {
    correctIdea: "This directly extends the lesson's worked derivation (n²  orbitals × 2 for spin) to a new shell.",
    whyCorrect: "Matches the general 2n² formula derived from Hydrogen Energy Levels' n² degeneracy combined with exclusion's factor of 2.",
    whyWrong: ["Answering just 16 (n²) forgets the factor of 2 from spin, undercounting by exactly half."],
  },
};
