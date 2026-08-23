import type { NumericProblem } from "@/lib/problems/types";

export const distinctJointEigenvaluePairs: NumericProblem = {
  meta: {
    slug: "distinct-joint-eigenvalue-pairs",
    title: "Counting Distinct Joint Eigenvalue Pairs",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/complete-sets-of-commuting-observables",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["csco", "degeneracy"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/complete-sets-of-commuting-observables"],
  },
  question: {
    type: "numeric",
    prompt: "For N = diag(1,1,2) and M = diag(5,-5,7) on C^3, how many distinct (N, M) eigenvalue pairs occur across the 3 basis states?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: 3,
    tolerance: 0.001,
    incorrectFeedback: "List the (N,M) pair for each of the 3 basis states and count how many are distinct from each other.",
  },
  hints: [{ text: "List the pairs: (1,5), (1,-5), (2,7). Are all three different from each other?" }],
  solution: {
    steps: [
      { description: "$|0\\rangle\\to(1,5)$, $|1\\rangle\\to(1,-5)$, $|2\\rangle\\to(2,7)$ — three pairs, all mutually distinct." },
    ],
    finalAnswer: "$3$ distinct pairs, confirming $\\{N,M\\}$ is a CSCO for this space.",
  },
  explanation: {
    correctIdea: "A CSCO's defining property is exactly that its joint eigenvalues distinguish every basis state.",
    whyCorrect: "Direct enumeration of the three pairs from the lesson's own table.",
    whyWrong: ["Counting only N's distinct eigenvalues (2, since N has values 1 and 2) misses the point — the question asks about the joint pair, which resolves N's own degeneracy."],
  },
};
