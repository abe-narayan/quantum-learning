import type { ConceptualProblem } from "@/lib/problems/types";

export const synthesisTunnelingVsResonanceRegimes: ConceptualProblem = {
  meta: {
    slug: "synthesis-tunneling-vs-resonance-regimes",
    title: "Synthesis: The Two Barrier-Scattering Regimes",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["synthesis", "tunneling", "resonance"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A particle's energy E is slowly increased from below a barrier's height V0 to above it. In two or three sentences, describe how the transmission probability's qualitative behavior changes as E crosses V0, connecting the tunneling (tanh/exponential) and resonance (oscillatory) regimes.",
    placeholder: "Describe the transition between the two scattering regimes...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["exponentially small", "tunneling regime", "E below V0"],
      ["oscillatory", "sin^2", "E above V0", "can reach exactly 1"],
    ],
    incorrectFeedback: "Name both pieces: the tunneling regime's exponentially-suppressed transmission below V0, and the resonance regime's oscillatory transmission (which can reach exactly 1) above V0.",
    partialFeedback: "You're partway there — describe both regimes, not just one.",
  },
  hints: [{ text: "What kind of function describes T below V0 (Tunneling and the Finite Barrier)? What kind describes T above V0 (this course)?" }],
  solution: {
    steps: [
      { description: "Below $V_0$: the wavefunction decays inside the barrier, giving transmission that falls off roughly exponentially with barrier width — always small for a wide or tall barrier, never exactly zero." },
      { description: "Above $V_0$: the wavefunction oscillates inside the barrier instead, giving transmission that oscillates with barrier width via $\\sin^2(k_2L)$ — generally high, and able to reach exactly 1 at resonance." },
    ],
    finalAnswer: "Below V0, transmission is small and roughly exponential in barrier width (tunneling); above V0, transmission is generally high and oscillates with barrier width, reaching exactly 1 at resonances — a qualitative change in behavior exactly at E=V0, where the wavefunction's character inside the barrier switches from decaying to oscillating.",
  },
  explanation: {
    correctIdea: "E=V0 is a genuine qualitative transition point, not just a boundary between two similar formulas.",
    whyCorrect: "This synthesizes the two courses' complementary treatments of the same physical barrier.",
    whyWrong: ["Assuming transmission increases smoothly and monotonically as E crosses V0 misses that the resonance structure (oscillating between values, including exactly 1) only appears once E exceeds V0 — the two regimes are qualitatively, not just quantitatively, different."],
  },
};
