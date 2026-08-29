import { StateVector } from "@/lib/quantum/state";
import { HADAMARD, applySingleQubitGate, applyCNOT } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

const afterH = applySingleQubitGate(StateVector.basis(2, 0b01), HADAMARD, 0);
const result = applyCNOT(afterH, 0, 1);
const probabilityOf01 = result.probabilities()[0b01];

export const psiPlusFromZeroOneProbability: NumericProblem = {
  meta: {
    slug: "psi-plus-from-zero-one-probability",
    title: "Deriving |Ψ+⟩ From |01⟩",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["bell-states", "entanglement", "measurement"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"],
  },
  question: {
    type: "numeric",
    prompt:
      "Starting from $|01\\rangle$, apply $H$ to qubit 0, then $\\text{CNOT}(0,1)$ — the recipe that produces $|\\Psi^+\\rangle$. What is the probability of measuring $|01\\rangle$ in the resulting state?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: probabilityOf01,
    tolerance: 0.01,
    incorrectFeedback: "Trace |01⟩ through H on qubit 0 first, then through CNOT(0,1), before applying the Born rule.",
    nearMisses: [
      { value: 0.25, feedback: "0.25 assumes all four outcomes are equally likely. |Ψ+⟩ has zero amplitude on |00⟩ and |11⟩, so its weight is split between two outcomes." },
      { value: 1, feedback: "Certainty would mean the circuit left |01⟩ untouched. The Hadamard puts qubit 0 into superposition first, so the final state is entangled, not a single basis state." },
    ],
  },
  hints: [
    { text: "H on qubit 0 of |01⟩ gives (|01⟩+|11⟩)/√2 — qubit 1 stays at 1 throughout this step." },
    { text: "CNOT(0,1): the |01⟩ term (control 0) is unaffected; the |11⟩ term (control 1) has its target, qubit 1, flipped." },
    { text: "The |11⟩ term becomes |10⟩ — so the final state is (|01⟩+|10⟩)/√2, which is exactly |Ψ+⟩." },
  ],
  solution: {
    steps: [
      {
        description: "Apply $H$ to qubit 0 of $|01\\rangle$.",
        latex: "|01\\rangle \\xrightarrow{H \\text{ on } q_0} \\frac{|01\\rangle+|11\\rangle}{\\sqrt2}",
      },
      {
        description: "Apply $\\text{CNOT}(0,1)$: the $|01\\rangle$ term is unaffected (control 0); the $|11\\rangle$ term has its target flipped (control 1).",
        latex: "\\frac{|01\\rangle+|11\\rangle}{\\sqrt2} \\xrightarrow{\\text{CNOT}(0,1)} \\frac{|01\\rangle+|10\\rangle}{\\sqrt2} = |\\Psi^+\\rangle",
      },
      { description: "Apply the Born rule to the |01⟩ term.", latex: "P(01) = \\left(\\frac{1}{\\sqrt2}\\right)^2 = \\frac12" },
    ],
    finalAnswer: "$P(01) = 0.5$",
  },
  explanation: {
    correctIdea: "The H-then-CNOT recipe applied to |01⟩ produces |Ψ+⟩ = (|01⟩+|10⟩)/√2, the same 'both terms equally likely' structure as |Φ+⟩.",
    whyCorrect: "Tracing |01⟩ through both gates individually gives exactly |Ψ+⟩, whose two nonzero terms each have probability 1/2.",
    whyWrong: [
      "Assuming all four two-qubit outcomes are equally likely (25% each) ignores that |00⟩ and |11⟩ have zero amplitude in this particular resulting state.",
    ],
  },
};
