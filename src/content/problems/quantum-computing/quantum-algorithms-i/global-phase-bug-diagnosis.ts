import type { ConceptualProblem } from "@/lib/problems/types";

export const globalPhaseBugDiagnosis: ConceptualProblem = {
  meta: {
    slug: "global-phase-bug-diagnosis",
    title: "Diagnosing the Global-Phase Diffusion Bug",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["grovers-algorithm", "testing"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion"],
  },
  question: {
    type: "conceptual",
    prompt: "The lesson describes a real bug where flipping |0⟩'s sign (instead of every other state's) passed every success-probability test. Explain precisely why a global phase difference is invisible to any test that only checks measurement probabilities.",
    placeholder: "Think about the Born rule's dependence on |amplitude|²...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["born rule", "|amplitude|", "magnitude squared", "squared magnitude", "amplitude squared", "squared amplitude", "square of the amplitude", "modulus", "absolute value", "mod squared", "probability depends on", "probabilities depend on"],
        missingFeedback:
          "You have said the probabilities come out the same. Now say why, in terms of the rule that turns an amplitude into a number a test can check.",
      },
      {
        phrases: ["same magnitude", "-1 squared", "minus one squared", "sign squares", "squares away", "squares to 1", "squares to one", "identical probabilities", "equal probabilities", "same probabilities", "unchanged", "unaffected", "doesn't change", "does not change", "no change", "cancels"],
        missingFeedback:
          "You have named the rule. Now finish the arithmetic: say what that rule does to an overall minus sign, and what that means for every number the test compares.",
      },
    ],
    incorrectFeedback: "You said 'phases don't matter', which is the thing to be explained. Two ingredients are wanted: the exact operation that converts a complex coefficient into a likelihood, and the effect that operation has on an overall factor of −1.",
    partialFeedback: "You have half of it. Now say explicitly what happens to each measurement probability when every coefficient in the state picks up the same overall sign.",
    modelAnswers: [
      "Every probability comes from the Born rule as |amplitude|^2, and squaring throws away the sign. Since |-z|^2 = |z|^2, an overall minus sign gives identical probabilities, so a test that only checks success probability cannot see it.",
      "The probability depends on the modulus squared of the amplitude. A global phase multiplies every amplitude by the same factor, and that factor squares away, so all the probabilities are unchanged and the bug is invisible.",
    ],
  },
  hints: [
    { text: "Start from how a measurement probability is computed from a complex coefficient. What operation is applied to it?" },
    { text: "Take any complex number z and negate it. What happens to the quantity that operation produces?" },
    { text: "The buggy circuit's output differs from the correct one by an overall factor of −1 on every term. Combine that with your answers to the two previous rungs." },
  ],
  solution: {
    steps: [
      { description: "Measurement probabilities are |amplitude|² for each outcome." },
      { description: "|−z|²=|z|² for any complex z, so multiplying an entire state by −1 changes no probability at all." },
      { description: "A test that only checks final measurement probabilities can never detect this kind of global sign (or any global phase e^{iθ}) difference." },
    ],
    finalAnswer: "Because probability depends only on |amplitude|², and |−z|²=|z|², a global −1 (or any global phase) leaves every probability exactly unchanged.",
  },
  explanation: {
    correctIdea: "Global phase is unobservable. That is a fact about quantum mechanics, not a testing quirk, and it applies to any overall e^{iθ}, not just −1.",
    whyCorrect: "This is exactly why the lesson's fix required testing groverDiffusion(|s⟩)=|s⟩ directly, an intermediate check insensitive to being 'washed out' by later measurement.",
    whyWrong: ["Saying 'the test just wasn't thorough enough' misses the specific reason: no measurement-probability-only test, however thorough, could ever catch this class of bug."],
  },
};
