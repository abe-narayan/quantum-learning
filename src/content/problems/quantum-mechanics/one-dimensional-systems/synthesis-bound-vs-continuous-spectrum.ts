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
      // The second group's three phrases were all long word-for-word strings
      // that even this problem's own model answer failed to reproduce ("any
      // energy above threshold" is not "any energy works"), so a correct answer
      // could not pass. Shorter phrases carry the same idea.
      {
        phrases: ["decay on both sides", "decay on both", "confined", "normalizable requires specific energies", "only discrete energies", "discrete energies"],
        missingFeedback:
          "Take the bound case first. Say what the wavefunction has to do far away on either side, and what that requirement does to the allowed energies.",
      },
      {
        phrases: ["any energy", "any e above", "continuum", "continuous spectrum", "oscillatory on both sides", "propagating on both sides", "not quantized", "no quantization", "above threshold"],
        missingFeedback:
          "You have the bound case. Now say what a scattering solution does far away instead, and which energies are permitted once that is all you demand.",
      },
    ],
    incorrectFeedback: "You described what the two kinds of state look like without saying what forces the difference. The mechanism is a boundary condition: ask which systems require the solution to die away far from the potential, what that requirement costs, and which systems impose no such demand. Then name a system of each kind from this course and from Wave Mechanics.",
    partialFeedback: "Give at least one concrete example from each category.",
    modelAnswers: [
      "A bound state has to decay on both sides, and that can only be arranged at discrete energies, which is why the finite well has a countable ladder of levels. A scattering state stays oscillatory on both sides for any energy above threshold, so the step and the barrier give a continuous spectrum.",
      "Confinement forces decay on both sides, which only works for discrete energies; the finite square well shows this. Above the step or barrier height the solutions are propagating on both sides and there is no quantization at all, so you get a continuum.",
    ],
  },
  hints: [
    { text: "Sort the systems you have met into two piles by asking one question of each: must the solution die away far from the potential, or is it allowed to keep oscillating out to infinity?" },
    { text: "Take a system from the first pile and pick a value of E slightly off one of its allowed ones. What goes wrong with the solution far from the potential?" },
    { text: "Now do the same for a scattering system: nudge E and see whether anything at all breaks. The contrast between the two outcomes is the whole distinction." },
  ],
  solution: {
    steps: [
      { description: "Bound states (infinite well, harmonic oscillator, finite well) require the wavefunction to vanish or decay on *both* outer sides, a restrictive condition satisfiable only at specific, discrete energies." },
      { description: "Scattering states (step, barrier with E>V0) stay oscillatory (propagating) on both outer sides for *any* energy above the relevant threshold. Nothing forces discreteness, so the spectrum is continuous." },
    ],
    finalAnswer: "Bound states require decay on both outer sides, satisfiable only at discrete energies; scattering states stay oscillatory on both sides for any energy above threshold, giving a continuous spectrum. The finite well illustrates the first case, the step and barrier the second.",
  },
  explanation: {
    correctIdea: "This bound/continuous distinction is a completely general feature of 1D quantum mechanics, not specific to any one potential.",
    whyCorrect: "Every example across both courses fits cleanly into one category or the other.",
    whyWrong: ["Claiming all quantum systems have discrete spectra ignores half of what this course covered. Scattering states are just as legitimate, and their continuous spectrum is not a special case or an approximation."],
  },
};
