import { RYDBERG_EV } from "@/lib/quantum/hydrogenAtom";
import type { NumericProblem } from "@/lib/problems/types";

const ALPHA = 1 / 137;

function spinOrbitEnergyEV(n: number, l: number, j: number): number {
  const bracket = j * (j + 1) - l * (l + 1) - 0.75;
  return (RYDBERG_EV * ALPHA * ALPHA * bracket) / (2 * Math.pow(n, 3) * l * (l + 0.5) * (l + 1));
}

const splitting = spinOrbitEnergyEV(3, 1, 1.5) - spinOrbitEnergyEV(3, 1, 0.5);

export const threePSpinOrbitSplitting: NumericProblem = {
  meta: {
    slug: "3p-spin-orbit-splitting",
    title: "Spin-Orbit Splitting of the 3p Level",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/degenerate-perturbation-theory-and-fine-structure",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["fine-structure", "degenerate-perturbation-theory", "hydrogen"],
    prerequisites: ["quantum-mastery/symmetry-scattering-and-semiclassical-methods/degenerate-perturbation-theory-and-fine-structure"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using E_SO(n,l,j) = (13.6 eV)·α²·[j(j+1)−l(l+1)−3/4] / (2n³l(l+½)(l+1)), compute the 3p spin-orbit splitting ΔE = E_SO(j=3/2) − E_SO(j=1/2) for n=3, l=1, in eV.",
    inputHint: "in eV, scientific notation is fine, e.g. 1.34e-5",
  },
  answer: {
    type: "numeric",
    value: splitting,
    tolerance: splitting * 0.02,
    toleranceType: "absolute",
    incorrectFeedback: "Compute E_SO at j=3/2 and j=1/2 separately for n=3, l=1 using the boxed formula, then subtract.",
  },
  hints: [
    { text: "j(j+1)−l(l+1)−3/4 equals +1 at j=3/2 and −2 at j=1/2, for any l=1 level — the same brackets as the 2p worked example, only n changes." },
    { text: "The shared denominator is 2n³l(l+½)(l+1) = 2·27·1·1.5·2 = 162 at n=3." },
    { text: "ΔE(n=3) = (13.6 eV)·α²·[1−(−2)]/162 = (13.6 eV)·α²/54." },
  ],
  solution: {
    steps: [
      { description: "Bracket at j=3/2: 3/2·5/2 − 1·2 − 3/4 = 3.75 − 2 − 0.75 = 1. Bracket at j=1/2: 1/2·3/2 − 2 − 3/4 = −2." },
      { description: "Denominator: 2·3³·1·1.5·2 = 162." },
      { description: "ΔE = (13.6 eV)·α²·(1−(−2))/162 = (13.6 eV)·α²/54, with α=1/137." },
    ],
    finalAnswer: `≈${splitting.toExponential(4)} eV`,
  },
  explanation: {
    correctIdea: "The 3p splitting is smaller than the 2p splitting by exactly the 1/n³ scaling (both share l=1, j=3/2 and 1/2), a direct consequence of ⟨1/r³⟩∝1/n³.",
    whyCorrect: "Matches the boxed formula from Degenerate Perturbation Theory and Fine Structure evaluated at n=3 instead of n=2.",
    whyWrong: ["Reusing the n=2 denominator (48, not 162) is a common slip — the n³ factor must be recomputed for n=3."],
  },
};
