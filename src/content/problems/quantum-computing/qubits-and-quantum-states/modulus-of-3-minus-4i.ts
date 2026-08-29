import { Complex } from "@/lib/quantum/complex";
import type { NumericProblem } from "@/lib/problems/types";

const z = new Complex(3, -4);
const modulus = z.magnitude();

export const modulusOf3Minus4i: NumericProblem = {
  meta: {
    slug: "modulus-of-3-minus-4i",
    title: "Modulus of 3 − 4i",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["complex-numbers", "modulus"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics"],
  },
  question: {
    type: "numeric",
    prompt: "Find the modulus $|z|$ of $z = 3 - 4i$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: modulus,
    tolerance: 0.01,
    incorrectFeedback: "Use |z| = √(a² + b²), where a is the real part and b is the imaginary part (including its sign doesn't matter since it gets squared).",
    nearMisses: [
      { value: 25, feedback: "25 is |z|², the sum of the squares. The modulus is its square root." },
      { value: -1, feedback: "−1 is 3 + (−4), adding the parts without squaring them. The modulus is a distance in the plane, so it squares, adds, then takes the root." },
      { value: 7, feedback: "7 adds the magnitudes 3 and 4 directly. Distance in the plane combines perpendicular components by Pythagoras, not by addition." },
    ],
  },
  hints: [
    { text: "The modulus formula is |z| = √(zz*) = √(a² + b²)." },
    { text: "Here a = 3, b = -4. Squaring a negative number gives a positive result, so the sign of b doesn't matter here." },
    { text: "Compute √(3² + (-4)²) = √(9 + 16) = √25." },
  ],
  solution: {
    steps: [
      { description: "Identify real and imaginary parts: $a = 3$, $b = -4$." },
      { description: "Apply the modulus formula.", latex: "|z| = \\sqrt{a^2+b^2} = \\sqrt{9+16} = \\sqrt{25}" },
      { description: "Simplify.", latex: "|z| = 5" },
    ],
    finalAnswer: "$|z| = 5$",
  },
  explanation: {
    correctIdea: "The modulus is the distance from the origin to the point (3, -4) in the complex plane, computed the same way as an ordinary 2D distance.",
    whyCorrect: "|z|² = zz* = (3-4i)(3+4i) = 9 - (4i)(-4i)... equivalently, a² + b² = 9 + 16 = 25, so |z| = √25 = 5.",
    whyWrong: [
      "Forgetting to square before adding (using 3 + (-4) = -1 directly) skips the modulus formula's actual structure.",
      "Reporting a negative modulus is impossible: |z| is always ≥ 0 by definition, a length.",
    ],
  },
};
