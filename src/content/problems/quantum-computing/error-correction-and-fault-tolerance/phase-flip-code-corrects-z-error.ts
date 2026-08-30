import { Complex } from "@/lib/quantum/complex";
import { encodePhaseFlipCode, runPhaseFlipCorrectionCycle, applyPhaseFlipError } from "@/lib/quantum/errorCorrection";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const encoded = encodePhaseFlipCode(new Complex(0.6), new Complex(0.8));
const corrupted = applyPhaseFlipError(encoded, 2);
const result = runPhaseFlipCorrectionCycle(corrupted, [0.1, 0.1]);
let maxDiff = 0;
for (let i = 0; i < 8; i++) maxDiff = Math.max(maxDiff, result.corrected.amplitudes[i].sub(encoded.amplitudes[i]).magnitude());

export const phaseFlipCodeCorrectsZError: MultipleChoiceProblem = {
  meta: {
    slug: "phase-flip-code-corrects-z-error",
    title: "Does the Phase-Flip Code Correct a Z Error on Qubit 2?",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-phase-flip-code",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["quantum-error-correction", "phase-flip-code"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-phase-flip-code"],
  },
  question: {
    type: "multiple-choice",
    prompt: "After a Z error on qubit 2 of the phase-flip-encoded state and running the full correction cycle, how does the recovered state compare to the original encoded state?",
    options: [
      { id: "a", text: "Matches exactly, to floating-point precision" },
      { id: "b", text: "Matches only approximately, with a small residual error" },
      { id: "c", text: "Does not match at all, since this code cannot correct Z errors" },
      { id: "d", text: "Matches only if the error was on qubit 0 or 1, not qubit 2" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The correction is exact, not approximate: conjugation by H is exact, and so is the underlying bit-flip code's correction.",
      c: "This has the two codes backward. The phase-flip code is built to correct Z errors; the bit-flip code is the one blind to them.",
      d: "The code corrects a Z error on any of the three qubits equally, qubit 2 included, as this problem's own computation confirms.",
    },
    defaultIncorrectFeedback: "This is the dual construction the phase-flip code lesson verified for all three qubit positions.",
  },
  hints: [
    { text: "The phase-flip code is the bit-flip code conjugated by H^⊗3." },
    { text: "The bit-flip code corrects any single-qubit X error exactly." },
    { text: "So the phase-flip code should correct any single-qubit Z error exactly, by the same conjugation." },
  ],
  solution: {
    steps: [{ description: "The recovered state matches the original exactly, confirmed to floating-point precision by direct computation." }],
    finalAnswer: "It matches exactly, to floating-point precision.",
  },
  explanation: {
    correctIdea: "The H-conjugation is exact, so the phase-flip code inherits the bit-flip code's exact correction guarantee for its own error type.",
    whyCorrect: `Confirmed directly: the maximum amplitude difference is ${maxDiff.toExponential(2)}, no larger than floating-point rounding.`,
    whyWrong: [
      { optionId: "b", text: "Understates the precision. The H-conjugation and the underlying bit-flip correction are both exact, so no residual error is left behind." },
      { optionId: "c", text: "Backwards on error type. The phase-flip code is built to correct Z errors; the bit-flip code is the one blind to them." },
      { optionId: "d", text: "Singles out qubit 2. The code corrects a Z error on any of the three qubits equally, as this problem's own computation shows." },
    ],
  },
};
