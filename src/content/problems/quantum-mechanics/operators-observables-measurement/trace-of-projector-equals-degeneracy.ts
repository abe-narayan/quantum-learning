import type { NumericProblem } from "@/lib/problems/types";

export const traceOfProjectorEqualsDegeneracy: NumericProblem = {
  meta: {
    slug: "trace-of-projector-equals-degeneracy",
    title: "The Trace of a Degenerate Projector",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["projectors", "degeneracy"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy"],
  },
  question: {
    type: "numeric",
    prompt: "For N = diag(2, 2, 5) on C^3, let P be the projector onto the eigenspace for eigenvalue 2. Find Tr(P).",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: 2,
    tolerance: 0.001,
    incorrectFeedback: "P = |e0><e0| + |e1><e1| for the two basis vectors sharing eigenvalue 2. Its trace equals the dimension of the eigenspace it projects onto.",
  },
  hints: [
    { text: "Write out P explicitly as a 3x3 diagonal matrix first." },
    { text: "The trace of any projector equals the dimension of the subspace it projects onto." },
  ],
  solution: {
    steps: [
      { description: "$P = \\mathrm{diag}(1,1,0)$ — identity on the eigenvalue-2 eigenspace (the first two basis vectors), zero elsewhere." },
      { description: "$\\mathrm{Tr}(P) = 1+1+0 = 2$." },
    ],
    finalAnswer: "$\\mathrm{Tr}(P) = 2$",
  },
  explanation: {
    correctIdea: "A projector's trace always equals the dimension of the subspace it projects onto.",
    whyCorrect: "Direct computation from the explicit matrix, matching the eigenvalue's degeneracy exactly.",
    whyWrong: ["Reporting the eigenvalue itself (2) instead of the eigenspace's dimension confuses what's being asked — the trace measures dimension, not the eigenvalue's numeric value (which is also 2 here, a coincidence of this example)."],
  },
};
