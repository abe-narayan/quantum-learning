import type { NumericProblem } from "@/lib/problems/types";

const n = 12;
const value = 2 ** (n - 1) + 1;

export const djClassicalQueriesN12: NumericProblem = {
  meta: {
    slug: "dj-classical-queries-n12",
    title: "Deutsch-Jozsa's Exact Classical Query Count at n=12",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["bqp", "oracle-complexity", "deutsch-jozsa"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity"],
  },
  question: {
    type: "numeric",
    prompt: "For n=12, what is the exact (zero-error) worst-case classical deterministic query count needed to decide the Deutsch-Jozsa promise?",
    inputHint: "an integer, using 2^(n-1)+1",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 1,
    incorrectFeedback: "Use the exact worst-case formula 2^(n-1)+1 derived in the lesson, with n=12.",
  },
  hints: [
    { text: "The lesson derives the exact classical worst-case query count as 2^(n-1)+1." },
    { text: "With n=12, that's 2^11+1." },
    { text: "2^11 = 2048." },
  ],
  solution: {
    steps: [
      { description: "The exact classical deterministic worst-case query count is 2^(n-1)+1." },
      { description: "For n=12: 2^11+1 = 2048+1 = 2049." },
    ],
    finalAnswer: `${value}`,
  },
  explanation: {
    correctIdea: "A deterministic algorithm can't certify constant-vs-balanced until it has seen more than half of all 2^n inputs.",
    whyCorrect: "Seeing exactly half of the inputs, all equal, is still consistent with either promise until one more, differently-valued query is seen — forcing 2^(n-1)+1 queries in the worst case.",
    whyWrong: ["This exact bound applies only to zero-error classical algorithms; with bounded error, O(1) random queries suffice regardless of n, a very different number."],
  },
};
