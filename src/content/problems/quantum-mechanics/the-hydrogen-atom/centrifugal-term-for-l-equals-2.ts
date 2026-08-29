import type { NumericProblem } from "@/lib/problems/types";

const l = 2;
const value = l * (l + 1);

export const centrifugalTermForLEquals2: NumericProblem = {
  meta: {
    slug: "centrifugal-term-for-l-equals-2",
    title: "The Centrifugal Coefficient for l=2 (d States)",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/the-radial-equation",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["radial-equation", "centrifugal-term"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/the-radial-equation"],
  },
  question: {
    type: "numeric",
    prompt: "The centrifugal term is l(l+1)ħ²/2mr². What is the numerical coefficient l(l+1) for l=2 (a 'd' state)?",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback: "Compute l(l+1) directly with l=2.",
    nearMisses: [
      { value: 4, feedback: "4 is l². The centrifugal coefficient is l(l+1), the same eigenvalue structure as L², which always exceeds l²." },
      { value: 2, feedback: "2 is l itself. The coefficient multiplies the two factors l and l+1." },
      { value: 5, feedback: "5 is 2l+1, the number of m states at l=2. The centrifugal coefficient is the L² eigenvalue l(l+1) instead." },
    ],
  },
  hints: [
    { text: "Substitute l=2 into l(l+1)." },
    { text: "With l=2, the two factors are 2 and 3." },
    { text: "Multiply the two factors. As a check, the result should exceed l=1's coefficient of 2, since higher l means a stronger centrifugal barrier." },
  ],
  solution: {
    steps: [{ description: "l(l+1) = 2(3) = 6." }],
    finalAnswer: "6",
  },
  explanation: {
    correctIdea: "Higher l states have a larger centrifugal coefficient, meaning a stronger effective repulsion from the nucleus at short range.",
    whyCorrect: "Direct substitution into the derived formula l(l+1).",
    whyWrong: ["Answering 'l=2' confuses the quantum number itself with the specific numeric coefficient it produces in the centrifugal term."],
  },
};
