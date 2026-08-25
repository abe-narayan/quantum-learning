import type { NumericProblem } from "@/lib/problems/types";

export const choiBlockEigenvalueAtGamma: NumericProblem = {
  meta: {
    slug: "choi-block-eigenvalue-at-gamma",
    title: "Amplitude Damping's Choi-Matrix Block Eigenvalue",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["choi-matrix", "amplitude-damping"],
    prerequisites: ["quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi"],
  },
  question: {
    type: "numeric",
    prompt:
      "Amplitude damping's Choi matrix has a 2x2 block with entries [[1, sqrt(1-gamma)],[sqrt(1-gamma), 1-gamma]]. Its determinant is exactly 0 for every gamma (since sqrt(1-gamma)^2 = 1-gamma exactly), so its two eigenvalues are {trace, 0} = {2-gamma, 0}. What is the nonzero eigenvalue at gamma=0.6?",
    inputHint: "exact value",
  },
  answer: {
    type: "numeric",
    value: 1.4,
    tolerance: 0.001,
    incorrectFeedback: "The nonzero eigenvalue is exactly 2-gamma (since the determinant is identically zero, the eigenvalues are trace and 0). At gamma=0.6, that's 2-0.6.",
  },
  hints: [
    { text: "Since det=0 identically, the two eigenvalues are {trace, 0}." },
    { text: "The block's trace is 1+(1-gamma) = 2-gamma." },
    { text: "At gamma=0.6, 2-gamma = 1.4." },
  ],
  solution: {
    steps: [
      { description: "The block's determinant is $1\\cdot(1-\\gamma)-(\\sqrt{1-\\gamma})^2=(1-\\gamma)-(1-\\gamma)=0$ for every $\\gamma$." },
      { description: "With determinant exactly 0, the two eigenvalues are the trace and 0: $\\{2-\\gamma,\\ 0\\}$." },
      { description: "At $\\gamma=0.6$: $2-0.6=1.4$." },
    ],
    finalAnswer: "The nonzero eigenvalue is 1.4, and the other is exactly 0.",
  },
  explanation: {
    correctIdea: "Amplitude damping's Choi matrix has rank exactly 2 for every gamma (matching its 2-Kraus-operator minimal representation), and one of that 2x2 block's two eigenvalues is always identically zero.",
    whyCorrect: "This is exactly why the lesson's Choi-eigenvector reconstruction recovers only two nonzero-weight Kraus operators, matching amplitude damping's own original K0, K1.",
  },
};
