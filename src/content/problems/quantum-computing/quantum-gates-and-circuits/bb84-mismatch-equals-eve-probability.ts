import type { ConceptualProblem } from "@/lib/problems/types";

export const bb84MismatchEqualsEveProbability: ConceptualProblem = {
  meta: {
    slug: "bb84-mismatch-equals-eve-probability",
    title: "Why Bob's Mismatch Probability Equals Eve's",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["bb84", "quantum-key-distribution", "measurement"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution"],
  },
  question: {
    type: "conceptual",
    prompt:
      "The Interactive Experiment shows exactly $50/50$ probabilities for both mismatch cases (Alice Z/Bob X and Alice X/Bob Z). Explain why this is exactly the same probability Eve gets when she guesses the wrong interception basis, and why that's not a coincidence.",
    placeholder: "Think about what mathematical operation Bob's mismatched measurement and Eve's wrong-basis measurement both actually perform on the qubit...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["same mismatch case", "identical mismatch scenario", "exact same operation", "the same computation"],
      ["not about who is measuring", "regardless of who measures", "property of the qubit itself", "doesn't depend on the observer"],
      ["conjugate basis", "wrong basis measurement", "non-commuting bases", "measuring in the other basis"],
    ],
    incorrectFeedback:
      "Compare, step by step, what Bob does when his basis doesn't match Alice's encoding basis to what Eve does when her guessed interception basis doesn't match Alice's encoding basis — are they mathematically the same operation on the same kind of state?",
    partialFeedback:
      "Good — now be explicit that it's not a coincidence because the underlying math (measuring a state in its conjugate basis) doesn't care whose measurement it is.",
  },
  hints: [
    { text: "Bob's mismatch case and Eve's wrong-guess case are both: 'measure a Z-basis-encoded (or X-basis-encoded) qubit in the other, conjugate basis.'" },
    { text: "That's literally the same mathematical operation — apply $H$, then read off computational-basis probabilities — regardless of whether the person doing it is named Bob or Eve." },
    { text: "The $50/50$ result comes purely from the qubit's own state and which basis it's measured in — it has no way of 'knowing' or caring who is holding the measuring device." },
  ],
  solution: {
    steps: [
      { description: "Bob's mismatch case (e.g. Alice Z-encodes, Bob measures X) and Eve's wrong-guess case (Alice Z-encodes, Eve guesses X) are the exact same physical setup: an X-basis measurement of a Z-basis-encoded qubit." },
      { description: "The Born-rule probabilities of that measurement depend only on the qubit's own state and the chosen measurement basis — never on any label attached to who is performing the measurement." },
      { description: "So Bob-mismatched and Eve-wrong-guess necessarily give identical $50/50$ statistics: they are literally the same calculation, $H$ then read off probabilities, applied to the same kind of input state." },
    ],
    finalAnswer:
      "It's not a coincidence: Bob's mismatch case and Eve's wrong-guess case are the identical operation (measuring a conjugate-basis-encoded qubit), and quantum probabilities depend only on the state and the measurement, not on who is measuring.",
  },
  explanation: {
    correctIdea:
      "Measurement probabilities are a property of the quantum state and the chosen basis, not of any label attached to the observer.",
    whyCorrect:
      "Both Bob's mismatch case and Eve's wrong-basis guess reduce to the identical calculation once you strip away the names — hence identical probabilities.",
    whyWrong: [
      "Treating this as a numerical coincidence misses that the two scenarios are literally the same underlying computation, not merely two calculations that happen to agree.",
    ],
  },
};
