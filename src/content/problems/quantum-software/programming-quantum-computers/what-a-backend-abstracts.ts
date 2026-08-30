import type { ConceptualProblem } from "@/lib/problems/types";

export const whatABackendAbstracts: ConceptualProblem = {
  meta: {
    slug: "what-a-backend-abstracts",
    title: "What Does a 'Backend' Actually Abstract Over?",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/quantum-sdks-overview",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["sdks", "conceptual"],
    prerequisites: ["quantum-software/programming-quantum-computers/quantum-sdks-overview"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain what a 'backend' abstraction lets a quantum SDK user avoid worrying about when writing circuit code.",
    placeholder: "A backend abstracts over ..., which means the circuit code does not need to ...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["which engine", "simulator or hardware", "execution target"],
        missingFeedback:
          "Say what the abstraction sits on top of. Name the kinds of thing it can stand for.",
      },
      {
        phrases: ["same circuit code", "doesn't need to change", "identical"],
        missingFeedback:
          "You have said what varies underneath. Now say what stays fixed above it, which is the whole point of the abstraction.",
      },
    ],
    incorrectFeedback: "Two things are needed here. Name the class of thing a backend stands in for, naming more than one kind of it so the class is visible, and then say what stays fixed on the author's side while that thing varies. Naming one kind on its own is half an answer.",
    partialFeedback: "Half of it is there. Now state what happens to the author's own file when the thing on the far side of the seam is swapped for a different one.",
    modelAnswers: [
      "A backend abstracts over the execution target: whether the circuit runs on a simulator or hardware, and which engine does the work. So the same circuit code runs unchanged when you switch from one to the other.",
      "It hides which engine actually executes the circuit. The circuit code doesn't need to change when you move from a local run to a real device.",
    ],
  },
  hints: [
    { text: "The word names a seam in the library. Ask what sits on the far side of it, and whether more than one thing could sit there." },
    { text: "List the kinds of thing that could carry out a circuit, and note how differently each goes about it: exact arithmetic at one end, physical pulses at the other." },
    { text: "Now look at the author's file. Ask which lines would have to be edited when the far side of the seam is swapped, and answer with what you find." },
  ],
  solution: {
    steps: [
      { description: "A backend abstracts over which execution engine actually runs a circuit: an ideal noiseless simulator, a noisy simulator, or real hardware." },
      { description: "These execution engines are internally very different: exact linear algebra, simulated noise, or real physical qubit operations." },
      { description: "The backend abstraction means the same circuit-building code works unchanged regardless of which backend is targeted. The circuit does not need to know how it will be executed." },
    ],
    finalAnswer: "A backend abstracts over the execution engine (simulator or hardware); the same circuit code runs unchanged across any of them.",
  },
  explanation: {
    correctIdea: "This tests understanding of a valuable software-engineering separation of concerns, not just recall of the word 'backend'.",
    whyCorrect: "The backend is where 'how this runs' is confined. An exact simulator, a noisy simulator and a real device differ enormously on the inside, and the point of naming that seam is that circuit-building code stays identical across all three.",
    whyWrong: ["Describing a backend as just 'a type of hardware' misses that simulators are also valid backends, and misses the key point that circuit code stays unchanged across all of them."],
  },
};
