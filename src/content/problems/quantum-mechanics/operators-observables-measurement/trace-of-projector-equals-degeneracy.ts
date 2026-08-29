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
    incorrectFeedback: "Write P out as an explicit diagonal matrix: a one on each basis direction sharing the degenerate eigenvalue, zeros elsewhere. The trace then counts those ones, which is the eigenspace's dimension, not the eigenvalue itself.",
    nearMisses: [
      { value: 3, feedback: "3 is the dimension of the whole space. P projects onto the eigenvalue-2 subspace only, which is two-dimensional." },
      { value: 1, feedback: "1 is the trace of a rank-one projector. Eigenvalue 2 is degenerate here, appearing on two basis directions." },
    ],
  },
  hints: [
    { text: "Write out P explicitly as a 3x3 diagonal matrix first." },
    { text: "The trace of any projector equals the dimension of the subspace it projects onto." },
  ],
  solution: {
    steps: [
      { description: "$P = \\mathrm{diag}(1,1,0)$: identity on the eigenvalue-2 eigenspace (the first two basis vectors), zero elsewhere." },
      { description: "$\\mathrm{Tr}(P) = 1+1+0 = 2$." },
    ],
    finalAnswer: "$\\mathrm{Tr}(P) = 2$",
  },
  explanation: {
    correctIdea: "A projector's trace always equals the dimension of the subspace it projects onto.",
    whyCorrect: "Direct computation from the explicit matrix, matching the eigenvalue's degeneracy exactly.",
    whyWrong: ["Reporting the eigenvalue itself (2) instead of the eigenspace's dimension confuses what's being asked: the trace measures dimension, not the eigenvalue's numeric value (which is also 2 here, a coincidence of this example)."],
  },
};
