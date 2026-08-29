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
    nearMisses: [
      { value: 1.511, tolerance: 0.02, feedback: "1.51 eV is |E₃|, the binding energy of the n=3 level. The photon carries the difference between the two levels, not one of them." },
      { value: 3.4, tolerance: 0.02, feedback: "3.40 eV is |E₂|. The emitted photon carries E₃ − E₂, the gap between the levels." },
      { value: -1.889, tolerance: 0.02, feedback: "The subtraction ran the wrong way. The electron falls to a more tightly bound level, so it releases energy and the photon energy is positive." },
      { value: 12.09, tolerance: 0.05, feedback: "12.09 eV is the n=3 to n=1 transition, in the Lyman series. This one ends at n=2." },
    ],
  },
  hints: [
    { text: "Two energies are involved. Compute each level from the -13.6/n² ladder, then ask which way the subtraction goes for an emitted photon." },
    { text: "E₃ = -13.6/9 ≈ -1.51 eV; E₂ = -13.6/4 = -3.40 eV." },
    { text: "The released photon energy is E₃ - E₂: a less-negative energy minus a more-negative one, so the result comes out positive." },
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
    correctIdea: "This is the well-known Balmer-alpha line (visible red light, 656 nm), computed directly from hydrogenEnergyLevel(3) - hydrogenEnergyLevel(2) rather than looked up.",
    whyCorrect: "Matches the standard hydrogen spectral series value for this specific transition.",
    whyWrong: ["Subtracting in the wrong order (E₂-E₃) gives a negative number, which isn't a physical emitted-photon energy."],
  },
};
