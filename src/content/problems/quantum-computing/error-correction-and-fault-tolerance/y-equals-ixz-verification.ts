import { Complex } from "@/lib/quantum/complex";
import { PAULI_X, PAULI_Z } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

const XZ = PAULI_X.mul(PAULI_Z);
const iXZ_01 = XZ.get(0, 1).mul(new Complex(0, 1));
const value = iXZ_01.im;

export const yEqualsIxzVerification: NumericProblem = {
  meta: {
    slug: "y-equals-ixz-verification",
    title: "Verifying Y=iXZ's (0,1) Entry",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["pauli-operators"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different"],
  },
  question: {
    type: "numeric",
    prompt: "Compute (iXZ)'s (0,1) matrix entry's imaginary part, and confirm it matches Y's known (0,1) entry, -i.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Compute XZ's (0,1) entry first, then multiply by i. A positive answer means Z's minus sign went missing; an answer of zero means the factor of i was dropped or the wrong entry was read.",
    nearMisses: [
      { value: 1, feedback: "The sign is off. Z's (1,1) entry is −1, and that minus survives into (XZ)₀₁ = −1, so the imaginary part of i(−1) is −1." },
      { value: 0, feedback: "A zero imaginary part would mean the entry is real. Multiplying the real number (XZ)₀₁ by i makes it purely imaginary; read off its coefficient." },
    ],
  },
  hints: [
    { text: "XZ's (0,1) entry is X's row 0 dotted with Z's column 1." },
    { text: "Write out X's top row and Z's rightmost column: each has a single nonzero entry, and Z's carries a minus sign." },
    { text: "Sum the products of the dot product, then multiply the result by i. The question asks for the imaginary part of what you get." },
  ],
  solution: {
    steps: [
      { description: "(XZ)₀₁ = 0(0)+1(-1) = -1." },
      { description: "(iXZ)₀₁ = i(-1) = -i." },
    ],
    finalAnswer: "-1 (imaginary part of -i)",
  },
  explanation: {
    correctIdea: "Y's standard (0,1) entry is exactly -i, matching iXZ's computed value.",
    whyCorrect: "Direct matrix multiplication confirms the identity Y=iXZ entry by entry.",
    whyWrong: ["Computing XZ correctly but forgetting the i factor would give -1 instead of the correct -i for this entry."],
  },
};
