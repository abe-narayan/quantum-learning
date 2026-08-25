import { RYDBERG_EV } from "@/lib/quantum/hydrogenAtom";
import type { NumericProblem } from "@/lib/problems/types";

const ALPHA = 1 / 137;

function spinOrbitEnergyEV(n: number, l: number, j: number): number {
  const bracket = j * (j + 1) - l * (l + 1) - 0.75;
  return (RYDBERG_EV * ALPHA * ALPHA * bracket) / (2 * Math.pow(n, 3) * l * (l + 0.5) * (l + 1));
}

const splitting2p = spinOrbitEnergyEV(2, 1, 1.5) - spinOrbitEnergyEV(2, 1, 0.5);
const splitting3p = spinOrbitEnergyEV(3, 1, 1.5) - spinOrbitEnergyEV(3, 1, 0.5);
const ratio = splitting2p / splitting3p;

export const twoPToThreePSplittingRatio: NumericProblem = {
  meta: {
    slug: "2p-to-3p-splitting-ratio",
    title: "The n³ Scaling of Spin-Orbit Splitting",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/degenerate-perturbation-theory-and-fine-structure",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["fine-structure", "hydrogen", "scaling"],
    prerequisites: ["quantum-mastery/symmetry-scattering-and-semiclassical-methods/degenerate-perturbation-theory-and-fine-structure"],
  },
  question: {
    type: "numeric",
    prompt:
      "The 2p spin-orbit splitting is ΔE(n=2) ≈ 4.5287×10⁻⁵ eV; the 3p splitting is ΔE(n=3) ≈ 1.3419×10⁻⁵ eV. Since l and j are identical in both, only the 1/n³ prefactor differs. Compute the exact ratio ΔE(n=2)/ΔE(n=3).",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: ratio,
    tolerance: 0.01,
    incorrectFeedback: "Every other factor in the boxed formula is identical between the two cases — only 1/n³ changes, so the ratio is (3/2)³.",
  },
  hints: [
    { text: "Everything in the boxed formula except 1/n³ is the same for both (same l=1, same j=3/2 and j=1/2 bracket values)." },
    { text: "So the ratio ΔE(n=2)/ΔE(n=3) = (1/2³)/(1/3³) = 3³/2³." },
  ],
  solution: {
    steps: [{ description: "ΔE(n=2)/ΔE(n=3) = n₃³/n₂³ = 3³/2³ = 27/8 = 3.375, since every other factor cancels in the ratio." }],
    finalAnswer: "3.375",
  },
  explanation: {
    correctIdea: "Spin-orbit splitting scales as 1/n³ at fixed l and j, the same ⟨1/r³⟩∝1/n³ scaling verified numerically in the lesson.",
    whyCorrect: "3.375 = (3/2)³ exactly, matching the two numeric splittings given in the prompt to four significant figures.",
  },
};
