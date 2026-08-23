import type { NumericProblem } from "@/lib/problems/types";

export const kappaCalculation: NumericProblem = {
  meta: {
    slug: "kappa-calculation",
    title: "The Decay Constant Inside a Barrier",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["tunneling", "barrier"],
    prerequisites: ["quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier"],
  },
  question: {
    type: "numeric",
    prompt: "A particle with energy E = 6 approaches a barrier of height V0 = 10 (natural units, hbar = m = 1). Find the decay constant kappa = sqrt(2*(V0-E)).",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 2.828427,
    tolerance: 0.001,
    incorrectFeedback: "kappa = sqrt(2*m*(V0-E))/hbar. With hbar=m=1, this is just sqrt(2*(V0-E)).",
  },
  hints: [
    { text: "First compute V0-E, the energy deficit." },
    { text: "kappa = sqrt(2*(V0-E)) in natural units." },
  ],
  solution: {
    steps: [
      { description: "$V_0-E = 10-6 = 4$." },
      { description: "$\\kappa = \\sqrt{2\\times4} = \\sqrt8 \\approx 2.828$." },
    ],
    finalAnswer: "$\\kappa \\approx 2.828$",
  },
  explanation: {
    correctIdea: "The decay constant inside a classically forbidden region depends on the energy deficit V0-E, not on V0 or E alone.",
    whyCorrect: "Direct substitution into the derived formula for kappa.",
    whyWrong: ["Using V0+E instead of V0-E, or forgetting the factor of 2 inside the square root, both give the wrong decay rate."],
  },
};
