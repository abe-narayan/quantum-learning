import { Complex } from "@/lib/quantum/complex";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const z1 = Complex.fromPolar(1, Math.PI / 6);
const z2 = Complex.fromPolar(1, Math.PI / 3);
const product = z1.mul(z2);
const productPhase = product.phase(); // pi/2

export const phaseOfProductOfTwoPhases: MultipleChoiceProblem = {
  meta: {
    slug: "phase-of-product-of-two-phases",
    title: "Multiplying Two Complex Numbers by Phase",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["complex-numbers", "polar-form", "phase"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "$z_1$ has phase $\\pi/6$ and $z_2$ has phase $\\pi/3$ (both modulus 1). What is the phase of $z_1 z_2$?",
    options: [
      { id: "a", text: "$\\pi/2$" },
      { id: "b", text: "$\\pi/18$" },
      { id: "c", text: "$\\pi/6$" },
      { id: "d", text: "$2\\pi/9$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "That comes from multiplying the phases (π/6 × π/3) rather than adding them. Multiplying two complex numbers adds their phases.",
      c: "That is z₁'s own phase, unchanged. Multiplying by z₂ rotates it by z₂'s phase.",
      d: "Check the addition: π/6 + π/3 needs a common denominator (sixths), not ninths.",
    },
    defaultIncorrectFeedback: "Recall the polar-form multiplication rule: z₁z₂ = r₁r₂ e^{i(θ₁+θ₂)}, so the phases add.",
  },
  hints: [
    { text: "In polar form, z₁z₂ = r₁r₂ e^{i(θ₁+θ₂)}: magnitudes multiply, phases add." },
    { text: "Add π/6 and π/3 using a common denominator of 6." },
    { text: "π/6 + 2π/6 = 3π/6." },
  ],
  solution: {
    steps: [
      { description: "Polar multiplication rule: phases add.", latex: "\\theta_1+\\theta_2 = \\frac{\\pi}{6}+\\frac{\\pi}{3}" },
      { description: "Common denominator.", latex: "\\frac{\\pi}{6}+\\frac{2\\pi}{6} = \\frac{3\\pi}{6} = \\frac{\\pi}{2}" },
    ],
    finalAnswer: "$\\pi/2$",
  },
  explanation: {
    correctIdea: "Multiplying complex numbers in polar form multiplies their magnitudes and adds their phases, a direct consequence of the exponent rule $e^{a}e^{b}=e^{a+b}$.",
    whyCorrect: `Directly verified: z₁ = e^{iπ/6}, z₂ = e^{iπ/3}, and their product's computed phase is ${productPhase.toFixed(4)} ≈ π/2 (${(Math.PI / 2).toFixed(4)}).`,
    whyWrong: [
      { optionId: "b", text: "Multiplies the phases, applying the magnitude rule to the wrong quantity. Magnitudes multiply; phases add." },
      { optionId: "c", text: "Leaves z₁'s phase where it was, dropping z₂'s contribution entirely." },
      { optionId: "d", text: "Adds the two but slips on the arithmetic. π/6 + π/3 shares a denominator of 6, not 9." },
    ],
  },
};
