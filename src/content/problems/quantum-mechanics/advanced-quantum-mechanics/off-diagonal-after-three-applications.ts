import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { pureStateDensityMatrix } from "@/lib/quantum/densityMatrix";
import { dephasingChannel, applyChannelRepeatedly } from "@/lib/quantum/openSystems";
import type { NumericProblem } from "@/lib/problems/types";

const plus = new StateVector([new Complex(1 / Math.sqrt(2)), new Complex(1 / Math.sqrt(2))]);
const rho0 = pureStateDensityMatrix(plus);
const rho3 = applyChannelRepeatedly(rho0, dephasingChannel(0.3), 3);
const value = rho3.get(0, 1).magnitude();

export const offDiagonalAfterThreeApplications: NumericProblem = {
  meta: {
    slug: "off-diagonal-after-three-applications",
    title: "Off-Diagonal Magnitude After 3 Dephasing Applications",
    course: "advanced-quantum-mechanics",
    lesson: "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["decoherence"],
    prerequisites: ["quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition"],
  },
  question: {
    type: "numeric",
    prompt: "Starting from |+⟩ (off-diagonal magnitude 0.5), and using the fact that each dephasing application (λ=0.3) multiplies the off-diagonal by (1-λ)=0.7, what is the off-diagonal magnitude after 3 applications?",
    inputHint: "as a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "The decay is multiplicative, not additive: each application multiplies the off-diagonal by 0.7. Apply that factor three times to the starting 0.5 rather than subtracting anything.",
    nearMisses: [
      { value: 0.343, tolerance: 0.002, feedback: "0.343 is 0.7³, the decay factor alone. It still has to multiply the starting off-diagonal magnitude of 0.5." },
      { value: 0.35, tolerance: 0.002, feedback: "0.35 is the result after one application. Two more remain." },
      { value: 0.5 - 3 * 0.3 * 0.5, tolerance: 0.002, feedback: "That subtracts a fixed slice each round. The channel scales the coherence by 0.7 each time, so the decay is geometric and never reaches zero in finitely many steps." },
    ],
  },
  hints: [
    { text: "Each application multiplies the off-diagonal by the same factor, 0.7. Three applications compound geometrically." },
    { text: "0.5 × 0.7 × 0.7 × 0.7 = 0.5 × 0.343." },
    { text: "Multiply 0.343 by the starting magnitude 0.5." },
  ],
  solution: {
    steps: [{ description: "0.5 × 0.7³ = 0.5 × 0.343 = 0.1715." }],
    finalAnswer: "≈0.1715",
  },
  explanation: {
    correctIdea: "This extends the lesson's own table (which lists n=1,2,5,10,20) to a value not directly shown, using the geometric-decay pattern.",
    whyCorrect: "Matches applyChannelRepeatedly(rho0, dephasingChannel(0.3), 3) computed directly from the engine.",
    whyWrong: ["Using an additive decay (0.5-3×something) instead of the correct multiplicative/geometric decay would give a substantially different, incorrect answer."],
  },
};
