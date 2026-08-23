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
      { id: "b", text: "3/2, 1, 1/2, 0" },
      { id: "c", text: "1, 0, −1" },
      { id: "d", text: "3/2 only" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "m must step by exactly 1 from the top rung down — this list has an inconsistent, non-integer-step pattern.",
      c: "This is the m-list for j=1, not j=3/2.",
      d: "There are 2j+1=4 allowed m values for j=3/2, not just the top one.",
    },
    defaultIncorrectFeedback: "Start at m=j=3/2 and step down by exactly 1 until reaching m=−j=−3/2.",
  },
  hints: [
    { text: "m ranges from −j to +j in steps of exactly 1." },
    { text: "For j=3/2, start at 3/2 and subtract 1 repeatedly." },
    { text: "3/2, 1/2, −1/2, −3/2 — exactly 2j+1=4 values." },
  ],
  solution: {
    steps: [{ description: "m = 3/2, 1/2, −1/2, −3/2 — four values, stepping by 1 from j down to −j." }],
    finalAnswer: "3/2, 1/2, −1/2, −3/2",
  },
  explanation: {
    correctIdea: "The integer-step-spacing rule applies regardless of whether j itself is an integer or half-integer.",
    whyCorrect: "This matches angularMomentumZ(1.5)'s actual 4 diagonal eigenvalues exactly.",
    whyWrong: ["Any list with the wrong step size or wrong count of values misapplies the −j-to-j-in-steps-of-1 rule."],
  },
};
