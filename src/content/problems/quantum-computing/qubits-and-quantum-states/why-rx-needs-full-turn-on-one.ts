import type { ConceptualProblem } from "@/lib/problems/types";

export const whyRxNeedsFullTurnOnOne: ConceptualProblem = {
  meta: {
    slug: "why-rx-needs-full-turn-on-one",
    title: "Why Rx Needs a Full 2π Turn on |1⟩",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/single-qubit-rotations",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["rotations", "rx", "bloch-sphere"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/single-qubit-rotations"],
  },
  question: {
    type: "conceptual",
    prompt:
      "|1⟩, the south pole, is fixed by Rz for any angle, but not by Rx. Explain geometrically why Rx(θ)|1⟩ needs a full θ = 2π before it returns to the same Bloch point as |1⟩ — why can't a smaller angle work?",
    placeholder: "Where does |1⟩ sit relative to the x-axis, and what shape does it trace under Rx?",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["not on the x-axis", "off the x-axis", "perpendicular to the x-axis", "not on the rotation axis"],
      ["full circle", "2π", "complete revolution", "full turn", "full rotation"],
    ],
    incorrectFeedback: "Start with where |1⟩ actually sits on the sphere relative to the x-axis, then think about what path it traces under a rotation about that axis.",
    partialFeedback: "Good start — now explain why a point off the rotation axis needs a complete revolution, not a partial one, to return to its start.",
  },
  hints: [
    { text: "|1⟩ sits at the south pole, on the z-axis, not the x-axis." },
    { text: "Rotating a point that isn't on the rotation axis traces a circle around that axis as θ increases." },
    { text: "A point moving around a circle only returns to its exact starting position after a full 2π sweep — any smaller angle lands somewhere else on the circle." },
  ],
  solution: {
    steps: [
      { description: "|1⟩ sits on the $z$-axis (the south pole), which is perpendicular to, not aligned with, the $x$-axis." },
      { description: "Under $R_x(\\theta)$, a point not on the $x$-axis traces a circle around that axis as $\\theta$ varies." },
      { description: "Like any point moving uniformly around a circle, it returns to its exact starting position only after a full $2\\pi$ sweep — no smaller positive angle brings it back." },
    ],
    finalAnswer: "θ = 2π is the smallest positive angle, because |1⟩ is off the x-axis and traces a full circle under Rx, only closing back on itself after a complete revolution.",
  },
  explanation: {
    correctIdea: "Only points sitting exactly on a rotation's own axis are fixed by that rotation; every other point traces a circle and needs a full 2π to return.",
    whyCorrect: "This is the same reasoning Rz's effect on θ used, applied to a different axis: |1⟩ is fixed by Rz (it's on the z-axis) but not by Rx (it isn't on the x-axis).",
    whyWrong: [
      "Assuming any rotation returns a point to itself after π, by analogy with X, Y, Z each squaring to the identity — that's a fact about specific π-rotations, not about smaller sweep angles in general.",
      "Confusing 'fixed by the rotation' with 'moved and eventually returning' — |1⟩ is the second case for Rx, not the first.",
    ],
  },
};
