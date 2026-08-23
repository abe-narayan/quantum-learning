import type { ConceptualProblem } from "@/lib/problems/types";

export const synthesisContinuumVsFiniteMapping: ConceptualProblem = {
  meta: {
    slug: "synthesis-continuum-vs-finite-mapping",
    title: "Synthesis: What's Genuinely New About Continuous Position",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/wave-mechanics-challenge",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["synthesis", "postulates"],
    prerequisites: ["quantum-mechanics/wave-mechanics/wave-mechanics-challenge"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In two or three sentences, identify the one genuinely new ingredient this course needed beyond what the last course's finite-dimensional postulates already provided, and explain why it was necessary.",
    placeholder: "Identify what's genuinely new in this course...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["numerical", "no closed form", "cannot generally solve exactly", "numerical time evolution", "split-operator", "FFT"],
      ["not new physics", "same postulates", "not a new postulate", "representation, not content"],
    ],
    incorrectFeedback: "Name both pieces: what the genuinely new *practical* ingredient was (a numerical time-evolution engine, since exact closed-form solutions generally don't exist for continuous position), and that this is not a new physical postulate, only new machinery.",
    partialFeedback: "You're partway there — be explicit that the new ingredient is numerical/computational, not a new physics postulate.",
  },
  hints: [
    { text: "Which finite-dimensional systems could often be solved exactly with a matrix exponential, that continuous-position systems generally cannot?" },
    { text: "Is the new ingredient a new physical rule, or new machinery for computing with an unchanged set of rules?" },
  ],
  solution: {
    steps: [
      { description: "Finite-dimensional (e.g. 2-level) systems often admit closed-form time evolution via a matrix exponential; general continuous-position potentials generally do not." },
      { description: "This forced building a genuine numerical engine (FFT-based split-operator method) — new *machinery*, not a new physical postulate." },
    ],
    finalAnswer: "The genuinely new ingredient is numerical: a real time-evolution engine, needed because continuous-position systems generally lack closed-form solutions — not a new physical postulate.",
  },
  explanation: {
    correctIdea: "This course's entire physical content is a specialization of the last course's postulates; only the computational tools needed to work with it are new.",
    whyCorrect: "This is exactly the recap table's conclusion, stated in the student's own words.",
    whyWrong: ["Claiming 'the Schrodinger equation is new' misses that it was derived (not postulated) directly from the same time-evolution axiom as the last course's matrix version."],
  },
};
