import type { NumericProblem } from "@/lib/problems/types";

const T = 10000;
/** Quantum: <x^2> = (1 - 1/sqrt2) T^2. Classical: <x^2> = T_c. Equate them. */
const quantumVariance = (1 - 1 / Math.sqrt(2)) * T * T;
const value = quantumVariance;

export const quantumWalkDisplacementAt10000: NumericProblem = {
  meta: {
    slug: "quantum-walk-displacement-at-10000",
    title: "Classical Steps Needed to Match 10000 Quantum Walk Steps",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/quantum-walks",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["quantum-walks", "ballistic-spreading", "diffusive-spreading"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/quantum-walks"],
  },
  question: {
    type: "numeric",
    prompt:
      "This lesson establishes two spreading laws: the Hadamard quantum walk has ⟨x²⟩ = (1−1/√2)T² after T steps, and the classical unbiased walk has a variance that this lesson computed exactly, with no large-T approximation. A Hadamard quantum walk runs for T = 10000 steps. How many steps must a classical walk take to reach the same typical displacement?",
    inputHint: "a number of steps, to about five significant figures",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    toleranceType: "relative",
    incorrectFeedback:
      "Equal typical displacement means equal ⟨x²⟩, so no square roots are needed anywhere. Write the classical walk's variance after T_c steps, set it equal to the quantum walk's ⟨x²⟩ at T = 10000, and read off T_c.",
    nearMisses: [
      {
        value: T * Math.sqrt(1 - 1 / Math.sqrt(2)),
        tolerance: 0.001,
        feedback:
          "That is the quantum walk's typical displacement, a distance rather than a step count. A square root has been taken one time too many: both sides of the comparison are variances already, so equating them needs no root at all.",
      },
      {
        value: T,
        tolerance: 0.001,
        feedback:
          "That is T itself. If the two walks needed the same number of steps there would be no ballistic-versus-diffusive contrast to draw; the whole point is that the classical walk needs vastly more.",
      },
      {
        value: T * T,
        tolerance: 0.001,
        feedback:
          "That is T², the quantum ⟨x²⟩ with the coefficient dropped. The constant 1−1/√2 ≈ 0.2929 is not a tidy-up factor here: it is most of the difference between this answer and yours.",
      },
    ],
  },
  hints: [
    {
      text: "Two walks spread by different laws, and the question asks when they have spread the same amount. Write that condition as an equation before touching either formula.",
    },
    {
      text: "The classical walk's variance after T_c steps is the one result in this lesson that is exact at every step count, and it is strikingly simple. Set it against the quantum walk's ⟨x²⟩ at T = 10000.",
    },
    {
      text: "Both sides of your equation are now variances, so the square roots cancel out of the problem entirely. Evaluate the quantum side and you have the classical step count directly.",
    },
  ],
  solution: {
    steps: [
      {
        description: "Equal typical displacement is equal variance, so set the two laws against each other.",
        latex: "T_c = \\langle x^2\\rangle_{\\text{classical}} = \\langle x^2\\rangle_{\\text{quantum}} = \\left(1-\\tfrac{1}{\\sqrt2}\\right)T^2",
      },
      {
        description: "The classical variance after T_c steps is exactly T_c, because independent unit steps add their variances. That is what makes the right-hand side the answer with no further work.",
      },
      {
        description:
          "At T = 10000: (1−1/√2)·10⁸ ≈ 0.292893·10⁸ ≈ 2.9289×10⁷ steps. Roughly 2929 classical steps for every quantum step, and the ratio grows linearly in T without bound.",
      },
    ],
    finalAnswer: "≈2.9289×10⁷ steps",
  },
  explanation: {
    correctIdea:
      "Ballistic versus diffusive is a statement about how variance grows: linearly in T for the classical walk, quadratically for the quantum one. Equating variances turns that qualitative contrast into a number, and the number is enormous even at a step count a laptop can simulate.",
    whyCorrect:
      "Independent classical steps add variances, so the classical walk's variance is its own step count; the quantum walk's is (1−1/√2)T². Setting them equal gives T_c = (1−1/√2)T² directly, about 2.93×10⁷ steps to match 10⁴ quantum ones.",
    whyWrong: [
      "Comparing displacements rather than variances invites an extra square root and lands on ≈5412, which is a distance rather than a step count.",
      "Dropping the constant 1−1/√2 and answering T² overstates the classical cost by a factor of more than three.",
    ],
  },
};
