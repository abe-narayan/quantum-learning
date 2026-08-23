import type { NumericProblem } from "@/lib/problems/types";

const p = 0.9999;
const value = Math.log(0.5) / Math.log(p);

export const gatesUntil50PercentAt9999: NumericProblem = {
  meta: {
    slug: "gates-until-50-percent-at-99.99",
    title: "How Many Gates at 99.99% Fidelity Before 50% Success?",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["scaling"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/scaling-challenges"],
  },
  question: {
    type: "numeric",
    prompt: "Using N=ln(0.5)/ln(p), how many sequential gates at 99.99% per-gate fidelity can run before success probability drops below 50%?",
    inputHint: "as a number of gates",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 50,
    incorrectFeedback: "Compute ln(0.5)/ln(0.9999).",
  },
  hints: [
    { text: "N = ln(0.5)/ln(0.9999)." },
    { text: "ln(0.9999) ≈ -0.0001." },
    { text: "N ≈ -0.6931/-0.0001 ≈ 6931." },
  ],
  solution: {
    steps: [{ description: "N = ln(0.5)/ln(0.9999) ≈ 6931 gates." }],
    finalAnswer: "≈6931 gates",
  },
  explanation: {
    correctIdea: "This is exactly 10× the worked example's 693-gate result for 99.9% fidelity — a genuine, checkable illustration that a 10× reduction in per-gate error buys roughly a 10× increase in usable circuit depth.",
    whyCorrect: "Matches the lesson's own worked-example methodology, extended to a higher fidelity target.",
    whyWrong: ["Assuming fidelity improvements give only marginal circuit-depth gains misses this roughly-proportional relationship near p≈1."],
  },
};
