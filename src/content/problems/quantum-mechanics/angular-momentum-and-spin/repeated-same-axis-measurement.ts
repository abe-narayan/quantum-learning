import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const repeatedSameAxisMeasurement: MultipleChoiceProblem = {
  meta: {
    slug: "repeated-same-axis-measurement",
    title: "Measuring the Same Axis Twice in a Row",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["stern-gerlach"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment"],
  },
  question: {
    type: "multiple-choice",
    prompt: "If a z-oriented SG apparatus gives 'up', and a second z-oriented apparatus immediately follows (same axis, nothing in between), what is P(up again)?",
    options: [
      { id: "a", text: "1 (certain)" },
      { id: "b", text: "0.5" },
      { id: "c", text: "0" },
      { id: "d", text: "Between 0.5 and 1, depending on how far apart the two apparatuses sit" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "0.5 would apply if an incompatible-axis measurement occurred in between. Here there is no intervening measurement at all.",
      c: "This would mean measuring twice always flips the outcome, which contradicts the state being an eigenstate after the first measurement.",
      d: "This imagines the state drifting back toward random while it flies. An Sz eigenstate is stationary under the free evolution between the magnets; nothing in the idealized setup rotates it, so the separation does not enter.",
    },
    defaultIncorrectFeedback: "Write down the state the atom is in after the first measurement, then ask what measuring that same observable on that state gives.",
  },
  hints: [
    { text: "Start by naming the state the atom is in the instant after the first apparatus reports 'up'." },
    { text: "That state is an eigenstate of the observable the second apparatus measures." },
    { text: "The Born rule on an eigenstate gives its own eigenvalue back, with what probability?" },
  ],
  solution: {
    steps: [{ description: "The first measurement collapses the atom into |↑⟩, an Sz eigenstate with eigenvalue +ħ/2. Nothing between the two magnets rotates that state, so the second Sz measurement acts on an eigenstate of the observable it measures and returns 'up' with probability 1." }],
    finalAnswer: "P = 1: the atom is already in the Sz eigenstate the second apparatus measures.",
  },
  explanation: {
    correctIdea: "Repeating a measurement on the state it just produced returns the same outcome, because collapse left the system in an eigenstate of that observable.",
    whyCorrect: "Contrast this with the x-then-z sequence: it is the intervening incompatible measurement, not the passage of time, that erases the first result.",
    whyWrong: [
      { optionId: "b", text: "Imports the answer for the x-then-z sequence, where an incompatible measurement sits in between. Here nothing does." },
      { optionId: "c", text: "Would mean a repeated measurement always flips its own result, which contradicts the state being an eigenstate." },
      { optionId: "d", text: "Has the state relaxing in flight. An Sz eigenstate is stationary under the free evolution between the magnets." },
    ],
  },
};
