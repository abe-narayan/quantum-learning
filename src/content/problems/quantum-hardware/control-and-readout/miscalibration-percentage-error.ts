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
    incorrectFeedback: "Ω_actual = π/(2×20ns); convert to MHz by dividing by 2π.",
  },
  hints: [
    { text: "Ω_actual = π/(2×20ns)." },
    { text: "Convert rad/s to Hz by dividing by 2π, then to MHz." },
    { text: "≈12.5 MHz." },
  ],
  solution: {
    steps: [{ description: "Ω_actual = π/(2×20×10⁻⁹) ≈ 2π×12.5 MHz." }],
    finalAnswer: "≈12.5 MHz",
  },
  explanation: {
    correctIdea: "This reproduces the lesson's own worked example number, confirming the actual Ω is substantially lower (about 69% of the assumed 18 MHz) than what an uncalibrated assumption would use.",
    whyCorrect: "Matches the lesson's explicit Worked Example calculation.",
    whyWrong: ["Using the ASSUMED t_π (13.89ns) instead of the ACTUALLY OBSERVED one (20ns) would just reproduce the wrong, already-assumed 18 MHz value, missing the point of the calibration check."],
  },
};
