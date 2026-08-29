import type { ConceptualProblem } from "@/lib/problems/types";

export const groundStateAngularDependence: ConceptualProblem = {
  meta: {
    slug: "ground-state-angular-dependence",
    title: "Predicting Hydrogen's Ground-State Angular Shape",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/capstone-from-abstract-algebra-to-the-hydrogen-atom",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["capstone", "hydrogen-preview"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/capstone-from-abstract-algebra-to-the-hydrogen-atom"],
  },
  question: {
    type: "conceptual",
    prompt: "Using only this course's results (not any hydrogen-specific calculation), explain why hydrogen's ground state (l=0) has no angular dependence at all.",
    placeholder: "Recall which spherical harmonic corresponds to l=0...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["y_0^0", "y00", "y_00", "y zero zero", "only one m value", "single m value", "one allowed m", "only m=0", "m=0 only", "m must be 0", "m can only be 0", "l=0 has m=0"],
      ["constant", "no theta", "no phi", "independent of theta", "independent of angle", "independent of direction", "angle-independent", "spherically symmetric", "same in all directions", "same in every direction", "no preferred direction", "does not depend on theta", "doesn't depend on theta", "does not depend on angle", "doesn't depend on angle", "no angular"],
    ],
    incorrectFeedback: "Two steps are needed: which single angular function l=0 leaves available, and what is special about that function's formula.",
    partialFeedback: "Good. Now state explicitly what that formula's behavior as the angles vary implies physically.",
  },
  hints: [
    { text: "How many m values does l=0 allow? Which spherical harmonic is left?" },
    { text: "Look up the formula for that one spherical harmonic. What is unusual about how it treats the angles?" },
    { text: "If the angular factor of a wavefunction is the same number at every angle, what does the probability density look like on a sphere?" },
  ],
  solution: {
    steps: [
      { description: "l=0 allows only m=0, so the angular part must be Y₀⁰." },
      { description: "Y₀⁰=1/(2√π) is a constant, independent of θ and φ." },
      { description: "A constant angular function means the probability density has no directional preference: it is spherically symmetric." },
    ],
    finalAnswer: "Since l=0 forces the angular part to be the constant Y₀⁰, the ground state has no angular dependence. It is spherically symmetric.",
  },
  explanation: {
    correctIdea: "This prediction requires zero hydrogen-specific calculation. It follows entirely from this course's general angular momentum results.",
    whyCorrect: "This is exactly the capstone's worked example, generalized to an explanation in your own words.",
    whyWrong: ["Appealing to 'hydrogen is simple' without citing the specific Y₀⁰ formula and its l=0 origin doesn't demonstrate the actual chain of reasoning."],
  },
};
