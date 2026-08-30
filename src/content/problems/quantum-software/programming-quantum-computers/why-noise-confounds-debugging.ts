import type { ConceptualProblem } from "@/lib/problems/types";

export const whyNoiseConfoundsDebugging: ConceptualProblem = {
  meta: {
    slug: "why-noise-confounds-debugging",
    title: "Why Hardware Noise Makes Logic Bugs Harder to Find",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/simulators-vs-real-hardware",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["simulators", "conceptual"],
    prerequisites: ["quantum-software/programming-quantum-computers/simulators-vs-real-hardware"],
  },
  question: {
    type: "conceptual",
    prompt: "For the worked example's 4-qubit debugging scenario, explain specifically why running on real hardware would make it harder, not easier, to isolate a genuine circuit-logic bug.",
    placeholder: "If results look wrong on real hardware, this could be caused by...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["two possible causes", "two explanations", "two causes", "logic bug OR hardware", "bug or noise", "code or noise", "or hardware", "or noise", "can't tell which", "cannot tell", "can't tell", "ambiguous", "which one", "either"],
        missingFeedback:
          "Say what a wrong-looking result on hardware could be blamed on. There is more than one candidate, and that is the whole difficulty.",
      },
      {
        phrases: ["simulator", "isolates", "zero physical error", "eliminates one cause"],
        missingFeedback:
          "You have the ambiguity. Now say what running the same circuit locally does about it, in terms of how many of those candidate causes survive.",
      },
    ],
    incorrectFeedback: "Two things. First, describe the position a debugger is in when a run on real hardware comes back wrong: how many candidate accounts are on the table, and can the result itself distinguish them? Second, describe what running the identical circuit somewhere with no physical faults does to that set of candidates.",
    partialFeedback: "Good. Now name what a noiseless run buys you specifically: it removes one of the candidate accounts by construction, so a wrong answer there can only mean one thing.",
    modelAnswers: [
      "On hardware a wrong result has two possible causes: a genuine logic bug in your circuit, or hardware noise. You cannot tell which one you are looking at, so the observation is ambiguous. A noiseless simulator has zero physical error, which eliminates one cause entirely and isolates the logic.",
      "If the counts look wrong you can't tell whether it is the code or noise. The simulator removes noise as an explanation, so anything still wrong there has to be a bug.",
    ],
  },
  hints: [
    { text: "On real hardware a wrong-looking result has more than one possible source, and the result on its own does not tell you which." },
    { text: "A noiseless run has no physical faults by construction." },
    { text: "So a wrong answer from that run leaves exactly one account standing. Ask what that buys a debugger." },
  ],
  solution: {
    steps: [
      { description: "On real hardware, a wrong-looking result has two possible explanations: a genuine circuit-logic bug, or ordinary hardware noise (Noise, Decoherence & Scaling). There is no easy way to tell which from the result alone." },
      { description: "A noiseless simulator has zero physical error by construction, so if it gives a wrong result the only possible explanation is a genuine circuit-logic bug." },
      { description: "That is why debugging circuit logic is strictly easier on a simulator. It eliminates one of the two possible causes entirely, isolating the question to what is being debugged." },
    ],
    finalAnswer: "Real hardware leaves two possible causes for a wrong result (logic bug or hardware noise); a noiseless simulator eliminates the hardware-noise possibility entirely, isolating logic bugs specifically.",
  },
  explanation: {
    correctIdea: "This makes the lesson's 'simulator is strictly more useful for debugging logic' claim concrete through a causal mechanism, eliminating an ambiguity, rather than an assertion.",
    whyCorrect: "Debugging is elimination, and hardware supplies two live explanations for every wrong result. A noiseless run removes one of them by construction, so a wrong answer there points at the code with no ambiguity left to resolve.",
    whyWrong: ["Saying hardware is 'just less reliable' without identifying the specific ambiguity, that a bug cannot be distinguished from noise, misses the debugging-methodology point."],
  },
};
