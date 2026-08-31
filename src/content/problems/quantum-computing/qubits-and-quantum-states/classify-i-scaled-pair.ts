import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { stateToBlochVector } from "@/lib/quantum/bloch";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const psi1 = new StateVector([new Complex(0.6), new Complex(0.8)]);
const psi4 = new StateVector([new Complex(0, 0.6), new Complex(0, 0.8)]);

const bloch1 = stateToBlochVector(psi1);
const bloch4 = stateToBlochVector(psi4);
const sameBlochPoint =
  Math.abs(bloch1.x - bloch4.x) < 1e-9 && Math.abs(bloch1.y - bloch4.y) < 1e-9 && Math.abs(bloch1.z - bloch4.z) < 1e-9;

export const classifyIScaledPair: MultipleChoiceProblem = {
  meta: {
    slug: "classify-i-scaled-pair",
    title: "Classifying an i-Scaled State Pair",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/global-and-relative-phase",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["global-phase", "relative-phase"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/global-and-relative-phase"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "$|\\psi_1\\rangle = 0.6|0\\rangle+0.8|1\\rangle$ and $|\\psi_4\\rangle = 0.6i|0\\rangle+0.8i|1\\rangle$. Do these differ by a global phase, a relative phase, or neither?",
    options: [
      { id: "a", text: "Global phase" },
      { id: "b", text: "Relative phase" },
      { id: "c", text: "Neither; they are physically different states with no simple phase relationship" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "A relative phase would multiply only ONE of the two coefficients by a phase factor. Here, BOTH coefficients got multiplied by the same factor, $i$.",
      c: "There is a simple relationship: $|\\psi_4\\rangle = i|\\psi_1\\rangle$, every coefficient scaled by the same factor. That's the definition of global phase.",
    },
    defaultIncorrectFeedback: "Check whether both coefficients were multiplied by the same factor, or only one of them.",
  },
  hints: [
    { text: "Compare the ratio of |ψ₄⟩'s coefficients to |ψ₁⟩'s coefficients, term by term." },
    { text: "Divide each amplitude of the second state by the matching amplitude of the first, and see whether the two ratios agree." },
    { text: "A single common factor multiplying every coefficient equally is exactly the definition of a global phase." },
  ],
  solution: {
    steps: [
      { description: "Compare coefficients: $\\frac{0.6i}{0.6}=i$ and $\\frac{0.8i}{0.8}=i$, the same ratio for both." },
      { description: "So $|\\psi_4\\rangle = i|\\psi_1\\rangle = e^{i\\pi/2}|\\psi_1\\rangle$: every amplitude scaled by the identical factor $e^{i\\pi/2}$." },
      {
        description: `This is confirmed directly: both states land at the exact same Bloch point, ${sameBlochPoint ? "as expected for a global-phase pair" : "(unexpected; recheck)"}.`,
      },
    ],
    finalAnswer: "Global phase ($\\gamma=\\pi/2$)",
  },
  explanation: {
    correctIdea: "Global phase means multiplying the entire state by one common factor, and both coefficients here were multiplied by the same i.",
    whyCorrect: "Since both terms scale by the identical factor, this is exactly the pattern the lesson defines as global phase, unobservable in any basis.",
    whyWrong: [
      { optionId: "b", text: "A relative phase touches one coefficient and leaves the other alone. Here both picked up the same factor, which is what makes it global." },
      { optionId: "c", text: "Reads i as too exotic to be a global phase. Any unit-modulus factor qualifies, i included, and here the relationship is the simple one |ψ₄⟩ = i|ψ₁⟩." },
    ],
  },
};
