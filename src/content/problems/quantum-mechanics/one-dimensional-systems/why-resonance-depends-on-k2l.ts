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
      {
        phrases: ["sin^2(k2*L)", "only appears through this combination", "only appears through", "enters only through", "enters only as", "L enters only", "the formula only depends on the product", "only depends on the product", "only through the product", "only the product matters", "appears only as a product", "always together", "never separately", "through k2 alone"],
        missingFeedback:
          "Look at where the barrier width appears in the transmission formula. Say whether it ever appears on its own, and what it is invariably attached to.",
      },
      {
        phrases: [
          "phase accumulated crossing the barrier",
          "accumulated phase",
          "phase accumulated",
          "phase picked up",
          "phase gained crossing",
          "phase across the barrier",
          "path length",
          "optical path",
          "interference condition",
          "standing wave",
          "half-wavelengths fit",
          "whole number of half wavelengths",
        ],
        missingFeedback:
          "You have shown the formula sees only one quantity. Now say what that quantity is physically: what does a wave acquire while it traverses the barrier and returns, and what does it mean for two such traversals to line up? Optics has a familiar name for the same effect.",
      },
    ],
    incorrectFeedback: "You restated that resonance happens at particular energies without saying why L and E are not independent knobs. Look at where each of them enters the transmission formula, and then ask what physical meaning the single quantity they enter as carries for a wave crossing and coming back.",
    modelAnswers: [
      "In the transmission formula L never appears on its own; it only appears through the product with k2, inside sin^2(k2*L). So any E, V0 and L giving the same product are equally resonant. Physically that product is the phase accumulated crossing the barrier once, exactly the round-trip phase that governs a thin optical film.",
      "The two only ever show up always together, never separately, so only the product matters. That product is the optical path length in phase units, which is why the thin-film interference condition is the same condition.",
    ],
  },
  hints: [
    { text: "Write the transmission formula out and circle every place the barrier's width appears, and every place the inside wavenumber appears." },
    { text: "They never appear apart. Pick a second pair of values, one wider and one slower, chosen so the quantity they form together is unchanged, and evaluate T for both." },
    { text: "That quantity is dimensionless, and dimensionless quantities inside a sine are angles. Say what angle a wave picks up on its way across the barrier and back, and which branch of physics calls the resulting condition by a name you have met." },
  ],
  solution: {
    steps: [
      { description: "In $T=[1+V_0^2\\sin^2(k_2L)/(4E(E-V_0))]^{-1}$, $L$ appears *only* inside $\\sin(k_2L)$, always multiplied by $k_2$ and never alone." },
      { description: "$k_2L$ is physically the phase a wave accumulates crossing the barrier once, which is the quantity that determines constructive or destructive interference between the two boundary reflections, just as a thin film's transparency depends on the phase accumulated crossing it rather than on its thickness and the light's wavelength separately." },
    ],
    finalAnswer: "L enters the formula only through the combination k2*L, which is physically the phase accumulated crossing the barrier once, the same quantity that governs interference in a thin optical film.",
  },
  explanation: {
    correctIdea: "Different (E,V0,L) combinations that happen to give the same k2*L are all equally resonant or equally off-resonance.",
    whyCorrect: "Directly readable from the formula's structure.",
    whyWrong: ["Claiming resonance depends on V0 and E independently, rather than only through k2, contradicts the formula. V0 and E do appear elsewhere, in the prefactor, but the resonance condition itself involves only k2*L."],
  },
};
