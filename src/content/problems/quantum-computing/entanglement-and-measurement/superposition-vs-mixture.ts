import type { ConceptualProblem } from "@/lib/problems/types";

export const superpositionVsMixture: ConceptualProblem = {
  meta: {
    slug: "superposition-vs-mixture",
    title: "Superposition vs. Mixture",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["mixed-states", "superposition", "conceptual"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states"],
  },
  question: {
    type: "conceptual",
    prompt:
      "|+⟩ and a 50/50 classical mixture of |0⟩,|1⟩ give identical probabilities for a computational-basis measurement. Explain how they can nonetheless be shown to be different physical states.",
    placeholder: "Explain using a different measurement basis...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["different basis", "x basis", "x-basis", "x axis", "x-axis", "measure in x", "measure x", "measuring x", "another basis", "hadamard basis", "plus minus basis", "different measurement", "rotated basis"],
        missingFeedback:
          "You have said they can be told apart, but not how. Name the experiment: what would you change about the measurement you already tried?",
      },
      {
        phrases: ["distinguish", "tell them apart", "tells them apart", "telling them apart", "different result", "different prediction", "different outcome", "deterministic", "with certainty"],
        missingFeedback:
          "You have named the experiment. Now report what it gives: say what each of the two preparations does in that setting, and how the two records fail to match.",
      },
    ],
    incorrectFeedback: "You said the two are 'the same because the probabilities match', which is exactly the trap. Matching probabilities in one setting is not sameness. Find a setting the first comparison never looked at, and compute both predictions there.",
    partialFeedback: "Name the basis that separates them, and state what each of the two predicts in it.",
    modelAnswers: [
      "Measure them in the X basis instead. |+> gives the same result every single time, with certainty, while the mixture still comes out 50/50, so a different measurement basis tells them apart.",
      "In the computational basis they look identical, but if you rotate to the Hadamard basis the superposition gives a deterministic result and the mixture does not. That difference distinguishes them.",
    ],
  },
  hints: [
    { text: "The two agree on every computational-basis prediction. So look for a measurement the computational basis does not cover." },
    { text: "One of the two states is an eigenstate of some observable other than Z. Which one, and of what?" },
    { text: "The other state gives even odds in every basis whatever. Compare the two predictions for the observable you just named." },
  ],
  solution: {
    steps: [
      { description: "In the computational basis, both states give P(0)=P(1)=0.5, so they are indistinguishable there." },
      { description: "Measure X instead: |+⟩ is X's +1-eigenstate, giving P(+)=1 deterministically." },
      { description: "The mixture, being I/2, gives P(+)=P(-)=0.5 in the X basis too. No basis makes its outcome certain." },
    ],
    finalAnswer: "Measuring in the X basis distinguishes them: |+⟩ gives a deterministic result; the mixture stays 50/50.",
  },
  explanation: {
    correctIdea: "The two states' density matrices differ in their off-diagonal (coherence) terms, which only a different measurement basis reveals.",
    whyCorrect: "|+⟩ has nonzero coherence and gives a deterministic X-basis outcome; I/2 has zero coherence and stays random in every basis.",
    whyWrong: ["Claiming the two states are 'basically the same' ignores that a real, executable measurement (X-basis) tells them apart with certainty."],
  },
};
