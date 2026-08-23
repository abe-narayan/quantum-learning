import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const rydbergBlockadeMechanism: MultipleChoiceProblem = {
  meta: {
    slug: "rydberg-blockade-mechanism",
    title: "What Does Rydberg Blockade Actually Do?",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/neutral-atoms",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["neutral-atoms"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/neutral-atoms"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What does Rydberg blockade do, physically, between two nearby neutral atoms?",
    options: [
      { id: "a", text: "One atom's excitation to a Rydberg state shifts its neighbor's energy levels, preventing the neighbor from also being excited to that same state at the same time" },
      { id: "b", text: "It physically pushes the two atoms apart" },
      { id: "c", text: "It permanently entangles the atoms' optical tweezer traps" },
      { id: "d", text: "It prevents either atom from ever being excited" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Blockade is an energy-level effect, not a mechanical/spatial repulsion of the atoms themselves.",
      c: "The tweezer traps are for positioning the atoms; blockade is a distinct effect involving the atoms' internal (Rydberg) states, not their traps.",
      d: "Blockade prevents SIMULTANEOUS excitation of both neighbors, not excitation of either atom individually.",
    },
    defaultIncorrectFeedback: "Blockade works by one atom's Rydberg excitation shifting the neighbor's energy levels, conditionally preventing the neighbor from reaching the same excited state at the same time.",
  },
  hints: [
    { text: "A Rydberg state has a huge electron orbit, creating a strong interaction with nearby atoms." },
    { text: "This interaction shifts the neighboring atom's energy levels." },
    { text: "The shift prevents the neighbor from ALSO being excited to the Rydberg state at the same time — a conditional, not permanent, suppression." },
  ],
  solution: {
    steps: [{ description: "One atom's Rydberg excitation shifts its neighbor's energy levels via a strong interaction, conditionally blocking the neighbor's simultaneous excitation to the same state — this conditional blocking implements the entangling two-qubit gate." }],
    finalAnswer: "(a) One atom's excitation shifts its neighbor's levels, blocking simultaneous excitation",
  },
  explanation: {
    correctIdea: "This is the specific mechanism (an energy-level shift, not a mechanical or permanent effect) the lesson describes for neutral-atom two-qubit gates.",
    whyCorrect: "Matches the lesson's explicit Rydberg blockade description.",
    whyWrong: ["Confusing blockade with a mechanical or permanent effect misses that it's a conditional, energy-level-based interaction specific to the excited (Rydberg) state."],
  },
};
