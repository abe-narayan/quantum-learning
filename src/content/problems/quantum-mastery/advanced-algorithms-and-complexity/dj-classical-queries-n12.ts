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
    tolerance: 0.5,
    incorrectFeedback: "Use the exact worst-case formula 2^(n-1)+1 derived in the lesson, with n=12. The +1 is load-bearing here: this is an exact count, not an estimate.",
    nearMisses: [
      { value: 2048, feedback: "2048 is 2^(n−1), the number of queries that can still leave both promises live. One more is needed to settle it." },
      { value: 4096, feedback: "4096 is 2^n, the full input count. A deterministic algorithm can stop once it has seen just over half of them." },
    ],
  },
  hints: [
    { text: "The lesson derives the exact classical worst-case query count as 2^(n-1)+1." },
    { text: "With n=12, that's 2^11+1." },
    { text: "Evaluate 2^11, then add the one extra query that finally settles the promise." },
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
    whyCorrect: "Seeing exactly half of the inputs, all equal, is still consistent with either promise until one more, differently-valued query is seen, forcing 2^(n-1)+1 queries in the worst case.",
    whyWrong: ["This exact bound applies only to zero-error classical algorithms; with bounded error, O(1) random queries suffice regardless of n, a very different number."],
  },
};
