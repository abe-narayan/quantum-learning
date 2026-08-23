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
    incorrectFeedback: "Use Ω=π/(2t_π), then convert to MHz by dividing by 2π.",
  },
  hints: [
    { text: "Ω = π/(2×13.89 ns)." },
    { text: "This gives Ω in rad/s; divide by 2π to get frequency in Hz, then convert to MHz." },
    { text: "Should recover very close to 18 MHz — the true (hidden) value." },
  ],
  solution: {
    steps: [{ description: "Ω=π/(2×13.89ns)≈2π×18.0 MHz — the calibration recovers the true hidden frequency to within scan resolution." }],
    finalAnswer: "≈18.0 MHz",
  },
  explanation: {
    correctIdea: "This is exactly the lesson's own worked calibration procedure, confirming the recovered value matches the true (otherwise hidden) Ω.",
    whyCorrect: "Matches the engine's own scan-and-invert procedure over exactTwoLevelTransitionProbability data.",
    whyWrong: ["A recovered value far from 18 MHz would indicate either a scan-range or peak-finding error — not what this platform's properly-scoped scan produces."],
  },
};
