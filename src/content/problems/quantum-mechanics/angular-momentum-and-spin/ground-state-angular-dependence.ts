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
      ["y_0\\^0", "only one m value", "l=0 has m=0"],
      ["constant", "no theta.*phi dependence", "spherically symmetric"],
    ],
    incorrectFeedback: "Recall which spherical harmonic corresponds to l=0, and what that function's actual formula looks like.",
    partialFeedback: "Good — now state explicitly what that formula's lack of θ,φ dependence implies physically.",
  },
  hints: [
    { text: "l=0 has exactly one allowed m value, m=0 (2l+1=1 state)." },
    { text: "The corresponding spherical harmonic is Y₀⁰=1/(2√π) — a constant." },
    { text: "A constant angular function means no preferred direction at all." },
  ],
  solution: {
    steps: [
      { description: "l=0 allows only m=0, so the angular part must be Y₀⁰." },
      { description: "Y₀⁰=1/(2√π) is a constant, independent of θ and φ." },
      { description: "A constant angular function means the probability density has no directional preference — spherically symmetric." },
    ],
    finalAnswer: "Since l=0 forces the angular part to be the constant Y₀⁰, the ground state has no angular dependence — it's spherically symmetric.",
  },
  explanation: {
    correctIdea: "This prediction requires zero hydrogen-specific calculation — it follows entirely from this course's general angular momentum results.",
    whyCorrect: "This is exactly the capstone's worked example, generalized to an explanation in your own words.",
    whyWrong: ["Appealing to 'hydrogen is simple' without citing the specific Y₀⁰ formula and its l=0 origin doesn't demonstrate the actual chain of reasoning."],
  },
};
