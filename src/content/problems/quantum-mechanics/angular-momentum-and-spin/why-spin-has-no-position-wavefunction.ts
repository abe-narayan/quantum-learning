import type { ConceptualProblem } from "@/lib/problems/types";

export const whySpinHasNoPositionWavefunction: ConceptualProblem = {
  meta: {
    slug: "why-spin-has-no-position-wavefunction",
    title: "Why Spin Escapes the Integer-Only Restriction",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["spin", "conceptual"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why the single-valuedness argument that restricts orbital l to integers doesn't apply to spin, allowing j=1/2 to be physically realized.",
    placeholder: "Think about what the single-valuedness argument was actually about...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["no position", "not a function of", "not functions of", "aren't functions of", "are not functions of", "not a function of angle", "no angle dependence", "no angular coordinate", "no dependence on angle", "there is no angle", "no phi", "no spatial wavefunction", "no position-space wavefunction", "not defined on space", "no such wavefunction", "has no wavefunction", "no wavefunction at all", "no wavefunction in space", "not a wavefunction in space", "nothing to rotate through"],
        missingFeedback:
          "The argument was about a particular kind of object. Say what spin states are not, in terms of the variable that argument leaned on.",
      },
      {
        phrases: ["doesn't apply", "argument requires", "nothing to be single-valued"],
        missingFeedback:
          "You have said what spin states are not. Now finish the sentence about the argument itself: say what it needs in order to bite, and what follows when that thing is absent.",
      },
    ],
    incorrectFeedback: "You answered that spin is 'intrinsic' or 'not orbital', which names the conclusion. The argument that excluded half-integers had a specific object in its hands; identify that object, then ask whether a spin state supplies one.",
    partialFeedback: "Now say explicitly that spin states have no such angular function to check.",
    modelAnswers: [
      "The single-valuedness argument is about functions of the angle phi: it says the function has to come back to itself after a 2pi turn. Spin states are not functions of position or angle at all, there is no phi in them, so there is nothing for the argument to be single-valued in and it doesn't apply.",
      "That argument requires a position-space wavefunction with an angular coordinate. Spin has no such wavefunction, so nothing has to be single-valued and j=1/2 is allowed.",
    ],
  },
  hints: [
    { text: "The single-valuedness argument was a statement about one particular object: a function of the azimuthal angle." },
    { text: "Spin states such as up and down are labels on a two-dimensional space; they are attached to no coordinate at all." },
    { text: "Ask what the argument would even be applied to in the spin case. If there is no such object, the restriction it produced has no reach here." },
  ],
  solution: {
    steps: [
      { description: "The single-valuedness argument specifically concerns a wavefunction's dependence on the angle φ." },
      { description: "Spin states carry no position or angle dependence whatsoever; they are abstract 2-level states, not functions on space." },
      { description: "With no φ-dependence to check, the argument has nothing to apply to, leaving j=1/2 unrestricted for spin." },
    ],
    finalAnswer: "Spin states aren't functions of angle at all, so the single-valuedness-under-2π-rotation argument (which only concerns functions of angle) doesn't apply to them.",
  },
  explanation: {
    correctIdea: "The integer restriction was never a general angular-momentum fact; it was specific to position-space wavefunctions.",
    whyCorrect: "This is the distinction the lesson draws between orbital and spin angular momentum.",
    whyWrong: ["Saying spin is 'just different' without identifying the missing ingredient (a position- or angle-dependent wavefunction) does not explain the mechanism."],
  },
};
