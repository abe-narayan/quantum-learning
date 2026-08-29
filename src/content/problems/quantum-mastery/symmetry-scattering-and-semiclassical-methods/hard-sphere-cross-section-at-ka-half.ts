import type { NumericProblem } from "@/lib/problems/types";

const a = 1;
const ka = 0.5;
const k = ka / a;
const delta0 = -ka;
const sigma0 = ((4 * Math.PI) / (k * k)) * Math.sin(delta0) ** 2;

export const hardSphereCrossSectionAtKaHalf: NumericProblem = {
  meta: {
    slug: "hard-sphere-cross-section-at-ka-half",
    title: "Hard-Sphere s-Wave Cross Section at ka=0.5",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["scattering", "partial-waves", "s-matrix"],
    prerequisites: [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix",
    ],
  },
  question: {
    type: "numeric",
    prompt:
      "Using δ₀=−ka and σ₀=(4π/k²)sin²δ₀, compute σ₀ for a hard sphere of radius a=1 at ka=0.5 (so k=0.5).",
    inputHint: "as a decimal (same units as a²)",
  },
  answer: {
    type: "numeric",
    value: sigma0,
    tolerance: sigma0 * 0.02,
    incorrectFeedback: "First find δ₀=−0.5, then σ₀=(4π/0.5²)sin²(0.5).",
    nearMisses: [
      { value: 4 * Math.PI, tolerance: 0.05, feedback: "4π is the ka→0 limit, 4πa² with a=1. At ka=0.5 the cross section has already fallen a little below it." },
      { value: 16 * Math.PI, tolerance: 0.1, feedback: "16π is the prefactor 4π/k² alone. It still has to be multiplied by sin²δ₀ ≈ 0.23." },
    ],
  },
  hints: [
    { text: "δ₀=−ka=−0.5 rad." },
    { text: "k²=0.25, so 4π/k²=16π." },
    { text: "sin(0.5)≈0.4794, so sin²(0.5)≈0.2300." },
  ],
  solution: {
    steps: [
      { description: "δ₀=−0.5 rad." },
      { description: "σ₀=(4π/(0.5)²)·sin²(0.5)=16π·(0.2300)≈11.55." },
    ],
    finalAnswer: "≈11.55",
  },
  explanation: {
    correctIdea: "Compare to the low-energy limit 4π≈12.57 (ka→0): at ka=0.5 the cross section has already dropped to about 92% of that limit, showing the approach isn't instantaneous even though it's exact as ka→0.",
    whyCorrect: "Direct substitution into the exact closed form derived in the lesson, δ₀=−ka for hard-sphere s-wave scattering.",
  },
};
