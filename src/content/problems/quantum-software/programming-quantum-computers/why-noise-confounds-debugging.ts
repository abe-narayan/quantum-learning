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
    prompt: "For the worked example's 4-qubit debugging scenario, explain specifically why running on real hardware would make it HARDER, not easier, to isolate a genuine circuit-logic bug.",
    placeholder: "If results look wrong on real hardware, this could be caused by...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["two possible causes", "logic bug OR hardware", "can't tell which"],
      ["simulator", "isolates", "zero physical error", "eliminates one cause"],
    ],
    incorrectFeedback: "Address the specific ambiguity real hardware introduces (two possible causes for a wrong result) and how a simulator eliminates one of them.",
    partialFeedback: "Good — now be explicit that a simulator's ZERO physical error is what isolates the logic-bug possibility specifically.",
  },
  hints: [
    { text: "On real hardware, a wrong-looking result could be caused by either a circuit-logic bug OR genuine hardware noise — you can't immediately tell which." },
    { text: "A noiseless simulator has zero physical error by construction." },
    { text: "So if a simulator gives a wrong result, it MUST be a logic bug — eliminating the ambiguity entirely." },
  ],
  solution: {
    steps: [
      { description: "On real hardware, a wrong-looking result has two possible explanations: a genuine circuit-logic bug, OR ordinary hardware noise/error (Noise, Decoherence & Scaling) — and there's no easy way to tell which from the result alone." },
      { description: "A noiseless simulator has zero physical error by construction — if it gives a wrong result, the ONLY possible explanation is a genuine circuit-logic bug." },
      { description: "This is why debugging circuit logic is strictly easier on a simulator: it eliminates one of the two possible causes entirely, isolating the question to exactly what's being debugged." },
    ],
    finalAnswer: "Real hardware leaves two possible causes for a wrong result (logic bug or hardware noise); a noiseless simulator eliminates the hardware-noise possibility entirely, isolating logic bugs specifically.",
  },
  explanation: {
    correctIdea: "This makes the lesson's 'simulator is strictly more useful for debugging logic' claim concrete via a specific causal mechanism (eliminating an ambiguity), not just an assertion.",
    whyCorrect: "Matches the lesson's explicit Worked Example and Common Mistakes sections.",
    whyWrong: ["Saying hardware is 'just less reliable' without identifying the SPECIFIC ambiguity (can't distinguish bug from noise) misses the actual debugging-methodology point."],
  },
};
