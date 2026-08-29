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
    { text: "Substitute n = 0 into the modified condition and read off what it demands of the action integral." },
    { text: "The action integral ∫p dx runs between the two classical turning points. Ask what energy makes it vanish." },
    { text: "Turning points coincide at the bottom of the well, so compare the energy that forces against the oscillator's true ground state." },
  ],
  solution: {
    steps: [{ description: "Setting n = 0 in ∫p dx = nπℏ demands ∫p dx = 0. The integral runs between the classical turning points, and it vanishes only when they coincide, which happens at the bottom of the well. So the modified condition predicts E = 0, missing the oscillator's zero-point energy of 0.5ℏω." }],
    finalAnswer: "It would predict E = 0 for the ground state, missing the oscillator's zero-point energy of 0.5ℏω.",
  },
  explanation: {
    correctIdea: "The Maslov half is what keeps WKB's lowest level off the bottom of the well. Dropping it is not a small numerical slip; it removes the zero-point energy.",
    whyCorrect: "Follows from setting n = 0 in both the correct and the modified quantization conditions.",
    whyWrong: [
      { optionId: "b", text: "Has it backwards. The shift is a fixed absolute amount, so it is proportionally largest at small n and fades at large n." },
      { optionId: "c", text: "Overshoots. The condition forces E down to the potential minimum, which is zero here, not below it." },
      { optionId: "d", text: "Confuses the two sides of the condition. The integral stays well defined; only the value it is set equal to changes." },
    ],
  },
};
