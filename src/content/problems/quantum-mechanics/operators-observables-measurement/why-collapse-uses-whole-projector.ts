import type { ConceptualProblem } from "@/lib/problems/types";

export const whyCollapseUsesWholeProjector: ConceptualProblem = {
  meta: {
    slug: "why-collapse-uses-whole-projector",
    title: "Why Collapse Uses the Whole Projector",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["measurement", "collapse", "degeneracy"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In one or two sentences, explain why the post-measurement state uses the full projector P_i|psi> rather than collapsing to one arbitrarily chosen eigenvector from the degenerate eigenspace.",
    placeholder: "Explain why the full projector is used for collapse...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["keeps only", "consistent with the outcome", "component within the eigenspace"],
      ["no extra information", "doesn't discard", "measurement only reveals the eigenvalue"],
    ],
    incorrectFeedback: "Name both pieces: that the projector keeps exactly the part of the state consistent with the observed outcome, and that a measurement of this observable reveals no information about *where* within the eigenspace the state is, so nothing beyond the projection should be discarded.",
  },
  hints: [{ text: "What information does measuring only the eigenvalue (not a finer, resolving observable) actually give you about the state within the degenerate eigenspace?" }],
  solution: {
    steps: [
      { description: "A measurement giving eigenvalue $a_i$ reveals *only* that the state lies in $a_i$'s eigenspace — nothing about which vector or superposition within it." },
      { description: "The projector $P_i$ keeps exactly that eigenspace's component and nothing else, so it retains all the information consistent with the observed outcome and discards none of it." },
    ],
    finalAnswer: "The projector keeps exactly the component of the state consistent with the observed outcome, since the measurement itself gives no further information about where within the eigenspace the state lies.",
  },
  explanation: {
    correctIdea: "Collapse should discard exactly the parts of the state ruled out by the outcome, and nothing more.",
    whyCorrect: "Picking a single eigenvector arbitrarily would discard real information the state actually carried, which the measurement never resolved.",
    whyWrong: ["Choosing 'the eigenvector with the largest coefficient' or any similar ad hoc rule isn't physically motivated and doesn't match how degenerate measurements actually behave — the correct rule is the projector, full stop."],
  },
};
