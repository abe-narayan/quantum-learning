import type { NumericProblem } from "@/lib/problems/types";

const ka = 1;
const ratio = Math.sin(ka) ** 2 / (ka * ka);

export const crossSectionRatioAtKa1: NumericProblem = {
  meta: {
    slug: "cross-section-ratio-at-ka-1",
    title: "s-Wave Cross Section as a Fraction of the Low-Energy Limit",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["scattering", "partial-waves"],
    prerequisites: [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix",
    ],
  },
  question: {
    type: "numeric",
    prompt:
      "σ₀(ka)/(4πa²) simplifies to sin²(ka)/(ka)² (a dimensionless function of ka alone). Compute this ratio at ka=1.",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: ratio,
    tolerance: 0.005,
    incorrectFeedback: "σ₀=(4π/k²)sin²(ka) and 4πa²=4π/(ka/a)²·(ka)² ... simplify directly: σ₀/(4πa²)=sin²(ka)/(ka)².",
    nearMisses: [
      { value: Math.sin(1), tolerance: 0.005, feedback: "That is sin(1) without the square. The cross section depends on sin²δ₀." },
      { value: 1, feedback: "1 is the ka→0 limit, where the cross section saturates at 4πa². At ka=1 it has already fallen below that." },
    ],
  },
  hints: [
    { text: "σ₀=(4π/k²)sin²(ka), and k=ka/a, so k²=(ka)²/a². Substituting, σ₀=4πa²·sin²(ka)/(ka)²." },
    { text: "Dividing both sides by 4πa² leaves exactly sin²(ka)/(ka)²." },
    { text: "sin(1 rad)≈0.8415." },
  ],
  solution: {
    steps: [{ description: "sin²(1)/(1)² = (0.8415)² ≈ 0.7081." }],
    finalAnswer: "≈0.7081",
  },
  explanation: {
    correctIdea: "This dimensionless ratio is exactly what the lesson's plotted curve shows: it starts at 1 as ka→0 (the 4πa² limit) and falls smoothly as ka grows, already down to about 71% by ka=1.",
  },
};
