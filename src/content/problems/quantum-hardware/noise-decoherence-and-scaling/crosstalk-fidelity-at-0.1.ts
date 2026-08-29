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
    incorrectFeedback: "Check the half-angle: the cosine takes ε/2, not ε. Forgetting the half makes the fidelity loss look about four times larger than it should.",
    nearMisses: [
      { value: Math.cos(0.1) ** 2, tolerance: 0.0005, feedback: "That is cos²(ε) without the half-angle. The spectator rotation by ε moves the Bloch vector by ε, and the overlap depends on half that angle." },
      { value: Math.cos(0.05), tolerance: 0.0002, feedback: "That is the overlap amplitude cos(ε/2). Fidelity is its square." },
      { value: 0.99938, tolerance: 0.0002, feedback: "That is the lesson's own ε = 0.05 answer. Doubling ε roughly quadruples the fidelity loss, so this ε = 0.1 case sits noticeably lower." },
    ],
  },
  hints: [
    { text: "One substitution and one squaring. The only trap is the half-angle: the formula divides ε by two before taking the cosine." },
    { text: "F = cos²(ε/2) with ε = 0.1, so evaluate cos(0.05) first." },
    { text: "Square the cosine you found. The result should sit just below one, since a small spectator rotation loses only a little fidelity." },
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
