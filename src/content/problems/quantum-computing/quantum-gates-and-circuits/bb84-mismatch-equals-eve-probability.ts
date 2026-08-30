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
      {
        phrases: ["same mismatch case", "identical mismatch scenario", "exact same operation", "same operation", "same computation", "same calculation", "same measurement", "same scenario", "same situation", "same physical setup", "literally the same", "identical"],
        missingFeedback:
          "You have said the probabilities agree. Now say why the two cases are not merely similar: compare what physically happens to the qubit in each of them.",
      },
      {
        phrases: [
          "not about who is measuring",
          "regardless of who measures",
          "who is measuring",
          "who measures",
          "who does the",
          "who is holding",
          "property of the qubit itself",
          "doesn't depend on the observer",
          "observer",
          "doesn't care who",
          "does not care who",
          "no label",
          "whose measurement",
        ],
        missingFeedback:
          "You have already matched the two cases step for step. Say why that settles it: list the ingredients a Born-rule probability is computed from, and note that the person operating the apparatus is not among them.",
      },
      {
        phrases: ["conjugate basis", "wrong basis measurement", "wrong basis", "other basis", "different basis", "mismatched basis", "non-commuting", "noncommuting", "incompatible bas", "measuring in the other basis", "x basis", "z basis"],
        missingFeedback:
          "You have said the two cases are one and the same operation. Now name that operation precisely: which basis is the qubit encoded in, and which one is it read out in?",
      },
    ],
    incorrectFeedback:
      "You explained where 0.5 comes from without comparing the two situations. Write the two out side by side, step for step, and then ask what, if anything, the Born-rule calculation is allowed to depend on.",
    partialFeedback:
      "Now say why it is not a coincidence: name what the Born rule's inputs actually are, and check whether any of them records the identity of the person operating the device.",
    modelAnswers: [
      "Bob measuring in the wrong basis and Eve intercepting in the wrong basis are literally the same operation: measuring a conjugate-basis-encoded qubit in the other basis. The probability depends only on the state and the basis, not on who is holding the detector, so both come out 50/50.",
      "It is the exact same operation physically. In both cases someone measures a qubit prepared in the X basis using a Z basis measurement, or the other way round. Quantum probabilities do not care who is measuring, so the same calculation gives the same number.",
    ],
  },
  hints: [
    { text: "Write out, using one notation for both, what Bob does when his basis fails to match, and what Eve does after an incorrect guess." },
    { text: "Put the two expressions beside each other. Do they differ in any symbol other than the name attached to the person?" },
    { text: "The probability that comes out is fixed by the state and by which measurement is performed. Ask whether either of those two carries any record of who is operating the apparatus." },
  ],
  solution: {
    steps: [
      { description: "Bob's mismatch case (e.g. Alice Z-encodes, Bob measures X) and Eve's wrong-guess case (Alice Z-encodes, Eve guesses X) are the exact same physical setup: an X-basis measurement of a Z-basis-encoded qubit." },
      { description: "The Born-rule probabilities of that measurement depend only on the qubit's own state and the chosen measurement basis, never on a label attached to who performs it." },
      { description: "So Bob-mismatched and Eve-wrong-guess necessarily give identical $50/50$ statistics: they are the same calculation, $H$ then read off probabilities, applied to the same kind of input state." },
    ],
    finalAnswer:
      "It's not a coincidence: Bob's mismatch case and Eve's wrong-guess case are the identical operation (measuring a conjugate-basis-encoded qubit), and quantum probabilities depend only on the state and the measurement, not on who is measuring.",
  },
  explanation: {
    correctIdea:
      "Measurement probabilities are a property of the quantum state and the chosen basis, not of any label attached to the observer.",
    whyCorrect:
      "Both Bob's mismatch case and Eve's wrong-basis guess reduce to the same calculation once the names are stripped away, which is why the probabilities match.",
    whyWrong: [
      "Treating this as a numerical coincidence misses that the two scenarios are the same underlying computation, not two calculations that happen to agree.",
    ],
  },
};
