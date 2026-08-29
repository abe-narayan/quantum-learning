import type { ConceptualProblem } from "@/lib/problems/types";

export const zeroEigenvalueStillCp: ConceptualProblem = {
  meta: {
    slug: "zero-eigenvalue-still-cp",
    title: "A Zero Choi Eigenvalue Does Not Threaten Complete Positivity",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["choi-matrix", "complete-positivity"],
    prerequisites: ["quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Amplitude damping's Choi matrix has eigenvalue 0 (not just non-negative, but exactly zero) in two of its four spectral directions. Explain why this is fully consistent with complete positivity, rather than a borderline or problematic case.",
    placeholder: "Recall the exact condition proved in this lesson: complete positivity requires...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      [
        "psd",
        "positive semi-definite",
        "semi-definite",
        "semidefinite",
        "non-negative",
        "nonnegative",
        "not strictly positive",
        "greater than or equal",
        "at or above zero",
        "zero is allowed",
        "zeros are allowed",
        "zero eigenvalues are allowed",
        "allows zero",
        "permits zero",
        "allowed to be zero",
      ],
      {
        phrases: ["rank", "minimal kraus", "fewer kraus operators", "not all eigenvectors needed", "fewer than", "contributes nothing", "no contribution", "drops out"],
        missingFeedback:
          "You have the right condition: semi-definite, not strictly positive. Add what a zero eigenvalue means in practice: its reconstructed Kraus operator is scaled by √0, so it contributes nothing, and the channel simply needs fewer Kraus operators than the maximum d².",
      },
    ],
    incorrectFeedback:
      "Complete positivity requires the Choi matrix to be positive SEMI-definite, i.e. all eigenvalues >= 0 -- zero eigenvalues are explicitly allowed by this condition, and correspond to Kraus operators the channel simply doesn't need (its minimal Kraus rank is smaller than d^2).",
  },
  hints: [
    { text: "The proved condition is J(E) >= 0, i.e. positive SEMI-definite, not strictly positive." },
    { text: "A zero eigenvalue in the Choi eigendecomposition reconstructs to a Kraus operator scaled by sqrt(0)=0, i.e. no contribution at all." },
  ],
  solution: {
    steps: [
      { description: "Complete positivity was proved equivalent to $J(\\mathcal E)\\geq0$ -- positive SEMI-definite, which explicitly permits zero eigenvalues." },
      { description: "A zero eigenvalue's reconstructed Kraus operator is scaled by $\\sqrt{0}=0$, contributing nothing to $\\sum_kK_k\\rho K_k^\\dagger$." },
      { description: "This just means the channel's minimal Kraus rank (here, 2) is smaller than the maximum possible $d^2=4$ -- not a defect." },
    ],
    finalAnswer: "A zero Choi eigenvalue is fully allowed by J(E)>=0 and simply signals that the channel needs fewer Kraus operators than the maximum possible, exactly amplitude damping's real minimal rank of 2.",
  },
  explanation: {
    correctIdea: "Positive semi-definiteness, not strict positivity, is the proved condition for complete positivity.",
    whyCorrect: "The lesson's own reconstruction showed the near-zero eigenvalue contributes essentially nothing, and the two nonzero eigenvalues alone reconstruct K0 and K1 exactly.",
  },
};
