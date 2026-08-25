import { infiniteSquareWellEnergyLevel } from "@/lib/quantum/potentials";
import type { NumericProblem } from "@/lib/problems/types";

const halfWidth = 1.5;
const firstPoleEnergy = infiniteSquareWellEnergyLevel(1, 2 * halfWidth);

export const infiniteWellPoleLocation: NumericProblem = {
  meta: {
    slug: "infinite-well-pole-location",
    title: "Where Is the First Pole for a Different Half-Width?",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/greens-functions-and-resolvents",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["greens-functions", "resolvent", "infinite-well"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/greens-functions-and-resolvents"],
  },
  question: {
    type: "numeric",
    prompt:
      "For an infinite square well of half-width a=1.5, the Green's function G_well(x,x';E) has poles at E=n²π²/(8a²). At what energy E does the FIRST pole (n=1) occur?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: firstPoleEnergy,
    tolerance: 0.01,
    incorrectFeedback: "Use E=n²π²/(8a²) with n=1, a=1.5 — this is exactly the lesson's boxed pole condition sin(2ka)=0, i.e. 2ka=π for the first pole.",
  },
  hints: [
    { text: "Poles occur where sin(2ka)=0, i.e. 2ka=nπ." },
    { text: "For the first pole, n=1, so k=π/(2a)." },
    { text: "E=k²/2, so E=π²/(8a²)." },
  ],
  solution: {
    steps: [
      { description: "The first pole (n=1) satisfies 2ka=π.", latex: "k = \\frac{\\pi}{2a} = \\frac{\\pi}{3}" },
      {
        description: "Convert to energy via E=k²/2.",
        latex: "E = \\frac{1}{2}\\left(\\frac{\\pi}{3}\\right)^2 = \\frac{\\pi^2}{18} \\approx 0.5483",
      },
    ],
    finalAnswer: "E ≈ 0.5483, matching infiniteSquareWellEnergyLevel(1, 3) exactly (full width 2a=3).",
  },
  explanation: {
    correctIdea:
      "The Green's function's pole condition E=n²π²/(8a²) is exactly the already-known infinite-well energy formula, now reached from the resolvent's analytic structure instead of directly solving the Schrödinger equation.",
    whyCorrect: "Directly verified against this platform's real infiniteSquareWellEnergyLevel(1, 2×1.5) function.",
    whyWrong: [
      "Using the well's full width (2a=3) in place of the half-width a in the formula E=n²π²/(8a²) would give a different (wrong) energy — the boxed formula uses the half-width a specifically.",
    ],
  },
};
