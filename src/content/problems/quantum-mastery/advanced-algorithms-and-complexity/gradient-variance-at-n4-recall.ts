import type { NumericProblem } from "@/lib/problems/types";

const value = 2.707e-2;

export const gradientVarianceAtN4Recall: NumericProblem = {
  meta: {
    slug: "gradient-variance-at-n4-recall",
    title: "Recalling the Measured Gradient Variance at n=4",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["barren-plateaus", "vqe"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability"],
  },
  question: {
    type: "numeric",
    prompt: "In this lesson's own real gradient-variance measurement (4n layers, 300 random parameter draws), approximately what variance was measured at n=4 qubits?",
    inputHint: "as a decimal, to about two significant figures",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    toleranceType: "relative",
    incorrectFeedback: "The lesson's table lists the measured variance at each qubit count from n=2 to n=6. Check the n=4 row and enter it to about two significant figures.",
  },
  hints: [
    { text: "The lesson's table lists variance at n=2,3,4,5,6." },
    { text: "It's the middle row, between n=3's ≈0.069 and n=5's ≈0.017." },
    { text: "Read the n=4 row of the table. As a check, it should sit between its two neighbors and continue the table's rough halving trend per added qubit." },
  ],
  solution: {
    steps: [{ description: "The lesson's real, seeded computation measured gradient variance ≈2.707×10⁻² at n=4 qubits (16 layers, 128 parameters, 300 samples)." }],
    finalAnswer: "≈2.707×10⁻²",
  },
  explanation: {
    correctIdea: "This is a directly measured number from this platform's own real variational-circuit engine, not a theoretical prediction alone.",
    whyCorrect: "It fits the lesson's overall pattern: roughly halving with each additional qubit, from ≈0.130 at n=2 down to ≈0.0076 at n=6.",
    whyWrong: ["Confusing this with the n=2 or n=6 values misreads which row of the table is being asked about."],
  },
};
