import type { NumericProblem } from "@/lib/problems/types";

const n = 16;
const djClassical = 2 ** (n - 1) + 1;
const value = djClassical; // the DJ speedup factor at n=16, since quantum queries = 1

export const speedupFactorComparison: NumericProblem = {
  meta: {
    slug: "speedup-factor-comparison",
    title: "Deutsch-Jozsa's Speedup Factor at n=16",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["quantum-advantage", "capstone"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage"],
  },
  question: {
    type: "numeric",
    prompt: "For n=16, what is Deutsch-Jozsa's classical worst-case query count (2^(n-1)+1) — i.e., the exact factor by which the quantum algorithm's single query beats it?",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback: "Compute 2^15 + 1 directly.",
    nearMisses: [
      { value: 2 ** (n - 1), feedback: "2^15 is the number of inputs that can still leave the answer ambiguous. One more query is needed to settle it, hence the +1." },
      { value: 2 ** n, feedback: "2^16 is the full input count. The classical worst case only needs to check just over half of them, 2^(n-1) + 1." },
      { value: 2 ** n + 1, feedback: "The exponent is n−1, not n: the ambiguity is resolved once you have seen one more than half the inputs." },
    ],
  },
  hints: [
    { text: "The formula is 2^(n-1)+1 with n=16." },
    { text: "2^15 = 32768." },
    { text: "Add 1." },
  ],
  solution: {
    steps: [{ description: "2^15 + 1 = 32768 + 1 = 32769." }],
    finalAnswer: `${value}`,
  },
  explanation: {
    correctIdea: "The classical worst-case bound grows exponentially with n, while the quantum algorithm stays at exactly 1 query regardless of n.",
    whyCorrect: "This is exactly why the gap between the two widens dramatically as n grows, as the capstone's worked example showed at n=10.",
    whyWrong: ["Using 2^n instead of 2^(n-1)+1 would overstate the classical bound — the +1 and the halving both matter to the exact worst-case count."],
  },
};
