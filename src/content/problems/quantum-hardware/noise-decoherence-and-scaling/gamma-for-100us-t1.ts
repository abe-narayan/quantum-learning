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
    incorrectFeedback: "If your number came out near 0.99, you computed the survival probability e^(-dt/T1) rather than the decay probability, which is 1 minus that. Otherwise, check the exponent: it is -dt/T1 = -1/100.",
    nearMisses: [
      { value: Math.exp(-0.01), tolerance: 0.0002, feedback: "That is the survival probability. The decay probability is what is left over: 1 minus it." },
    ],
  },
  hints: [
    { text: "You are asked for the probability that the qubit decays during a single timestep. Think in terms of survival: over one step the excited population survives by an exponential factor set by how the step compares to T1, and decay is whatever survival leaves behind." },
    { text: "γ = 1 - e^(-dt/T1). With dt = 1 μs and T1 = 100 μs, the exponent is -1/100." },
    { text: "Evaluate 1 - e^(-1/100). Useful check: for a small exponent x, 1 - e^(-x) is just under x, so your answer should land slightly below the ratio dt/T1." },
  ],
  solution: {
    steps: [
      { description: "dt/T1 = 1/100 = 0.01." },
      { description: "γ = 1 - e^(-0.01) ≈ 1 - 0.990050 = 0.009950." },
    ],
    finalAnswer: "≈0.00995",
  },
  explanation: {
    correctIdea: "This is a small per-step probability, as expected when the timestep is much shorter than T1: most steps leave the qubit unchanged, with only a small chance of decay each step.",
    whyCorrect: "Matches decayProbabilityForTimestep(100,1) computed directly from the engine.",
    whyWrong: ["Computing dt/T1 directly as the answer (0.01) instead of 1-e^(-dt/T1) misses the exponential form of the formula."],
  },
};
