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
    inputHint: "a decimal (negative)",
  },
  answer: {
    type: "numeric",
    value: -2.788155,
    tolerance: 0.001,
    incorrectFeedback: "This requires solving the transcendental equation numerically (bisection) — it has no closed form. Use the platform's finiteSquareWellGroundStateEnergy approach: find k where tan(k*a) = sqrt(2*V0-k^2)/k, then E = k^2/2 - V0.",
  },
  hints: [
    { text: "This cannot be solved algebraically — it requires the bisection method from this lesson." },
    { text: "The engine's finiteSquareWellGroundStateEnergy(2, 3) computes this directly." },
  ],
  solution: {
    steps: [
      { description: "Bisecting on $g(k)=k\\tan(ka)-\\sqrt{2V_0-k^2}$ for $a=2,V_0=3$ converges to $k\\approx1.0209$." },
      { description: "$E = k^2/2 - V_0 \\approx -2.7882$." },
    ],
    finalAnswer: "$E \\approx -2.7882$",
  },
  explanation: {
    correctIdea: "This is a genuine numerical result — no closed-form shortcut exists.",
    whyCorrect: "Directly matches this platform's tested finiteSquareWellGroundStateEnergy function.",
    whyWrong: ["Using the infinite-well formula instead (E_1 = pi^2/(2*(2a)^2) ≈ 0.308, ignoring V0 entirely) confuses the two different systems — the finite well requires the transcendental equation, not the infinite well's closed form."],
  },
};
