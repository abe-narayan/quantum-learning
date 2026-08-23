import type { NumericProblem } from "@/lib/problems/types";

export const complexModulus: NumericProblem = {
  meta: {
    slug: "complex-modulus",
    title: "The Modulus of a Complex Number",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/complex-numbers-for-physics",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["complex-numbers", "modulus"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/complex-numbers-for-physics"],
  },
  question: {
    type: "numeric",
    prompt: "What is $|3+4i|$, the modulus of $z=3+4i$?",
    inputHint: "a positive real number",
  },
  answer: {
    type: "numeric",
    value: 5,
    tolerance: 0.01,
    incorrectFeedback: "Remember |z| = sqrt(z z*) = sqrt(a^2 + b^2), not a + b.",
  },
  hints: [
    { text: "The modulus formula is |z| = sqrt(a^2 + b^2) for z = a + bi." },
    { text: "Here a = 3 and b = 4." },
    { text: "3^2 + 4^2 = 9 + 16 = 25 — take the square root." },
  ],
  solution: {
    steps: [
      { description: "Identify $a=3$, $b=4$." },
      { description: "Apply the modulus formula.", latex: "|z| = \\sqrt{a^2+b^2} = \\sqrt{9+16}" },
      { description: "Simplify.", latex: "|z| = \\sqrt{25} = 5" },
    ],
    finalAnswer: "$|3+4i| = 5$",
  },
  explanation: {
    correctIdea: "The modulus comes from $zz^*=a^2+b^2$, always real and non-negative.",
    whyCorrect: "$zz^* = (3+4i)(3-4i) = 9+16 = 25$, and $|z|=\\sqrt{25}=5$.",
    whyWrong: ["Adding a+b=7 skips the squaring-and-square-root that defines modulus entirely."],
  },
};
