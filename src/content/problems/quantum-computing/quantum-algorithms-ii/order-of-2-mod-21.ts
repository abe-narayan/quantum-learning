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
    nearMisses: [
      { value: 3, feedback: "2³ is 8 mod 21, not 1. The search has to continue past this exponent." },
      { value: 4, feedback: "2⁴ is 16 mod 21. Still not back to 1, so keep multiplying." },
      { value: 12, feedback: "2¹² is indeed 1 mod 21, but 12 is a multiple of the order rather than the order itself. The prompt asks for the smallest positive exponent that works." },
      { value: 21, feedback: "21 is the modulus, not the order. The order has to divide φ(21) = 12, so it can never exceed 12." },
    ],
    incorrectFeedback: "Either the sequence was stopped before it returned to 1, or a multiple of the order was reported instead of the order. Reduce mod 21 after every doubling rather than at the end, and take the first exponent that lands back on 1.",
  },
  hints: [
    { text: "The order r is defined as the first exponent at which the power cycles back to where it started. The plan: repeatedly double, reduce mod 21, and watch for the return." },
    { text: "March through the powers: 2, 4, 8, 16 so far, none of them congruent to 1 mod 21. Each next power is double the previous one, reduced mod 21." },
    { text: "Keep going past the fourth power; the sequence has not returned yet. Stop at the first exponent where the remainder is 1. That exponent is r." },
  ],
  solution: {
    steps: [{ description: "2,4,8,16,11,1: the sequence returns to 1 after 6 steps." }],
    finalAnswer: `r = ${value}`,
  },
  explanation: {
    correctIdea: "Order-finding is direct trial multiplication for small N. The quantum speedup only matters once N is too large for this to be practical.",
    whyCorrect: "Matches classicalOrder's actual computation exactly.",
    whyWrong: ["Stopping early (e.g. at 2⁴=16 mod 21=16≠1) and guessing r=4 skips checking that the sequence hasn't actually returned to 1 yet."],
  },
};
