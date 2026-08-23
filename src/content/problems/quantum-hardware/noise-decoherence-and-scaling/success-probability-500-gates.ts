import type { NumericProblem } from "@/lib/problems/types";

const p = 0.999;
const N = 500;
const value = Math.pow(p, N);

export const successProbability500Gates: NumericProblem = {
  meta: {
    slug: "success-probability-500-gates",
    title: "Success Probability for 500 Gates at 99.9% Fidelity",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["scaling"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/scaling-challenges"],
  },
  question: {
    type: "numeric",
    prompt: "Using p^N, what is the overall success probability for 500 sequential gates at 99.9% per-gate fidelity?",
    inputHint: "as a decimal (0 to 1)",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Compute 0.999^500.",
  },
  hints: [
    { text: "0.999^500 = exp(500 × ln(0.999))." },
    { text: "ln(0.999) ≈ -0.0010005, so the exponent is ≈ -0.50." },
    { text: "exp(-0.50) ≈ 0.607." },
  ],
  solution: {
    steps: [{ description: "0.999^500 ≈ 0.607 — about 60.7% overall success probability." }],
    finalAnswer: "≈0.607 (60.7%)",
  },
  explanation: {
    correctIdea: "This sits between the lesson's own table entries for N=100 (90.5%) and N=1000 (36.8%), confirming the smooth exponential decay pattern.",
    whyCorrect: "Direct application of p^N with the lesson's own methodology.",
    whyWrong: ["Linear interpolation between the N=100 and N=1000 table values would give a different (incorrect) answer, since the decay is exponential, not linear, in N."],
  },
};
