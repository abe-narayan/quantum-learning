import type { NumericProblem } from "@/lib/problems/types";

const sigma = 0.5;
const value = 1 - (sigma * sigma) / 2 + (sigma * sigma * sigma * sigma) / 24;

export const qsvtPolynomialValueAtASingularValue: NumericProblem = {
  meta: {
    slug: "qsvt-polynomial-value-at-a-singular-value",
    title: "Evaluating a QSVT Polynomial at a Singular Value",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/the-quantum-singular-value-transformation",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["qsvt", "quantum-signal-processing", "block-encoding"],
    prerequisites: ["apex/algorithmic-frontiers/the-quantum-singular-value-transformation"],
  },
  question: {
    type: "numeric",
    prompt:
      "A QSVT phase sequence realizes the degree-4 polynomial P(x) = 1 - x^2/2 + x^4/24 (this lesson's worked-example polynomial). A block-encoded Hermitian matrix A has a singular value σ = 0.5. According to the QSVT main theorem, what is P(σ) — the value the corresponding term of P(A) contributes — to three decimal places?",
    inputHint: "as a decimal, three decimal places",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.002,
    incorrectFeedback: "Substitute σ=0.5 directly into P(x)=1-x²/2+x⁴/24: compute x²=0.25 and x⁴=0.0625 first, then combine.",
    nearMisses: [
      {
        value: 1 - (sigma * sigma) / 2,
        tolerance: 0.0005,
        feedback: "You stopped at the quadratic term. The x⁴/24 term is small but the question asks for three decimal places, and it moves the third one.",
      },
      {
        value: 1,
        feedback: "That treats P as the constant polynomial 1. Both correction terms contribute at σ=0.5.",
      },
      {
        value: 1 + (sigma * sigma) / 2 + (sigma * sigma * sigma * sigma) / 24,
        tolerance: 0.0005,
        feedback: "The quadratic term is subtracted, not added: P(x) = 1 - x²/2 + x⁴/24, the alternating truncation of cos.",
      },
    ],
  },
  hints: [
    { text: "The QSVT main theorem says P(A) = Σᵢ P(σᵢ)|uᵢ⟩⟨vᵢ| — you just need P evaluated at this one σ, exactly as in single-qubit QSP." },
    { text: "σ=0.5, so σ²=0.25 and σ⁴=0.0625." },
    { text: "Divide σ² by 2 and σ⁴ by 24, then combine with the leading 1, watching the alternating signs: the quadratic term subtracts, the quartic adds back." },
  ],
  solution: {
    steps: [
      { description: "By the QSVT main theorem, the subspace for singular value σ contributes exactly P(σ) to P(A) — the same value single-qubit QSP would produce for signal x=σ." },
      { description: "Compute σ²=0.25 and σ⁴=0.0625 for σ=0.5.", latex: "\\sigma^2=0.25,\\qquad \\sigma^4=0.0625" },
      { description: "Substitute: P(0.5) = 1 - 0.25/2 + 0.0625/24 = 1 - 0.125 + 0.0026042.", latex: "P(0.5)=1-0.125+0.0026042\\approx0.878" },
    ],
    finalAnswer: `P(0.5) ≈ ${value.toFixed(3)}`,
  },
  explanation: {
    correctIdea: "QSVT guarantees that whatever polynomial the underlying QSP phases realize gets applied, unchanged, to every one of A's singular values independently.",
    whyCorrect: "0.878 is close to cos(0.5)≈0.8776, exactly as expected since P is a degree-4 truncation of cos's Taylor series — a small, honest truncation error, not a sign of a mistake.",
    whyWrong: ["Answering exactly 1 would ignore the -x²/2 and +x⁴/24 correction terms entirely, treating P as if it were the constant polynomial 1."],
  },
};
