import { StateVector } from "@/lib/quantum/state";
import { HADAMARD, applySingleQubitGate, applyCNOT } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

const afterH = applySingleQubitGate(StateVector.zero(2), HADAMARD, 1);
const afterCnot = applyCNOT(afterH, 1, 0);
const probabilityOf11 = afterCnot.probabilities()[3];

export const hOnQ1ThenCnot10Outcome: NumericProblem = {
  meta: {
    slug: "h-on-q1-then-cnot-1-0-outcome",
    title: "A Circuit With Qubit 1 as Control",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["circuits", "cnot", "measurement"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation"],
  },
  question: {
    type: "numeric",
    prompt:
      "A circuit has $H$ on qubit 1 only in column 1, then $\\text{CNOT}$ with qubit 1 as control and qubit 0 as target in column 2. Starting from $|00\\rangle$, what is the probability of measuring $|11\\rangle$ at the end?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: probabilityOf11,
    tolerance: 0.01,
    incorrectFeedback: "Work through the circuit column by column: first apply H to qubit 1 only, then apply CNOT with the roles this problem specifies.",
  },
  hints: [
    { text: "Column 1 only touches qubit 1 — qubit 0 stays exactly |0⟩ through that step." },
    { text: "After H on qubit 1, the state is (|00⟩+|01⟩)/√2." },
    { text: "In column 2, the |00⟩ term (qubit 1 = 0) is left alone; the |01⟩ term (qubit 1 = 1) has qubit 0, the target, flipped." },
  ],
  solution: {
    steps: [
      {
        description: "Apply $H$ to qubit 1 of $|00\\rangle$; qubit 0 is untouched.",
        latex: "|00\\rangle \\xrightarrow{H \\text{ on } q_1} \\frac{|00\\rangle+|01\\rangle}{\\sqrt2}",
      },
      {
        description: "Apply CNOT with qubit 1 as control, qubit 0 as target: the $|00\\rangle$ term is unaffected; the $|01\\rangle$ term has its target (qubit 0) flipped.",
        latex: "\\frac{|00\\rangle+|01\\rangle}{\\sqrt2} \\xrightarrow{\\text{CNOT}(1,0)} \\frac{|00\\rangle+|11\\rangle}{\\sqrt2}",
      },
      { description: "Apply the Born rule to the |11⟩ term.", latex: "P(11) = \\left(\\frac{1}{\\sqrt2}\\right)^2 = \\frac12" },
    ],
    finalAnswer: "$P(11) = 0.5$",
  },
  explanation: {
    correctIdea: "Reading the circuit column by column with the stated control/target roles reproduces a Bell-like correlated state.",
    whyCorrect: "Tracing each basis term through both columns individually gives (|00⟩+|11⟩)/√2, whose |11⟩ probability is 1/2.",
    whyWrong: [
      "Assuming qubit 0 (the target here, not the control) is the one that gets superposed by H mixes up which qubit column 1 actually touches.",
      "Treating this as an ordinary CNOT(0,1) instead of CNOT(1,0) swaps which qubit's value the target-flip depends on.",
    ],
  },
};
