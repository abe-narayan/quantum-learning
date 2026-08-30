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
    prompt: "This lesson's framing is that state-vector simulation is what the platform has been doing all along. Which of these earlier numeric results was produced that way, rather than by ordinary classical arithmetic?",
    options: [
      { id: "a", text: "Grover's success probability after the optimal iteration count (Quantum Algorithms I)" },
      { id: "b", text: "gcd(7, 15) from the classical post-processing step of Shor's (Quantum Algorithms II)" },
      { id: "c", text: "The thermal photon occupation n̄ from the Bose-Einstein formula (Cryogenic Systems)" },
      { id: "d", text: "A trapped-ion device's gate budget, coherence time divided by gate time (Trapped Ions)" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Euclid's algorithm on two integers. It appears in a quantum algorithm's write-up, but the computation itself never touches an amplitude.",
      c: "Evaluating a closed-form expression, n̄ = 1/(exp(ħω/k_BT) − 1), at given ω and T. One formula, one arithmetic result, no state at all.",
      d: "Dividing one duration by another. It describes a quantum device without simulating one.",
    },
    defaultIncorrectFeedback: "Ask which of these four required tracking a vector of amplitudes through gates. The rest are arithmetic on numbers that happen to describe quantum systems.",
  },
  hints: [
    { text: "State-vector simulation means holding a vector of amplitudes and pushing it through gates." },
    { text: "Three of these evaluate a formula or run a classical algorithm on plain numbers." },
    { text: "Only one required a state to be built, evolved by a sequence of operators, and then read for probabilities." },
  ],
  solution: {
    steps: [{ description: "Grover's success probability is obtained by building the uniform superposition, applying the oracle and diffusion operators for the optimal number of iterations, and reading the marked amplitude's squared magnitude. That is state-vector simulation. The other three evaluate a formula or run a classical algorithm on ordinary numbers." }],
    finalAnswer: "Grover's success probability: it comes from evolving an amplitude vector through the oracle and diffusion operators and reading the result.",
  },
  explanation: {
    correctIdea: "State-vector simulation is a specific procedure, evolving a vector of amplitudes under operators, and the lesson's point is how much of this platform has quietly been doing it since the first course.",
    whyCorrect: "Grover's number comes from runGrover, which builds the uniform superposition and applies oracle and diffusion steps to the amplitude array directly.",
    whyWrong: [
      { optionId: "b", text: "Runs Euclid's algorithm on two integers. It sits inside a quantum algorithm without being a quantum computation." },
      { optionId: "c", text: "Evaluates one closed-form expression at given ω and T." },
      { optionId: "d", text: "Divides two durations. It characterizes a quantum device rather than simulating one." },
    ],
  },
};
