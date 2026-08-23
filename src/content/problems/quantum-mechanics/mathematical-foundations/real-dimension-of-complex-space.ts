import type { NumericProblem } from "@/lib/problems/types";

export const realDimensionOfComplexSpace: NumericProblem = {
  meta: {
    slug: "real-dimension-of-complex-space",
    title: "Real Dimension of a Complex Vector Space",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/vector-spaces",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["vector-spaces", "dimension"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/vector-spaces"],
  },
  question: {
    type: "numeric",
    prompt: "What is $\\dim_{\\mathbb{R}}(\\mathbb{C}^3)$ — the dimension of $\\mathbb{C}^3$ viewed as a vector space over $\\mathbb{R}$?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: 6,
    tolerance: 0.001,
    incorrectFeedback: "Each complex coordinate needs two independent real numbers (real and imaginary parts) — the real dimension isn't just the number of complex coordinates.",
  },
  hints: [
    { text: "dim_C(C^n) = n, but dim_R(C^n) is different." },
    { text: "Every complex coordinate contributes 2 real degrees of freedom, not 1." },
    { text: "C^3 has 3 complex coordinates." },
  ],
  solution: {
    steps: [
      { description: "Each complex coordinate $z=a+bi$ needs two independent real numbers, $a$ and $b$." },
      { description: "$\\mathbb{C}^3$ has 3 complex coordinates, so $3\\times2=6$ real numbers are needed to specify a point." },
    ],
    finalAnswer: "$\\dim_{\\mathbb{R}}(\\mathbb{C}^3) = 6$",
  },
  explanation: {
    correctIdea: "Complex dimension and real dimension of the same space differ by a factor of 2.",
    whyCorrect: "dim_C(C^3)=3 counts complex coordinates; dim_R(C^3)=6 counts the real numbers needed, since each complex coordinate is really a pair of real numbers.",
    whyWrong: ["Answering 3 confuses the complex dimension with the real dimension — they're genuinely different numbers for the same space."],
  },
};
