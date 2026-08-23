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
    incorrectFeedback: "Compute 2×4² directly.",
  },
  hints: [
    { text: "2n² with n=4." },
    { text: "4²=16, then 2×16." },
    { text: "=32." },
  ],
  solution: {
    steps: [{ description: "2(4)²=2(16)=32." }],
    finalAnswer: "32",
  },
  explanation: {
    correctIdea: "This directly extends the lesson's worked derivation (n²  orbitals × 2 for spin) to a new shell.",
    whyCorrect: "Matches the general 2n² formula derived from Hydrogen Energy Levels' n² degeneracy combined with exclusion's factor of 2.",
    whyWrong: ["Answering just 16 (n²) forgets the factor of 2 from spin, undercounting by exactly half."],
  },
};
