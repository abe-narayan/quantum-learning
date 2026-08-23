import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const whichPotentialsAreCentral: MultipleChoiceProblem = {
  meta: {
    slug: "which-potentials-are-central",
    title: "Which of These Potentials Is Central?",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/central-potentials",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["central-potential"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/central-potentials"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which of the following is a central potential, V(r), depending only on distance from the origin?",
    options: [
      { id: "a", text: "V = x² + y² + z²  (3D harmonic oscillator)" },
      { id: "b", text: "V = x²  (harmonic oscillator along one axis only)" },
      { id: "c", text: "V = xyz" },
      { id: "d", text: "V = x² + y²  (no z-dependence)" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This depends only on x, not on the full distance r=√(x²+y²+z²) — rotating about the y or z axis changes it.",
      c: "This is not even invariant under reflecting a single coordinate, let alone full rotations — far from central.",
      d: "This is cylindrically symmetric (invariant under rotations about z only), not fully spherically symmetric — not central.",
    },
    defaultIncorrectFeedback: "A central potential must be expressible as a function of r=√(x²+y²+z²) alone, unchanged by any rotation about the origin.",
  },
  hints: [
    { text: "Central means: depends only on r=√(x²+y²+z²), the same value for any direction at a fixed distance." },
    { text: "x²+y²+z² is literally r² — a function of r alone." },
    { text: "The others depend on direction, not just distance." },
  ],
  solution: {
    steps: [{ description: "x²+y²+z²=r² is manifestly a function of r alone, so V=r² is central; none of the others are invariant under a general rotation." }],
    finalAnswer: "(a) V = x²+y²+z²",
  },
  explanation: {
    correctIdea: "Central potentials are exactly those built from x²+y²+z² (or its square root), never from an individual Cartesian component alone.",
    whyCorrect: "Rotating the coordinate axes leaves x²+y²+z² completely unchanged, which is the defining property of a central potential.",
    whyWrong: ["Options with a single bare coordinate or a product of coordinates all fail to be rotationally invariant."],
  },
};
