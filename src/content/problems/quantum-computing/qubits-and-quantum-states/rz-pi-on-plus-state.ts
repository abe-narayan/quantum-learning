import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { rotationZ, applySingleQubitGate } from "@/lib/quantum/gates";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const plusState = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
const result = applySingleQubitGate(plusState, rotationZ(Math.PI), 0);

function ketLatex(state: StateVector): string {
  const terms = state.amplitudes
    .map((amplitude, index) => ({ amplitude, label: state.basisLabel(index) }))
    .filter(({ amplitude }) => amplitude.magnitudeSquared() > 1e-9);
  return terms.map(({ amplitude, label }) => `(${formatAmplitudeLatex(amplitude)})|${label}\\rangle`).join(" + ");
}

export const rzPiOnPlusState: MultipleChoiceProblem = {
  meta: {
    slug: "rz-pi-on-plus-state",
    title: "Rz(π) Applied to |+⟩",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/single-qubit-rotations",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["rotations", "rz"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/single-qubit-rotations"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Apply $R_z(\\pi)$ to $|+\\rangle$. Which named state results (up to global phase)?",
    options: [
      { id: "a", text: "$|{-}\\rangle$" },
      { id: "b", text: "$|{+i}\\rangle$" },
      { id: "c", text: "$|0\\rangle$" },
      { id: "d", text: "$|{-i}\\rangle$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "That's the result of $R_z(\\pi/2)$ (worked out in the lesson's own worked example), not $R_z(\\pi)$ — you've applied half the rotation angle asked for.",
      c: "$R_z$ never changes $\\theta$, so the result must stay on the equator like $|+\\rangle$ did — it can't land on a pole.",
      d: "That would correspond to adding $3\\pi/2$ (or $-\\pi/2$) to $\\varphi$, not $\\pi$.",
    },
    defaultIncorrectFeedback: "Rz(θ) adds θ to φ and leaves θ (the latitude) fixed. |+⟩ starts at φ=0; add π to it and identify the resulting equatorial state.",
  },
  hints: [
    { text: "Rz(θ) leaves the Bloch θ (latitude) fixed and adds θ (the rotation angle) to φ (longitude)." },
    { text: "|+⟩ has φ = 0. Adding π gives φ = π, still on the equator." },
    { text: "Which of the equatorial states (|+⟩, |−⟩, |+i⟩, |−i⟩) sits at φ = π?" },
  ],
  solution: {
    steps: [
      { description: "$|+\\rangle$ has $\\theta=\\pi/2$, $\\varphi=0$." },
      { description: "$R_z(\\pi)$ adds $\\pi$ to $\\varphi$, giving $\\theta=\\pi/2$, $\\varphi=\\pi$ — exactly the coordinates of $|-\\rangle$." },
      { description: `Confirmed directly by applying the gate: the result is $${ketLatex(result)}$.` },
    ],
    finalAnswer: "$|-\\rangle$",
  },
  explanation: {
    correctIdea: "Rz's entire effect is φ → φ + θ; tracking φ alone is enough to identify the resulting named state on the equator.",
    whyCorrect: "Starting at φ=0 and adding π lands exactly at φ=π, which is |−⟩'s defining longitude.",
    whyWrong: [
      "Applying only half the requested rotation angle (a common slip, since π/2 is a more familiar special case from the worked example) gives |+i⟩ instead.",
      "Forgetting that Rz can never move a state off the equator once it started there.",
    ],
  },
};
