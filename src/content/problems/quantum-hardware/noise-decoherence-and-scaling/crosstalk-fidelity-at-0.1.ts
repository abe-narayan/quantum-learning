import { StateVector } from "@/lib/quantum/state";
import { PAULI_X, rotationAboutAxis, applySingleQubitGate } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

const initial = StateVector.zero(2);
const ideal = applySingleQubitGate(initial, PAULI_X, 0);
const epsilon = 0.1;
let actual = applySingleQubitGate(initial, PAULI_X, 0);
actual = applySingleQubitGate(actual, rotationAboutAxis({ x: 1, y: 0, z: 0 }, epsilon), 1);
const value = ideal.innerProduct(actual).magnitudeSquared();

export const crosstalkFidelityAt01: NumericProblem = {
  meta: {
    slug: "crosstalk-fidelity-at-0.1",
    title: "Crosstalk Fidelity Loss for ε=0.1 Radians",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/crosstalk",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["crosstalk"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/crosstalk"],
  },
  question: {
    type: "numeric",
    prompt: "Using F(ε)=cos²(ε/2), what is the fidelity for ε=0.1 radians of crosstalk-induced spectator rotation?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.0001,
    incorrectFeedback: "Compute cos²(0.05).",
  },
  hints: [
    { text: "F(0.1) = cos²(0.1/2) = cos²(0.05)." },
    { text: "cos(0.05) ≈ 0.99875." },
    { text: "0.99875² ≈ 0.99750." },
  ],
  solution: {
    steps: [{ description: "F(0.1) = cos²(0.05) ≈ 0.9975." }],
    finalAnswer: "≈0.9975",
  },
  explanation: {
    correctIdea: "This extends the lesson's own ε=0.05 worked example to a doubled crosstalk strength, showing the fidelity loss more than doubles (not linearly) as ε grows.",
    whyCorrect: "Matches the engine's own applySingleQubitGate/rotationAboutAxis composition, verified to match cos²(ε/2) exactly.",
    whyWrong: ["Using cos²(ε) instead of cos²(ε/2) (forgetting the half-angle) gives a noticeably different, incorrect answer."],
  },
};
