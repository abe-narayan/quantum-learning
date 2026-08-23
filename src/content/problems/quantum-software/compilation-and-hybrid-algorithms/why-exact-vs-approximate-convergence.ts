import type { ConceptualProblem } from "@/lib/problems/types";

export const whyExactVsApproximateConvergence: ConceptualProblem = {
  meta: {
    slug: "why-exact-vs-approximate-convergence",
    title: "Why H=Z Converges Exactly but 0.6Z+0.8X Doesn't",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["variational-algorithms", "conceptual"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why the single-parameter H=Z case converges to EXACTLY the true ground energy, while the two-parameter H=0.6Z+0.8X case only gets within ≈0.01%.",
    placeholder: "H=Z's ground state, |1⟩, happens to land exactly on...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["grid point", "theta = pi", "lands exactly"],
      ["grid resolution", "finite grid", "doesn't land exactly", "residual gap"],
    ],
    incorrectFeedback: "Address both cases explicitly: why H=Z's optimum lands exactly on a tested grid point, and why H=0.6Z+0.8X's doesn't.",
    partialFeedback: "Good — now be explicit that this is a property of the SPECIFIC grid chosen, not a fundamental physics difference between the two cases.",
  },
  hints: [
    { text: "H=Z's true optimal θ is exactly π, a 'nice' number that a uniform grid search is likely to test exactly (or very close to it)." },
    { text: "H=0.6Z+0.8X's true optimal (θ,φ) is some less 'round' pair of numbers, unlikely to fall exactly on a finite grid's tested points." },
    { text: "Both are limited by the SAME finite-grid-resolution issue — H=Z's exact match is a fortunate coincidence of its specific optimal angle, not a deeper physics distinction." },
  ],
  solution: {
    steps: [
      { description: "H=Z's true optimal parameter is exactly θ=π — a value that a reasonably fine uniform grid search is likely to test exactly (or extremely close to it)." },
      { description: "H=0.6Z+0.8X's true optimal (θ,φ) pair is some less 'round' combination of numbers, which generally does NOT fall exactly on any finite grid's specific tested points." },
      { description: "Both cases are limited by the same finite-grid-resolution constraint; H=Z's exact-looking result is a fortunate coincidence of its particular optimal angle landing on a grid point, not evidence of some deeper physical difference between the two problems." },
    ],
    finalAnswer: "H=Z's optimal θ=π happens to fall exactly on the grid; H=0.6Z+0.8X's optimal parameters don't — both face the same finite-grid limitation, just with different luck.",
  },
  explanation: {
    correctIdea: "This resists the tempting but wrong conclusion that H=Z is 'easier' physics — it's purely a coincidence of grid alignment, an important distinction for correctly interpreting numerical optimization results.",
    whyCorrect: "Matches the lesson's explicit Worked Example discussion.",
    whyWrong: ["Attributing the exact-vs-approximate difference to some fundamental physical distinction between the two Hamiltonians misses that it's purely a grid-resolution/alignment artifact."],
  },
};
