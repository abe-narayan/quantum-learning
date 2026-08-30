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
      {
        phrases: ["quantized", "quantization", "discrete values", "discrete set", "discrete ladder", "integer", "quantum number"],
        missingFeedback:
          "The older theorem already says the action is preserved. Say what WKB says about which values it may take at all.",
      },
      {
        phrases: ["hbar", "planck", "action-dimensioned constant", "quantum of action"],
        missingFeedback:
          "You have said the values are restricted. Now say what sets the spacing of those values, and note that this constant is absent from the older statement entirely.",
      },
      {
        phrases: ["classical", "adiabatic invariant", "stays constant", "conserved"],
        missingFeedback:
          "Start by saying what the pre-quantum theorem on its own actually guarantees about the action variable under slow change.",
      },
    ],
    incorrectFeedback:
      "Two statements are being run together and the answer has to pull them apart. One of them predates quantum theory entirely: it says what happens to I when the Hamiltonian is varied slowly. The other is what WKB contributes: it says which values of I are permitted at all. Say which is which, and say where a constant with the dimensions of action first enters the story.",
    partialFeedback: "Good. Now separate them explicitly: state the part that holds with no reference to quantum theory, then state exactly what WKB adds on top, and where the action-dimensioned constant appears.",
    modelAnswers: [
      "The classical statement says only that the action I is conserved under slow variation, whatever value it happens to have. WKB adds that not every value is allowed: I is quantized to the discrete set (n+1/2)hbar. That is where Planck's constant and the integer quantum number n first appear.",
      "Classically the adiabatic invariant stays constant but can be anything at all. WKB restricts it to a discrete ladder, and the scale of the rungs is hbar, so Planck's constant enters exactly as the quantization scale.",
    ],
  },
  hints: [
    { text: "The adiabatic theorem of mechanics says I does not change value as the Hamiltonian is slowly varied. Ask whether it says anything about which values I may take in the first place." },
    { text: "WKB's condition restricts I to I=(n+½)ħ. Ask what changed: the values I may take, or the fact that it is preserved?" },
    { text: "Look at the spacing between consecutive permitted values of I. Which constant sets it, and does that constant appear anywhere in the slow-variation theorem?" },
  ],
  solution: {
    steps: [
      { description: "Classically, I=(1/2π)∮p dx can take any real value, and adiabatic invariance says whatever value it starts with, it keeps as the Hamiltonian is slowly varied." },
      { description: "WKB's condition, ∫p dx=(n+½)πħ, i.e. I=(n+½)ħ, additionally restricts which values of I are physically realizable at all: only a discrete, ħ-spaced ladder, not the full classical continuum." },
      { description: "So ħ enters specifically as the quantization scale of an otherwise purely classical conserved quantity: new physics (quantization) added on top of a classical fact (conservation)." },
    ],
    finalAnswer:
      "The classical theorem gives conservation of I under slow variation, for any value of I. WKB adds that only the discrete values I=(n+½)ħ are allowed at all, and that is exactly where Planck's constant and the quantum number n first appear.",
  },
  explanation: {
    correctIdea: "This is the capstone's central synthesis point: WKB is not an unrelated new idea bolted onto quantum mechanics. It is the natural quantization of an already-existing classical structure, adiabatic invariance, with Planck's constant entering only as a quantization scale.",
  },
};
