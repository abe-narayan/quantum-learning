import type { ConceptualProblem } from "@/lib/problems/types";

export const basisDependenceOfInterference: ConceptualProblem = {
  meta: {
    slug: "basis-dependence-of-interference",
    title: "Why Interference Depends on the Measurement Basis",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["interference", "superposition"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/superposition-interference-and-phase"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Explain why a relative phase between two amplitudes is invisible when measuring in the state's own basis, but visible when measuring in a different basis.",
    placeholder: "Explain the basis-dependence...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["natural basis", "|c_a|^2", "doesn't depend on phase", "does not depend on phase", "phase cancels", "phase drops out", "modulus kills the phase", "squared modulus removes", "only the magnitudes", "magnitudes alone", "phase disappears"],
        missingFeedback:
          "Take the state's own basis first. Write down what one outcome's probability is there, and say why the phase leaves no trace in it.",
      },
      {
        phrases: ["mixes the terms", "rotated basis", "cross term", "cross-term", "overlap with both", "overlaps both", "interference term", "the two terms add", "both terms contribute at once"],
        missingFeedback:
          "You have the own-basis case. Now say what is structurally different when you project onto a vector that is not one of the state's own, and what extra piece appears in the probability as a result.",
      },
    ],
    incorrectFeedback:
      "You said 'phase is unobservable', which is true of a global phase and false of the one in question. Do the arithmetic in two settings: compute a probability using the state's own eigenvectors, then using eigenvectors of some other observable, and see in which of the two the phase survives the modulus.",
    partialFeedback: "You've covered one setting. Do the same computation in the other one and compare which terms show up.",
    modelAnswers: [
      "In the state's own basis each outcome probability is a single squared modulus, and taking the modulus kills the phase, so it drops out and you see nothing. In a rotated basis the projection overlaps both terms at once, so a cross term survives in the probability and the phase shows up there.",
      "Measuring in the natural basis gives |c_a|^2 and |c_b|^2, which do not depend on phase at all. A different basis mixes the terms, so the two terms add before you square and the resulting interference term carries the phase.",
    ],
  },
  hints: [
    { text: "Write the state as c_a|a⟩ + c_b|b⟩ with a relative phase carried by c_b, and compute P(a) directly. How many terms does the expression have?" },
    { text: "Now pick a vector that is a combination of |a⟩ and |b⟩, and compute the probability of that outcome. Expand the square honestly and count the terms this time." },
    { text: "One of the two calculations produced an extra term containing both coefficients at once. Say what that term does when the relative phase changes, and why the first calculation had nothing like it." },
  ],
  solution: {
    steps: [
      { description: "Measuring in the state's own basis gives $P(a)=|c_a|^2$: a single term, no cross term, so no phase dependence." },
      { description: "Measuring in a different basis requires projecting onto a new basis vector that overlaps with both original terms, producing a cross term proportional to $\\cos\\varphi$." },
    ],
    finalAnswer: "In the state's own basis each probability is a single squared modulus, so the phase drops out of it. In a rotated basis the projection overlaps both terms at once, a cross term survives, and the phase shows up there.",
  },
  explanation: {
    correctIdea: "Interference is not a property of a state alone. It depends on the relationship between the state and the chosen measurement basis.",
    whyCorrect: "This is the derivation from the lesson: |⟨+|ψ⟩|² picks up a cross term that |⟨0|ψ⟩|² never does.",
    whyWrong: ["Saying phase is 'just never observable' ignores that a cross-basis measurement makes it directly observable."],
  },
};
