import type { ConceptualProblem } from "@/lib/problems/types";

export const superpositionVsClassicalUncertainty: ConceptualProblem = {
  meta: {
    slug: "superposition-vs-classical-uncertainty",
    title: "Superposition Is Not Classical Uncertainty",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/what-is-a-qubit",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "conceptual",
    tags: ["superposition", "measurement", "conceptual"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/what-is-a-qubit"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A classical bit you haven't looked at yet is still secretly 0 or 1. Explain, in your own words, why a qubit in superposition is not the same kind of situation.",
    placeholder: "A qubit in superposition has...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // Three ideas, not two. The earlier pair was one sentence cut in half
      // ("no definite value" / "until measured"), so the five-word fragment
      // "no definite value until measured" satisfied both and graded correct
      // while a student who actually argued the contrast graded partial. The
      // third group is the thing the question is really asking for: why the
      // qubit's indefiniteness is not the classical bit's kind of ignorance.
      {
        phrases: ["no definite value", "no fixed value", "no definite state", "not determined", "undetermined", "no predetermined value", "no pre-existing value", "does not have a value", "does not have a definite", "no value until", "there is no fact", "not any particular value", "nothing to reveal", "nothing hidden", "no hidden", "nothing inside", "nothing decides", "nothing determines", "not secretly anything", "not secretly 0", "in both states at once", "both states at once", "both values at once", "in both states", "both at the same time", "superposition of both", "both possibilities at once"],
        missingFeedback:
          "You have named the moment the outcome shows up, but not the qubit's condition before that moment. Say what is, or is not, sitting inside it while nobody is looking.",
      },
      {
        phrases: ["until measured", "until it is measured", "until measurement", "until you measure", "when measured", "when you measure", "when you look", "at the moment you measure", "at measurement", "upon measurement", "prior to measurement", "before measurement", "measurement creates", "measurement forces", "measurement produces", "measurement makes", "measurement is what", "created when", "produced when", "comes into being when", "acquires one when", "becomes 0 or 1 when", "becomes one or the other", "picks one", "pick one", "forced to choose", "forces it to choose"],
        missingFeedback:
          "You have described the qubit's condition but not the event that ends it. Name what has to happen, and say what that event does that nothing before it did.",
      },
      {
        phrases: ["genuinely", "really is", "actually is", "truly", "ignoran", "just do not know", "we do not know which", "we simply do not know", "only our knowledge", "about our knowledge", "missing information", "lack of information", "already is", "is already", "already fixed", "already has", "already 0", "already a 0", "was already", "ahead of time", "in advance", "beforehand", "physical fact", "fact about the qubit", "not just that we", "epistemic"],
        missingFeedback:
          "Both halves of what you wrote are about the qubit alone, so nothing yet separates it from the coin under the cup. The question is a comparison: say what is true of the classical bit while you are not looking, and why the qubit is not that.",
      },
    ],
    incorrectFeedback:
      "You said both cases 'involve randomness', which is where the two look alike rather than where they differ. Ask a sharper question of each: does the object have a value sitting there waiting to be read, and if so when did it acquire it?",
    partialFeedback:
      "Answer the question directly: does the qubit have a definite, pre-existing value sitting there, at what moment does it acquire one, and how is that unlike the coin under the cup?",
    modelAnswers: [
      "A classical bit is already 0 or 1 and we are just ignorant of which one. A qubit isn't secretly anything - it has no definite value until you measure it, and that is the moment it picks one.",
      "The qubit is genuinely in both states at once, not hiding a value we cannot see. Nothing decides the outcome ahead of time; the measurement is what creates it.",
      "With the coin under the cup there really is an answer already and we simply do not know it. With a qubit there is nothing to know yet, no fixed value at all, and the outcome only comes into being when you look.",
    ],
  },
  hints: [
    { text: "For the classical bit, say what is true of it right now, while you are not looking." },
    { text: "Now try to say the same sentence about the qubit. Which word in it stops being justified?" },
    { text: "If no such sentence can be written, say what the qubit's situation is instead, and at what moment that changes." },
  ],
  solution: {
    steps: [
      {
        description:
          "A classical bit not yet looked at is an epistemic situation: the bit has a definite value (0 or 1), and 'uncertainty' describes your ignorance of which one, not the bit's actual state.",
      },
      {
        description:
          "A qubit in superposition is a physical fact about the state itself: it has no definite value at all until the moment it's measured, which is when a specific outcome is produced.",
      },
    ],
    finalAnswer:
      "Classical uncertainty describes ignorance of an already-fixed value; quantum superposition means no fixed value exists prior to measurement.",
  },
  explanation: {
    correctIdea:
      "Superposition is a physical fact about the qubit's state, not a description of missing information about a value that was already fixed.",
    whyCorrect:
      "This distinction is why superposition produces interference effects (Quantum States and State Vectors, later in this course) that no classical probability distribution over pre-existing values could reproduce.",
    whyWrong: [
      "Saying 'we just don't know which one it is yet' describes classical ignorance, exactly the situation this question asks you to distinguish superposition from.",
    ],
  },
};
