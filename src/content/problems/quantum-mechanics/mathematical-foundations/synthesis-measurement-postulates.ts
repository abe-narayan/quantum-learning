import type { ConceptualProblem } from "@/lib/problems/types";

export const synthesisMeasurementPostulates: ConceptualProblem = {
  meta: {
    slug: "synthesis-measurement-postulates",
    title: "Synthesis: How the Postulates Fit Together",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/mathematical-foundations-challenge",
    difficulty: "advanced",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["synthesis", "born-rule", "hermitian-operators"],
    prerequisites: [
      "quantum-mechanics/mathematical-foundations/hermitian-operators",
      "quantum-mechanics/mathematical-foundations/probability-and-quantum-states",
    ],
  },
  question: {
    type: "conceptual",
    prompt:
      "In two or three sentences, explain how the four ideas — unit vectors, Hermitian operators, eigenvalues, and the Born rule — fit together to predict the outcome of a quantum measurement.",
    placeholder: "Explain how these four pieces connect...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["unit vector", "normalized", "norm 1", "‖ψ‖", "normalization"],
      ["hermitian", "eigenvalue", "eigenvalues are the possible outcomes", "real eigenvalues", "possible outcomes"],
      ["born rule", "probability", "amplitude squared", "|⟨", "squared overlap", "modulus squared"],
    ],
    incorrectFeedback:
      "Try to name all three pieces explicitly: what a state is (in terms of vectors), what an observable's possible outcomes are (in terms of an operator's structure), and how probabilities are actually computed.",
    partialFeedback: "Good start — you're missing at least one of the three pieces (the state's normalization, the observable's eigenvalues, or the Born rule's probability formula).",
  },
  hints: [
    { text: "Start with what a 'state' mathematically is." },
    { text: "Then explain what a Hermitian observable's eigenvalues represent physically." },
    { text: "Finish with how a probability is actually computed from the state and the eigenvectors." },
  ],
  solution: {
    steps: [
      { description: "A physical state is a normalized (unit-norm) vector $|\\psi\\rangle$ in a Hilbert space." },
      { description: "An observable is a Hermitian operator $A$; its eigenvalues (guaranteed real) are the only possible measurement outcomes, and its eigenvectors are the corresponding definite states." },
      { description: "The Born rule gives the probability of each outcome as the squared overlap between the state and that outcome's eigenvector.", latex: "P(\\lambda_i) = |\\langle e_i|\\psi\\rangle|^2" },
    ],
    finalAnswer:
      "A normalized state's overlaps with a Hermitian observable's (real) eigenvectors, squared, give the probabilities of measuring each corresponding (real) eigenvalue.",
  },
  explanation: {
    correctIdea: "The whole predictive machinery of quantum mechanics is exactly this chain: state → observable's eigenbasis → overlaps → squared → probabilities.",
    whyCorrect: "Every piece was derived, not just asserted, across the ten lessons this capstone reviews.",
    whyWrong: ["Leaving out normalization, real eigenvalues, or the squaring step each break a link in the chain that makes the whole prediction self-consistent."],
  },
};
