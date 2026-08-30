import { exactTwoLevelTransitionProbability } from "@/lib/quantum/approximationMethods";
import type { NumericProblem } from "@/lib/problems/types";

const omega = 2 * Math.PI * 25e6;
const tPi = Math.PI / (2 * omega);
const value = tPi * 1e9; // nanoseconds

// Cross-check: the exact two-level Rabi model should give essentially
// full population transfer (P1≈1) at this pulse duration.
const p1AtTPi = exactTwoLevelTransitionProbability(0, 0, omega, tPi, 2000);
if (Math.abs(p1AtTPi - 1) > 1e-6) {
  throw new Error(`pi-pulse-duration-25mhz: expected P1≈1 at t_π, got ${p1AtTPi}`);
}

export const piPulseDuration25Mhz: NumericProblem = {
  meta: {
    slug: "pi-pulse-duration-25mhz",
    title: "π-Pulse Duration at Ω=2π×25 MHz",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/superconducting-qubits",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["superconducting-qubits", "rabi"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/superconducting-qubits"],
  },
  question: {
    type: "numeric",
    prompt: "Using t_π=π/(2Ω), what is the π-pulse duration (in nanoseconds) for a Rabi frequency Ω=2π×25 MHz?",
    inputHint: "in nanoseconds",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.1,
    incorrectFeedback: "Check the factor of 2 in the denominator: using π/Ω instead of π/(2Ω) doubles the answer. Then check units: the formula gives seconds, and the question asks for nanoseconds.",
    nearMisses: [
      { value: 20, tolerance: 0.1, feedback: "20 ns is t = π/Ω, missing the factor of 2 in the denominator." },
      { value: 40, tolerance: 0.2, feedback: "40 ns is 1/(25 MHz), the period of the frequency quoted inside Ω rather than a pulse duration. Under this track's convention the π-pulse takes a quarter of it." },
    ],
  },
  hints: [
    { text: "You are handed both the formula and Ω, quoted as 2π times a frequency in MHz. The plan: substitute, cancel the 2π factors, and only then handle the unit conversion to nanoseconds." },
    { text: "t_π = π/(2Ω). With Ω = 2π×25 MHz, the π in the numerator cancels against the 2π inside Ω, leaving t_π = 1/(4×25 MHz)." },
    { text: "Evaluate 1/(4×25 MHz) = 1/(100 MHz), then express that time in nanoseconds." },
  ],
  solution: {
    steps: [{ description: "t_π = π/(2×2π×25×10⁶) = 1/(4×25×10⁶) = 10⁻⁸ s = 10 ns." }],
    finalAnswer: "10 ns",
  },
  explanation: {
    correctIdea: "This exactly reproduces the lesson's worked example, confirming a realistic superconducting-qubit gate time from the Rabi model alone.",
    whyCorrect: "Verified against exactTwoLevelTransitionProbability(0,0,Ω,t_π), which gives P₁≈1.0 at this t_π.",
    whyWrong: ["Forgetting the factor of 2 in the denominator (using t=π/Ω instead of π/(2Ω)) would double the correct answer."],
  },
};
