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
      {
        phrases: ["psd", "positive semi-definite", "semi-definite", "semidefinite", "non-negative", "nonnegative", "not strictly positive", "greater than or equal", "at or above zero", "zero is allowed", "zeros are allowed", "zero eigenvalues are allowed", "allows zero", "permits zero", "allowed to be zero"],
        missingFeedback:
          "Restate the exact condition the lesson proved for complete positivity, in terms of what the Choi matrix's eigenvalues have to satisfy. Be careful about which inequality it is.",
      },
      {
        phrases: ["rank", "minimal kraus", "fewer kraus operators", "not all eigenvectors needed", "fewer than", "contributes nothing", "no contribution", "drops out"],
        missingFeedback:
          "The condition is stated correctly. What is still missing is the consequence for the channel. Rebuild the Kraus operators from the eigendecomposition and ask what the one attached to a vanishing eigenvalue gets multiplied by, and therefore how many operators the channel truly needs.",
      },
    ],
    incorrectFeedback:
      "Quote the proved condition exactly, then read it literally. The Choi matrix must have no negative eigenvalue; the theorem never demanded that every eigenvalue sit strictly above the line. So ask what a vanishing eigenvalue does when you rebuild the Kraus operators from the eigendecomposition: what is each operator scaled by, and what does that scaling do to the one attached to that eigenvalue?",
    modelAnswers: [
      "The condition proved is that the Choi matrix is positive semi-definite, not strictly positive. Zero eigenvalues are allowed by that condition, so a zero is perfectly ordinary rather than borderline. It just means the channel needs fewer Kraus operators than the maximum, here a rank of 2.",
      "Complete positivity requires the Choi matrix to be non-negative, greater than or equal to zero, and not strictly positive. A zero eigenvalue signals a smaller minimal Kraus rank, so those directions simply contribute nothing.",
    ],
  },
  hints: [
    { text: "Write the proved condition down exactly as it appears, then read the inequality sign carefully." },
    { text: "In the eigendecomposition rebuild, each Kraus operator carries a factor of √(eigenvalue). Ask what that factor is when the eigenvalue is 0, and what the resulting operator does to any state." },
  ],
  solution: {
    steps: [
      { description: "Complete positivity was proved equivalent to $J(\\mathcal E)\\geq0$, positive semi-definite, which explicitly permits zero eigenvalues." },
      { description: "A zero eigenvalue's reconstructed Kraus operator is scaled by $\\sqrt{0}=0$, contributing nothing to $\\sum_kK_k\\rho K_k^\\dagger$." },
      { description: "This means the channel's minimal Kraus rank (here 2) is smaller than the maximum possible $d^2=4$. It is not a defect." },
    ],
    finalAnswer: "A zero Choi eigenvalue is allowed by J(E)>=0 and signals that the channel needs fewer Kraus operators than the maximum possible, which for amplitude damping is a minimal rank of 2.",
  },
  explanation: {
    correctIdea: "Positive semi-definiteness, not strict positivity, is the proved condition for complete positivity.",
    whyCorrect: "The lesson's own reconstruction showed the near-zero eigenvalue contributes essentially nothing, and the two nonzero eigenvalues alone reconstruct K0 and K1 exactly.",
  },
};
