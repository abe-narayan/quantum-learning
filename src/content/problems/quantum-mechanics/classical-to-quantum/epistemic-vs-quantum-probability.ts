import type { ConceptualProblem } from "@/lib/problems/types";

export const epistemicVsQuantumProbability: ConceptualProblem = {
  meta: {
    slug: "epistemic-vs-quantum-probability",
    title: "Epistemic vs. Quantum Probability",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/classical-states-and-observables",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["classical-mechanics", "probability"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/classical-states-and-observables"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In one or two sentences, explain the difference between classical (epistemic) probability and the kind of probability quantum mechanics turns out to need.",
    placeholder: "Explain the difference...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["ignorance", "hidden", "unknown but definite", "lack of knowledge", "don't know"],
      ["no definite state", "genuinely random", "not due to ignorance", "indeterminate", "ontological"],
    ],
    incorrectFeedback:
      "Try again — name both sides explicitly: what classical probability always reduces to, and what the quantum case can't be explained by.",
    partialFeedback: "You've named one side — say something about the other kind of probability too.",
  },
  hints: [
    { text: "Classical probability always traces back to one specific hidden fact." },
    { text: "The double-slit lesson showed quantum probability can't be explained that way, even with a hidden fact." },
  ],
  solution: {
    steps: [
      { description: "Classical (epistemic) probability always describes ignorance about one definite, if unknown, underlying state." },
      { description: "Quantum probability, as the double-slit calculation showed, cannot be explained by any hidden definite fact — it requires amplitudes that genuinely interfere." },
    ],
    finalAnswer: "Epistemic probability = ignorance about a definite fact; quantum probability is not reducible to any such hidden fact.",
  },
  explanation: {
    correctIdea: "Classical probability is always epistemic; quantum probability, as later lessons prove, cannot be.",
    whyCorrect: "This is exactly the distinction the next lesson makes rigorous with a specific numerical contradiction.",
    whyWrong: ["Saying quantum probability is 'just more complicated ignorance' misses the point — it's a genuinely different kind of probability, not a harder version of the same kind."],
  },
};
