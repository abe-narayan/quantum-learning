import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const kineticTermForm: MultipleChoiceProblem = {
  meta: {
    slug: "kinetic-term-form",
    title: "The Correct Form of the Kinetic Energy Term",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/the-schrodinger-equation-in-position-space",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["schrodinger-equation", "hamiltonian"],
    prerequisites: ["quantum-mechanics/wave-mechanics/the-schrodinger-equation-in-position-space"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which of the following is the correct kinetic energy term in the position-space Hamiltonian, derived from p-hat^2/(2m)?",
    options: [
      { id: "a", text: "$-\\dfrac{\\hbar^2}{2m}\\dfrac{d^2}{dx^2}$" },
      { id: "b", text: "$+\\dfrac{\\hbar^2}{2m}\\dfrac{d^2}{dx^2}$" },
      { id: "c", text: "$-\\dfrac{\\hbar}{2m}\\dfrac{d}{dx}$" },
      { id: "d", text: "$-i\\dfrac{\\hbar^2}{2m}\\dfrac{d^2}{dx^2}$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Check the sign: two factors of -i from applying p-hat twice give i^2=-1, which combines with the overall structure to leave a minus sign, not a plus.",
      c: "This has only a single derivative, not p-hat squared. The kinetic term needs the second derivative from applying p-hat twice.",
      d: "The two factors of i from applying p-hat twice multiply to -1, a real number, so there should be no leftover factor of i in the final kinetic term.",
    },
    defaultIncorrectFeedback: "Apply p-hat = -i*hbar*d/dx twice and simplify i^2 = -1 carefully.",
  },
  hints: [
    { text: "Write down p-hat in position space, then square it: p-hat^2 = (-i*hbar*d/dx)(-i*hbar*d/dx)." },
    { text: "Collect the two constant factors and the two derivatives separately." },
    { text: "Simplify (-i)^2 using i^2 = -1, then divide the whole thing by 2m." },
  ],
  solution: {
    steps: [
      { description: "$\\hat p^2 = (-i\\hbar)^2\\dfrac{d^2}{dx^2} = -\\hbar^2\\dfrac{d^2}{dx^2}$, using $i^2=-1$." },
      { description: "Divide by $2m$: $\\hat T = -\\dfrac{\\hbar^2}{2m}\\dfrac{d^2}{dx^2}$." },
    ],
    finalAnswer: "$-\\dfrac{\\hbar^2}{2m}\\dfrac{d^2}{dx^2}$",
  },
  explanation: {
    correctIdea: "Applying p-hat twice and simplifying i^2=-1 gives a real, negative-signed second-derivative operator.",
    whyCorrect: "This matches the derivation in the lesson.",
    whyWrong: [
      { optionId: "b", text: "Loses the minus sign, which comes from (-i)^2 = -1 and not from anywhere else." },
      { optionId: "c", text: "Squares the constant but not the derivative, leaving one power of d/dx where two belong." },
      { optionId: "d", text: "Stops halfway through the simplification, keeping an i that the second factor of -i has already cancelled." },
    ],
  },
};
