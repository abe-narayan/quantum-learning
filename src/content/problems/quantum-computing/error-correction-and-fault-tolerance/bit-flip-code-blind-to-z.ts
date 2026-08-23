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
    incorrectFeedback: "Z only changes relative phase, never which computational-basis term has amplitude — does the syndrome (a parity check on basis values) notice this at all?",
  },
  hints: [
    { text: "Z leaves |0⟩ and |1⟩'s computational-basis identity unchanged — only a phase changes." },
    { text: "The syndrome checks are parity checks on qubit values, not phases." },
    { text: "A Z error should be completely invisible to this syndrome." },
  ],
  solution: {
    steps: [{ description: "Z doesn't change which basis state a qubit is in, only its phase — so both syndrome bits stay 0." }],
    finalAnswer: "0",
  },
  explanation: {
    correctIdea: "This confirms directly, not just by argument, that the bit-flip code is completely blind to Z errors.",
    whyCorrect: "Matches the engine's actual syndrome output of (0,0) for this error.",
    whyWrong: ["Expecting a nonzero syndrome here misunderstands that Z errors are a fundamentally different error type this specific code isn't designed to catch."],
  },
};
