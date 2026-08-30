import { blochStateFromAngles, stateToBlochVector } from "@/lib/quantum/bloch";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const plusState = blochStateFromAngles({ theta: Math.PI / 2, phi: 0 });
const plusBlochVector = stateToBlochVector(plusState);

export const blochPoint100State: MultipleChoiceProblem = {
  meta: {
    slug: "bloch-point-1-0-0-state",
    title: "What State Sits at Bloch Point (1, 0, 0)?",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/the-bloch-sphere",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["bloch-sphere", "canonical-form"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/the-bloch-sphere"],
  },
  question: {
    type: "multiple-choice",
    prompt: "A state sits at Bloch point $(x,y,z) = (1, 0, 0)$, on the equator. Which state is it?",
    options: [
      { id: "a", text: "$|{+}\\rangle = \\frac{1}{\\sqrt2}(|0\\rangle+|1\\rangle)$" },
      { id: "b", text: "$|0\\rangle$" },
      { id: "c", text: "$|{-}\\rangle = \\frac{1}{\\sqrt2}(|0\\rangle-|1\\rangle)$" },
      { id: "d", text: "$\\frac{1}{\\sqrt2}(|0\\rangle+i|1\\rangle)$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "|0⟩ sits at the north pole, (0,0,1), not on the equator at all.",
      c: "|−⟩ sits at (−1,0,0): same latitude, opposite side of the equator (φ=π instead of φ=0).",
      d: "This state sits at (0,1,0), on the equator but 90° around from (1,0,0).",
    },
    defaultIncorrectFeedback: "z=0 means θ=π/2 (the equator). x=1 (with y=0) pins down φ. Which preset state has these angles?",
  },
  hints: [
    { text: "z=0 means θ=π/2: the point is on the equator." },
    { text: "On the equator, x=cos(φ) and y=sin(φ). x=1, y=0 forces φ=0." },
    { text: "θ=π/2, φ=0 in the canonical form cos(θ/2)|0⟩+e^{iφ}sin(θ/2)|1⟩ gives equal real positive coefficients." },
  ],
  solution: {
    steps: [
      { description: "z=0 forces $\\theta=\\pi/2$ (the equator)." },
      { description: "x=1, y=0 on the equator forces $\\varphi=0$ (since $x=\\cos\\varphi$, $y=\\sin\\varphi$ there)." },
      { description: "Substitute into the canonical form.", latex: "\\cos\\!\\left(\\frac{\\pi}{4}\\right)|0\\rangle + e^{i0}\\sin\\!\\left(\\frac{\\pi}{4}\\right)|1\\rangle = \\frac{1}{\\sqrt2}|0\\rangle+\\frac{1}{\\sqrt2}|1\\rangle" },
    ],
    finalAnswer: "$|{+}\\rangle$",
  },
  explanation: {
    correctIdea: "Each point on the Bloch sphere corresponds to exactly one state; (1,0,0) is |+⟩'s point specifically, not any other equatorial state.",
    whyCorrect: `Directly confirmed via this platform's engine: blochStateFromAngles({theta: π/2, phi: 0}) gives amplitudes (${formatAmplitudeLatex(plusState.amplitudes[0])}, ${formatAmplitudeLatex(plusState.amplitudes[1])}), and stateToBlochVector on that state returns (${plusBlochVector.x.toFixed(2)}, ${plusBlochVector.y.toFixed(2)}, ${plusBlochVector.z.toFixed(2)}), matching (1,0,0).`,
    whyWrong: [
      { optionId: "b", text: "Sits at the north pole, (0,0,1). The prompt already places the state on the equator, where z=0." },
      { optionId: "c", text: "Shares the equator but differs in φ by π, landing at (−1,0,0), the opposite side of the sphere." },
      { optionId: "d", text: "Sits at (0,1,0): also on the equator, a quarter turn round from the point asked about." },
    ],
  },
};
