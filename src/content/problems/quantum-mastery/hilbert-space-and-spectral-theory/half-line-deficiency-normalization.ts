import type { NumericProblem } from "@/lib/problems/types";

// n_+ deficiency solution for p on L^2(0,infinity): psi(x) = e^{-x}.
const normSquared = 0.5; // integral_0^infinity e^{-2x} dx = 1/2, computed in closed form below.

export const halfLineDeficiencyNormalization: NumericProblem = {
  meta: {
    slug: "half-line-deficiency-normalization",
    title: "Is the Deficiency Solution Normalizable?",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["self-adjointness", "deficiency-indices", "half-line"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness"],
  },
  question: {
    type: "numeric",
    prompt:
      "The n₊ deficiency solution for p̂=−i d/dx on L²(0,∞) is ψ(x)=e^{−x}. Compute ‖ψ‖² = ∫₀^∞ |e^{−x}|² dx.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: normSquared,
    tolerance: 0.01,
    incorrectFeedback:
      "Compute ∫₀^∞ e^{−2x} dx directly: it's a standard exponential integral, [-e^{-2x}/2]₀^∞.",
  },
  hints: [
    { text: "|e^{-x}|^2 = e^{-2x} for real x." },
    { text: "∫₀^∞ e^{-2x} dx = [-e^{-2x}/2]₀^∞." },
    { text: "At x=0 this gives 1/2; at x→∞ the term vanishes." },
  ],
  solution: {
    steps: [
      { description: "Square the deficiency solution.", latex: "|e^{-x}|^2 = e^{-2x}" },
      {
        description: "Integrate over the half-line.",
        latex: "\\int_0^\\infty e^{-2x}\\,dx = \\left[-\\frac{1}{2}e^{-2x}\\right]_0^\\infty = 0 - \\left(-\\frac12\\right) = \\frac12",
      },
    ],
    finalAnswer: "‖ψ‖² = 1/2, so ψ(x)=e^{-x} IS normalizable on (0,∞), giving n₊=1.",
  },
  explanation: {
    correctIdea:
      "e^{-x} decays on the half-line, so its L² norm converges — it genuinely belongs to L²(0,∞), which is exactly why it counts toward the n₊ deficiency index.",
    whyCorrect:
      "The exponential integral ∫e^{-2x}dx converges because the integrand decays; this is the direct computation behind the lesson's claim n₊=1.",
    whyWrong: [
      "Confusing this with the companion solution e^{+x}, whose integral ∫₀^∞e^{2x}dx diverges (n₋=0) — the two deficiency solutions behave oppositely, which is exactly why the indices are unequal.",
    ],
  },
};
