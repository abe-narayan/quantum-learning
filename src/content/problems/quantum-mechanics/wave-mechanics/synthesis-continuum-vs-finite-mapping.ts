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
      {
        phrases: ["numerical", "no closed form", "cannot generally solve exactly", "numerical time evolution", "split-operator", "FFT"],
        missingFeedback:
          "Name the new ingredient concretely. It is a tool rather than a principle, and the reason it was needed is a fact about continuous systems.",
      },
      {
        phrases: ["not new physics", "same postulates", "not a new postulate", "representation, not content"],
        missingFeedback:
          "You have named the new ingredient. Now be explicit about what was not new: say what happened to the underlying postulates.",
      },
    ],
    incorrectFeedback: "You listed something the course introduced (the wavefunction, the position operator, the momentum operator) rather than something the earlier postulates could not already express. Each of those is a choice of basis. Ask instead what you could do in a finite-dimensional space that stops working once the space is continuous.",
    partialFeedback: "One half. The other half is a claim about status: does this course add a rule to the theory, or only a way of computing with rules that were already there?",
    modelAnswers: [
      "The genuinely new ingredient is numerical: a real time-evolution engine, split-operator with an FFT, needed because continuous-position systems generally have no closed form. It is not new physics and not a new postulate; the same postulates apply, in a representation you have to compute in.",
      "Nothing new was added to the physics. What was needed was numerical machinery, since you cannot generally solve exactly in this setting. The postulates are the same postulates as before; only the representation changed.",
    ],
  },
  hints: [
    { text: "Go back to the postulate list from Mathematical Foundations: state, observable, measurement, evolution. Is any one of them stated differently here?" },
    { text: "The physics is unchanged. So look elsewhere: what did you actually *do* all course that you never had to do in a finite-dimensional space?" },
    { text: "For an arbitrary potential you had to march the state forward on a grid, step by step, instead of writing its eigenstates down. Give that machinery a name, and then ask whether inventing it changed any physical rule." },
  ],
  solution: {
    steps: [
      { description: "Finite-dimensional (e.g. 2-level) systems often admit closed-form time evolution via a matrix exponential; general continuous-position potentials generally do not." },
      { description: "This forced building a genuine numerical engine (FFT-based split-operator method): new *machinery*, not a new physical postulate." },
    ],
    finalAnswer: "The genuinely new ingredient is numerical: a real time-evolution engine, needed because continuous-position systems generally lack closed-form solutions. It is not a new physical postulate.",
  },
  explanation: {
    correctIdea: "This course's entire physical content is a specialization of the last course's postulates; only the computational tools needed to work with it are new.",
    whyCorrect: "This is the recap table's conclusion, stated in the student's own words.",
    whyWrong: ["Claiming 'the Schrodinger equation is new' misses that it was derived (not postulated) directly from the same time-evolution axiom as the last course's matrix version."],
  },
};
