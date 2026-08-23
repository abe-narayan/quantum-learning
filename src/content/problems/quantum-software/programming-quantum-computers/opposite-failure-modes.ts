import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const oppositeFailureModes: MultipleChoiceProblem = {
  meta: {
    slug: "opposite-failure-modes",
    title: "How Do Simulators and Hardware Fail Differently?",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/simulators-vs-real-hardware",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["simulators"],
    prerequisites: ["quantum-software/programming-quantum-computers/simulators-vs-real-hardware"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Per this lesson, how do simulators and real hardware fail in 'opposite' ways?",
    options: [
      { id: "a", text: "Simulators are exact but face exponential memory cost; hardware has no such memory limit but suffers real physical error" },
      { id: "b", text: "Simulators always give wrong answers; hardware always gives correct answers" },
      { id: "c", text: "Both fail identically — qubit count is the only limiting factor for either" },
      { id: "d", text: "Simulators suffer physical error; hardware suffers exponential memory cost" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Simulators are exact (correct by construction, up to numerical precision) — this option has it backwards.",
      c: "The lesson explicitly distinguishes two DIFFERENT limiting factors — exponential memory (simulators) vs. physical error and access constraints (hardware) — not one shared factor.",
      d: "This swaps the two failure modes — it's simulators that face memory cost, and hardware that faces physical error, not the reverse.",
    },
    defaultIncorrectFeedback: "Simulators are exact but memory-limited (exponential in qubit count); hardware has no such memory wall but suffers genuine physical error and access constraints.",
  },
  hints: [
    { text: "A simulator computes exact math — no physical error at all." },
    { text: "But a simulator's memory requirement grows as 2^n with qubit count n." },
    { text: "Hardware has no such memory limit (a physical qubit isn't 2^n times more qubits), but it does have real, unavoidable physical noise." },
  ],
  solution: {
    steps: [{ description: "Simulators: exact, but exponential memory cost. Hardware: no memory wall, but genuine physical error — exactly opposite limiting factors." }],
    finalAnswer: "(a) Simulators: exact but exponential memory; hardware: no memory limit but real physical error",
  },
  explanation: {
    correctIdea: "This tests the lesson's precise 'opposite failure modes' framing, distinguishing it from a vague 'both have limits' claim.",
    whyCorrect: "Matches the lesson's explicit Physical Interpretation section.",
    whyWrong: ["Conflating the two failure modes, or swapping which system faces which limit, misses the lesson's specific point about WHY the choice between them depends on context."],
  },
};
