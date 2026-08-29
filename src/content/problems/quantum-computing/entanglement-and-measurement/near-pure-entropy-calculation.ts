import { Complex } from "@/lib/quantum/complex";
import { Matrix } from "@/lib/quantum/matrix";
import { vonNeumannEntropy } from "@/lib/quantum/densityMatrix";
import type { NumericProblem } from "@/lib/problems/types";

const rho = new Matrix([
  [new Complex(0.6), new Complex(0.48)],
  [new Complex(0.48), new Complex(0.4)],
]);
const value = vonNeumannEntropy(rho);

export const nearPureEntropyCalculation: NumericProblem = {
  meta: {
    slug: "near-pure-entropy-calculation",
    title: "Entropy of a Near-Pure Density Matrix",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/purity-entropy-and-information",
    difficulty: "advanced",
    estimatedMinutes: 8,
    problemType: "numeric",
    tags: ["von-neumann-entropy", "eigenvalues"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/purity-entropy-and-information"],
  },
  question: {
    type: "numeric",
    prompt:
      "Find the von Neumann entropy of $\\rho=\\begin{pmatrix}0.6&0.48\\\\0.48&0.4\\end{pmatrix}$ (Hermitian, trace 1, and positive semidefinite since $0.6\\times0.4-0.48^2=0.0096\\geq0$).",
    inputHint: "in bits, as a decimal (should be small but nonzero)",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "First find the eigenvalues via the quadratic formula, using a=0.6, d=0.4, z=0.48 — they should be close to 1 and 0, but not exactly.",
    nearMisses: [
      {
        value: 0,
        tolerance: 0.005,
        feedback:
          "Zero entropy would require an exactly pure ρ, which needs the off-diagonal entry to be √(0.6×0.4) ≈ 0.4899. Here it is 0.48, slightly less, so the smaller eigenvalue is small but nonzero and contributes most of the entropy.",
      },
      {
        value: 0.971,
        tolerance: 0.01,
        feedback: "That is the entropy of diag(0.6, 0.4). The off-diagonal entries matter: you have to diagonalize first, and this ρ's eigenvalues are near 0.99 and 0.01, not 0.6 and 0.4.",
      },
    ],
  },
  hints: [
    { text: "Use λ± = (a+d)/2 ± √(((a-d)/2)² + z²) with a=0.6, d=0.4, z=0.48." },
    { text: "(a+d)/2 = 0.5, and ((a-d)/2)²+z² = 0.01+0.2304 = 0.2404." },
    { text: "√0.2404 ≈ 0.4903, giving eigenvalues ≈ 0.9903 and ≈ 0.0097 — close to a pure state, but not exactly." },
  ],
  solution: {
    steps: [
      { description: "Eigenvalues: $\\lambda_\\pm = 0.5\\pm\\sqrt{0.01+0.2304}=0.5\\pm0.4903$, giving $\\lambda_+\\approx0.9903,\\lambda_-\\approx0.0097$." },
      { description: "$S = -0.9903\\log_2(0.9903)-0.0097\\log_2(0.0097) \\approx 0.014+0.065$", latex: "S \\approx 0.079 \\text{ bits}" },
    ],
    finalAnswer: "S ≈ 0.079 bits — small, since this ρ is close to (but not exactly) a pure state.",
  },
  explanation: {
    correctIdea: "This matrix's off-diagonal entry (0.48) is close to, but slightly below, the value (√0.24≈0.4899) that would make it exactly pure.",
    whyCorrect: "The eigenvalues (≈0.99, ≈0.01) are close to (1,0), giving small but nonzero entropy — not exactly 0.",
    whyWrong: ["Answering exactly 0 would incorrectly assume this matrix is exactly pure, but its off-diagonal entry (0.48) doesn't quite reach the value needed for that."],
  },
};
