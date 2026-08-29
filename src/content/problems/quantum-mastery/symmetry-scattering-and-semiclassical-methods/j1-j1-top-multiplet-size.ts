import type { NumericProblem } from "@/lib/problems/types";

export const j1j1TopMultipletSize: NumericProblem = {
  meta: {
    slug: "j1-j1-top-multiplet-size",
    title: "Coupling Two j=1 Systems: Size of the Top Multiplet",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/clebsch-gordan-coefficients-and-the-wigner-eckart-theorem",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["clebsch-gordan", "angular-momentum", "triangle-rule"],
    prerequisites: [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/clebsch-gordan-coefficients-and-the-wigner-eckart-theorem",
    ],
  },
  question: {
    type: "numeric",
    prompt:
      "Two j=1 systems are coupled (j₁=j₂=1). The top multiplet has j=j₁+j₂=2. How many states (values of mⱼ) does that top multiplet contain?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: 5,
    tolerance: 0,
    incorrectFeedback: "A multiplet of total angular momentum j always contains 2j+1 states, mⱼ=j,j−1,...,−j.",
    nearMisses: [
      { value: 9, feedback: "9 is the whole product space, 3×3. It splits into three multiplets of sizes 5, 3 and 1; the question asks only for the top one." },
      { value: 2, feedback: "2 is j, the top multiplet's total angular momentum. Its state count is 2j+1." },
      { value: 4, feedback: "4 is 2j, which forgets the mⱼ=0 rung sitting between the negative and positive values." },
    ],
  },
  hints: [
    { text: "Any multiplet of definite j contains 2j+1 states (mⱼ = j, j−1, ..., −j)." },
    { text: "Here j=2." },
  ],
  solution: {
    steps: [{ description: "2j+1 = 2(2)+1 = 5, for mⱼ = 2,1,0,−1,−2." }],
    finalAnswer: "5",
  },
  explanation: {
    correctIdea: "The full j₁=1⊗j₂=1 coupling splits the 3×3=9-dimensional product space into j=2 (5 states), j=1 (3 states), and j=0 (1 state) — 5+3+1=9, matching the product space's dimension exactly, the same dimension-counting check the lesson used for l=1⊗s=1/2.",
  },
};
