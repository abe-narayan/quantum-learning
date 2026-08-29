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
    incorrectFeedback: "Raise the per-gate fidelity to the power of the gate count. Multiplying the error rate by the count and subtracting from one is only a linear approximation, and at this depth it noticeably misestimates the survival.",
    nearMisses: [
      { value: 0.5, tolerance: 0.005, feedback: "0.5 comes from 1 − N(1−p), the linear estimate. It undercounts survival because the compounding is multiplicative, not additive." },
      { value: 0.905, tolerance: 0.005, feedback: "That is the lesson's N = 100 entry. At 500 gates the exponent is five times larger." },
      { value: 0.368, tolerance: 0.005, feedback: "That is the N = 1000 entry. This circuit is half that depth, so its survival is the square root of that value." },
    ],
  },
  hints: [
    { text: "0.999^500 = exp(500 × ln(0.999))." },
    { text: "ln(0.999) ≈ -0.0010005, so the exponent is ≈ -0.50." },
    { text: "Exponentiate the result. The answer should land between the lesson's table entries for shallower and deeper circuits." },
  ],
  solution: {
    steps: [{ description: "0.999^500 ≈ 0.607, about 60.7% overall success probability." }],
    finalAnswer: "≈0.607 (60.7%)",
  },
  explanation: {
    correctIdea: "This sits between the lesson's own table entries for N=100 (90.5%) and N=1000 (36.8%), confirming the smooth exponential decay pattern.",
    whyCorrect: "Direct application of p^N with the lesson's own methodology.",
    whyWrong: ["Linear interpolation between the N=100 and N=1000 table values would give a different (incorrect) answer, since the decay is exponential, not linear, in N."],
  },
};
