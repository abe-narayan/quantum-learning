import { Complex } from "@/lib/quantum/complex";
import { encodeBitFlipCode, runBitFlipCorrectionCycle } from "@/lib/quantum/errorCorrection";
import { applySingleQubitGate, PAULI_Z } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

const encoded = encodeBitFlipCode(new Complex(0.6), new Complex(0.8));
const corrupted = applySingleQubitGate(encoded, PAULI_Z, 1); // Z error on qubit 1
const result = runBitFlipCorrectionCycle(corrupted, [0.1, 0.1]);
const value = result.syndrome[0] + result.syndrome[1];

export const bitFlipCodeBlindToZ: NumericProblem = {
  meta: {
    slug: "bit-flip-code-blind-to-z",
    title: "The Bit-Flip Code's Syndrome for a Z Error",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["quantum-error-correction", "bit-flip-code"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code"],
  },
  question: {
    type: "numeric",
    prompt: "Apply a Z error to qubit 1 of the encoded state, then run the bit-flip code's syndrome extraction. What is s₁+s₂ (the sum of both syndrome bits)?",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback: "Z changes only the relative phase, never which computational-basis term carries amplitude. Ask whether a parity check on basis values can register a pure phase change at all; the syndrome bits you sum should reflect that.",
  },
  hints: [
    { text: "Start by asking what a Z error does to a computational-basis ket: it can flip the sign in front, but it never changes which basis state the qubit occupies." },
    { text: "The bit-flip code's syndrome bits are parity checks on basis values. Parity checks see only which basis state each qubit is in, never the phase." },
    { text: "So decide whether this error changes anything the parity checks can see. Your answer is the sum of the two syndrome bits that follow." },
  ],
  solution: {
    steps: [
      { description: "Z doesn't change which basis state a qubit is in, only its phase." },
      { description: "The parity checks therefore see nothing: both syndrome bits stay 0, and their sum is 0." },
    ],
    finalAnswer: "0",
  },
  explanation: {
    correctIdea: "This confirms directly, not just by argument, that the bit-flip code is completely blind to Z errors.",
    whyCorrect: "Matches the engine's actual syndrome output of (0,0) for this error.",
    whyWrong: ["Expecting a nonzero syndrome here misunderstands that Z errors are a fundamentally different error type this specific code isn't designed to catch."],
  },
};
