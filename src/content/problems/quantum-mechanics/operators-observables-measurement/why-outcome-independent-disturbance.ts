import type { ConceptualProblem } from "@/lib/problems/types";

export const whyOutcomeIndependentDisturbance: ConceptualProblem = {
  meta: {
    slug: "why-outcome-independent-disturbance",
    title: "Why the Disturbance Doesn't Depend on Which Outcome Occurred",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/sequential-measurements-and-incompatibility",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["measurement", "incompatibility"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/sequential-measurements-and-incompatibility"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In one or two sentences, explain why P(Z=0) comes out exactly 0.5 regardless of whether the intervening X measurement gave +1 or -1.",
    placeholder: "Explain why the specific X outcome doesn't matter...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["both x eigenstates", "both eigenstates", "both outcomes", "both branches", "both post-measurement states", "both cases", "either eigenstate", "either outcome", "whichever outcome", "plus and minus", "either x eigenstate"],
        missingFeedback:
          "The X measurement leaves the qubit in one of two states. Say which two, because the answer turns on both of them sharing a feature.",
      },
      {
        phrases: ["equal superposition", "50/50 in the Z basis", "same magnitude", "same magnitudes", "equal magnitude", "only a sign", "only the sign", "sign differs", "squaring"],
        missingFeedback:
          "You have said each X result must be checked. Now compare the two coefficient lists you get: what is identical between them, what is different, and which of those two features survives the Born rule's modulus?",
      },
    ],
    incorrectFeedback: "You answered that measuring X 'destroys the information', which explains why the result is 0.5 in one case but not why the two cases agree. Write each of the two possible post-X states in the Z basis and put their coefficients side by side.",
    modelAnswers: [
      "Both X eigenstates have Z-basis coefficients of the same magnitude, differing only by a sign. Squaring removes the sign, so P(Z=0)=0.5 whichever outcome the X measurement gave.",
      "Whichever outcome you got, the state left behind is an equal superposition in the Z basis. The two cases differ only in the sign of one coefficient, and that disappears on squaring.",
    ],
  },
  hints: [
    { text: "There are two possible states after the X measurement. Write each of them out in terms of |0> and |1>." },
    { text: "Line the two expansions up and compare coefficient by coefficient. What is identical, and what differs?" },
    { text: "The Born rule does not use the coefficient itself. Apply what it does use to each expansion, and see whether the difference you spotted still shows up in the answer." },
  ],
  solution: {
    steps: [
      { description: "$|+\\rangle=\\tfrac1{\\sqrt2}(|0\\rangle+|1\\rangle)$ and $|-\\rangle=\\tfrac1{\\sqrt2}(|0\\rangle-|1\\rangle)$ have the *same* magnitude coefficients on $|0\\rangle$ and $|1\\rangle$; only a relative sign differs." },
      { description: "Since probabilities depend on squared magnitudes, that sign difference is invisible to $P(Z{=}0)$, giving $0.5$ in both cases." },
    ],
    finalAnswer: "Both X-eigenstates have equal-magnitude Z-basis coefficients (differing only by a sign that vanishes upon squaring), so P(Z=0)=0.5 regardless of which X outcome occurred.",
  },
  explanation: {
    correctIdea: "The specific relative phase between |0> and |1> in an X-eigenstate doesn't affect Z-basis measurement probabilities.",
    whyCorrect: "This is a direct consequence of the Born rule depending on |amplitude|^2, not the amplitude itself.",
    whyWrong: ["Assuming one X-outcome would somehow 'partially preserve' the original Z certainty misunderstands that both X-eigenstates are equally far from being Z-eigenstates."],
  },
};
