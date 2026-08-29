import type { NumericProblem } from "@/lib/problems/types";

const n = 10000;
const p = 0.5;
const value = Math.sqrt(n * p * (1 - p));

export const shotNoiseStandardDeviation10000: NumericProblem = {
  meta: {
    slug: "shot-noise-standard-deviation-10000",
    title: "Shot-Noise Standard Deviation at 10,000 Shots",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/writing-your-first-circuit",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["shot-noise"],
    prerequisites: ["quantum-software/programming-quantum-computers/writing-your-first-circuit"],
  },
  question: {
    type: "numeric",
    prompt: "Using σ=√(np(1-p)) with n=10,000 shots and p=0.5, what is the standard deviation in the '000' count for the GHZ circuit?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 1,
    incorrectFeedback: "Compute √(10000 × 0.5 × 0.5).",
    nearMisses: [
      { value: 2500, tolerance: 2, feedback: "2500 is the variance np(1−p). The standard deviation is its square root." },
      { value: 100, tolerance: 0.5, feedback: "100 is √n, missing the p(1−p) factor of 1/4, whose square root halves the result." },
      { value: 0.005, tolerance: 0.0002, feedback: "0.005 is the relative uncertainty σ/n. The question asks for the standard deviation of the count itself." },
    ],
  },
  hints: [
    { text: "np(1-p) = 10000 × 0.5 × 0.5 = 2500." },
    { text: "Take the square root of 2500." },
  ],
  solution: {
    steps: [{ description: "σ = √(10000×0.5×0.5) = √2500 = 50." }],
    finalAnswer: "50",
  },
  explanation: {
    correctIdea: "Doubling shots from 5000 to 10000 increases the absolute standard deviation (from ≈35.4 to 50) but shrinks it as a fraction of total shots (from ≈0.71% to 0.5%): statistical noise grows slower than shot count, the general √n scaling behind 'more shots = more precision.'",
    whyCorrect: "Direct application of the binomial standard deviation formula, matching the lesson's own methodology.",
    whyWrong: ["Expecting the absolute standard deviation to shrink with more shots confuses absolute noise (which grows as √n) with relative/fractional noise (which shrinks as 1/√n)."],
  },
};
