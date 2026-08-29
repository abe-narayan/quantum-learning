import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const allowedMValuesForJThreeHalves: MultipleChoiceProblem = {
  meta: {
    slug: "allowed-m-values-for-j-three-halves",
    title: "Allowed m Values for j=3/2",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/ladder-operators-and-the-angular-momentum-spectrum",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["angular-momentum", "ladder-operators"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/ladder-operators-and-the-angular-momentum-spectrum"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What are the allowed values of m for j=3/2?",
    options: [
      { id: "a", text: "3/2, 1/2, −1/2, −3/2" },
      { id: "b", text: "3/2, 1, 1/2, 0, −1/2, −1, −3/2" },
      { id: "c", text: "1, 0, −1" },
      { id: "d", text: "3/2 and −3/2 only" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This steps down by 1/2 rather than by 1, which gives 7 rungs instead of 4. The ladder operators raise and lower m by one unit of ħ, never half a unit.",
      c: "This is the m-list for j=1. Half-integer j gives half-integer m all the way down, never passing through 0.",
      d: "This keeps only the extreme rungs, as if m were a two-valued spin label. The ladder fills in every rung between them.",
    },
    defaultIncorrectFeedback: "Start at m = j = 3/2 and step down by 1 until you reach m = −j = −3/2, then count the rungs.",
  },
  hints: [
    { text: "The ladder operators J± change m by one unit, and the ladder runs from m = j down to m = −j." },
    { text: "Take j = 3/2 as the top rung and subtract 1 repeatedly until you reach the bottom rung." },
    { text: "Check your list against the count 2j+1, and check that no rung is an integer." },
  ],
  solution: {
    steps: [{ description: "Starting at m = 3/2 and stepping down by 1 gives 3/2, 1/2, −1/2, −3/2, stopping at m = −j. That is 2j+1 = 4 rungs, all half-integer, as half-integer j requires." }],
    finalAnswer: "m = 3/2, 1/2, −1/2, −3/2: four rungs, stepping by 1 from j down to −j.",
  },
  explanation: {
    correctIdea: "The step between rungs is always 1, whether j is an integer or a half-integer. Half-integer j simply means every rung is half-integer too.",
    whyCorrect: "Matches angularMomentumZ(1.5), whose diagonal holds these four eigenvalues.",
    whyWrong: [
      { optionId: "b", text: "Steps by 1/2 and gets 7 rungs. J± move m by a full unit." },
      { optionId: "c", text: "Gives the j = 1 ladder. Half-integer j never passes through m = 0." },
      { optionId: "d", text: "Keeps only the end rungs, treating m as a two-valued label rather than a ladder." },
    ],
  },
};
