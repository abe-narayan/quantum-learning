import type { ConceptualProblem } from "@/lib/problems/types";

export const whyPHatNeedsI: ConceptualProblem = {
  meta: {
    slug: "why-p-hat-needs-i",
    title: "Why the Momentum Operator Needs a Factor of i",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/the-position-and-momentum-operators",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["momentum-operator", "hermitian"],
    prerequisites: ["quantum-mechanics/wave-mechanics/the-position-and-momentum-operators"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In one or two sentences, explain why p-hat = -i*hbar*d/dx needs the factor of i, using the Hermiticity requirement from Mathematical Foundations.",
    placeholder: "Explain why the factor of i is required...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["hermitian", "real eigenvalues", "observable must be hermitian"],
      ["plain derivative", "d/dx alone", "anti-hermitian", "not hermitian without i"],
    ],
    incorrectFeedback: "Name both pieces: that observables must be Hermitian (for real eigenvalues), and that a bare derivative d/dx alone fails that requirement while -i*d/dx satisfies it.",
    partialFeedback: "You're partway there — be explicit that a plain derivative operator alone is not Hermitian.",
  },
  hints: [
    { text: "What property must every valid observable operator satisfy, from Mathematical Foundations?" },
    { text: "Is the plain derivative operator d/dx, on its own, Hermitian?" },
  ],
  solution: {
    steps: [
      { description: "Observables must be Hermitian, to guarantee real eigenvalues (measurable outcomes)." },
      { description: "Integration by parts shows $d/dx$ alone is anti-Hermitian; multiplying by $-i$ flips this into exactly the Hermitian condition." },
    ],
    finalAnswer: "The factor of i converts the anti-Hermitian plain derivative into a Hermitian operator, as required for p-hat to be a valid observable.",
  },
  explanation: {
    correctIdea: "Momentum must be a valid observable, which means Hermitian — and only -i*hbar*d/dx (not a bare derivative) satisfies that.",
    whyCorrect: "This is exactly the lesson's integration-by-parts calculation: the boundary term vanishes and the sign flip from d/dx becomes the correct Hermitian match once multiplied by -i.",
    whyWrong: ["Saying 'it's needed to match units' is incomplete — units alone don't force a complex factor; the actual reason is the Hermiticity requirement for real, measurable eigenvalues."],
  },
};
