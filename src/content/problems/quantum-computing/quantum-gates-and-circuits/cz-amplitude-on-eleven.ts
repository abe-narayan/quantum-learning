import { StateVector } from "@/lib/quantum/state";
import { applyCZ } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

const afterCZ = applyCZ(StateVector.basis(2, 0b11), 0, 1);
const amplitudeOn11 = afterCZ.amplitudes[0b11].re;

export const czAmplitudeOnEleven: NumericProblem = {
  meta: {
    slug: "cz-amplitude-on-eleven",
    title: "CZ's Effect on |11⟩",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["controlled-gates", "cz", "phase"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using the same $|0\\rangle\\langle0|\\otimes I + |1\\rangle\\langle1|\\otimes U$ construction with $U=Z$, apply controlled-$Z$ (control = qubit 0, target = qubit 1) to $|11\\rangle$. What is the resulting (real) amplitude on $|11\\rangle$?",
    inputHint: "as a signed number, e.g. 1 or -1",
  },
  answer: {
    type: "numeric",
    value: amplitudeOn11,
    tolerance: 0.01,
    incorrectFeedback: "CZ never changes which basis state you're in — only its sign. Recall what Z alone does to |1⟩.",
  },
  hints: [
    { text: "The control (qubit 0) is 1 in |11⟩, so the U=Z part of the construction applies to the target." },
    { text: "Z|1⟩ = -|1⟩ — Z leaves the basis state unchanged but flips its sign." },
    { text: "So CZ|11⟩ is still |11⟩, just with amplitude -1 instead of +1." },
  ],
  solution: {
    steps: [
      { description: "In $|11\\rangle$, the control (qubit 0) is 1, so the $|1\\rangle\\langle1|\\otimes Z$ term of the construction is the one that applies." },
      { description: "Z acts on the target (qubit 1, also 1): $Z|1\\rangle=-|1\\rangle$.", latex: "\\text{CZ}|11\\rangle = -|11\\rangle" },
    ],
    finalAnswer: "$-1$",
  },
  explanation: {
    correctIdea: "Unlike CNOT, CZ never changes which basis state a computational-basis input is in — it only ever multiplies by a sign.",
    whyCorrect: "Z is diagonal (Z|0⟩=|0⟩, Z|1⟩=-|1⟩), so the controlled version can only ever attach a ±1 phase, never flip a bit.",
    whyWrong: [
      "Expecting CZ to flip a bit the way CNOT does confuses the two gates — CZ's U=Z is diagonal, so no bit ever changes value under it.",
      "Answering +1 forgets that Z specifically flips the sign of |1⟩ (not |0⟩), and both qubits are 1 here.",
    ],
  },
};
