import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { S_GATE, applySingleQubitGate } from "@/lib/quantum/gates";
import { stateToBlochVector } from "@/lib/quantum/bloch";
import type { NumericProblem } from "@/lib/problems/types";

const plusState = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
const afterS = applySingleQubitGate(plusState, S_GATE, 0);
const blochZ = stateToBlochVector(afterS).z;

export const blochZAfterSOnPlus: NumericProblem = {
  meta: {
    slug: "bloch-z-after-s-on-plus",
    title: "Bloch z-Coordinate After S|+⟩",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/quantum-gates",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["gates", "s-gate", "bloch-sphere"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/quantum-gates"],
  },
  question: {
    type: "numeric",
    prompt: "What is the Bloch-sphere $z$-coordinate of the state $S|+\\rangle$?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: blochZ,
    tolerance: 0.01,
    incorrectFeedback: "S rotates about the z-axis. Think about what that does to a point's latitude (its z-coordinate) versus its longitude.",
  },
  hints: [
    { text: "S rotates the Bloch vector by π/2 about the z-axis — the same axis z is measured along." },
    { text: "A rotation about the z-axis moves a point's longitude (φ) but never its latitude (θ), so z = cos(θ) can't change either." },
    { text: "|+⟩ starts on the equator, where z = 0." },
  ],
  solution: {
    steps: [
      { description: "$|+\\rangle$ sits on the equator of the Bloch sphere, at $z=0$." },
      { description: "S is a rotation about the $z$-axis, so it changes only $\\varphi$ (longitude), never $\\theta$ (latitude)." },
      { description: "Since $z=\\cos\\theta$ depends only on $\\theta$, and $\\theta$ is unchanged, $z$ stays exactly $0$ after applying S." },
    ],
    finalAnswer: `$z \\approx ${blochZ.toFixed(3)}$`,
  },
  explanation: {
    correctIdea: "Any rotation about the z-axis leaves the z-coordinate fixed, regardless of the rotation angle.",
    whyCorrect: "S|+⟩ = |+i⟩, which is still on the equator (z=0), just at a different longitude — exactly the geometric picture from Quantum Gates.",
    whyWrong: [
      "Computing the new amplitudes and mistakenly treating the imaginary coefficient itself as a z-coordinate — z comes from |α|²−|β|², not from reading off i directly.",
      "Assuming any gate applied to a non-pole state must move it off the equator; only Rx- or Ry-type rotations do that here.",
    ],
  },
};
