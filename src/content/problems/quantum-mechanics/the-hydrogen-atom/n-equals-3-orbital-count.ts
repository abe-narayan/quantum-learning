import type { NumericProblem } from "@/lib/problems/types";

const n = 3;
let value = 0;
for (let l = 0; l < n; l++) {
  value += 2 * l + 1;
}

export const nEquals3OrbitalCount: NumericProblem = {
  meta: {
    slug: "n-equals-3-orbital-count",
    title: "How Many Distinct Orbitals Share n=3?",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["orbitals", "quantum-numbers"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers"],
  },
  question: {
    type: "numeric",
    prompt: "Counting every distinct (l,m) combination for n=3 (3s + 3p + 3d), how many total orbitals share the n=3 energy level?",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback: "Sum 2l+1 for l=0 (3s), l=1 (3p), l=2 (3d) and add them up.",
  },
  hints: [
    { text: "3s: l=0 gives 1 orbital. 3p: l=1 gives 3 orbitals. 3d: l=2 gives 5 orbitals." },
    { text: "1+3+5=9." },
    { text: "This matches n²=3²=9." },
  ],
  solution: {
    steps: [
      { description: "3s (l=0): 1 orbital." },
      { description: "3p (l=1): 3 orbitals." },
      { description: "3d (l=2): 5 orbitals." },
      { description: "Total: 1+3+5=9=n²." },
    ],
    finalAnswer: "9",
  },
  explanation: {
    correctIdea: "This concretely reproduces the n² degeneracy count for the n=3 shell, matching the sum-over-l pattern from the previous lesson.",
    whyCorrect: "1+3+5=9=3², consistent with the general n² formula.",
    whyWrong: ["Counting only distinct l values (3: s,p,d) instead of every individual m-orbital undercounts by a factor related to 2l+1."],
  },
};
