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
      {
        phrases: ["keeps only", "consistent with the outcome", "component within the eigenspace"],
        missingFeedback:
          "Say what the projector actually does to the state, in terms of which part of it survives.",
      },
      {
        phrases: [
          "no extra information",
          "no more information",
          "no further information",
          "doesn't discard",
          "does not discard",
          "nothing is discarded",
          "measurement only reveals the eigenvalue",
          "only the eigenvalue",
          "only reveals",
          "only tells you the eigenvalue",
          "which eigenvalue",
          "nothing more",
          "no reason to",
          "keeps every",
        ],
        missingFeedback:
          "You have described what the projector keeps. Now justify keeping all of it: state exactly what the apparatus reported, and check whether that report says anything at all about direction inside the subspace.",
      },
    ],
    incorrectFeedback: "You said the projector is 'the rule', which restates the postulate rather than justifying it. Ask what the apparatus actually reported, and then ask what would have to be true for you to be entitled to throw away part of the surviving state.",
    modelAnswers: [
      "The projector keeps only the component within the eigenspace consistent with the outcome, and throws away the rest. Picking one eigenvector out of that eigenspace would discard information the measurement gave you no reason to throw out.",
      "It keeps exactly the part of the state consistent with the outcome you actually saw. The measurement only tells you the eigenvalue and nothing more, so there is no reason to collapse any further than that.",
    ],
  },
  hints: [
    { text: "Write down the readout of the measurement: a single number. Now list what that number does and does not pin down about the state." },
    { text: "Two different vectors inside the same eigenspace produce that identical readout. So the readout cannot separate them." },
    { text: "Collapse is supposed to remove exactly what the result has ruled out. Ask what, in this case, has been ruled out, and let the projector be whatever survives that test." },
  ],
  solution: {
    steps: [
      { description: "A measurement giving eigenvalue $a_i$ reveals *only* that the state lies in $a_i$'s eigenspace, and nothing about which vector or superposition within it." },
      { description: "The projector $P_i$ keeps exactly that eigenspace's component and nothing else, so it retains all the information consistent with the observed outcome and discards none of it." },
    ],
    finalAnswer: "The projector keeps exactly the component of the state consistent with the observed outcome, since the measurement itself gives no further information about where within the eigenspace the state lies.",
  },
  explanation: {
    correctIdea: "Collapse should discard exactly the parts of the state ruled out by the outcome, and nothing more.",
    whyCorrect: "Picking a single eigenvector arbitrarily would discard real information the state carried, which the measurement never resolved.",
    whyWrong: ["Choosing 'the eigenvector with the largest coefficient', or any similar ad hoc rule, is not physically motivated and does not match how degenerate measurements behave. The correct rule is the projector."],
  },
};
