import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { pureStateDensityMatrix, purity } from "@/lib/quantum/densityMatrix";
import { dephasingChannel, applyChannelRepeatedly } from "@/lib/quantum/openSystems";
import type { NumericProblem } from "@/lib/problems/types";

const plus = new StateVector([new Complex(1 / Math.sqrt(2)), new Complex(1 / Math.sqrt(2))]);
const rho0 = pureStateDensityMatrix(plus);
const rho50 = applyChannelRepeatedly(rho0, dephasingChannel(0.3), 50);
const value = purity(rho50);

export const longRunPurityLimit: NumericProblem = {
  meta: {
    slug: "long-run-purity-limit",
    title: "The Long-Run Purity Limit Under Repeated Dephasing",
    course: "advanced-quantum-mechanics",
    lesson: "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["decoherence"],
    prerequisites: ["quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition"],
  },
  question: {
    type: "numeric",
    prompt: "As the number of dephasing applications grows very large (e.g. 50), what value does |+⟩'s purity approach?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "Repeated dephasing destroys the coherence but preserves the populations, leaving the maximally mixed diagonal state. Compute Tr(ρ²) for that state: square each of its two equal eigenvalues and add.",
    nearMisses: [
      { value: 1, feedback: "Purity 1 means the state stayed pure. Dephasing removes coherence, so the limit is mixed, not pure." },
      { value: 0, feedback: "Purity has a floor of 1/d, which is 1/2 for a qubit. No density matrix reaches 0." },
      { value: 0.25, feedback: "0.25 is one squared eigenvalue. Purity sums the squares of all of them, and there are two equal populations here." },
    ],
  },
  hints: [
    { text: "Each dephasing application shrinks the off-diagonal coherence, so ask what the density matrix looks like once the coherence is entirely gone." },
    { text: "What survives is an even diagonal: equal populations in both basis states. That is the maximally mixed single-qubit state." },
    { text: "Purity is Tr(ρ²), the sum of squared eigenvalues. Square the two equal populations and add them." },
  ],
  solution: {
    steps: [{ description: "As applications grow, the off-diagonal vanishes, leaving diag(0.5,0.5), the maximally mixed state, with purity 0.5² +0.5² = 0.5." }],
    finalAnswer: "0.5",
  },
  explanation: {
    correctIdea: "This matches the lesson's table exactly, and connects the long-run limit to the general definition of purity for a maximally mixed state.",
    whyCorrect: "Matches applyChannelRepeatedly's purity output at large n, converging to exactly 0.5.",
    whyWrong: ["Answering 0 or 1 confuses purity's scale: 1 is a pure state, 0.5 is single-qubit maximally mixed, and 0 is not achievable for any valid density matrix."],
  },
};
