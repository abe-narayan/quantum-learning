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
    prompt: "Encode α=0.6, β=0.8. Apply X errors to both qubit 0 and qubit 1 (a weight-2 error). Run the full recovery cycle. What is the resulting |000⟩ amplitude?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Careful: this error is beyond what the code can correct, so recovery does not restore the original state. Trace what the decode table does with the (0,1) syndrome and work out the net operator actually applied, then read off the amplitude.",
    nearMisses: [
      {
        value: 0.6,
        feedback:
          "0.6 is the original α, which is what you would get if recovery had worked. A weight-2 error is outside the code's distance, and the decoder's best guess completes a logical X rather than undoing the error.",
      },
      { value: 0, feedback: "The state is still normalized after recovery: no amplitude is destroyed, it is only moved. Ask which basis state the net X₀X₁X₂ carries |111⟩ onto." },
    ],
  },
  hints: [
    { text: "The syndrome for X₀X₁ is (0,1), which the decode table reads as 'qubit 2'." },
    { text: "Applying X₂ to the already-corrupted state combines with X₀X₁ to give a net X₀X₁X₂." },
    { text: "X₀X₁X₂ swaps |000⟩↔|111⟩. So the recovered |000⟩ amplitude is whichever original amplitude sat on |111⟩; check whether that was α or β." },
  ],
  solution: {
    steps: [{ description: "The net applied error becomes X₀X₁X₂, swapping the roles of α and β: the |000⟩ amplitude becomes 0.8 (originally β)." }],
    finalAnswer: "0.8",
  },
  explanation: {
    correctIdea: "This confirms directly that running recovery on an over-threshold error doesn't fail gently: it produces a specific, predictable logical error.",
    whyCorrect: "Matches the engine's actual computed output exactly, as derived in the lesson's worked example.",
    whyWrong: ["Expecting the original α=0.6 here would assume the recovery either did nothing or worked correctly. Neither is what actually happens for this over-threshold error."],
  },
};
