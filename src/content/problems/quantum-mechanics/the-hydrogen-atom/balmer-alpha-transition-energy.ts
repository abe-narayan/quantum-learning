import { hydrogenEnergyLevel } from "@/lib/quantum/hydrogenAtom";
import type { NumericProblem } from "@/lib/problems/types";

const value = hydrogenEnergyLevel(3) - hydrogenEnergyLevel(2);

export const balmerAlphaTransitionEnergy: NumericProblem = {
  meta: {
    slug: "balmer-alpha-transition-energy",
    title: "The Balmer-Alpha Transition Energy (n=3 → n=2)",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["energy-levels", "spectroscopy"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels"],
  },
  question: {
    type: "numeric",
    prompt: "What photon energy (in eV) is released when a hydrogen electron falls from n=3 to n=2?",
    inputHint: "in eV, positive number",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.02,
    incorrectFeedback: "Compute E₃ and E₂ separately using -13.6/n², then take E₃ minus E₂ (the energy released is the magnitude of the drop).",
  },
  hints: [
    { text: "E₃ = -13.6/9 ≈ -1.51 eV; E₂ = -13.6/4 = -3.40 eV." },
    { text: "The photon energy released equals E₃ - E₂ (a less-negative energy minus a more-negative one)." },
    { text: "≈1.89 eV." },
  ],
  solution: {
    steps: [
      { description: "E₃ = -13.6/9 ≈ -1.511 eV." },
      { description: "E₂ = -13.6/4 = -3.40 eV." },
      { description: "Released photon energy = E₃ - E₂ ≈ -1.511 - (-3.40) = 1.89 eV." },
    ],
    finalAnswer: "≈1.89 eV",
  },
  explanation: {
    correctIdea: "This is the well-known Balmer-alpha line (visible red light, 656 nm) — computed directly from hydrogenEnergyLevel(3) - hydrogenEnergyLevel(2), not looked up.",
    whyCorrect: "Matches the standard hydrogen spectral series value for this specific transition.",
    whyWrong: ["Subtracting in the wrong order (E₂-E₃) gives a negative number, which isn't a physical emitted-photon energy."],
  },
};
