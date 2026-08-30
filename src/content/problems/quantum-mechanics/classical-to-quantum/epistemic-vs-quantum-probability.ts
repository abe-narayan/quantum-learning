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
      // Bare "ignorance" and bare "hidden" are both substrings of the quantum
      // group's own phrases ("not due to ignorance", "not reducible to any such
      // hidden fact"), so an answer that only described quantum probability
      // satisfied the classical group too.
      {
        phrases: ["classical ignorance", "epistemic", "ignorance about", "ignorance of a definite", "unknown but definite", "definite but unknown", "lack of knowledge", "don't know", "already has a definite"],
        missingFeedback:
          "Deal with the ordinary case first. Say what a classical probability is a statement about, given that the coin under the cup has already landed.",
      },
      {
        phrases: ["no definite state", "genuinely random", "not due to ignorance", "not reducible", "irreducible", "no hidden fact", "not a hidden fact", "indeterminate", "ontological", "amplitudes that interfere"],
        missingFeedback:
          "You have the classical side. Now say what is different about the quantum case, and be explicit about whether there is some settled fact underneath for the probability to be about.",
      },
    ],
    incorrectFeedback:
      "Name both sides: what classical probability always reduces to, and what the quantum case cannot be explained by.",
    partialFeedback: "You've named one side. Now say something about the other kind of probability.",
    modelAnswers: [
      "Classical probability is epistemic: the coin already has a definite face up and the probability just measures our ignorance about a fact that is already settled. Quantum probability is not like that, it is not due to ignorance of any hidden fact, because there is no definite value sitting there to be ignorant about.",
      "Classically it is lack of knowledge about something unknown but definite. Quantum mechanically the randomness is irreducible: there is no hidden fact underneath, so the probability is not reducible to ignorance.",
    ],
  },
  hints: [
    { text: "Ask what a classical probability is a statement about. If you could see further into the system, would the probability survive?" },
    { text: "Now run that same test on the double-slit case: assume there is a definite fact about which slit the particle took, and compare what that assumption predicts against what the lesson computed." },
    { text: "State the contrast as two claims about what each probability is a statement about, rather than as a claim about how complicated the system is." },
  ],
  solution: {
    steps: [
      { description: "Classical (epistemic) probability always describes ignorance about one definite, if unknown, underlying state." },
      { description: "Quantum probability, as the double-slit calculation showed, cannot be explained by any hidden definite fact. It requires amplitudes that interfere." },
    ],
    finalAnswer: "Epistemic probability = ignorance about a definite fact; quantum probability is not reducible to any such hidden fact.",
  },
  explanation: {
    correctIdea: "Classical probability is always epistemic; quantum probability, as later lessons prove, cannot be.",
    whyCorrect: "This is the distinction the next lesson makes rigorous with a specific numerical contradiction.",
    whyWrong: ["Saying quantum probability is 'just more complicated ignorance' misses the point: it is a different kind of probability, not a harder version of the same kind."],
  },
};
