import { Complex } from "@/lib/quantum/complex";
import type { NumericProblem } from "@/lib/problems/types";

const z = new Complex(1, 1);
const phase = z.phase();

export const phaseOf1PlusI: NumericProblem = {
  meta: {
    slug: "phase-of-1-plus-i",
    title: "Phase of 1 + i",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["complex-numbers", "polar-form", "phase"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics"],
  },
  question: {
    type: "numeric",
    prompt: "Find the phase $\\theta$ (in radians) of $z = 1 + i$, using $z = re^{i\\theta}$.",
    inputHint: "in radians, as a decimal",
  },
  answer: {
    type: "numeric",
    value: phase,
    tolerance: 0.02,
    incorrectFeedback: "Plot 1 + i in the complex plane: it sits on the line at 45° from the positive real axis. Convert that angle to radians.",
    nearMisses: [
      { value: 45, tolerance: 0.5, feedback: "45 is the angle in degrees. The question asks for radians, so multiply by π/180." },
      { value: Math.SQRT2, tolerance: 0.02, feedback: "√2 is the modulus, the other half of the polar form. The phase is the angle, not the length." },
      { value: 1, feedback: "1 is the ratio b/a. The phase is the arctangent of that ratio, not the ratio itself." },
    ],
  },
  hints: [
    { text: "The phase is θ = atan2(imaginary part, real part), the angle the point makes with the positive real axis." },
    { text: "For z = 1 + i, both the real and imaginary parts equal 1, so the point sits exactly on the 45° line." },
    { text: "45° in radians is π/4." },
  ],
  solution: {
    steps: [
      { description: "The point $(a,b) = (1,1)$ lies on the ray at $45°$ from the positive real axis, since its real and imaginary parts are equal." },
      { description: "Convert to radians.", latex: "\\theta = \\frac{\\pi}{4} \\approx 0.785" },
    ],
    finalAnswer: "$\\theta = \\pi/4 \\approx 0.785$ radians",
  },
  explanation: {
    correctIdea: "The phase of a + bi is the angle its position vector makes with the positive real axis, computed via atan2(b, a), not simply b/a.",
    whyCorrect: "Since a = b = 1 here, the point lies exactly on the diagonal, at 45° = π/4 radians. You can check it from Euler's formula: $\\sqrt2\\, e^{i\\pi/4} = \\sqrt2(\\cos\\frac{\\pi}{4}+i\\sin\\frac{\\pi}{4}) = 1+i$.",
    whyWrong: [
      "Using plain arctan(b/a) = arctan(1) without checking the quadrant happens to work here, but the same formula silently gives the wrong angle whenever the real part is negative. atan2 handles the quadrant for you.",
      "Reporting the modulus (√2 ≈ 1.41) instead of the phase confuses the two separate pieces of polar form.",
    ],
  },
};
