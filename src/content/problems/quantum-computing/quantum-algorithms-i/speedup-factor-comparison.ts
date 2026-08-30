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
    prompt: "For n=16, what is Deutsch-Jozsa's classical worst-case query count, 2^(n-1)+1? Since the quantum algorithm uses a single query, this is also the factor by which it beats the classical bound.",
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
    { text: "Powers of two double each step: 2^10 = 1024, so 2^15 = 1024 × 32." },
    { text: "Add the +1. The worst case is one query past the halfway point, not the halfway point itself." },
  ],
  solution: {
    steps: [{ description: "2^15 + 1 = 32768 + 1 = 32769." }],
    finalAnswer: `${value}`,
  },
  explanation: {
    correctIdea: "The classical worst-case bound grows exponentially with n, while the quantum algorithm stays at 1 query for every n.",
    whyCorrect: "This is why the gap widens so fast as n grows, as the capstone's worked example showed at n=10.",
    whyWrong: ["Using 2^n instead of 2^(n-1)+1 overstates the classical bound; both the halving and the +1 matter to the worst-case count."],
  },
};
