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
    { text: "Central means the potential takes the same value everywhere on a sphere about the origin, whatever the direction." },
    { text: "Pick two points at the same distance from the origin but in different directions, such as (1,0,0) and (0,1,0), and evaluate each candidate at both." },
    { text: "Any expression that can be rewritten in terms of x²+y²+z² alone passes; anything that distinguishes a direction fails." },
  ],
  solution: {
    steps: [{ description: "x²+y²+z² is r², a function of distance alone, so it takes the same value at every point of a sphere about the origin. Each of the others gives different values at (1,0,0) and (0,1,0), which are the same distance out, so none of them is rotationally invariant." }],
    finalAnswer: "V = x²+y²+z², which is r² and so depends on distance alone.",
  },
  explanation: {
    correctIdea: "A potential is central when it can be written in terms of x²+y²+z² alone, so that no direction is singled out.",
    whyCorrect: "Rotating the axes leaves x²+y²+z² unchanged, which is the defining property.",
    whyWrong: [
      { optionId: "b", text: "Singles out the x-axis. It gives 1 at (1,0,0) and 0 at (0,1,0), both at distance 1." },
      { optionId: "c", text: "Depends on direction in the strongest way here: it changes sign under flipping one coordinate, and vanishes on all three coordinate planes." },
      { optionId: "d", text: "Is symmetric about the z-axis but not about the origin. It gives 1 at (1,0,0) and 0 at (0,0,1)." },
    ],
  },
};
