import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const notEveryGateNeedsThreeRotations: MultipleChoiceProblem = {
  meta: {
    slug: "not-every-gate-needs-three-rotations",
    title: "How Many Native Rotations Does Z Actually Need?",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["gate-decomposition"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/gate-decomposition"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Per this lesson's verified decompositions, how many native rotations does the Z gate need?",
    options: [
      { id: "a", text: "One — Z = Rz(π) directly" },
      { id: "b", text: "Two, the same as H" },
      { id: "c", text: "Three, the general Euler upper bound" },
      { id: "d", text: "Zero — Z is already a native gate on every device" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "H needs two rotations (Ry(π/2)Rz(π)); Z needs only one — they're not the same case.",
      c: "Three is a general UPPER BOUND for an arbitrary unitary — many specific gates, including Z, need fewer.",
      d: "Z isn't assumed to be native — this lesson verifies it decomposes into exactly one native Rz rotation, not that it's already native by assumption.",
    },
    defaultIncorrectFeedback: "This lesson verifies Z = Rz(π) directly — a single native rotation, no composition needed.",
  },
  hints: [
    { text: "This lesson's verified list includes Z, S, and T as SINGLE-rotation cases." },
    { text: "Only H and X needed a composition of two rotations." },
    { text: "Z = Rz(π) directly." },
  ],
  solution: {
    steps: [{ description: "Z = Rz(π) — a single native rotation, verified directly, no composition needed." }],
    finalAnswer: "(a) One",
  },
  explanation: {
    correctIdea: "This directly tests the lesson's explicit Common Mistakes point that not every gate needs the full three-rotation Euler form.",
    whyCorrect: "Matches the lesson's own verified decomposition list.",
    whyWrong: ["Assuming every gate needs the general three-rotation upper bound overstates the actual, case-by-case verified cost for specific gates like Z, S, and T."],
  },
};
