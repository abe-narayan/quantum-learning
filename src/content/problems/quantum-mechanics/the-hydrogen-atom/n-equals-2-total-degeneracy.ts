import type { NumericProblem } from "@/lib/problems/types";

const n = 2;
let value = 0;
for (let l = 0; l < n; l++) {
  value += 2 * l + 1;
}

export const nEquals2TotalDegeneracy: NumericProblem = {
  meta: {
    slug: "n-equals-2-total-degeneracy",
    title: "Total Degeneracy of the n=2 Level",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["energy-levels", "degeneracy"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels"],
  },
  question: {
    type: "numeric",
    prompt: "For n=2, l ranges over 0 and 1 (l < n). Summing 2l+1 over each allowed l, what is the total degeneracy of the n=2 energy level (ignoring spin)?",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback: "Sum 2l+1 for l=0 (giving 1 state, the 2s) and l=1 (giving 3 states, the 2p states with m=-1,0,1).",
    nearMisses: [
      { value: 3, feedback: "3 counts the 2p states only. The 2s state shares the same energy and has to be included." },
      { value: 2, feedback: "2 counts the allowed l values. Each l carries 2l+1 states of its own, so the sum is larger." },
      { value: 8, feedback: "8 includes the factor of 2 from spin. The prompt asks for the degeneracy ignoring spin." },
    ],
  },
  hints: [
    { text: "For n=2, allowed l values are 0 and 1 (l runs from 0 to n-1)." },
    { text: "l=0 contributes 2(0)+1=1 state; l=1 contributes 2(1)+1=3 states." },
    { text: "Add the two contributions. As a check, the total should match the general n² degeneracy rule." },
  ],
  solution: {
    steps: [
      { description: "l=0 (2s): 2(0)+1=1 state." },
      { description: "l=1 (2p): 2(1)+1=3 states (m=-1,0,1)." },
      { description: "Total: 1+3=4, matching the general formula n²=2²=4." },
    ],
    finalAnswer: "4",
  },
  explanation: {
    correctIdea: "This sum-over-l calculation is exactly how the general n² degeneracy formula is derived, done concretely for the smallest nontrivial case.",
    whyCorrect: "1 (2s) + 3 (2p) = 4 = 2², matching the stated n² rule.",
    whyWrong: ["Counting only the l=1 states (3) or only l=0 (1) misses that the level's degeneracy sums over every allowed l, not just one."],
  },
};
