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
    inputHint: "as a decimal in scientific notation, e.g. 3e-9; only the order of magnitude is graded",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.95,
    toleranceType: "relative",
    nearMisses: [
      { value: 1e-9, tolerance: 0.95, feedback: "1e-9 would be respectable convergence for a noisy optimizer. This one does considerably better: the ansatz contains the exact ground state, and the landscape it searches is smooth, so it converges to near machine precision." },
      { value: 1, tolerance: 0.5, feedback: "1 is the magnitude of the exact ground energy, not the distance from it. The question asks how far the optimizer's answer falls short, and it falls short by a vanishingly small amount." },
    ],
    incorrectFeedback:
      "This is an order-of-magnitude question, so a rounded decimal like 0.01 will not do. The lesson states the optimizer converges to within about 10⁻¹² of the exact value: submit a number of that size.",
  },
  hints: [
    { text: "The lesson states the convergence precision directly. Look for it before estimating." },
    { text: "The optimizer halves its step size repeatedly until the step is negligible, so ask what limits the final accuracy: the algorithm, or double-precision arithmetic itself." },
    { text: "Line the found energy up against the exact −1 digit by digit. How many digits agree before they part company, and what size gap does that leave?" },
  ],
  solution: {
    steps: [{ description: "The pattern-search optimizer keeps halving its step size until negligibly small, reaching agreement to about 10⁻¹²." }],
    finalAnswer: `≈${value.toExponential(2)}`,
  },
  explanation: {
    correctIdea: "With a fully expressive ansatz and enough iterations, this optimizer converges to machine precision on a smooth, single-minimum cost landscape.",
    whyCorrect: "Matches the engine's measured convergence rather than a rounded or idealized claim.",
    whyWrong: ["Expecting only 2-3 decimal places of agreement understates how tightly this particular smooth, low-dimensional optimization converges given 80 iterations."],
  },
};
