import type { ConceptualProblem } from "@/lib/problems/types";

export const wkbAsQuantizedAdiabaticInvariant: ConceptualProblem = {
  meta: {
    slug: "wkb-as-quantized-adiabatic-invariant",
    title: "WKB Quantization as a Quantized Classical Adiabatic Invariant",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/capstone-symmetry-and-the-classical-limit",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["wkb", "adiabatic-invariance", "synthesis", "conceptual"],
    prerequisites: [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/capstone-symmetry-and-the-classical-limit",
    ],
  },
  question: {
    type: "conceptual",
    prompt:
      "The classical action variable I=(1/2π)∮p dx is an adiabatic invariant under a slowly-varying classical Hamiltonian. Explain what WKB's quantization condition ∫p dx=(n+½)πħ adds on top of this classical statement, and why that specific addition is where ħ (and the quantum number n) first enters.",
    placeholder: "The classical statement alone says I stays constant. WKB adds...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["quantized", "discrete values", "integer", "n"],
      ["ħ", "hbar", "planck"],
      ["classical", "adiabatic invariant", "stays constant", "conserved"],
    ],
    incorrectFeedback:
      "State clearly: the classical fact is that I is CONSERVED (stays constant) under slow variation; WKB's addition is that I is further restricted to a discrete, ħ-spaced set of allowed values.",
    partialFeedback: "Good — make sure you explicitly separate what's purely classical (conservation) from what WKB adds (quantization in units of ħ).",
  },
  hints: [
    { text: "The classical adiabatic invariance theorem says I doesn't change value as the Hamiltonian is slowly varied — it says nothing about WHICH values I is allowed to take in the first place." },
    { text: "WKB's condition additionally restricts I to I=(n+½)ħ, n=0,1,2,..., a discrete ladder of allowed values, not a continuum." },
    { text: "ħ enters exactly here, as the spacing between consecutive allowed values of the classical invariant, not anywhere in the classical conservation statement itself." },
  ],
  solution: {
    steps: [
      { description: "Classically, I=(1/2π)∮p dx can take any real value, and adiabatic invariance says whatever value it starts with, it keeps as the Hamiltonian is slowly varied." },
      { description: "WKB's condition, ∫p dx=(n+½)πħ, i.e. I=(n+½)ħ, additionally restricts which values of I are physically realizable at all: only a discrete, ħ-spaced ladder, not the full classical continuum." },
      { description: "So ħ enters specifically as the quantization scale of an otherwise purely classical conserved quantity — genuinely new physics (quantization), added on top of a genuinely classical fact (conservation)." },
    ],
    finalAnswer:
      "The classical theorem gives conservation of I under slow variation, for any value of I; WKB adds that only the discrete values I=(n+½)ħ are allowed at all, which is exactly where ħ and the quantum number n first appear.",
  },
  explanation: {
    correctIdea: "This is the capstone's central synthesis point: WKB is not an unrelated new idea bolted onto quantum mechanics — it's the natural quantization of an already-existing classical structure (adiabatic invariance), with ħ entering only as a quantization scale.",
  },
};
