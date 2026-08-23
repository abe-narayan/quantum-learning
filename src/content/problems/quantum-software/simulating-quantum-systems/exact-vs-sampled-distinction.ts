import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const exactVsSampledDistinction: MultipleChoiceProblem = {
  meta: {
    slug: "exact-vs-sampled-distinction",
    title: "Exact Amplitudes vs. Sampled Estimates",
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
    prompt: "Which of these gives EXACT probabilities (up to floating-point precision), and which only ESTIMATES them statistically?",
    options: [
      { id: "a", text: "runCircuit (state-vector simulation) is exact; sampleMeasurements is a statistical estimate" },
      { id: "b", text: "Both give exact probabilities" },
      { id: "c", text: "Both only estimate probabilities statistically" },
      { id: "d", text: "sampleMeasurements is exact; runCircuit is a statistical estimate" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "sampleMeasurements draws random samples (shot noise, Writing Your First Circuit) — it does NOT give exact probabilities.",
      c: "runCircuit computes exact linear algebra with no randomness involved — it IS exact, up to ordinary floating-point rounding.",
      d: "This reverses the roles — runCircuit computes exact amplitudes directly; sampleMeasurements is the one that estimates via repeated random draws.",
    },
    defaultIncorrectFeedback: "runCircuit performs exact linear algebra (state-vector simulation); sampleMeasurements draws random samples, giving only a statistical estimate.",
  },
  hints: [
    { text: "runCircuit computes amplitudes via direct matrix multiplication — no randomness involved." },
    { text: "sampleMeasurements uses Math.random() to draw individual simulated measurement outcomes." },
    { text: "Only one of these two involves any randomness at all." },
  ],
  solution: {
    steps: [{ description: "runCircuit (state-vector simulation) computes exact amplitudes via deterministic linear algebra; sampleMeasurements estimates probabilities via random sampling, subject to shot noise." }],
    finalAnswer: "(a) runCircuit is exact; sampleMeasurements is a statistical estimate",
  },
  explanation: {
    correctIdea: "This is the lesson's central distinction, tested directly against the two specific platform functions that embody each approach.",
    whyCorrect: "Matches the lesson's explicit 'What it guarantees' section.",
    whyWrong: ["Confusing which function is deterministic and which is random inverts the entire lesson's point about what state-vector simulation actually guarantees."],
  },
};
