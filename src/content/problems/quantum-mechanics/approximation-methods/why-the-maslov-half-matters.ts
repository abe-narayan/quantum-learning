import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const whyTheMaslovHalfMatters: MultipleChoiceProblem = {
  meta: {
    slug: "why-the-maslov-half-matters",
    title: "What Happens Without the +1/2 in the WKB Condition?",
    course: "approximation-methods",
    lesson: "quantum-mechanics/approximation-methods/the-wkb-approximation",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["wkb"],
    prerequisites: ["quantum-mechanics/approximation-methods/the-wkb-approximation"],
  },
  question: {
    type: "multiple-choice",
    prompt: "If the quantization condition were mistakenly used as ∫p dx=nπℏ (dropping the +1/2), what would happen to the predicted harmonic-oscillator ground-state energy (n=0)?",
    options: [
      { id: "a", text: "It would predict E=0 for the ground state, instead of the correct E=0.5ℏω" },
      { id: "b", text: "Nothing would change — the +1/2 only matters for large n" },
      { id: "c", text: "It would predict a negative energy, which is unphysical" },
      { id: "d", text: "The action integral itself would become undefined" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The +1/2 shifts every predicted level by the same fixed amount, including (very visibly) the n=0 ground state.",
      c: "∫p dx=0 has the trivial solution of zero turning-point separation, i.e. E=V_min=0 in this potential's units — not negative, just wrong (missing the real zero-point energy).",
      d: "The action integral is still perfectly well-defined; only the target value on the right-hand side of the quantization condition changes.",
    },
    defaultIncorrectFeedback: "Setting n=0 in ∫p dx=nπℏ requires the action integral to be exactly 0, which happens only at E=0 (the bottom of the potential) — missing the true zero-point energy entirely.",
  },
  hints: [
    { text: "For n=0, the correct condition is ∫p dx=(0+1/2)πℏ=πℏ/2, not 0." },
    { text: "Dropping the +1/2 would require ∫p dx=0 at n=0, which only happens when the turning points coincide (E at the potential's minimum)." },
    { text: "This would predict E=0, missing the real zero-point energy of 0.5ℏω entirely." },
  ],
  solution: {
    steps: [{ description: "Without +1/2, n=0 requires ∫p dx=0, forcing E to the potential minimum (E=0) — missing the actual zero-point energy of 0.5ℏω." }],
    finalAnswer: "(a) It would incorrectly predict E=0 instead of 0.5ℏω",
  },
  explanation: {
    correctIdea: "The Maslov correction is precisely what gives WKB a nonzero, correct zero-point energy for a confined system — omitting it isn't a small error, it's qualitatively wrong at n=0.",
    whyCorrect: "Directly follows from setting n=0 in both the correct and (incorrectly) modified quantization conditions.",
    whyWrong: ["Claiming the effect only matters for large n has it backwards — the FRACTIONAL error from omitting +1/2 actually shrinks at large n, since n itself grows; the absolute effect is a fixed shift, most noticeable at small n."],
  },
};
