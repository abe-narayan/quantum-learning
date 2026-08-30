import type { ConceptualProblem } from "@/lib/problems/types";

export const ghzCorrelationWithoutSignaling: ConceptualProblem = {
  meta: {
    slug: "ghz-correlation-without-signaling",
    title: "Why GHZ Correlation Isn't a Faster-Than-Light Signal",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["ghz", "entanglement", "no-signaling"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/building-quantum-circuits"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Measuring any one qubit of the GHZ state instantly determines the definite outcome of the other two, even if they're far apart. Explain why this doesn't let the three qubit-holders send a signal to each other faster than light.",
    placeholder: "Whoever holds one of the other qubits, on their own...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // "compare" does not match "comparing" (the validator's stemmer only
      // strips a trailing s/es), and "on its own" does not match "on their
      // own", so the problem's own model answer used to be graded incomplete.
      //
      // Every group here used to stand on a single bare word ("random",
      // "local", "compar"), so the three-word stub "random local compare"
      // graded fully correct while a student describing a fair coin and a
      // phone call graded incorrect. Each group now needs a claim rather than
      // a topic.
      {
        phrases: ["looks random", "look random", "is random", "are random", "still random", "uniformly random", "completely random", "just random", "random string", "random outcome", "random result", "random either way", "50/50", "fifty fifty", "fair coin", "coin flip", "coin toss", "half the time", "cannot tell", "can not tell", "no way to know", "no information", "carries no information", "tells them nothing", "maximally mixed", "reduced density matrix", "reduced state", "marginal"],
        missingFeedback:
          "You have said what makes the pattern visible, but not what a single holder's raw tally looks like before that. Describe that tally over many runs.",
      },
      {
        phrases: ["on its own", "on their own", "on your own", "on his own", "on her own", "own results", "own record", "own outcomes", "own measurement", "own tally", "by itself", "by themselves", "alone", "locally", "each qubit", "each holder", "each party", "single qubit", "one qubit", "individually", "in isolation", "without the others", "their own qubit"],
        missingFeedback:
          "Say whose record the claim is about. It only holds for what one holder has in front of them, with nothing from the other two mixed in.",
      },
      {
        phrases: ["compar", "classical channel", "classical communication", "communicate the result", "comparing notes", "phone", "call them", "send the results", "send them", "bring the results together", "put the records", "side by side", "only see the correlation", "see the correlation once", "afterward", "speed of light", "no faster than light", "no matter what the others", "no matter what anyone", "no matter what alice", "regardless of what", "whatever alice", "whatever the others", "whatever anyone else", "independent of what", "does not depend on what", "unaffected by what", "identical no matter"],
        missingFeedback:
          "You have the local picture. Now close the argument: either say what has to physically travel between the three of them before the pattern shows up and what limits its speed, or say why what one holder sees is untouched by anything the other two choose to do.",
      },
    ],
    incorrectFeedback:
      "You said the correlation is 'instant but useless', which is the conclusion. Work it out: write down what a single holder sees in their own record before anyone speaks, and then say what has to happen before the pattern across the three records becomes visible.",
    partialFeedback: "Explain both halves: what one holder's own record looks like before anyone speaks, and what has to travel between them before the pattern can be seen.",
    modelAnswers: [
      "Whatever Alice gets, Bob's own results still look like a fair coin to him. He can only see the correlation once someone phones him with their outcome, and that phone call is stuck at the speed of light.",
      "The reduced density matrix of each qubit is maximally mixed, so the marginal statistics are identical no matter what the others do.",
      "On your own you just get a random string of 0s and 1s, and it looks the same whether or not anyone else has measured yet. You only spot that all three agree once you compare the three lists, and someone has to send you theirs the ordinary way for that.",
    ],
  },
  hints: [
    { text: "Take a single holder and give them nothing but their own measurement results, over many runs. What does the tally look like?" },
    { text: "Now set two of the three tallies next to each other. What structure appears that neither one showed separately?" },
    { text: "To set them next to each other, the three records must physically meet. Say by what means, and what speed limit that means obeys." },
  ],
  solution: {
    steps: [
      { description: "A qubit holder measuring only their own qubit of the GHZ state, with no other information, always sees a uniformly random 50/50 outcome. Nothing local reveals whether anyone else has measured yet, or what they got." },
      { description: "The perfect correlation (all three outcomes always agreeing) only becomes visible once the three separate results are compared against each other." },
      { description: "That comparison requires sending the actual measurement outcomes over an ordinary classical channel, which cannot exceed the speed of light, so no signal outruns it." },
    ],
    finalAnswer:
      "Each qubit's local measurement statistics are always random on their own; the correlation is only visible after classically comparing results, so no information is transmitted instantaneously.",
  },
  explanation: {
    correctIdea: "Entanglement produces correlations, not communication. The correlation becomes visible only when results are compared afterwards by ordinary means.",
    whyCorrect: "This is the same general principle established for the Bell state two courses ago, extended here to three parties: the physics guarantees local randomness for each observer individually.",
  },
};
