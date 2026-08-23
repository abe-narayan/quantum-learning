import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { applyBitOracle } from "@/lib/quantum/oracles";
import type { NumericProblem } from "@/lib/problems/types";

const s = Math.SQRT1_2;
const xState = StateVector.basis(1, 0); // |x=0>
const minus = new StateVector([new Complex(s), new Complex(-s)]);
const full = new StateVector(xState.amplitudes.flatMap((a) => minus.amplitudes.map((m) => a.mul(m))));
const f = (x: number) => (x === 0 ? 1 : 0) as 0 | 1;
const result = applyBitOracle(full, f);
// overlap with |x=0>|-> to extract the sign
const overlap = result.amplitudes[0].mul(minus.amplitudes[0].conjugate()).add(result.amplitudes[1].mul(minus.amplitudes[1].conjugate()));
const value = overlap.re;

export const phaseKickbackSignForF0: NumericProblem = {
  meta: {
    slug: "phase-kickback-sign-for-f0",
    title: "Phase Kickback Sign When f(0)=1",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/phase-kickback",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["phase-kickback"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/phase-kickback"],
  },
  question: {
    type: "numeric",
    prompt: "Using U_f|x⟩|−⟩=(−1)^f(x)|x⟩|−⟩, what sign multiplies |0⟩|−⟩ when f(0)=1?",
    inputHint: "as +1 or -1",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "(−1)^f(0) with f(0)=1 gives (−1)^1.",
  },
  hints: [
    { text: "The formula is (−1)^f(x)." },
    { text: "Here f(0)=1, so the exponent is 1." },
    { text: "(−1)^1 = −1." },
  ],
  solution: {
    steps: [{ description: "(−1)^f(0) = (−1)^1 = −1." }],
    finalAnswer: "−1",
  },
  explanation: {
    correctIdea: "The kickback formula's exponent is f(x) itself, so f(x)=1 gives a minus sign directly.",
    whyCorrect: "Matches the direct algebraic derivation and the engine's own computed overlap.",
    whyWrong: ["Answering +1 would be correct for f(0)=0, not f(0)=1 — check which case applies."],
  },
};
