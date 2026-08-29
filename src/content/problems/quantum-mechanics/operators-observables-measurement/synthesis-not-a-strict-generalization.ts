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
      ["energy-time", "energy time uncertainty"],
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
          "You have named the relation. The point of the question is its status: nothing earlier in the course is a special case of it, so it is a new statement in its own right rather than a generalization of something already established.",
      },
    ],
    incorrectFeedback: "Name both pieces: which lesson (the energy-time uncertainty relation), and why it's different (there was no earlier, special-cased version of it anywhere on the platform to generalize from — unlike every other result in this course).",
  },
  hints: [{ text: "Every other row in the recap table has a specific 'earlier version' in the left column. Which row's left-column entry is really a different kind of claim (specific about x and p) rather than a special case of the same general idea?" }],
  solution: {
    steps: [
      { description: "The Energy-Time Uncertainty Relation is the odd one out: $\\Delta x\\Delta p\\ge\\hbar/2$ (Wave Mechanics) is a *specific instance* of the general operator uncertainty bound, but $\\Delta E\\Delta t_A\\ge\\hbar/2$ isn't a special case of *that* — it required an entirely different derivation route (via Ehrenfest's theorem) because time isn't an operator." },
      { description: "Every other lesson in this course took an existing result and made it correct for degeneracy or multiple observables; this one derived a genuinely new kind of bound from scratch." },
    ],
    finalAnswer: "The Energy-Time Uncertainty Relation lesson — unlike every other lesson, it wasn't generalizing an existing degenerate-case gap, it derived a new kind of bound because time isn't an operator and the usual commutator route doesn't apply.",
  },
  explanation: {
    correctIdea: "Recognizing which results are generalizations versus genuinely new derivations is itself a synthesis skill.",
    whyCorrect: "This is exactly what the lesson's own motivation section flagged explicitly.",
    whyWrong: ["Picking 'Sequential Measurements' is incorrect — that lesson was a fully concrete worked example of the already-proven incompatibility theorem, not a new theoretical result."],
  },
};
