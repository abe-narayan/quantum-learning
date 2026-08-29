import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { HADAMARD, applySingleQubitGate } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

const psi = new StateVector([new Complex(0.5), new Complex(Math.sqrt(3) / 2)]);
const afterH = applySingleQubitGate(psi, HADAMARD, 0);
const pPlus = afterH.probabilities()[0];

export const pPlusForKnownAmplitudes: NumericProblem = {
  meta: {
    slug: "p-plus-for-known-amplitudes",
    title: "P(+) for a Tilted State",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/measurement-and-probability",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["measurement", "born-rule", "x-basis"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/measurement-and-probability"],
  },
  question: {
    type: "numeric",
    prompt:
      "A qubit is in the state $|\\psi\\rangle = \\frac12|0\\rangle + \\frac{\\sqrt3}{2}|1\\rangle$. What is $P(+)$, the probability of measuring $|+\\rangle$ in the X-basis?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: pPlus,
    tolerance: 0.01,
    incorrectFeedback: "Recompute $\\langle+|\\psi\\rangle$ directly, then square its magnitude. Measuring in the X-basis in this course is the same as applying H, then reading the computational-basis probability of |0⟩.",
    nearMisses: [
      { value: 0.25, feedback: "0.25 is P(0), the computational-basis probability |α|². The X-basis question asks for the overlap with |+⟩ instead." },
      { value: (0.5 + Math.sqrt(3) / 2) / Math.SQRT2, tolerance: 0.005, feedback: "That is ⟨+|ψ⟩, the overlap itself. The Born rule squares it to give a probability." },
      { value: 1 - ((0.5 + Math.sqrt(3) / 2) / Math.SQRT2) ** 2, tolerance: 0.005, feedback: "That is P(−). The two X-basis outcomes sum to 1, so check which one uses α + β rather than α − β." },
    ],
  },
  hints: [
    { text: "Measuring in the X-basis is exactly the same operation as applying H first, then measuring in the computational basis (the lesson's Interactive Experiment uses this directly)." },
    { text: "Apply H to |ψ⟩: $H|\\psi\\rangle = \\frac{1}{\\sqrt2}(\\alpha+\\beta)|0\\rangle + \\frac{1}{\\sqrt2}(\\alpha-\\beta)|1\\rangle$." },
    { text: "P(+) is the resulting probability of the |0⟩ term after applying H." },
  ],
  solution: {
    steps: [
      { description: "Identify the amplitudes: $\\alpha=\\frac12$, $\\beta=\\frac{\\sqrt3}{2}$, both real." },
      {
        description: "Use $P(+) = \\left|\\frac{\\alpha+\\beta}{\\sqrt2}\\right|^2$, directly from the lesson's X-basis formula.",
        latex: `P(+) = \\left(\\frac{\\frac12+\\frac{\\sqrt3}{2}}{\\sqrt2}\\right)^2 \\approx ${pPlus.toFixed(4)}`,
      },
    ],
    finalAnswer: `$P(+) \\approx ${pPlus.toFixed(3)}$`,
  },
  explanation: {
    correctIdea: "P(+) is the squared magnitude of the inner product with |+⟩, which for real amplitudes reduces to $\\left(\\frac{\\alpha+\\beta}{\\sqrt2}\\right)^2$.",
    whyCorrect: "This state's amplitudes are both positive and real, so they add constructively in the |+⟩ overlap, giving a probability well above 1/2.",
    whyWrong: [
      "Using $P(0)=|\\alpha|^2=0.25$ answers a different question — that's the computational-basis probability, not the X-basis one.",
      "Forgetting to square the overlap gives a number that looks plausible but isn't a probability computed correctly from the Born rule.",
    ],
  },
};
