import { exactTwoLevelTransitionProbability } from "@/lib/quantum/approximationMethods";
import type { NumericProblem } from "@/lib/problems/types";

const omegaTrue = 2 * Math.PI * 18e6;
let bestT = 0;
let bestP = -1;
const steps = 4000;
const tMax = 20e-9;
for (let i = 0; i <= steps; i++) {
  const t = (i / steps) * tMax;
  const p = exactTwoLevelTransitionProbability(0, 0, omegaTrue, t, 2000);
  if (p > bestP) {
    bestP = p;
    bestT = t;
  }
}
const omegaRecovered = Math.PI / (2 * bestT);
const value = omegaRecovered / (2 * Math.PI) / 1e6; // MHz

export const recoverOmegaFromScan: NumericProblem = {
  meta: {
    slug: "recover-omega-from-scan",
    title: "Recovering Ω From a Rabi Calibration Scan",
    course: "control-and-readout",
    lesson: "quantum-hardware/control-and-readout/calibration",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["calibration", "rabi"],
    prerequisites: ["quantum-hardware/control-and-readout/calibration"],
  },
  question: {
    type: "numeric",
    prompt: "A Rabi calibration scan (true, hidden Ω=2π×18 MHz) finds its first population peak at t≈13.89 ns. What Rabi frequency (in MHz, i.e. Ω/(2π)) does this recover?",
    inputHint: "in MHz",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.05,
    incorrectFeedback: "Solve the peak condition Ω = π/(2 t_π) using the observed peak time, then divide by 2π to convert rad/s to Hz. An answer far from the hidden value usually means the 2π conversion was skipped.",
  },
  hints: [
    { text: "The scan hands you the observed π-pulse time. The peak condition ties that time to Ω; solve it for Ω before doing any unit conversion." },
    { text: "Ω = π/(2 t_π) with t_π ≈ 13.89 ns. This gives rad/s; divide by 2π for Hz, then scale to MHz." },
    { text: "Convert to MHz and compare with the value the prompt says was hidden. A good calibration should land on it to within scan resolution." },
  ],
  solution: {
    steps: [{ description: "Ω=π/(2×13.89ns)≈2π×18.0 MHz: the calibration recovers the true hidden frequency to within scan resolution." }],
    finalAnswer: "≈18.0 MHz",
  },
  explanation: {
    correctIdea: "This is exactly the lesson's own worked calibration procedure, confirming the recovered value matches the true (otherwise hidden) Ω.",
    whyCorrect: "Matches the engine's own scan-and-invert procedure over exactTwoLevelTransitionProbability data.",
    whyWrong: ["A recovered value far from 18 MHz would indicate either a scan-range or peak-finding error, which a properly scoped scan does not produce."],
  },
};
