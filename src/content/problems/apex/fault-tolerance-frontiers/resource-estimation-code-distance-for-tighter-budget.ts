import type { NumericProblem } from "@/lib/problems/types";

const totalGates = 10 + 40;
const perGateBudget = 0.01 / totalGates;
const errorRatio = 0.1;
const minCodeDistanceRaw = 2 * (Math.log(perGateBudget) / Math.log(errorRatio)) - 1;
const rounded = Math.ceil(minCodeDistanceRaw);
const value = rounded % 2 === 0 ? rounded + 1 : rounded;

export const resourceEstimationCodeDistanceForTighterBudget: NumericProblem = {
  meta: {
    slug: "resource-estimation-code-distance-for-tighter-budget",
    title: "Code Distance for a Smaller Toy Circuit",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["resource-estimation", "code-distance", "surface-codes", "threshold-theorem"],
    prerequisites: ["apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm"],
  },
  question: {
    type: "numeric",
    prompt:
      "Redo the capstone's Steps 1–2 for a smaller toy circuit with N_T=10 T gates and N_2=40 two-qubit Clifford gates, targeting the same ≥99% overall success probability, at the same operating point p/p_th=0.1. Using p_L ~ (p/p_th)^((d+1)/2), what is the smallest odd code distance d that meets the resulting per-gate budget?",
    inputHint: "an odd integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0,
    incorrectFeedback:
      "Most wrong answers here come from rounding: the raw d is fractional, and surface-code distance must be rounded up to an odd integer, not merely the nearest integer. Also check the budget step: the 1% failure allowance is shared across all 50 gates, not applied to each gate individually.",
    nearMisses: [
      {
        value: 5,
        feedback:
          "d=5 rounds the raw 6.40 down. Check it against the budget: (0.1)^((5+1)/2) = 10⁻³, five times larger than the 2×10⁻⁴ allowance, so it fails.",
      },
      {
        value: 6,
        feedback: "6 is the next integer above 6.40's floor, but surface-code distance must be odd. Round up to the next odd value.",
      },
      {
        value: 9,
        feedback:
          "9 is the capstone's own answer for its 600-gate circuit. This toy circuit has 50 gates, so its per-gate budget is looser and a smaller distance suffices.",
      },
    ],
  },
  hints: [
    { text: "Two steps, the same as the capstone's. First split the overall failure budget evenly across every gate to get a per-gate budget. Then ask what code distance pushes the logical error rate below that budget." },
    { text: "The per-gate budget is 0.01/(N_T+N_2) = 0.01/50 = 2×10⁻⁴, looser than the capstone's own 1.667×10⁻⁵ since fewer gates each need to succeed. Set (p/p_th)^((d+1)/2) ≤ that budget and take logs, as the capstone's Step 2 does." },
    { text: "Solving gives a raw d that is not an integer. Surface-code distance must be an odd integer, so round up to the next odd value, not just the next integer." },
  ],
  solution: {
    steps: [
      { description: "Per-gate budget: p_L^target = 0.01/(10+40) = 0.01/50 = 2×10⁻⁴." },
      { description: "Solve (d+1)/2 ≥ ln(2×10⁻⁴)/ln(0.1) = (−8.517)/(−2.303) ≈ 3.700, so d ≥ 2(3.700)−1 ≈ 6.40." },
      { description: "d must be an odd integer at or above 6.40, so d = 7 (checking: (0.1)^4 = 10⁻⁴ ≤ 2×10⁻⁴, while d=5 gives (0.1)^3 = 10⁻³, which overshoots the budget)." },
    ],
    finalAnswer: `d = ${value}`,
  },
  explanation: {
    correctIdea:
      "A looser per-gate error budget (from fewer total gates) requires a smaller code distance than the capstone's own 600-gate, d=9 result. It is the same Step 1→Step 2 algebra, run on different inputs.",
    whyCorrect:
      "This is the same derivation the capstone lesson performs, applied to a smaller N_T+N_2, showing explicitly that code distance is not a fixed platform constant but a computed consequence of the circuit's own gate count and target reliability.",
    whyWrong: [
      "Using d=5 undershoots: (0.1)^3=10⁻³ is larger than the 2×10⁻⁴ target, so it fails the reliability requirement.",
      "Rounding the raw ~6.40 down to 6 ignores that surface-code distance must be odd; the correct next odd integer above 6.40 is 7, not 6.",
    ],
  },
};
