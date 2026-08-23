import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { rotationZ, applySingleQubitGate } from "@/lib/quantum/gates";
import { stateToBlochAngles } from "@/lib/quantum/bloch";
import type { NumericProblem } from "@/lib/problems/types";

const plusState = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
const rotated = applySingleQubitGate(plusState, rotationZ(1.3), 0);
const theta = stateToBlochAngles(rotated).theta;

export const thetaPreservedUnderRz: NumericProblem = {
  meta: {
    slug: "theta-preserved-under-rz",
    title: "θ Preserved Under Rz",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/single-qubit-rotations",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["rotations", "rz", "bloch-sphere"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/single-qubit-rotations"],
  },
  question: {
    type: "numeric",
    prompt: "Starting from $|+\\rangle$ (where $\\theta=\\pi/2$), apply $R_z(1.3)$. What is the resulting Bloch angle $\\theta$, in radians?",
    inputHint: "as a decimal, in radians",
  },
  answer: {
    type: "numeric",
    value: theta,
    tolerance: 0.02,
    incorrectFeedback: "Recall which coordinate Rz changes and which one it leaves alone — the lesson states this as a directly testable, falsifiable claim.",
  },
  hints: [
    { text: "Rz(θ) is a rotation about the z-axis." },
    { text: "A rotation about the z-axis changes longitude (φ) but never latitude (θ)." },
    { text: "|+⟩ starts at θ = π/2. What does Rz(1.3) do to that value?" },
  ],
  solution: {
    steps: [
      { description: "$|+\\rangle$ has Bloch angle $\\theta=\\pi/2$." },
      { description: "$R_z(\\theta)$ changes only $\\varphi$, never $\\theta$, regardless of the rotation angle used." },
      { description: "So after $R_z(1.3)$, $\\theta$ is still exactly $\\pi/2$, no matter that the applied angle (1.3) has nothing to do with $\\theta$ itself." },
    ],
    finalAnswer: `$\\theta \\approx ${theta.toFixed(3)}$ (i.e. $\\pi/2$)`,
  },
  explanation: {
    correctIdea: "Rz rotates about the axis θ is measured from, so it structurally cannot change θ, for any rotation angle.",
    whyCorrect: "This is confirmed directly: applying Rz(1.3), an angle with no special relationship to π/2, still leaves θ completely unchanged.",
    whyWrong: [
      "Assuming the applied angle (1.3) somehow adds to or replaces θ — that's what Rz does to φ, not θ.",
      "Assuming any rotation changes both θ and φ — true for Rx and Ry, but specifically false for Rz.",
    ],
  },
};
