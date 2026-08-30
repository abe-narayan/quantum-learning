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
    prompt: "Using the WKB quantization condition on the harmonic oscillator (m=ω=1), what energy does it predict for n=2? Work the exact eigenvalue out from the oscillator's own energy ladder as well, so you can say how far apart the two are.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    nearMisses: [
      { value: 2, tolerance: 0.005, feedback: "2 is ħω·n with the zero-point offset dropped. The WKB quantization condition carries the same half-integer offset the exact spectrum does, which is why the two agree so closely." },
      { value: 3, tolerance: 0.005, feedback: "3 is ħω(n+1), a whole level too high. Check whether the offset added to n was 1 rather than 1/2." },
      { value: 0.5, tolerance: 0.005, feedback: "0.5 is the ground-state energy. The prompt asks for n = 2." },
    ],
    incorrectFeedback: "Two things to check. First the exact reference: the ladder formula gives Eₙ as n plus a half, times ℏω, in these units. Second, whether your WKB search bracketed that value: a result far from the exact eigenvalue means the root was missed, not that WKB fails here.",
  },
  hints: [
    { text: "Two numbers are in play: the exact eigenvalue from the oscillator's energy ladder, and the WKB prediction from the quantization condition. Compute the exact one first as your reference." },
    { text: "The exact ladder is Eₙ = (n + 1/2)ℏω, evaluated with m = ω = 1." },
    { text: "For the harmonic oscillator specifically, WKB happens to be exact. So expect the action-integral root to land on the exact eigenvalue, up to grid error." },
  ],
  solution: {
    steps: [
      { description: "Exact reference: E₂ = (2 + 1/2)(1) = 2.5." },
      { description: "WKB's bisection search on the action integral converges to ≈2.5003 on this grid." },
      { description: "The comparison: WKB agrees with the exact 2.5 to about one part in ten thousand, limited only by grid resolution. This is the same near-exact agreement as the lesson's other rows." },
    ],
    finalAnswer: "≈2.5",
  },
  explanation: {
    correctIdea: "This directly extends the lesson's n=0,1,3 worked-example table to n=2, confirming the same near-exact agreement.",
    whyCorrect: "Matches wkbQuantizedEnergy's engine output for n=2 on this potential and grid.",
    whyWrong: ["A value far from 2.5 would suggest either a bracket [eMin,eMax] too narrow to contain the root, or a genuine bug in the action-integral bisection."],
  },
};
