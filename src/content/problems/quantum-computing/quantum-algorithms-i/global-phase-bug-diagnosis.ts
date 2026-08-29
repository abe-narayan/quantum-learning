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
      ["born rule", "|amplitude|", "magnitude squared", "squared magnitude", "amplitude squared", "squared amplitude", "square of the amplitude", "modulus", "absolute value", "mod squared", "probability depends on", "probabilities depend on"],
      ["same magnitude", "same modulus", "same absolute value", "-1 squared", "minus one squared", "sign squares", "squares away", "squares to 1", "squares to one", "identical probabilities", "equal probabilities", "same probabilities", "unchanged", "unaffected", "doesn't change", "does not change", "no change", "cancels"],
    ],
    incorrectFeedback: "Your answer needs two ingredients: the rule that turns amplitudes into probabilities, and what that rule does to an overall sign. Name both.",
    partialFeedback: "You have half of it. Now say explicitly what happens to each measurement probability when every amplitude in the state picks up the same overall sign.",
  },
  hints: [
    { text: "Start from how a measurement probability is computed from an amplitude. What operation is applied to the amplitude?" },
    { text: "Take any complex number z and negate it. What happens to the quantity that the measurement rule cares about?" },
    { text: "The buggy circuit's output differs from the correct one by an overall factor of −1 on every term. Combine that with your answers to the previous two questions." },
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
    correctIdea: "Global phase is fundamentally unobservable. This is a basic quantum mechanics fact, not a testing quirk, and it applies to any overall e^{iθ}, not just −1.",
    whyCorrect: "This is exactly why the lesson's fix required testing groverDiffusion(|s⟩)=|s⟩ directly, an intermediate check insensitive to being 'washed out' by later measurement.",
    whyWrong: ["Saying 'the test just wasn't thorough enough' misses the specific reason: no measurement-probability-only test, however thorough, could ever catch this class of bug."],
  },
};
