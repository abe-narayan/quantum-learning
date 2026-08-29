import { StateVector } from "@/lib/quantum/state";
import { HADAMARD, S_GATE, applySingleQubitGate } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

const afterH1 = applySingleQubitGate(StateVector.zero(1), HADAMARD, 0);
const afterS = applySingleQubitGate(afterH1, S_GATE, 0);
const afterH2 = applySingleQubitGate(afterS, HADAMARD, 0);
const pZero = afterH2.probabilities()[0];

export const p0AfterHSHOnZero: NumericProblem = {
  meta: {
    slug: "p0-after-h-s-h-on-zero",
    title: "P(0) After H, S, H on |0⟩",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/building-qubit-circuits",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["circuits", "composition", "measurement"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/building-qubit-circuits"],
  },
  question: {
    type: "numeric",
    prompt: "Starting from $|0\\rangle$, apply $H$, then $S$, then $H$. If you then measure in the computational basis, what is $P(0)$?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: pZero,
    tolerance: 0.01,
    incorrectFeedback: "Track the state through all three gates one at a time: |0⟩ → (after H) → (after S) → (after H), then apply the Born rule to the final state.",
    nearMisses: [
      { value: 1, feedback: "P(0) = 1 is what HH|0⟩ gives, with nothing between the Hadamards. The S gate in the middle changes the relative phase, and the outcome with it." },
      { value: 0, feedback: "Nothing here forces destructive interference on |0⟩: the final amplitude is (1+i)/2, which has magnitude 1/√2, not 0." },
    ],
  },
  hints: [
    { text: "Apply the gates one at a time, in the order given: H first, then S, then H again." },
    { text: "After H then S, you should have |+i⟩ = (1/√2)(|0⟩ + i|1⟩)." },
    { text: "Apply H to |+i⟩ next, then read off the |0⟩ probability from the resulting amplitudes." },
  ],
  solution: {
    steps: [
      { description: "$H|0\\rangle = |+\\rangle$." },
      { description: "$S|+\\rangle = |{+i}\\rangle = \\frac{1}{\\sqrt2}(|0\\rangle+i|1\\rangle)$." },
      {
        description: "Apply $H$ to $|{+i}\\rangle$: $H|{+i}\\rangle = \\frac{1}{2}\\big[(1+i)|0\\rangle+(1-i)|1\\rangle\\big]$.",
        latex: `P(0) = \\left|\\frac{1+i}{2}\\right|^2 \\approx ${pZero.toFixed(4)}`,
      },
    ],
    finalAnswer: `$P(0) \\approx ${pZero.toFixed(3)}$`,
  },
  explanation: {
    correctIdea: "Composing gates means applying them one at a time to the evolving state, exactly as this lesson's step-by-step tracking method does for HZH=X.",
    whyCorrect: "Even though the final probability (0.5) looks like 'no information,' the actual final state has a nontrivial relative phase — this is genuinely different from, say, HH|0⟩ which returns exactly to |0⟩ with P(0)=1.",
    whyWrong: [
      "Assuming H then S then H must cancel out symmetrically (since it starts and ends with H) and give P(0)=1 — the S gate in the middle genuinely changes the outcome, unlike a circuit with nothing between the two H's.",
      "Stopping after only two of the three gates and reading off that intermediate state's probability instead.",
    ],
  },
};
