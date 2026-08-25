import type { NumericProblem } from "@/lib/problems/types";

const theta = Math.PI / 2;
const gamma = -Math.PI * (1 - Math.cos(theta));

export const berryPhaseAt90Degrees: NumericProblem = {
  meta: {
    slug: "berry-phase-at-90-degrees",
    title: "Berry Phase for a Field Sweeping the Equator",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/the-adiabatic-theorem-and-berry-phase",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["berry-phase", "adiabatic-theorem"],
    prerequisites: ["quantum-mastery/symmetry-scattering-and-semiclassical-methods/the-adiabatic-theorem-and-berry-phase"],
  },
  question: {
    type: "numeric",
    prompt:
      "A spin-1/2's field direction traces a cone of half-angle θ=90° (sweeping exactly along the equator of directions). Using γ=−π(1−cosθ), compute the Berry phase γ in radians.",
    inputHint: "in radians, as a decimal",
  },
  answer: {
    type: "numeric",
    value: gamma,
    tolerance: 0.01,
    incorrectFeedback: "cos(90°)=0, so the solid angle is the full hemisphere's Ω=2π, and γ=−Ω/2.",
  },
  hints: [
    { text: "cos(90°)=0, so Ω=2π(1−0)=2π." },
    { text: "γ=−Ω/2=−π." },
  ],
  solution: {
    steps: [{ description: "Ω=2π(1−cos90°)=2π(1−0)=2π. γ=−Ω/2=−π≈−3.1416." }],
    finalAnswer: "≈−3.1416 rad (−π)",
  },
  explanation: {
    correctIdea: "θ=90° is exactly the hemisphere case: the loop encloses half the sphere of field directions, and the Berry phase is minus half of that hemisphere's solid angle.",
    whyCorrect: "Matches the lesson's own numeric loop-integral computation at θ=90°, one of the seven angles plotted directly against this closed form.",
  },
};
