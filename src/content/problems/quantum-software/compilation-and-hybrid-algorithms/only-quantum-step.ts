import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const onlyQuantumStep: MultipleChoiceProblem = {
  meta: {
    slug: "only-quantum-step",
    title: "Which Step of the Hybrid Loop Must Run on a Quantum Device?",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["hybrid-workflows"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows"],
  },
  question: {
    type: "multiple-choice",
    prompt: "In the general hybrid loop, which single step must actually run on a quantum device, and why can't classical hardware perform it efficiently instead?",
    options: [
      { id: "a", text: "Preparing the ansatz state and measuring it — because efficiently sampling from a generic quantum state's distribution is exactly what's classically hard" },
      { id: "b", text: "Proposing the next parameter values — classical computers cannot generate numbers" },
      { id: "c", text: "Computing the cost function from measurement results — this requires quantum superposition" },
      { id: "d", text: "Checking convergence — this needs a quantum random number generator" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Classical computers propose parameter values constantly (this is ordinary numerical optimization) — nothing quantum is needed for this step.",
      c: "Computing a cost function from ALREADY-MEASURED classical statistics is ordinary classical arithmetic — no superposition is involved at this stage.",
      d: "Checking convergence is a simple classical comparison against a threshold — no randomness (quantum or otherwise) is required.",
    },
    defaultIncorrectFeedback: "Only state preparation and measurement genuinely require the quantum device — every other step (parameter proposal, cost computation, convergence check) is ordinary classical computation.",
  },
  hints: [
    { text: "Three of the four loop steps are pure classical computation (arithmetic, comparisons, numerical optimization)." },
    { text: "Only one step actually needs quantum mechanical behavior: preparing and measuring the ansatz state." },
    { text: "This is exactly the step classical computers can't efficiently emulate for a generic quantum state (Simulating Quantum Systems' exponential wall)." },
  ],
  solution: {
    steps: [{ description: "Only ansatz state preparation and measurement genuinely requires a quantum device — this is exactly the step subject to Simulating Quantum Systems' exponential classical-simulation cost for a generic state." }],
    finalAnswer: "(a) Preparing and measuring the ansatz state",
  },
  explanation: {
    correctIdea: "This connects directly back to Simulating Quantum Systems' central result: classical computers CAN in principle do this too, just at exponential cost — which is precisely why a real quantum device is valuable for this one step specifically.",
    whyCorrect: "Matches the lesson's explicit 'What runs where' section.",
    whyWrong: ["The other three options each describe ordinary classical computation the algorithm's classical optimizer performs routinely, with no quantum requirement at all."],
  },
};
