import { createGrid } from "@/lib/quantum/wavefunction";
import { harmonicOscillatorPotential, harmonicOscillatorEnergyLevel } from "@/lib/quantum/potentials";
import { minimizeGaussianTrialEnergy } from "@/lib/quantum/approximationMethods";
import type { NumericProblem } from "@/lib/problems/types";

const grid = createGrid(1024, 0.05);
const V = harmonicOscillatorPotential(grid, 1, 1);
const { bestEnergy } = minimizeGaussianTrialEnergy(grid, V, { widthMin: 0.2, widthMax: 3, steps: 300 });
const exact = harmonicOscillatorEnergyLevel(0, 1);
const value = bestEnergy - exact;

export const variationalEnergyNeverBelowExact: NumericProblem = {
  meta: {
    slug: "variational-energy-never-below-exact",
    title: "The Optimized Trial Energy Minus the Exact Ground Energy",
    course: "approximation-methods",
    lesson: "quantum-mechanics/approximation-methods/the-variational-method",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["variational-method"],
    prerequisites: ["quantum-mechanics/approximation-methods/the-variational-method"],
  },
  question: {
    type: "numeric",
    prompt: "The optimized Gaussian trial energy for the harmonic oscillator is ≈0.50002; the exact ground energy is 0.5. What is (trial energy − exact energy), and what sign should it always have, per the variational theorem?",
    inputHint: "as a small decimal, to 5 decimal places (it can be very close to 0, but its sign matters)",
  },
  answer: {
    type: "numeric",
    value,
    // The value itself is ≈ +1.94e-5, so the tolerance must be smaller than
    // the value: a looser one (0.001 previously) accepted 0 and negative
    // submissions, contradicting this problem's whole point that the sign
    // can never be negative. 1e-5 accepts plausible roundings (1.9e-5,
    // 1.94e-5, 2e-5) while rejecting 0 and everything below it.
    tolerance: 0.00001,
    nearMisses: [
      { value: -0.00001938946280999332, tolerance: 0.00001, feedback: "The sign is inverted, and the sign is the entire point: the variational theorem forbids a trial energy below the exact ground-state energy, so this difference can never come out negative." },
      { value: 0.50002, tolerance: 0.000005, feedback: "That is the trial energy itself. The exact ground energy still has to be subtracted from it." },
      { value: 0, tolerance: 0.000005, feedback: "Zero would say the Gaussian trial reproduces the exact ground state. It comes very close, but the gap in the fifth decimal place is real, and its being strictly positive is what the theorem asserts." },
    ],
    incorrectFeedback: "Subtract: optimized trial energy minus exact ground energy. The variational theorem guarantees this is never negative.",
  },
  hints: [
    { text: "0.50002 - 0.5 = a very small positive number." },
    { text: "The variational theorem guarantees this difference is always ≥0, for any trial family." },
    { text: "Subtract the exact energy from the trial energy, keeping all five decimal places. The variational theorem tells you which sign to expect before you compute anything." },
  ],
  solution: {
    steps: [{ description: "0.50002 - 0.5 ≈ 0.00002, a tiny but non-negative number, consistent with the variational theorem." }],
    finalAnswer: "≈+0.00002 (small and positive)",
  },
  explanation: {
    correctIdea: "The sign (non-negative) is the theorem's actual content: the size of the gap depends on how good the trial family is, but the sign never flips.",
    whyCorrect: "Matches the engine's own minimizeGaussianTrialEnergy result compared directly to harmonicOscillatorEnergyLevel(0,1).",
    whyWrong: ["A negative answer here would indicate either a bug in the variational search or a violation of the variational theorem itself, worth flagging as a real error rather than an unusual result."],
  },
};
