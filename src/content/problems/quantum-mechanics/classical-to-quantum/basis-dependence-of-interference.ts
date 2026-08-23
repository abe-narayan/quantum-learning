import type { ConceptualProblem } from "@/lib/problems/types";

export const basisDependenceOfInterference: ConceptualProblem = {
  meta: {
    slug: "basis-dependence-of-interference",
    title: "Why Interference Depends on the Measurement Basis",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["interference", "superposition"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/superposition-interference-and-phase"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Explain why a relative phase between two amplitudes is invisible when measuring in the state's own basis, but visible when measuring in a different basis.",
    placeholder: "Explain the basis-dependence...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["own basis", "natural basis", "|c_a|^2", "doesn't depend on phase", "phase cancels"],
      ["different basis", "mixes the terms", "rotated basis", "cross term", "overlap with both"],
    ],
    incorrectFeedback:
      "Say something about both cases explicitly: what happens measuring in the state's own basis, and what changes measuring in a different one.",
    partialFeedback: "You've covered one case — say something about the other basis too.",
  },
  hints: [
    { text: "In the state's own basis, P(a)=|c_a|² directly — no cross term appears at all." },
    { text: "In a different basis, each new basis vector overlaps with BOTH original terms, producing a cross term that depends on their relative phase." },
  ],
  solution: {
    steps: [
      { description: "Measuring in the state's own basis gives $P(a)=|c_a|^2$ — a single term, no cross term, so no phase dependence." },
      { description: "Measuring in a different basis requires projecting onto a new basis vector that overlaps with both original terms, producing a cross term proportional to $\\cos\\varphi$." },
    ],
    finalAnswer: "Phase only becomes visible once a measurement mixes the original terms together — projecting onto a basis vector that overlaps with more than one term at once.",
  },
  explanation: {
    correctIdea: "Interference is not a property of a state alone — it depends on the relationship between the state and the chosen measurement basis.",
    whyCorrect: "This is exactly the derivation from the lesson: |⟨+|ψ⟩|² picks up a cross term that |⟨0|ψ⟩|² never does.",
    whyWrong: ["Saying phase is 'just never observable' ignores that a cross-basis measurement makes it directly observable."],
  },
};
