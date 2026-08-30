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
    prompt: "Explain why the single-parameter H=Z case converges to exactly the true ground energy, while the two-parameter H=0.6Z+0.8X case only gets within about 0.01%.",
    placeholder: "H=Z's ground state, |1⟩, happens to land exactly on...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["grid point", "theta = pi", "lands exactly", "on the grid", "fall exactly", "falls exactly", "tested point", "hits the grid"],
        missingFeedback:
          "Compare the optimal parameter values with the values the search actually tries. Say what is special about the single-parameter case in that comparison.",
      },
      {
        phrases: ["grid resolution", "finite grid", "residual gap", "coarse grid", "the grid is finite"],
        missingFeedback:
          "You have the alignment. Now name the limitation both runs share, so it is clear the difference is not one Hamiltonian being harder than the other.",
      },
    ],
    incorrectFeedback: "Both cases have to be explained, and the explanation is the same in each: a sweep only ever tries a fixed list of angles. So ask, for each Hamiltonian, where its true optimum sits relative to that list. One of them happens to sit on a value the sweep tries; the other does not. Say why that is luck about the numbers rather than a difference in the physics.",
    partialFeedback: "Good. Now be explicit that this is a property of the particular grid chosen, not a physics difference between the two cases.",
    modelAnswers: [
      "For H=Z the optimum is theta = pi, and that lands exactly on a tested point of the grid, so the search finds the true minimum exactly. For the two-parameter case the optimal parameters do not fall exactly on any grid point, so the best tested point leaves a small residual gap. Both face the same finite grid; the difference is alignment, not difficulty.",
      "H=Z's optimum happens to hit the grid, so nothing is left over. The other case's optimum sits between tested points, and the grid resolution is what leaves the 0.01%.",
    ],
  },
  hints: [
    { text: "H=Z's true optimum is at a very round angle. Ask whether a uniform sweep is likely to try that value." },
    { text: "H=0.6Z+0.8X's optimum sits at a much less round pair of angles. Ask the same question of it." },
    { text: "Both runs are limited the same way. The difference is whether the true answer happens to coincide with a sampled value, which is arithmetic luck rather than physics." },
  ],
  solution: {
    steps: [
      { description: "H=Z's true optimal parameter is exactly θ=π, a value a reasonably fine uniform grid search is likely to test exactly, or extremely close to it." },
      { description: "H=0.6Z+0.8X's true optimal (θ,φ) pair is a less round combination of numbers, which generally does not fall exactly on any finite grid's tested points." },
      { description: "Both cases are limited by the same finite-grid-resolution constraint; H=Z's exact-looking result is a fortunate coincidence of its particular optimal angle landing on a grid point, not evidence of some deeper physical difference between the two problems." },
    ],
    finalAnswer: "H=Z's optimal θ=π happens to fall exactly on the grid, while H=0.6Z+0.8X's optimal parameters do not. Both face the same finite-grid limitation, just with different luck.",
  },
  explanation: {
    correctIdea: "This resists the tempting but wrong conclusion that H=Z is 'easier' physics. It is a coincidence of grid alignment, an important distinction for interpreting numerical optimization results correctly.",
    whyCorrect: "Both searches are limited by the spacing of the angles they try. One target happens to be a round multiple the sweep lands on, the other is not, so the residual difference measures luck about the arithmetic rather than any difference between the two Hamiltonians.",
    whyWrong: ["Attributing the exact-versus-approximate difference to a physical distinction between the two Hamiltonians misses that it is a grid-resolution and alignment artifact."],
  },
};
