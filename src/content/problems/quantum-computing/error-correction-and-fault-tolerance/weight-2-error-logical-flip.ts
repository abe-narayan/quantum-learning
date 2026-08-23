import { Complex } from "@/lib/quantum/complex";
import { encodeBitFlipCode, runBitFlipCorrectionCycle, applyBitFlipError } from "@/lib/quantum/errorCorrection";
import type { NumericProblem } from "@/lib/problems/types";

const alpha = new Complex(0.6);
const beta = new Complex(0.8);
const encoded = encodeBitFlipCode(alpha, beta);
let corrupted = applyBitFlipError(encoded, 0);
corrupted = applyBitFlipError(corrupted, 1);
const result = runBitFlipCorrectionCycle(corrupted, [0.1, 0.1]);
const value = result.corrected.amplitudes[0].re;

export const weight2ErrorLogicalFlip: NumericProblem = {
  meta: {
    slug: "weight-2-error-logical-flip",
    title: "The Recovered Amplitude After a Weight-2 Error",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["quantum-error-correction", "code-distance"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map"],
  },
  question: {
    type: "numeric",
    prompt: "Encode α=0.6, β=0.8. Apply X errors to qubits 0 AND 1 (a weight-2 error). Run the full recovery cycle. What is the resulting |000⟩ amplitude?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "The lesson derives that this specific weight-2 error, after 'recovery,' swaps α and β — so the |000⟩ amplitude becomes what β was, not α.",
  },
  hints: [
    { text: "The syndrome for X₀X₁ is (0,1), which the decode table reads as 'qubit 2'." },
    { text: "Applying X₂ to the already-corrupted state combines with X₀X₁ to give a net X₀X₁X₂." },
    { text: "X₀X₁X₂ swaps |000⟩↔|111⟩, so the new |000⟩ amplitude is the original β=0.8." },
  ],
  solution: {
    steps: [{ description: "The net applied error becomes X₀X₁X₂, swapping the roles of α and β — the |000⟩ amplitude becomes 0.8 (originally β)." }],
    finalAnswer: "0.8",
  },
  explanation: {
    correctIdea: "This confirms directly that running recovery on an over-threshold error doesn't fail gently — it produces a specific, predictable logical error.",
    whyCorrect: "Matches the engine's actual computed output exactly, as derived in the lesson's worked example.",
    whyWrong: ["Expecting the original α=0.6 here would assume the recovery either did nothing or worked correctly — neither is what actually happens for this over-threshold error."],
  },
};
