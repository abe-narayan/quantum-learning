import type { ConceptualProblem } from "@/lib/problems/types";

export const synthesisNotAStrictGeneralization: ConceptualProblem = {
  meta: {
    slug: "synthesis-not-a-strict-generalization",
    title: "Synthesis: The One Genuinely New Result",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["synthesis", "energy-time-uncertainty"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Using the course's recap table, identify which lesson's result was not a strict generalization of an already-proven special case, and explain in one sentence why it's different in character from the others.",
    placeholder: "Identify the lesson and explain why it differs...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["energy-time", "energy time uncertainty"],
        missingFeedback:
          "Name the lesson. The recap table has exactly one row that does not sit above an earlier special case.",
      },
      {
        phrases: [
          "no earlier special case",
          "not a special case",
          "no special case",
          "not previously stated in any form",
          "not previously stated",
          "genuinely new starting point",
          "new starting point",
          "new postulate",
          "new statement",
          "not a generalization",
          "separate claim",
          "independent claim",
          "additional assumption",
          "not derived",
        ],
        missingFeedback:
          "You have named the row. Now give its status: ask whether anything earlier in the course is an instance of it, and if the answer is nothing, say what that makes the result rather than a broadened version of an older one.",
      },
    ],
    incorrectFeedback: "You named a row of the table without saying what makes it different in kind. Every other entry has an earlier, narrower version sitting in the left column that the later result contains. Find the row where the left column holds something that is not a narrower version of the right, and say what that makes the right-hand entry.",
    modelAnswers: [
      "The Energy-Time Uncertainty Relation lesson. Every other result filled in a degenerate case of something already proved, but this one had no earlier special case to generalize: time is not an operator, so the usual commutator route does not apply and the bound had to come from a genuinely new starting point.",
      "It is the energy-time uncertainty result. It differs in character because it was not previously stated in any form; it is a separate claim built from scratch rather than a widening of an old one.",
    ],
  },
  hints: [
    { text: "Read the recap table one row at a time and ask of each: is the left-hand entry an instance of the right-hand one, obtained by fixing a particular choice?" },
    { text: "For all but one row the answer is yes. The exception's left-hand entry is a claim about two specific quantities, and the right-hand entry is not about those quantities at all." },
    { text: "Name that row, then say what the right-hand entry has to be if nothing on the platform is an instance of it." },
  ],
  solution: {
    steps: [
      { description: "The Energy-Time Uncertainty Relation is the odd one out: $\\Delta x\\Delta p\\ge\\hbar/2$ (Wave Mechanics) is a *specific instance* of the general operator uncertainty bound, but $\\Delta E\\Delta t_A\\ge\\hbar/2$ is not a special case of *that*: it required an entirely different derivation route (via Ehrenfest's theorem) because time is not an operator." },
      { description: "Every other lesson in this course took an existing result and made it correct for degeneracy or multiple observables; this one derived a genuinely new kind of bound from scratch." },
    ],
    finalAnswer: "The Energy-Time Uncertainty Relation lesson. Unlike every other lesson, it was not generalizing an existing degenerate-case gap; it derived a new kind of bound because time is not an operator and the usual commutator route does not apply.",
  },
  explanation: {
    correctIdea: "Recognizing which results are generalizations versus genuinely new derivations is itself a synthesis skill.",
    whyCorrect: "This is what the lesson's own motivation section flagged.",
    whyWrong: ["Picking 'Sequential Measurements' is incorrect: that lesson was a concrete worked example of the already-proven incompatibility theorem, not a new theoretical result."],
  },
};
