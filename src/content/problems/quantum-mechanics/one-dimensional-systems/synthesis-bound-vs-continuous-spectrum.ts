import type { ConceptualProblem } from "@/lib/problems/types";

export const synthesisBoundVsContinuousSpectrum: ConceptualProblem = {
  meta: {
    slug: "synthesis-bound-vs-continuous-spectrum",
    title: "Synthesis: Bound vs. Continuous Spectra",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["synthesis", "bound-states", "scattering"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In two or three sentences, explain the general distinction between a bound-state system's discrete spectrum and a scattering system's continuous one, using at least two specific examples from this course and Wave Mechanics.",
    placeholder: "Explain the discrete vs. continuous spectrum distinction...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["decay on both sides", "confined", "normalizable requires specific energies"],
      ["any energy works", "continuum", "oscillatory on both sides allows any E"],
    ],
    incorrectFeedback: "Name both pieces: why bound states need decay on both outer sides (forcing only discrete energies to work), and why scattering states stay oscillatory on both outer sides (letting any energy above the relevant threshold work).",
    partialFeedback: "You're partway there — give at least one concrete example from each category.",
  },
  hints: [{ text: "Which systems from this course and Wave Mechanics require the wavefunction to decay outside a region, and which don't?" }],
  solution: {
    steps: [
      { description: "Bound states (infinite well, harmonic oscillator, finite well) require the wavefunction to vanish or decay on *both* outer sides — a restrictive condition satisfiable only at specific, discrete energies." },
      { description: "Scattering states (step, barrier with E>V0) stay oscillatory (propagating) on both outer sides for *any* energy above the relevant threshold — no discreteness-forcing condition, hence a continuous spectrum." },
    ],
    finalAnswer: "Bound states require decay on both outer sides, satisfiable only at discrete energies; scattering states stay oscillatory on both sides for any energy above threshold, giving a continuous spectrum — illustrated by the finite well (discrete) versus the step and barrier (continuous).",
  },
  explanation: {
    correctIdea: "This bound/continuous distinction is a completely general feature of 1D quantum mechanics, not specific to any one potential.",
    whyCorrect: "Every example across both courses fits cleanly into one category or the other.",
    whyWrong: ["Claiming all quantum systems have discrete spectra ignores half of what this course covered — scattering states are just as legitimate, and their continuous spectrum is not a special case or approximation."],
  },
};
