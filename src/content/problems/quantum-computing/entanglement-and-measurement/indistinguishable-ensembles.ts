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
      ["tr(", "trace", "expectation value", "same ρ", "same density matrix"],
      ["depends only on", "determined by ρ", "identical predictions", "no experiment"],
    ],
    incorrectFeedback: "Focus on what every measurable prediction (expectation value) actually depends on — is it ρ, or the ensemble story behind it?",
    partialFeedback: "You're close — be explicit that every observable's prediction is a function of ρ alone, not of which ensemble produced it.",
  },
  hints: [
    { text: "Every observable's expectation value is Tr(ρA) — a function of ρ alone." },
    { text: "If two ensembles produce the same ρ, they produce the same Tr(ρA) for every A." },
    { text: "A measurement is a way of estimating some Tr(ρA); if that's identical for both ensembles, no measurement can tell them apart." },
  ],
  solution: {
    steps: [
      { description: "Any observable's expectation value is $\\langle A\\rangle=\\text{Tr}(\\rho A)$ — a function of ρ alone." },
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
