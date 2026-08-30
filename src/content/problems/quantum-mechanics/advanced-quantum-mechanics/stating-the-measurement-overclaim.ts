import type { ConceptualProblem } from "@/lib/problems/types";

export const statingTheMeasurementOverclaim: ConceptualProblem = {
  meta: {
    slug: "stating-the-measurement-overclaim",
    title: "Stating the Decoherence Overclaim Precisely",
    course: "advanced-quantum-mechanics",
    lesson: "quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["capstone", "conceptual"],
    prerequisites: ["quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths"],
  },
  question: {
    type: "conceptual",
    prompt: "State, in one sentence, exactly what claim about decoherence this course considers an overclaim, and what the accurate, narrower claim is instead.",
    placeholder: "The overclaim is... The accurate claim is instead...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // "explains outcome" stem-matches the second group's "does not explain
      // outcome", so an answer that only stated the narrow claim satisfied the
      // overclaim group as well.
      {
        phrases: ["solves", "measurement problem", "explains definite outcome", "explains why one outcome", "explains why a definite"],
        missingFeedback:
          "The question asks for two statements. State the one this course says goes too far, in the form somebody would actually say it.",
      },
      {
        phrases: ["coherence loss", "loss of coherence", "loses coherence", "lose coherence", "explains why superpositions", "does not explain outcome", "becomes a mixture", "into a mixture"],
        missingFeedback:
          "You have the overclaim. Now give the narrower one that is actually earned: say what decoherence does account for, and what it turns the state into.",
      },
    ],
    incorrectFeedback: "You restated the lesson's caveat as a caveat, without naming the two claims. Write them as a pair of sentences that could each be true or false on their own: the strong one people reach for, and the weaker one the physics supports.",
    partialFeedback: "You have one of the two claims. Supply the other, and set them side by side so the gap between them is visible.",
    modelAnswers: [
      "The overclaim is that decoherence solves the measurement problem, that it explains why one definite outcome happens. The accurate claim is narrower: decoherence explains only the loss of coherence, the way the state becomes a mixture, and leaves the selection of a single outcome untouched.",
      "Overclaim: decoherence explains definite outcomes. Accurate: it explains why superpositions stop showing interference and turn into a mixture, and nothing more than that.",
    ],
  },
  hints: [
    { text: "Two claims are in play, and they are often run together. One of them is about what a system's description becomes when it touches an environment." },
    { text: "The other is about which single thing you find when you look. Write that one down as a separate sentence." },
    { text: "Now check whether the first sentence, on its own, entails the second. If it does not, you have located the gap: name the claim that overshoots it." },
  ],
  solution: {
    steps: [
      { description: "Overclaim: 'decoherence explains why measurements have definite outcomes' / 'decoherence solves the measurement problem.'" },
      { description: "Accurate claim: decoherence explains why quantum superpositions lose their coherence (become statistical mixtures) upon interacting with an environment, which is a real, important, and narrower result." },
      { description: "The gap between these: a mixture is still a description of unresolved possibilities with probabilities attached, not a record of one thing having actually happened." },
    ],
    finalAnswer: "Overclaim: decoherence explains definite measurement outcomes. Accurate claim: decoherence explains only the loss of coherence into a probabilistic mixture, leaving outcome selection open.",
  },
  explanation: {
    correctIdea: "This is the single most repeated caveat across this course's lessons, restated here as a precise one-sentence pair rather than a vague warning.",
    whyCorrect: "Matches the capstone's explicit 'What decoherence resolves, and what it doesn't' section.",
    whyWrong: ["Stating only the accurate claim without naming the specific overclaim it's meant to correct doesn't demonstrate the contrast this course emphasizes."],
  },
};
