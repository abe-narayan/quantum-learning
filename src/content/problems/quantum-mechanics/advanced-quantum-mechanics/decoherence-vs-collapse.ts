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
      ["mixture", "probabilistic", "50/50", "both possibilities"],
      ["single outcome", "definite", "one specific result", "not yet realized"],
    ],
    incorrectFeedback: "Address both sides: what a probabilistic mixture actually represents, and how that differs from a single realized measurement outcome.",
    partialFeedback: "Good — now be explicit that the mixture itself does not specify which single outcome occurred.",
  },
  hints: [
    { text: "A diagonal density matrix diag(0.5,0.5) describes 'the system is definitely 0, OR definitely 1, with 50% odds each' — it does not say WHICH." },
    { text: "An actual measurement outcome is a single, specific, realized result — '0' happened, or '1' happened, not both-with-a-probability." },
    { text: "Decoherence produces the mixture description; it does not, by itself, pick out one specific realized outcome." },
  ],
  solution: {
    steps: [
      { description: "The fully-decohered diagonal state diag(0.5,0.5) describes a probabilistic mixture: the system is in one of |0⟩ or |1⟩, with 50% probability each — but the description itself doesn't specify which." },
      { description: "An actual measurement outcome is a single, definite, realized result: the measurement apparatus shows '0' or shows '1', not 'both, with some probability.'" },
      { description: "Decoherence's Kraus-channel math produces exactly the mixture description (this lesson's numerical result) — it does not, by itself, contain any mechanism that selects or realizes one specific outcome." },
    ],
    finalAnswer: "A probabilistic mixture describes odds over unresolved possibilities; a measurement outcome is one realized, definite result — decoherence produces the former, not the latter.",
  },
  explanation: {
    correctIdea: "This is the precise version of the lesson's central Common Mistakes point, stated as an explicit logical distinction rather than a vague caveat.",
    whyCorrect: "Matches the lesson's explicit discussion of what decoherence does and does not resolve.",
    whyWrong: ["Claiming decoherence 'causes' a specific outcome to occur smuggles in an additional assumption (some collapse mechanism) that the Kraus-channel math itself does not contain."],
  },
};
