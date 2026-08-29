import type { NumericProblem } from "@/lib/problems/types";

const tPiObserved = 20e-9; // seconds
const omegaActual = Math.PI / (2 * tPiObserved); // rad/s
const value = omegaActual / (2 * Math.PI) / 1e6; // MHz

export const miscalibrationPercentageError: NumericProblem = {
  meta: {
    slug: "miscalibration-percentage-error",
    title: "The Actual Ω When the Peak Is Found at 20ns Instead of 13.89ns",
    course: "control-and-readout",
    lesson: "quantum-hardware/control-and-readout/calibration",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["calibration"],
    prerequisites: ["quantum-hardware/control-and-readout/calibration"],
  },
  question: {
    type: "numeric",
    prompt: "The lesson's worked example finds a peak at t=20ns instead of the assumed 13.89ns (for an assumed Ω=2π×18 MHz). What is the actual Ω/(2π), in MHz?",
    inputHint: "in MHz",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.1,
    incorrectFeedback: "Two common slips here. Using the assumed 13.89 ns instead of the observed 20 ns just reproduces the assumed 18 MHz and defeats the calibration check. Or the units went wrong: the peak condition gives Ω in rad/s, and the question asks for Ω/(2π) in MHz.",
    nearMisses: [
      { value: 18, tolerance: 0.2, feedback: "18 MHz is the assumed value the calibration is testing. Feeding the observed 20 ns peak back through the peak condition is what reveals the true Ω." },
      { value: 25, tolerance: 0.2, feedback: "25 MHz is twice the answer: it comes from reading the peak condition as t = π/Ω instead of t = π/(2Ω), or equivalently from dividing the rad/s result by π rather than by 2π." },
    ],
  },
  hints: [
    { text: "Calibration reasons backward from data. The observed peak location, not the assumed one, tells you the true pulse duration, and the peak condition ties that duration to the actual Rabi frequency. Solve that relation for Ω." },
    { text: "The peak condition here reads Ω_actual = π/(2 t_obs), with t_obs the observed 20 ns." },
    { text: "That gives Ω in rad/s. Divide by 2π to get Hz, then convert to MHz. As a sanity check, the result should come out well below the assumed 18 MHz." },
  ],
  solution: {
    steps: [
      { description: "The observed peak sits at t_obs = 20 ns, so Ω_actual = π/(2×20×10⁻⁹ s) ≈ 7.854×10⁷ rad/s." },
      { description: "Ω_actual/(2π) ≈ 7.854×10⁷/(2π) Hz = 1.25×10⁷ Hz = 12.5 MHz." },
    ],
    finalAnswer: "≈12.5 MHz",
  },
  explanation: {
    correctIdea: "This reproduces the lesson's own worked example number, confirming the actual Ω is substantially lower (about 69% of the assumed 18 MHz) than what an uncalibrated assumption would use.",
    whyCorrect: "Matches the lesson's explicit Worked Example calculation.",
    whyWrong: ["Using the assumed t_π (13.89ns) instead of the observed one (20ns) would just reproduce the wrong, already-assumed 18 MHz value, missing the point of the calibration check."],
  },
};
