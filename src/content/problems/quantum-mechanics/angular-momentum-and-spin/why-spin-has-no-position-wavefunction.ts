import type { ConceptualProblem } from "@/lib/problems/types";

export const whySpinHasNoPositionWavefunction: ConceptualProblem = {
  meta: {
    slug: "why-spin-has-no-position-wavefunction",
    title: "Why Spin Escapes the Integer-Only Restriction",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["spin", "conceptual"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why the single-valuedness argument that restricts orbital l to integers doesn't apply to spin, allowing j=1/2 to be physically realized.",
    placeholder: "Think about what the single-valuedness argument was actually about...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["no position", "not a function of", "no angle dependence", "no phi"],
      ["doesn't apply", "argument requires", "nothing to be single-valued"],
    ],
    incorrectFeedback: "Recall exactly what object the single-valuedness argument was checking — a function of the angle φ.",
    partialFeedback: "Good — now be explicit that spin states simply have no such angular function to check.",
  },
  hints: [
    { text: "The single-valuedness argument applied to a function Φ(φ) of the azimuthal angle." },
    { text: "Spin states like |↑⟩,|↓⟩ are not functions of position or angle at all." },
    { text: "Without an angular function, there's nothing for the single-valuedness condition to apply to." },
  ],
  solution: {
    steps: [
      { description: "The single-valuedness argument specifically concerns a wavefunction's dependence on the angle φ." },
      { description: "Spin states carry no position or angle dependence whatsoever — they're abstract 2-level states, not functions on space." },
      { description: "With no φ-dependence to check, the argument simply has nothing to apply to, leaving j=1/2 unrestricted for spin." },
    ],
    finalAnswer: "Spin states aren't functions of angle at all, so the single-valuedness-under-2π-rotation argument (which only concerns functions of angle) doesn't apply to them.",
  },
  explanation: {
    correctIdea: "The integer restriction was never a general angular-momentum fact — it was specific to position-space wavefunctions.",
    whyCorrect: "This is exactly the distinction the lesson draws between orbital and spin angular momentum.",
    whyWrong: ["Saying spin is 'just different' without identifying the specific missing ingredient (a position/angle-dependent wavefunction) doesn't explain the actual mechanism."],
  },
};
