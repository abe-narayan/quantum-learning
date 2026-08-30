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
      {
        phrases: ["y_0^0", "y00", "y_00", "y zero zero", "only one m value", "single m value", "one allowed m", "only m=0", "m=0 only", "m must be 0", "m can only be 0", "l=0 has m=0"],
        missingFeedback:
          "Start from l=0 and say what the general angular-momentum results leave available for m, and which single spherical harmonic that picks out.",
      },
      {
        phrases: ["constant", "no theta", "no phi", "independent of theta", "independent of angle", "independent of direction", "angle-independent", "spherically symmetric", "same in all directions", "same in every direction", "no preferred direction", "does not depend on theta", "doesn't depend on theta", "does not depend on angle", "doesn't depend on angle", "no angular"],
        missingFeedback:
          "You have the harmonic. Now say what that function looks like as you move around the sphere, and what that means for the shape of the state.",
      },
    ],
    incorrectFeedback: "Two steps are needed: which single angular function l=0 leaves available, and what is special about that function's formula.",
    partialFeedback: "Now state what that formula's behavior as the angles vary implies physically.",
    modelAnswers: [
      "l=0 forces m=0, and the only spherical harmonic with l=0 is Y_0^0, which is a constant. So the angular part carries no theta or phi dependence at all and the state is spherically symmetric.",
      "For l=0 there is only one allowed m, and Y_00 is just a number. The wavefunction therefore does not depend on angle: it looks the same in every direction.",
    ],
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
    whyCorrect: "This is the capstone's worked example, restated as an explanation in your own words.",
    whyWrong: ["Appealing to 'hydrogen is simple' without citing the Y₀⁰ formula and its l=0 origin does not demonstrate the chain of reasoning."],
  },
};
