import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const surfaceCodeDistanceScaling: MultipleChoiceProblem = {
  meta: {
    slug: "surface-code-distance-scaling",
    title: "How Does Reaching a Larger Distance Change the Construction?",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["surface-codes"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction"],
  },
  question: {
    type: "multiple-choice",
    prompt: "To reach a higher code distance, what does a surface code require, compared to what the Shor-code family requires?",
    options: [
      { id: "a", text: "Surface code: a bigger grid using the same repeated stabilizer pattern; Shor-style: an entirely new, larger hand-designed construction" },
      { id: "b", text: "Both require an entirely new hand-designed construction" },
      { id: "c", text: "Both simply use a bigger version of the same repeated pattern" },
      { id: "d", text: "Neither can reach a higher distance than 3" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This misses the surface code's key structural advantage — a bigger grid reuses the identical local stabilizer pattern.",
      c: "The Shor-code family doesn't have a simple 'bigger version' — reaching higher distance needs genuinely new code design.",
      d: "Both families can reach arbitrarily higher distance — surface codes by growing the grid, Shor-style codes via new (more complex) constructions.",
    },
    defaultIncorrectFeedback: "Recall the lesson's explicit contrast between the two families' approaches to increasing distance.",
  },
  hints: [
    { text: "A surface code's stabilizer pattern is identical at every grid size — only the grid gets bigger." },
    { text: "The Shor code's 9-qubit structure doesn't have an obvious 'bigger version' at the same design." },
    { text: "This is exactly the lesson's stated advantage of surface codes for scaling." },
  ],
  solution: {
    steps: [{ description: "Surface codes scale by repeating an identical local pattern on a bigger grid; Shor-style codes need a new, larger hand-designed construction for higher distance." }],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea: "This scaling difference, not raw qubit count at any one distance, is the surface code's real structural advantage.",
    whyCorrect: "Matches the lesson's explicit distinction directly.",
    whyWrong: ["Options b, c, and d each misstate the actual difference in how each code family scales to higher distance."],
  },
};
