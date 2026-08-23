import { classicalOrder } from "@/lib/quantum/shor";
import type { NumericProblem } from "@/lib/problems/types";

const value = classicalOrder(2, 21);

export const orderOf2Mod21: NumericProblem = {
  meta: {
    slug: "order-of-2-mod-21",
    title: "The Order of 2 mod 21",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["shors-algorithm", "order-finding"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding"],
  },
  question: {
    type: "numeric",
    prompt: "Find r, the smallest positive integer with 2^r ≡ 1 (mod 21), by trial multiplication.",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback: "Compute 2^1, 2^2, 2^3, ... mod 21 until you get back to 1.",
  },
  hints: [
    { text: "2¹=2, 2²=4, 2³=8, 2⁴=16 mod 21." },
    { text: "2⁵=32 mod 21=11, 2⁶=22 mod 21=1." },
    { text: "r=6 is the first time you return to 1." },
  ],
  solution: {
    steps: [{ description: "2,4,8,16,11,1 — the sequence returns to 1 after 6 steps." }],
    finalAnswer: `r = ${value}`,
  },
  explanation: {
    correctIdea: "Order-finding is direct trial multiplication for small N — the quantum speedup only matters once N is too large for this to be practical.",
    whyCorrect: "Matches classicalOrder's actual computation exactly.",
    whyWrong: ["Stopping early (e.g. at 2⁴=16 mod 21=16≠1) and guessing r=4 skips checking that the sequence hasn't actually returned to 1 yet."],
  },
};
