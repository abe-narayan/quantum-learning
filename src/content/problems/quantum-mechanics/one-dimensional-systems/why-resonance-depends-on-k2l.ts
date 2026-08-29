import type { ConceptualProblem } from "@/lib/problems/types";

export const whyResonanceDependsOnK2L: ConceptualProblem = {
  meta: {
    slug: "why-resonance-depends-on-k2l",
    title: "Why Resonance Depends Only on k2*L",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["scattering", "barrier", "resonance"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In one or two sentences, explain why the resonance condition depends only on the combination k2*L, not on V0 or E separately, connecting this to the optical thin-film 'round-trip phase' analogy.",
    placeholder: "Explain why only k2*L matters for resonance...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      [
        "sin^2(k2*L)",
        "k2l",
        "k2 l",
        "only appears through this combination",
        "combination",
        "the formula only depends on the product",
        "only depends on the product",
        "only through the product",
        "the product",
        "only depends on",
        "always together",
      ],
      {
        phrases: [
          "round-trip phase",
          "round trip",
          "round-trip",
          "phase accumulated crossing the barrier",
          "accumulated phase",
          "phase accumulated",
          "like a thin film",
          "thin film",
          "path length",
          "optical path",
          "interference condition",
          "standing wave",
        ],
        missingFeedback:
          "You have shown the formula only sees the product k₂L. Say what that product means physically: it is the phase the wave accumulates crossing the barrier, so resonance is an interference condition on a round trip, the same mechanism as an anti-reflection thin film.",
      },
    ],
    incorrectFeedback: "Name both pieces: that the transmission formula's only L-and-energy dependence is through the single combination k2*L (inside the sin^2 term), and that k2*L physically represents the phase accumulated crossing the barrier, exactly like a thin film's round-trip phase in optics.",
  },
  hints: [{ text: "Look at the transmission formula: where do L and k2 appear, and always together or separately?" }],
  solution: {
    steps: [
      { description: "In $T=[1+V_0^2\\sin^2(k_2L)/(4E(E-V_0))]^{-1}$, $L$ appears *only* inside $\\sin(k_2L)$ — always multiplied by $k_2$, never alone." },
      { description: "$k_2L$ is physically the phase a wave accumulates crossing the barrier once — exactly the quantity that determines constructive or destructive interference between the two boundary reflections, just as a thin film's transparency depends on the phase accumulated crossing it, not on its thickness and the light's wavelength separately." },
    ],
    finalAnswer: "L enters the formula only through the combination k2*L, which is physically the phase accumulated crossing the barrier once — the same quantity that governs interference in a thin optical film.",
  },
  explanation: {
    correctIdea: "Different (E,V0,L) combinations that happen to give the same k2*L are all equally resonant or equally off-resonance.",
    whyCorrect: "Directly readable from the formula's structure.",
    whyWrong: ["Claiming resonance depends on V0 and E independently (not just through k2) contradicts the formula directly — V0 and E appear elsewhere (the prefactor), but the resonance condition itself is purely about k2*L."],
  },
};
