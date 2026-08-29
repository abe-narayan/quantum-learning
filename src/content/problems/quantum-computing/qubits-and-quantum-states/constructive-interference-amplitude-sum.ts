import { Complex } from "@/lib/quantum/complex";
import type { NumericProblem } from "@/lib/problems/types";

const alpha1 = new Complex(Math.SQRT1_2);
const alpha2 = new Complex(Math.SQRT1_2);
const combinedProbability = alpha1.add(alpha2).magnitudeSquared();

export const constructiveInterferenceAmplitudeSum: NumericProblem = {
  meta: {
    slug: "constructive-interference-amplitude-sum",
    title: "Adding Amplitudes That Reinforce",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["interference", "amplitudes", "superposition"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors"],
  },
  question: {
    type: "numeric",
    prompt:
      "Two amplitudes, $\\alpha_1 = \\frac{1}{\\sqrt2}$ and $\\alpha_2 = \\frac{1}{\\sqrt2}$, each individually would give probability $\\frac12$ on their own. If they combine (add) before you square, what is $|\\alpha_1+\\alpha_2|^2$?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: combinedProbability,
    tolerance: 0.01,
    incorrectFeedback: "Add the amplitudes before squaring; do not add the individual probabilities. If you answered one, you used the classical rule of summing probabilities. Squaring the summed amplitude gives something strictly larger.",
    nearMisses: [
      { value: 1, feedback: "1 is the sum of the two individual probabilities, the classical rule. Amplitudes are added first and squared afterwards, which is what produces interference." },
      { value: Math.SQRT2, tolerance: 0.01, feedback: "√2 is the summed amplitude. The question asks for its squared magnitude." },
      { value: 0.5, feedback: "0.5 is what one amplitude alone gives. The point of the comparison is what happens when both are present before the squaring." },
    ],
  },
  hints: [
    { text: "This question is testing the difference between two rules: adding probabilities and adding amplitudes. Decide which one the prompt asks for before computing anything." },
    { text: "Add the two amplitudes first, while they are still amplitudes. Each equals one over root two, so work out what their sum is." },
    { text: "Now square the summed amplitude. Compare the result with the sum of the two individual probabilities; coming out bigger is the signature of constructive interference." },
  ],
  solution: {
    steps: [
      { description: "Add the amplitudes before squaring.", latex: "\\alpha_1+\\alpha_2 = \\frac{1}{\\sqrt2}+\\frac{1}{\\sqrt2} = \\frac{2}{\\sqrt2} = \\sqrt2" },
      { description: "Square the sum.", latex: "|\\alpha_1+\\alpha_2|^2 = (\\sqrt2)^2 = 2" },
    ],
    finalAnswer: "$|\\alpha_1+\\alpha_2|^2 = 2$",
  },
  explanation: {
    correctIdea: "Squaring a sum of amplitudes is not the same as summing the individual squared probabilities: $|\\alpha_1+\\alpha_2|^2 \\neq |\\alpha_1|^2+|\\alpha_2|^2$ in general.",
    whyCorrect: "Here the combined value, 2, is strictly larger than 1/2 + 1/2 = 1: the two amplitudes reinforced each other, constructive interference. (This number is only meaningful as an illustration of interference; a real normalized combined state would need renormalizing.)",
    whyWrong: [
      "Adding the individual probabilities (1/2+1/2=1) is exactly the classical-probability rule, which quantum amplitudes do not obey when combined before squaring.",
    ],
  },
};
