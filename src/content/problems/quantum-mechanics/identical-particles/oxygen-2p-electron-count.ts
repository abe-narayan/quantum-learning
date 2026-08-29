import type { NumericProblem } from "@/lib/problems/types";

const totalElectrons = 8;
const oneS = 2;
const twoS = 2;
const value = totalElectrons - oneS - twoS;

export const oxygen2pElectronCount: NumericProblem = {
  meta: {
    slug: "oxygen-2p-electron-count",
    title: "How Many 2p Electrons Does Oxygen Have?",
    course: "identical-particles",
    lesson: "quantum-mechanics/identical-particles/multi-electron-atoms-introduction",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["shell-filling"],
    prerequisites: ["quantum-mechanics/identical-particles/multi-electron-atoms-introduction"],
  },
  question: {
    type: "numeric",
    prompt: "Oxygen has 8 electrons. Filling 1s (capacity 2) and 2s (capacity 2) first, how many electrons are left over for the 2p subshell?",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback: "8 total, minus 2 (1s) minus 2 (2s), leaves the 2p count.",
    nearMisses: [
      { value: 6, feedback: "6 is the 2p subshell's full capacity, not oxygen's occupancy of it. Only 4 electrons are left once 1s and 2s are filled." },
      { value: 2, feedback: "2 subtracts only one full subshell. Both 1s and 2s fill before 2p starts." },
    ],
  },
  hints: [
    { text: "1s holds 2 electrons (full)." },
    { text: "2s holds 2 more (full), which together with 1s uses half of oxygen's electrons." },
    { text: "Subtract the already-placed electrons from the total of eight. Whatever remains goes into 2p." },
  ],
  solution: {
    steps: [
      { description: "1s: 2 electrons." },
      { description: "2s: 2 more electrons (4 total so far)." },
      { description: "Remaining: 8-4=4 electrons go into 2p." },
    ],
    finalAnswer: "4 (configuration 1s²2s²2p⁴, matching oxygen's known configuration)",
  },
  explanation: {
    correctIdea: "This applies the worked example's carbon method to a different atom, using only the shell-filling logic (no lookup table needed).",
    whyCorrect: "1s²2s²2p⁴ is oxygen's standard electron configuration, reproduced here purely from the fill-lowest-shells-first method.",
    whyWrong: ["Forgetting that 1s and 2s are already full before 2p starts filling would misallocate the remaining electron count."],
  },
};
