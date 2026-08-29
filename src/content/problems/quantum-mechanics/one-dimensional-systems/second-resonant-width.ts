import type { NumericProblem } from "@/lib/problems/types";

export const secondResonantWidth: NumericProblem = {
  meta: {
    slug: "second-resonant-width",
    title: "The Second Resonant Barrier Width",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["scattering", "barrier", "resonance"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier"],
  },
  question: {
    type: "numeric",
    prompt: "For E = 5, V0 = 2 (natural units), the first resonance (n=1) occurs at width L ≈ 1.2825. Find the second resonant width (n=2).",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 2.5651,
    tolerance: 0.001,
    incorrectFeedback: "The n-th resonance occurs at L = n*pi/k2. Since n=1 gives L≈1.2825, n=2 is simply double that.",
    nearMisses: [
      { value: 1.2825, tolerance: 0.002, feedback: "That is the n=1 width, given in the prompt. The resonance condition k₂L = nπ is linear in n, so the next one sits at twice this." },
      { value: 3.8477, tolerance: 0.002, feedback: "That is the n=3 width. Count the resonances in order: n=2 comes next after the one the prompt names." },
    ],
  },
  hints: [{ text: "Resonances occur at k2*L = n*pi — the n=2 width is exactly twice the n=1 width." }],
  solution: {
    steps: [
      { description: "$k_2L=n\\pi$, so $L_n = n\\pi/k_2$; since $L_1\\approx1.2825$, $L_2=2L_1\\approx2.5651$." },
    ],
    finalAnswer: "$L_2 \\approx 2.5651$",
  },
  explanation: {
    correctIdea: "Resonant widths form an evenly-spaced sequence, exactly like the nodes of a standing wave.",
    whyCorrect: "Direct consequence of the resonance condition k2*L = n*pi being linear in n.",
    whyWrong: ["Recomputing k2 differently for n=2 (as if k2 depended on n) misunderstands that k2 is fixed by E and V0 alone — only L changes between resonances, not k2."],
  },
};
