import { createGrid } from "@/lib/quantum/wavefunction";
import { harmonicOscillatorPotential } from "@/lib/quantum/potentials";
import { wkbQuantizedEnergy } from "@/lib/quantum/approximationMethods";
import type { NumericProblem } from "@/lib/problems/types";

const grid = createGrid(2048, 0.02);
const V = harmonicOscillatorPotential(grid, 1, 1);
const value = wkbQuantizedEnergy(grid, V, 2, { eMin: 0.01, eMax: 20 });

export const wkbEnergyForNEquals2: NumericProblem = {
  meta: {
    slug: "wkb-energy-for-n-equals-2",
    title: "The WKB-Quantized Energy for n=2",
    course: "approximation-methods",
    lesson: "quantum-mechanics/approximation-methods/the-wkb-approximation",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["wkb"],
    prerequisites: ["quantum-mechanics/approximation-methods/the-wkb-approximation"],
  },
  question: {
    type: "numeric",
    prompt: "Using the WKB quantization condition on the harmonic oscillator (m=ω=1), what energy does it predict for n=2, and how does it compare to the exact E₂=2.5?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "The exact answer is E₂=(2+1/2)(1)=2.5; WKB should match this to within a small numerical-integration error.",
  },
  hints: [
    { text: "Exact: Eₙ=(n+1/2)ℏω, so E₂=2.5." },
    { text: "WKB is exact for the harmonic oscillator (a special property of this potential)." },
    { text: "Expect a WKB value extremely close to 2.5." },
  ],
  solution: {
    steps: [{ description: "Exact E₂=(2+1/2)(1)=2.5; WKB's bisection search on the action integral converges to essentially the same value, matching to within grid-resolution numerical error." }],
    finalAnswer: "≈2.5",
  },
  explanation: {
    correctIdea: "This directly extends the lesson's n=0,1,3 worked-example table to n=2, confirming the same near-exact agreement.",
    whyCorrect: "Matches wkbQuantizedEnergy's engine output for n=2 on this potential and grid.",
    whyWrong: ["A value far from 2.5 would suggest either a bracket [eMin,eMax] too narrow to contain the root, or a genuine bug in the action-integral bisection."],
  },
};
