import { PAULI_X, PAULI_Z } from "@/lib/quantum/gates";
import { runVqe, exactGroundStateEnergy } from "@/lib/quantum/vqe";
import type { NumericProblem } from "@/lib/problems/types";

const H = PAULI_Z.scale(0.6).add(PAULI_X.scale(0.8));
const value = Math.abs(runVqe(H, 80).energy - exactGroundStateEnergy(H));

export const vqeConvergenceAccuracy: NumericProblem = {
  meta: {
    slug: "vqe-convergence-accuracy",
    title: "How Close Does VQE Get to the Exact Answer?",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/vqe-a-worked-toy-example",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["vqe"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/vqe-a-worked-toy-example"],
  },
  question: {
    type: "numeric",
    prompt: "For H=0.6Z+0.8X with 80 optimizer iterations, approximately how far (in absolute value) is runVqe's found energy from the exact ground energy −1?",
    inputHint: "order of magnitude, as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.95,
    toleranceType: "relative",
    incorrectFeedback:
      "This is an order-of-magnitude question, so a rounded decimal like 0.01 will not do. The lesson states the optimizer converges to within about 10⁻¹² of the exact value: submit a number of that size.",
  },
  hints: [
    { text: "The lesson explicitly states the convergence precision." },
    { text: "It's far tighter than any practically needed tolerance." },
    { text: "The answer is on the order of 10⁻¹²." },
  ],
  solution: {
    steps: [{ description: "The pattern-search optimizer keeps halving its step size until negligibly small, reaching agreement to about 10⁻¹²." }],
    finalAnswer: `≈${value.toExponential(2)}`,
  },
  explanation: {
    correctIdea: "With a fully expressive ansatz and enough iterations, this simple optimizer converges essentially exactly for a smooth, single-minimum cost landscape.",
    whyCorrect: "Matches the engine's own actual convergence, not a rounded or idealized claim.",
    whyWrong: ["Expecting only 2-3 decimal places of agreement understates how tightly this particular smooth, low-dimensional optimization converges given 80 iterations."],
  },
};
