import type { ConceptualProblem } from "@/lib/problems/types";

export const whyHalfIntegerLExcluded: ConceptualProblem = {
  meta: {
    slug: "why-half-integer-l-excluded",
    title: "Why Half-Integer Orbital Angular Momentum Is Excluded",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["spherical-harmonics", "conceptual"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain, using single-valuedness of the wavefunction under φ→φ+2π, why m=1/2 is excluded for orbital angular momentum, showing the specific numeric check that fails.",
    placeholder: "Substitute m=1/2 into e^{im2π} and evaluate...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // "e^{iπ} = −1" strips to the three tokens "e i 1", which the validator
      // matches as an in-order subsequence against almost any sentence ("the
      // electron in 1 dimension..."). "π}" survives only as a literal
      // substring, so it catches the same typed answer without the looseness.
      {
        phrases: ["e^{i pi} = -1", "e^{ipi}", "e^ipi", "eipi", "π}", "minus one", "negative one", "minus 1 not 1", "not equal to 1", "does not equal 1", "doesn't equal 1", "is not 1", "isn't 1", "not 1 but"],
        missingFeedback:
          "Do the substitution and evaluate. Say what number the phase comes out to after a full turn when m is a half, and how that compares with what it has to be.",
        anchors: {
          "π}": "The closing brace after pi is the tail of a typed e^{iπ}. It survives normalization as nothing, which is the point: the raw glyphs are what identify the substitution having been carried out.",
        },
      },
      {
        phrases: ["multi-valued", "multivalued", "multi valued", "double-valued", "double valued", "two values", "two different values", "different value", "not single-valued", "not single valued", "fails single", "disagree", "inconsistent", "ill-defined", "not well-defined", "not well defined"],
        missingFeedback:
          "You have the number. Now say what having that value after a full turn in phi does to the wavefunction at one and the same physical point.",
      },
    ],
    incorrectFeedback: "You appealed to 'orbital angular momentum comes in whole numbers' as a rule, which is the thing being derived. Do the substitution instead: put m = 1/2 into the condition a full turn imposes, evaluate the number that comes out, and say what having that number instead of the required one does to the wavefunction at one point in space.",
    partialFeedback: "Now state what this means for the wavefunction's validity at a single physical point.",
    modelAnswers: [
      "Put m=1/2 into the phase you pick up after a full turn and you get e^{ipi}, which is -1, not 1. So going once round in phi returns the wavefunction with the opposite sign: it would be double valued and disagree with itself at the same physical point.",
      "The half integer case gives minus one rather than one after a 2pi turn. Since that does not equal 1, the wavefunction is not single-valued; it takes two different values at the same place, which is inconsistent.",
    ],
  },
  hints: [
    { text: "Single-valuedness requires that the azimuthal factor come back to itself after a full turn. Write that requirement as an equation in m." },
    { text: "Substitute m = 1/2. What does the exponent reduce to?" },
    { text: "Evaluate that exponential with Euler's formula and compare the result with what the first rung's equation demands." },
  ],
  solution: {
    steps: [
      { description: "For m=1/2, single-valuedness requires e^{i(1/2)(2π)}=e^{iπ}=1." },
      { description: "But e^{iπ}=−1, not 1, so the condition fails." },
      { description: "This means Φ_{1/2}(φ+2π)=−Φ_{1/2}(φ)≠Φ_{1/2}(φ): the function takes two different values at the same physical point, so it isn't a valid wavefunction." },
    ],
    finalAnswer: "e^{iπ}=−1≠1, so m=1/2 fails single-valuedness. The wavefunction would disagree with itself at the same physical point.",
  },
  explanation: {
    correctIdea: "This is a concrete, checkable numerical failure, not just an abstract rule. Computing the specific number e^{iπ} makes the exclusion explicit.",
    whyCorrect: "This directly reproduces the lesson's general argument for this one specific, easily-checked case.",
    whyWrong: ["Simply stating 'half-integers are excluded' without doing the e^{iπ}=−1 computation doesn't demonstrate the actual mechanism."],
  },
};
