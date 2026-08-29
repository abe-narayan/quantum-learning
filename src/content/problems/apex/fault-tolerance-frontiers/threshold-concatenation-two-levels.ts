import type { NumericProblem } from "@/lib/problems/types";

export const thresholdConcatenationTwoLevels: NumericProblem = {
  meta: {
    slug: "threshold-concatenation-two-levels",
    title: "Two Levels of Concatenation Below Threshold",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/the-threshold-theorem",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["threshold-theorem", "concatenated-codes", "fault-tolerance"],
    prerequisites: ["apex/fault-tolerance-frontiers/the-threshold-theorem"],
  },
  question: {
    type: "numeric",
    prompt:
      "A fault-tolerant gadget has constant c=200, so p_th = 1/c = 0.005. The physical error rate is p0 = 0.002 (below threshold). Using the recursion p_(k+1) = c * p_k^2, compute the level-2 logical error rate p_2.",
    inputHint: "as a decimal, e.g. 0.000128",
  },
  answer: {
    type: "numeric",
    value: 0.000128,
    tolerance: 0.000001,
    incorrectFeedback:
      "Apply the recursion twice, not once: first get p_1 = c*p_0^2, then feed that p_1 (not p_0) back into the same formula for p_2. If your answer is off by orders of magnitude, check that c was multiplied in at both levels.",
    nearMisses: [
      {
        value: 0.0008,
        feedback: "That is p_1, the level-1 rate. The question asks for level 2, so feed p_1 back through p_(k+1) = c p_k^2 once more.",
      },
      {
        value: 3.2e-9,
        tolerance: 1e-10,
        feedback:
          "That is c p_0^4, with c applied only once. Every concatenation level pays its own factor of c; only the squaring compounds for free.",
      },
      {
        value: 1.6e-11,
        tolerance: 1e-12,
        feedback: "That is p_0^4 with no factor of c at all. The gadget constant multiplies at each level, and it is what makes the threshold 1/c rather than 1.",
      },
    ],
  },
  hints: [
    { text: "Apply the recursion once to get p_1 from p_0, then apply it again to get p_2 from p_1 -- concatenation is genuinely iterative, not a one-shot formula." },
    { text: "p_1 = c * p_0^2 = 200 * (0.002)^2." },
    { text: "p_2 = c * p_1^2, using the p_1 you just computed, not p_0 again." },
  ],
  solution: {
    steps: [
      { description: "$p_1 = c\\,p_0^2 = 200 \\times (0.002)^2 = 200 \\times 0.000004 = 0.0008$" },
      { description: "$p_2 = c\\,p_1^2 = 200 \\times (0.0008)^2 = 200 \\times 0.00000064 = 0.000128$" },
    ],
    finalAnswer: "p_2 = 1.28 x 10^-4.",
  },
  explanation: {
    correctIdea:
      "Concatenation is applied recursively: each level's output logical error rate becomes the next level's input, exactly the p_(k+1) = c*p_k^2 recursion this lesson derived from the two-fault argument, iterated twice.",
    whyCorrect:
      "The closed form after 2 levels is p_2 = (1/c)*(c*p_0)^4 = (1/200)*(0.4)^4 = (1/200)*0.0256 = 0.000128, matching the step-by-step recursion exactly.",
    whyWrong: [
      "Computing p_2 as c*p_0^4 (reusing c only once instead of at every level) gives 200*(0.002)^4 = 3.2e-9, a wildly different and incorrect number -- c must be reapplied at each concatenation level, not folded in only once at the end.",
    ],
  },
};
