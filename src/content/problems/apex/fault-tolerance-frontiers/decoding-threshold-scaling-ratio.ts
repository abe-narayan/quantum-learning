import type { NumericProblem } from "@/lib/problems/types";

const exponentForDistance = (d: number) => (d + 1) / 2;
const relativeLogicalErrorRate = (pOverPth: number, d: number) => Math.pow(pOverPth, exponentForDistance(d));

const pOverPth = 0.5;
const ratioD9ToD5 = relativeLogicalErrorRate(pOverPth, 9) / relativeLogicalErrorRate(pOverPth, 5);

export const decodingThresholdScalingRatio: NumericProblem = {
  meta: {
    slug: "decoding-threshold-scaling-ratio",
    title: "Comparing Logical Error Rates Across Code Distances",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/decoding-surface-codes",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["surface-codes", "decoding", "threshold-theorem"],
    prerequisites: ["apex/fault-tolerance-frontiers/decoding-surface-codes"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using the below-threshold scaling relation p_L ~ A(p/p_th)^{(d+1)/2} (same prefactor A for both, since only distance changes), a device runs at a physical error rate exactly half its threshold (p/p_th = 0.5). What is the ratio p_L(d=9) / p_L(d=5)?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: ratioD9ToD5,
    tolerance: 0.01,
    toleranceType: "absolute",
    incorrectFeedback:
      "Compute each distance's exponent (d+1)/2 separately, evaluate 0.5 raised to each, then divide.",
    nearMisses: [
      {
        value: Math.pow(pOverPth, 9) / Math.pow(pOverPth, 5),
        feedback: "You used d itself as the exponent instead of (d+1)/2. Each step of distance buys half an extra power, not a whole one.",
      },
      {
        value: pOverPth,
        feedback: "0.5 is the ratio p/p_th, not the ratio of logical error rates. The exponent grows with d as well, so the suppression compounds.",
      },
      {
        value: Math.pow(pOverPth, 3) / Math.pow(pOverPth, 5),
        feedback: "You divided the wrong way round: 4 is p_L(5)/p_L(9). The larger distance has the smaller logical error rate, so p_L(9)/p_L(5) must be below 1.",
      },
    ],
  },
  hints: [
    { text: "The exponent is (d+1)/2, not d itself. For d=9 that is 5, and for d=5 that is 3." },
    { text: "p_L(d) ∝ (p/p_th)^{(d+1)/2}, so p_L(9) ∝ 0.5^5 and p_L(5) ∝ 0.5^3." },
    { text: "The prefactor A is the same for both distances here, so it cancels exactly in the ratio." },
  ],
  solution: {
    steps: [
      { description: "Exponent for d=9: $(9+1)/2 = 5$. Exponent for d=5: $(5+1)/2 = 3$.", latex: "(d+1)/2" },
      { description: "$p_L(9) \\propto 0.5^5 = 1/32$; $p_L(5) \\propto 0.5^3 = 1/8$ (prefactor $A$ cancels in the ratio)." },
      { description: "Ratio: $(1/32) / (1/8) = 1/4 = 0.25$." },
    ],
    finalAnswer: "0.25",
  },
  explanation: {
    correctIdea:
      "Every two steps of code distance add one full extra power of (p/p_th) to the suppression. Below threshold that is an exponentially shrinking logical error rate for a linear cost in qubits.",
    whyCorrect:
      "The distance-9 patch's logical error rate is a quarter of the distance-5 patch's at the same physical error rate. That is the exponential-suppression-with-distance behavior the threshold theorem promises, and the reason larger surface-code patches are worth their extra qubit cost below threshold.",
    whyWrong: [
      "A ratio of 0.5 (linear scaling) ignores that the exponent itself grows with d, not just the base.",
      "A ratio of 1 would imply distance has no effect on logical error rate, contradicting the exponential suppression this lesson establishes.",
    ],
  },
};
