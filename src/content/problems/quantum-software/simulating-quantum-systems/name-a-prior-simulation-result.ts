import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const nameAPriorSimulationResult: MultipleChoiceProblem = {
  meta: {
    slug: "name-a-prior-simulation-result",
    title: "Which Prior Result Used State-Vector Simulation?",
    course: "simulating-quantum-systems",
    lesson: "quantum-software/simulating-quantum-systems/state-vector-simulation",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["state-vector-simulation"],
    prerequisites: ["quantum-software/simulating-quantum-systems/state-vector-simulation"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which of these prior-course results was computed via state-vector simulation, per this lesson's framing?",
    options: [
      { id: "a", text: "Grover's algorithm's success probability (Quantum Algorithms I)" },
      { id: "b", text: "None of them — state-vector simulation is a new technique introduced in this course" },
      { id: "c", text: "Only results from this course count as state-vector simulation" },
      { id: "d", text: "Only results computed with sampleMeasurements count" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The lesson explicitly states this platform has been doing state-vector simulation since its very first lesson — it's a name for an existing, constantly-used technique, not something new.",
      c: "State-vector simulation has been used throughout EVERY prior course, not just this one — this course only names and examines the already-familiar technique.",
      d: "sampleMeasurements is the STATISTICAL alternative to state-vector simulation, not an example of it — exact amplitude computation is what counts.",
    },
    defaultIncorrectFeedback: "Grover's algorithm's success probability (like essentially every numeric result across this platform) was computed via exact state-vector simulation.",
  },
  hints: [
    { text: "State-vector simulation is the technique behind essentially every numeric result this platform has ever computed." },
    { text: "Grover's algorithm's success probability was computed via exact amplitude tracking, not statistical sampling." },
    { text: "This lesson's whole point is recognizing this common thread across prior courses." },
  ],
  solution: {
    steps: [{ description: "Grover's algorithm's success probability, like nearly every numeric result on this platform, was computed via exact state-vector simulation — the technique this lesson names retroactively." }],
    finalAnswer: "(a) Grover's algorithm's success probability",
  },
  explanation: {
    correctIdea: "This tests whether the reader grasped the lesson's central 'this isn't new, it's what we've always been doing' framing.",
    whyCorrect: "Matches the lesson's explicit Physical Interpretation section, which names this exact example.",
    whyWrong: ["Assuming state-vector simulation is exclusive to this course, or only applies to sampled results, misunderstands the lesson's retroactive-naming framing entirely."],
  },
};
