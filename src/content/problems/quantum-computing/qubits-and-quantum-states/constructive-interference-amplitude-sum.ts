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
    incorrectFeedback: "Add the amplitudes FIRST (1/√2 + 1/√2 = 2/√2 = √2), then square the sum — don't add the individual probabilities (1/2 + 1/2).",
  },
  hints: [
    { text: "This is not the same as adding the two individual probabilities (1/2 + 1/2 = 1)." },
    { text: "Add the amplitudes first: 1/√2 + 1/√2 = 2/√2 = √2." },
    { text: "Now square that sum: (√2)² = 2." },
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
    whyCorrect: "Here the combined value, 2, is strictly larger than 1/2 + 1/2 = 1 — the two amplitudes reinforced each other, constructive interference. (This number is only meaningful as an illustration of interference; a real normalized combined state would need renormalizing.)",
    whyWrong: [
      "Adding the individual probabilities (1/2+1/2=1) is exactly the classical-probability rule, which quantum amplitudes do not obey when combined before squaring.",
    ],
  },
};
