import type { NumericProblem } from "@/lib/problems/types";

const epsilon0 = 0.01;
const outputErrorRate = (epsilonIn: number) => 35 * epsilonIn ** 3;
const epsilon1 = outputErrorRate(epsilon0);
const epsilon2 = outputErrorRate(epsilon1);
const targetErrorRate = 1e-10;
const roundsNeeded = epsilon1 < targetErrorRate ? 1 : epsilon2 < targetErrorRate ? 2 : 3;

export const magicStateDistillationRoundsNeeded: NumericProblem = {
  meta: {
    slug: "magic-state-distillation-rounds-needed",
    title: "How Many 15-to-1 Distillation Rounds Reach a 10⁻¹⁰ Target?",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/magic-states-and-distillation",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["magic-state-distillation", "resource-estimation", "cubic-suppression"],
    prerequisites: ["apex/fault-tolerance-frontiers/magic-states-and-distillation"],
  },
  question: {
    type: "numeric",
    prompt:
      "A magic-state factory starts from a raw magic-state error rate of ε₀ = 0.01 and applies successive rounds of 15-to-1 distillation, each round taking an input error rate ε to an output error rate of 35ε³ (feeding one round's output into the next round as its input). The factory needs its output error rate below 10⁻¹⁰ before injecting a magic state into the computation. What is the smallest number of distillation rounds that achieves this?",
    inputHint: "as a whole number of rounds",
  },
  answer: {
    type: "numeric",
    value: roundsNeeded,
    tolerance: 0,
    incorrectFeedback:
      "Apply ε_out = 35ε_in³ once to get ε₁, check it against 10⁻¹⁰, and if it's not yet below target, apply the same formula again to ε₁ to get ε₂.",
    nearMisses: [
      {
        value: 1,
        feedback:
          "One round gives ε₁ = 35×10⁻⁶ ≈ 3.5×10⁻⁵, five orders of magnitude above the 10⁻¹⁰ target. The 35 prefactor also works against you at the first round.",
      },
      {
        value: 3,
        feedback:
          "Round 2 already lands at ≈1.5×10⁻¹², below the target. Check ε₂ before assuming a third round is needed: cubic suppression moves fast once ε is small.",
      },
    ],
  },
  hints: [
    { text: "Compute ε₁ = 35 × (0.01)³ first, and compare it to 10⁻¹⁰." },
    { text: "ε₁ ≈ 3.5×10⁻⁵, which is still far above 10⁻¹⁰ — one round isn't enough." },
    { text: "Feed ε₁ back into the same formula to get ε₂ = 35 × ε₁³, and compare that to 10⁻¹⁰." },
  ],
  solution: {
    steps: [
      { description: "Round 1: $\\epsilon_1 = 35 \\times (0.01)^3 = 35\\times10^{-6} = 3.5\\times10^{-5}$, still far above $10^{-10}$." },
      { description: "Round 2: $\\epsilon_2 = 35 \\times (3.5\\times10^{-5})^3 \\approx 1.50\\times10^{-12}$, which is below $10^{-10}$." },
      { description: "So 2 rounds suffice; 1 round does not." },
    ],
    finalAnswer: "2 rounds",
  },
  explanation: {
    correctIdea: "Each round applies the same cubic-suppression formula to the previous round's output, so the exponent on the original ε₀ roughly triples each round, a double-exponential collapse.",
    whyCorrect: "35×10⁻⁶ ≈ 3.5×10⁻⁵ (round 1) is still 5 orders of magnitude above the 10⁻¹⁰ target; feeding that back in gives ≈1.5×10⁻¹² (round 2), which clears the target.",
    whyWrong: ["Answering 1 round mistakes ε₁ ≈ 3.5×10⁻⁵ for something below 10⁻¹⁰, when it is actually five orders of magnitude larger.", "Answering 3 or more overshoots — round 2's output already clears the target with room to spare."],
  },
};
