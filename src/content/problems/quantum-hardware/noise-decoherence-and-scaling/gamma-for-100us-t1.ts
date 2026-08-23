import { decayProbabilityForTimestep } from "@/lib/quantum/openSystems";
import type { NumericProblem } from "@/lib/problems/types";

const value = decayProbabilityForTimestep(100, 1);

export const gammaFor100UsT1: NumericProblem = {
  meta: {
    slug: "gamma-for-100us-t1",
    title: "Per-Step Damping Probability for T1=100μs, dt=1μs",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["t1-t2"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence"],
  },
  question: {
    type: "numeric",
    prompt: "For T1=100μs and a timestep dt=1μs, what per-step damping probability γ=1-e^(-dt/T1) does decayProbabilityForTimestep give?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.0001,
    incorrectFeedback: "Compute 1 - e^(-1/100) = 1 - e^(-0.01).",
  },
  hints: [
    { text: "γ = 1 - e^(-dt/T1) = 1 - e^(-1/100)." },
    { text: "e^(-0.01) ≈ 0.99005." },
    { text: "γ ≈ 1 - 0.99005 = 0.00995." },
  ],
  solution: {
    steps: [{ description: "γ = 1 - e^(-0.01) ≈ 0.00995." }],
    finalAnswer: "≈0.00995",
  },
  explanation: {
    correctIdea: "This is a small per-step probability, as expected when the timestep is much shorter than T1 — most steps leave the qubit unchanged, with only a small chance of decay each step.",
    whyCorrect: "Matches decayProbabilityForTimestep(100,1) computed directly from the engine.",
    whyWrong: ["Computing dt/T1 directly as the answer (0.01) instead of 1-e^(-dt/T1) misses the exponential form of the formula."],
  },
};
