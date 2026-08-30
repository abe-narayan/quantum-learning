import type { ConceptualProblem } from "@/lib/problems/types";

export const whySeparationEnablesOptimization: ConceptualProblem = {
  meta: {
    slug: "why-separation-enables-optimization",
    title: "Why Build-Then-Run Enables Circuit Optimization",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/circuit-representation-in-code",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["circuit-representation", "conceptual"],
    prerequisites: ["quantum-software/programming-quantum-computers/circuit-representation-in-code"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why representing a circuit as a data structure (a list of instructions) makes it possible to optimize the circuit before running it, in a way that immediate gate-by-gate execution would not.",
    placeholder: "Because the circuit is a list of instructions that can be inspected...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["inspect", "look at all", "rewrite the whole", "held as data", "whole circuit at once", "examine it first", "examined first", "rewritten", "rewrite it", "as a whole", "before any of it runs"],
        missingFeedback:
          "Say what having the circuit sitting there as a structure lets you do to it before it runs. Be concrete about the operation.",
      },
      {
        phrases: ["immediate execution", "already happened", "cannot undo", "no list to modify"],
        missingFeedback:
          "You have the advantage. Now make the contrast: say what running each gate as it arrives leaves you with at the moment you would want to improve things.",
      },
    ],
    incorrectFeedback: "Two sides. Say what having the circuit sit around as data lets a tool do to it, and when that becomes possible relative to the moment any gate acts. Then say what the alternative design forecloses: if each call has already taken effect by the time the next line runs, what is there left for an optimiser to work on?",
    partialFeedback: "Good. Now say what the alternative design lacks: with each call taking effect at once, there is no intermediate object for a rewriting pass to examine or change.",
    modelAnswers: [
      "Because the circuit is held as data, you can inspect the whole circuit at once before any of it runs, and rewrite it: merge adjacent gates, cancel inverses, reorder. With immediate execution the gates have already happened by the time you would want to change them, and there is no list to modify.",
      "A list of instructions can be examined first and rewritten as a whole. Gate-by-gate execution leaves nothing to work on, because each step already happened and you cannot undo it.",
    ],
  },
  hints: [
    { text: "A recorded sequence of gates can be examined and rewritten (dropping a redundant pair, say) before any of them act." },
    { text: "With each call taking effect at once, when would you get the chance to rewrite anything?" },
    { text: "Compilation & Hybrid Algorithms' transpilation step is this kind of pre-execution circuit rewriting." },
  ],
  solution: {
    steps: [
      { description: "Because a circuit-as-data representation is a complete list of instructions, an optimizer can examine that whole list before any of it runs, spotting and removing two adjacent gates that cancel out, for instance." },
      { description: "With immediate gate-by-gate execution (Quantum Gates & Circuits' direct approach), each gate's effect on the state happens the instant the code executes it, so there is no intermediate representation to inspect or rewrite first." },
      { description: "That is what makes Compilation & Hybrid Algorithms' transpilation and optimization step possible: it operates on the circuit-as-data representation, before execution." },
    ],
    finalAnswer: "A data representation can be inspected and rewritten as a whole before running; immediate execution has no equivalent intermediate structure to optimize.",
  },
  explanation: {
    correctIdea: "This connects the lesson's software-structure point forward to a concrete future use (compilation/optimization), rather than leaving 'why does this matter' unanswered.",
    whyCorrect: "Optimisation needs something to look at. Holding the circuit as data hands a rewriting pass the whole sequence before any of it acts, so cancelling gates or re-routing becomes possible; executing each call immediately destroys that opportunity before it exists.",
    whyWrong: ["Saying a data representation is 'more flexible' without identifying the specific mechanism, a rewritable list existing before execution, misses the reason."],
  },
};
