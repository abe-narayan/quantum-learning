import { harmonicOscillatorEnergyLevels, positionOperator } from "@/lib/quantum/harmonicOscillator";
import { firstOrderEnergyCorrection } from "@/lib/quantum/approximationMethods";
import type { NumericProblem } from "@/lib/problems/types";

const dim = 8;
const H0diag = harmonicOscillatorEnergyLevels(dim, 1);
const x = positionOperator(dim, 1, 1);
const x4 = x.mul(x).mul(x).mul(x);
const lambda = 0.02;
const Hprime = x4.scale(lambda);
const value = firstOrderEnergyCorrection(H0diag, Hprime, 0);

export const anharmonicFirstOrderShift: NumericProblem = {
  meta: {
    slug: "anharmonic-first-order-shift",
    title: "First-Order Ground-State Shift for λ=0.02",
    course: "approximation-methods",
    lesson: "quantum-mechanics/approximation-methods/time-independent-perturbation-theory",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["perturbation-theory"],
    prerequisites: ["quantum-mechanics/approximation-methods/time-independent-perturbation-theory"],
  },
  question: {
    type: "numeric",
    prompt: "For H'=λx⁴ with λ=0.02 on the harmonic oscillator (m=ω=1), using E₀^(1)=λ⟨0|x⁴|0⟩=3λ/4, what is E₀^(1)?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.0005,
    incorrectFeedback: "The Gaussian moment matters here: ⟨0|x⁴|0⟩ is 3/4, not the 1/2 that belongs to x². Multiply that moment by λ.",
    nearMisses: [
      { value: lambda * 0.5, tolerance: 0.0002, feedback: "That uses ⟨0|x²|0⟩ = 1/2. The perturbation is x⁴, whose ground-state moment is 3⟨x²⟩² = 3/4." },
      { value: 0.75, tolerance: 0.002, feedback: "0.75 is the moment ⟨0|x⁴|0⟩ on its own. The energy shift multiplies it by the coupling λ." },
      { value: 0.0075, tolerance: 0.0002, feedback: "0.0075 is the worked example's answer at λ = 0.01. A first-order shift is linear in λ, so doubling the coupling doubles the shift." },
    ],
  },
  hints: [
    { text: "⟨0|x⁴|0⟩=3/4 exactly for the harmonic oscillator ground state." },
    { text: "E₀^(1)=λ×(3/4)." },
    { text: "Multiply 0.02 by 0.75." },
  ],
  solution: {
    steps: [{ description: "E₀^(1) = λ⟨0|x⁴|0⟩ = 0.02×0.75 = 0.015." }],
    finalAnswer: "0.015",
  },
  explanation: {
    correctIdea: "This scales linearly with λ from the worked example's λ=0.01 case (0.0075), confirming the formula's linearity in the perturbation strength at first order.",
    whyCorrect: "Matches firstOrderEnergyCorrection computed directly from the engine's positionOperator-built x⁴ matrix.",
    whyWrong: ["Using ⟨0|x²|0⟩=1/2 instead of ⟨0|x⁴|0⟩=3/4 is a common mix-up between the two different moments of the Gaussian ground state."],
  },
};
