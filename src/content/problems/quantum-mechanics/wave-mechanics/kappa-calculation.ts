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
    prompt: "A particle with energy E = 6 approaches a barrier of height V0 = 10 (natural units, hbar = m = 1). Find the decay constant kappa that governs the wavefunction's exponential decay inside the barrier.",
    inputHint: "a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 2.828427,
    tolerance: 0.001,
    incorrectFeedback: "kappa = sqrt(2*m*(V0-E))/hbar. With hbar=m=1, this is just sqrt(2*(V0-E)).",
    nearMisses: [
      { value: 2, feedback: "2 is √(V₀−E), missing the factor of 2 inside the root that comes from 2m/ħ²." },
      { value: 4, feedback: "4 is the energy deficit V₀ − E. κ is the square root of twice that." },
      { value: Math.sqrt(32), tolerance: 0.005, feedback: "That uses V₀ + E. Inside a barrier the decay constant is set by how far the energy falls short, V₀ − E." },
    ],
  },
  hints: [
    { text: "Inside the barrier the kinetic energy would have to be negative, so the wavenumber turns imaginary and the oscillation becomes a decay." },
    { text: "Take the free-particle relation between wavenumber and energy and put the energy deficit V0 minus E where the kinetic energy used to sit." },
    { text: "Work the deficit out first, then the factor of 2, then the root. Stopping before the root leaves kappa squared rather than kappa." },
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
