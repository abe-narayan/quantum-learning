import type { NumericProblem } from "@/lib/problems/types";

const T1 = 80;
const value = 2 * T1;

export const maxT2ForGivenT1: NumericProblem = {
  meta: {
    slug: "max-t2-for-given-t1",
    title: "The Maximum Possible T2 for T1=80μs",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["t1-t2"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence"],
  },
  question: {
    type: "numeric",
    prompt: "Using T2 ≤ 2T1, what is the absolute maximum possible T2 (in μs) for a device with T1=80μs?",
    inputHint: "in μs",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 1,
    incorrectFeedback: "The maximum comes from saturating the bound: double T1. If you answered T1 itself, you dropped the factor of two that separates energy relaxation from pure dephasing.",
    nearMisses: [
      { value: 80, feedback: "80 μs is T₁ itself. The bound permits T₂ to reach twice that, when pure dephasing is entirely absent." },
      { value: 40, feedback: "40 μs halves T₁. The bound runs the other way: T₂ ≤ 2T₁, so the extreme case is above T₁, not below." },
    ],
  },
  hints: [
    { text: "The bound is T2 ≤ 2T1, and the question asks for the extreme case, where the bound is saturated with equality." },
    { text: "Double the given T1." },
  ],
  solution: {
    steps: [{ description: "T2_max = 2 × 80μs = 160μs." }],
    finalAnswer: "160 μs",
  },
  explanation: {
    correctIdea: "This directly applies the lesson's stated T2≤2T1 bound, matching its own worked example's numbers exactly.",
    whyCorrect: "Matches the lesson's explicit Worked Example.",
    whyWrong: ["Answering T1 itself (80) or an unrelated value confuses the bound's factor of 2, which comes from the physical asymmetry between energy relaxation and pure dephasing."],
  },
};
