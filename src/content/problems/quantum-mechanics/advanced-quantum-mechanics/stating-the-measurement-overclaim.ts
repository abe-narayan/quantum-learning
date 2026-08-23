import type { ConceptualProblem } from "@/lib/problems/types";

export const statingTheMeasurementOverclaim: ConceptualProblem = {
  meta: {
    slug: "stating-the-measurement-overclaim",
    title: "Stating the Decoherence Overclaim Precisely",
    course: "advanced-quantum-mechanics",
    lesson: "quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["capstone", "conceptual"],
    prerequisites: ["quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths"],
  },
  question: {
    type: "conceptual",
    prompt: "State, in one sentence, exactly what claim about decoherence this course considers an overclaim, and what the accurate, narrower claim is instead.",
    placeholder: "The overclaim is... The accurate claim is instead...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["solves", "measurement problem", "explains outcome"],
      ["coherence loss", "explains why superpositions", "does not explain outcome"],
    ],
    incorrectFeedback: "State both halves explicitly: the overclaim (what decoherence is sometimes said to explain) and the accurate, narrower claim (what it actually explains).",
    partialFeedback: "Good — make sure both the overclaim and the correct narrower claim are stated as a contrast.",
  },
  hints: [
    { text: "The overclaim: 'decoherence solves the measurement problem / explains why one definite outcome occurs.'" },
    { text: "The accurate claim: decoherence explains why quantum coherence (superposition) is lost upon interacting with an environment." },
    { text: "The difference: losing coherence (becoming a mixture) is not the same as one outcome being realized." },
  ],
  solution: {
    steps: [
      { description: "Overclaim: 'decoherence explains why measurements have definite outcomes' / 'decoherence solves the measurement problem.'" },
      { description: "Accurate claim: decoherence explains why quantum superpositions lose their coherence (become statistical mixtures) upon interacting with an environment — a real, important, and narrower result." },
      { description: "The gap between these: a mixture is still a description of unresolved possibilities with probabilities attached, not a record of one thing having actually happened." },
    ],
    finalAnswer: "Overclaim: decoherence explains definite measurement outcomes. Accurate claim: decoherence only explains the loss of coherence into a probabilistic mixture — outcome selection remains open.",
  },
  explanation: {
    correctIdea: "This is the single most repeated caveat across this course's lessons, restated here as a precise one-sentence pair rather than a vague warning.",
    whyCorrect: "Matches the capstone's explicit 'What decoherence resolves, and what it doesn't' section.",
    whyWrong: ["Stating only the accurate claim without naming the specific overclaim it's meant to correct doesn't demonstrate the contrast this course emphasizes."],
  },
};
