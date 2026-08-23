import type { ConceptualProblem } from "@/lib/problems/types";

export const ehrenfestSecondTheorem: ConceptualProblem = {
  meta: {
    slug: "ehrenfest-second-theorem",
    title: "Ehrenfest's Theorem for Momentum",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/wave-packet-dynamics-and-dispersion",
    difficulty: "advanced",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["ehrenfest-theorem", "momentum"],
    prerequisites: ["quantum-mechanics/wave-mechanics/wave-packet-dynamics-and-dispersion"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Using the general Ehrenfest identity d<A>/dt = (i/hbar)<[H,A]>, and the fact that [V(x),p] does not vanish in general, explain in one or two sentences what d<p>/dt should physically represent for a particle in a potential V(x).",
    placeholder: "Explain what Ehrenfest's theorem predicts for momentum...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["force", "-dV/dx", "classical force", "negative gradient"],
      ["newton", "second law", "average", "expectation value obeys"],
    ],
    incorrectFeedback: "Name both pieces: that d<p>/dt should equal the expectation value of -dV/dx (the classical force), and that this is exactly Newton's second law holding on average.",
    partialFeedback: "You're partway there — connect this explicitly to Newton's second law holding for the expectation values.",
  },
  hints: [
    { text: "In classical mechanics, dp/dt = -dV/dx (force is the negative gradient of potential energy)." },
    { text: "Ehrenfest's theorem says quantum expectation values obey the analogous classical equation." },
  ],
  solution: {
    steps: [
      { description: "$\\dfrac{d\\langle p\\rangle}{dt} = \\left\\langle -\\dfrac{dV}{dx}\\right\\rangle$ — the expectation value of the classical force." },
      { description: "This is Newton's second law, holding exactly for expectation values (not for individual trajectories)." },
    ],
    finalAnswer: "d<p>/dt = <-dV/dx>, the expectation value of the classical force — Newton's second law holding for averages.",
  },
  explanation: {
    correctIdea: "Ehrenfest's theorem shows that quantum mechanical expectation values obey classical equations of motion, even though the underlying dynamics is fully quantum.",
    whyCorrect: "This is the direct momentum analogue of d<x>/dt=<p>/m, both following from the same general identity.",
    whyWrong: ["Saying momentum is exactly conserved in any potential is wrong — it's only conserved (d<p>/dt=0) when V(x) is uniform (force-free), not in general."],
  },
};
