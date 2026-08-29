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
      ["both", "either eigenstate", "|+> and |->"],
      {
        phrases: ["equal superposition", "50/50 in the Z basis", "same magnitude", "same magnitudes", "equal magnitude", "only a sign", "only the sign", "sign differs", "squaring"],
        missingFeedback:
          "You have said both X outcomes have to be considered. Add why they agree: |+⟩ and |−⟩ carry the same magnitudes on |0⟩ and |1⟩ and differ only by a relative sign, which the Born rule's squaring erases.",
      },
    ],
    incorrectFeedback: "Name both pieces: that both X-eigenstates (|+> and |->) are being considered, and that both happen to be equal-magnitude superpositions of |0> and |1>, giving the same Z-probabilities either way.",
  },
  hints: [{ text: "Write out both |+> and |-> in the Z basis and compare their |0>-coefficients' magnitudes." }],
  solution: {
    steps: [
      { description: "$|+\\rangle=\\tfrac1{\\sqrt2}(|0\\rangle+|1\\rangle)$ and $|-\\rangle=\\tfrac1{\\sqrt2}(|0\\rangle-|1\\rangle)$ have the *same* magnitude coefficients on $|0\\rangle$ and $|1\\rangle$ — only a relative sign differs." },
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
