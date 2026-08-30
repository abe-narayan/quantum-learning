import type { ConceptualProblem } from "@/lib/problems/types";

export const decoherenceVsCollapse: ConceptualProblem = {
  meta: {
    slug: "decoherence-vs-collapse",
    title: "Decoherence Is Not Wavefunction Collapse",
    course: "advanced-quantum-mechanics",
    lesson: "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["decoherence", "conceptual"],
    prerequisites: ["quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain precisely why the fully-decohered state (diagonal, 50/50) is NOT the same physical claim as 'a measurement occurred and gave a definite outcome.'",
    placeholder: "The fully-decohered state is a probabilistic MIXTURE, which means...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["mixture", "probabilistic", "both possibilities", "odds over", "unresolved", "statistical mixture", "weighted list", "classical probabilities", "not yet decided", "still both open"],
        missingFeedback:
          "Say what kind of object the decohered state actually is. Its diagonal entries are odds, so what is the state a description of?",
      },
      {
        phrases: ["single outcome", "one specific result", "not yet realized", "one realized", "realized result", "actually happened", "has occurred", "one branch has occurred", "a fact of the matter", "definite result", "definite outcome has"],
        missingFeedback:
          "You have said what the mixture describes. Now say what the other claim asserts on top of that, and why a list of odds never amounts to it.",
      },
    ],
    incorrectFeedback: "You described what decoherence does to the off-diagonal entries, which is the setup rather than the answer. The question is about two statements: read the diagonal matrix as a claim about what is true of the system, then read 'a measurement happened' as a claim, and say which one is silent about something the other settles.",
    partialFeedback: "One side is stated. Say what the other side asserts that the first does not: which particular thing has actually happened, as opposed to a list of what might have.",
    modelAnswers: [
      "The decohered density matrix is a statistical mixture: it gives the odds over two possibilities that are still both open, not the claim that either has happened. A measurement outcome is a single realized result, one specific fact of the matter. Decoherence produces the first and says nothing about the second.",
      "A diagonal 50/50 state is a probabilistic description of unresolved possibilities. It is not the assertion that one branch has occurred and given a definite outcome. Those are different claims.",
    ],
  },
  hints: [
    { text: "Read diag(0.5, 0.5) aloud as an English sentence about the system. What does it commit you to, and what does it leave unsaid?" },
    { text: "Now read 'the apparatus registered a result' aloud as an English sentence. What does that commit you to?" },
    { text: "Put the two sentences side by side. One of them names a particular thing that occurred; the other supplies odds. Say which is which, and what would have to be added to the first to get the second." },
  ],
  solution: {
    steps: [
      { description: "The fully-decohered diagonal state diag(0.5,0.5) describes a probabilistic mixture: the system is in one of |0⟩ or |1⟩, with 50% probability each, but the description itself does not specify which." },
      { description: "An actual measurement outcome is a single, definite, realized result: the measurement apparatus shows '0' or shows '1', not 'both, with some probability.'" },
      { description: "Decoherence's Kraus-channel math produces exactly the mixture description, which is this lesson's numerical result. It does not, by itself, contain any mechanism that selects or realizes one specific outcome." },
    ],
    finalAnswer: "A probabilistic mixture describes odds over unresolved possibilities; a measurement outcome is one realized, definite result. Decoherence produces the former, not the latter.",
  },
  explanation: {
    correctIdea: "This is the precise version of the lesson's central Common Mistakes point, stated as an explicit logical distinction rather than a vague caveat.",
    whyCorrect: "Decoherence kills the off-diagonal terms, and that is all it does. A diagonal density matrix is still a statement about odds, so nothing in it says which of the two possibilities is the one that happened.",
    whyWrong: ["Claiming decoherence 'causes' a specific outcome to occur smuggles in an additional assumption (some collapse mechanism) that the Kraus-channel math itself does not contain."],
  },
};
