import type { NumericProblem } from "@/lib/problems/types";

export const finiteWellGroundStateCalculation: NumericProblem = {
  meta: {
    slug: "finite-well-ground-state-calculation",
    title: "A Finite Well's Ground-State Energy",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["finite-square-well", "numerical-methods"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically"],
  },
  question: {
    type: "numeric",
    prompt: "For a finite well with half-width a = 2 and depth V0 = 3 (natural units), find the ground-state energy E (relative to V=0 outside).",
    inputHint: "a negative decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: -2.788155,
    tolerance: 0.001,
    incorrectFeedback: "This has no closed form, so the transcendental equation has to be solved numerically by bisection: find k where tan(k*a) = sqrt(2*V0-k^2)/k, then E = k^2/2 - V0.",
    nearMisses: [
      { value: 2.788155, tolerance: 0.001, feedback: "The sign is wrong. A bound state sits below the V = 0 asymptote outside the well, so its energy is negative on this reference." },
      { value: Math.PI ** 2 / (2 * 16), tolerance: 0.005, feedback: "That is the infinite well's ground state for the same width, which ignores V₀ entirely. A finite well leaks into the walls, lowering k and hence the energy." },
      { value: -3, feedback: "−3 is the well's floor. The ground state sits above it by the zero-point energy k²/2." },
    ],
  },
  hints: [
    { text: "This cannot be solved algebraically. Use the bisection method from this lesson." },
    { text: "Bisect on g(k) = k*tan(k*a) - sqrt(2*V0 - k^2), staying on the first tangent branch where k*a < pi/2." },
    { text: "Once you have k, convert it to an energy with E = k^2/2 - V0. Both terms matter: the answer sits above the well floor at -3." },
  ],
  solution: {
    steps: [
      { description: "Bisecting on $g(k)=k\\tan(ka)-\\sqrt{2V_0-k^2}$ for $a=2,V_0=3$ converges to $k\\approx0.6509$, on the first tangent branch $ka<\\pi/2$." },
      { description: "$E = k^2/2 - V_0 \\approx -2.7882$." },
    ],
    finalAnswer: "$E \\approx -2.7882$",
  },
  explanation: {
    correctIdea: "This is a numerical result; no closed-form shortcut exists.",
    whyCorrect: "Matches this platform's tested finiteSquareWellGroundStateEnergy function.",
    whyWrong: ["Using the infinite-well formula instead (E_1 = pi^2/(2*(2a)^2) ≈ 0.308, ignoring V0 entirely) confuses the two systems. The finite well requires the transcendental equation, not the infinite well's closed form."],
  },
};
