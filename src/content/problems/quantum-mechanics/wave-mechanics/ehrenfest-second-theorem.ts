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
      {
        phrases: ["force", "-dV/dx", "classical force", "negative gradient"],
        missingFeedback:
          "Work out what the commutator with the potential gives you, and say what familiar physical quantity the right-hand side turns out to be.",
      },
      {
        phrases: ["newton", "second law", "average", "expectation value obeys"],
        missingFeedback:
          "You have identified the quantity. Now say what the resulting equation is a version of, and be careful to say what it holds for rather than claiming too much.",
      },
    ],
    incorrectFeedback: "The commonest wrong turn here is to conclude that d<p>/dt vanishes, which happens only when V is flat. You were told the commutator does not vanish, so evaluate it and then say what physical quantity the result is.",
    partialFeedback: "Half of it is there. The other half is the identification: which classical equation of motion this reproduces, and whether it holds for individual measurements or only for the means.",
    modelAnswers: [
      "It comes out as the expectation value of -dV/dx, which is the classical force. So the average momentum changes at the rate given by the average force: Newton's second law holds for the expectation values, even though the underlying dynamics is fully quantum.",
      "It represents the average force on the particle, the negative gradient of the potential. Ehrenfest's theorem is saying that the averages obey the classical equation of motion.",
    ],
  },
  hints: [
    { text: "Set A = p in the identity you were given, so the whole problem reduces to evaluating one commutator: [H,p]." },
    { text: "Only the potential piece of H fails to commute with p. Act with [V,p] on a wavefunction and let the product rule do the work." },
    { text: "You are left with something proportional to the slope of V. Read the finished equation aloud and compare it with the equation of motion you would write for a classical particle in the same V." },
  ],
  solution: {
    steps: [
      { description: "$\\dfrac{d\\langle p\\rangle}{dt} = \\left\\langle -\\dfrac{dV}{dx}\\right\\rangle$: the expectation value of the classical force." },
      { description: "This is Newton's second law, holding exactly for expectation values (not for individual trajectories)." },
    ],
    finalAnswer: "d<p>/dt = <-dV/dx>, the expectation value of the classical force. Newton's second law holds for the averages.",
  },
  explanation: {
    correctIdea: "Ehrenfest's theorem shows that quantum mechanical expectation values obey classical equations of motion, even though the underlying dynamics is fully quantum.",
    whyCorrect: "This is the direct momentum analogue of d<x>/dt=<p>/m, both following from the same general identity.",
    whyWrong: ["Saying momentum is conserved in any potential is wrong. It is conserved (d<p>/dt=0) only when V(x) is uniform, so that the force vanishes."],
  },
};
