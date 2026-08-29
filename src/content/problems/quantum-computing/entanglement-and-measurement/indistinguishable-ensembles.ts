import type { ConceptualProblem } from "@/lib/problems/types";

export const indistinguishableEnsembles: ConceptualProblem = {
  meta: {
    slug: "indistinguishable-ensembles",
    title: "Why No Experiment Reveals the Preparation Ensemble",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/convex-combinations-and-physical-mixtures",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["mixed-states", "convex-combination", "conceptual"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/convex-combinations-and-physical-mixtures"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A 50/50 mix of {|0⟩,|1⟩} and a 50/50 mix of {|+⟩,|-⟩} both give ρ=I/2. Explain why no possible measurement can determine which ensemble actually prepared a given qubit.",
    placeholder: "Explain using the expectation-value formula...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["tr(", "trace", "expectation value", "expectation values", "same ρ", "same rho", "same density matrix", "identical density matrix", "born rule"],
      ["depends only on", "depend only on", "only on ρ", "only on rho", "only on the density", "function of ρ", "function of rho", "function of the density", "determined by ρ", "determined by rho", "same statistics", "identical statistics", "same predictions", "identical predictions", "same probabilities", "no experiment", "cannot distinguish", "can't distinguish", "cannot be distinguished", "indistinguishable"],
    ],
    incorrectFeedback: "Ask what every measurable prediction is computed from. Does the recipe that prepared the qubit appear anywhere in that computation?",
    partialFeedback: "You're close. Say what single object every observable's prediction is computed from, and note that both recipes hand you that very object.",
  },
  hints: [
    { text: "Write down the formula that turns a state and an observable into a measurable prediction. Which objects enter it?" },
    { text: "The two preparation stories differ, but what mathematical object do they share?" },
    { text: "If every quantity an experiment can estimate is computed from that shared object, what follows about telling the two stories apart?" },
  ],
  solution: {
    steps: [
      { description: "Any observable's expectation value is $\\langle A\\rangle=\\text{Tr}(\\rho A)$, a function of ρ alone." },
      { description: "Both ensembles produce the identical $\\rho=I/2$, so $\\text{Tr}(\\rho A)$ is identical for every observable $A$." },
      { description: "Since every possible measurement's statistics reduce to some Tr(ρA), no experiment can distinguish the two preparations." },
    ],
    finalAnswer: "Because every measurable prediction depends only on ρ, and both ensembles give the same ρ, no experiment can distinguish them.",
  },
  explanation: {
    correctIdea: "Measurable physics is a function of ρ alone; ensembles giving identical ρ are physically identical states.",
    whyCorrect: "This follows directly from ⟨A⟩=Tr(ρA) holding for every observable, with no dependence on the preparation recipe.",
    whyWrong: ["Arguing 'in principle, a clever enough experiment could tell' contradicts the fact that all measurement statistics are already determined by ρ alone."],
  },
};
