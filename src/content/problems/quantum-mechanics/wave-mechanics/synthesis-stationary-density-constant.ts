import type { ConceptualProblem } from "@/lib/problems/types";

export const synthesisStationaryDensityConstant: ConceptualProblem = {
  meta: {
    slug: "synthesis-stationary-density-constant",
    title: "Synthesis: Why Stationary States Don't Move",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/wave-mechanics-challenge",
    difficulty: "advanced",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["synthesis", "stationary-states", "ehrenfest-theorem"],
    prerequisites: ["quantum-mechanics/wave-mechanics/wave-mechanics-challenge"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Combining the Schrodinger-equation-in-position-space lesson and Ehrenfest's theorem, explain in two or three sentences why an energy eigenstate's <x> and <p> are both exactly constant in time, using two independent lines of reasoning that both reach the same conclusion.",
    placeholder: "Give two independent arguments for why <x> and <p> are constant for an eigenstate...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["pure phase", "|psi|^2 unchanged", "probability density constant", "stationary"],
      ["ehrenfest", "d<x>/dt = <p>/m", "derivative is zero", "constant implies zero derivative"],
    ],
    incorrectFeedback: "Give both independent arguments: that an eigenstate's probability density is exactly unchanged in time (a pure phase factor), and that Ehrenfest's theorem then forces the time derivatives of <x> and <p> to vanish.",
    partialFeedback: "You're partway there — try to give both the direct (density-based) and the Ehrenfest-based argument.",
  },
  hints: [
    { text: "First argument: what happens to |psi(x,t)|^2 for an eigenstate, directly?" },
    { text: "Second argument: if <x> is constant in time, what must its time derivative equal, and what does Ehrenfest's theorem say that derivative is?" },
  ],
  solution: {
    steps: [
      { description: "Direct argument: an eigenstate evolves by a pure phase, so $|\\psi(x,t)|^2=|\\psi_n(x)|^2$ is exactly constant, making every expectation value computed from it constant too." },
      { description: "Ehrenfest argument: since $\\langle x\\rangle$ is constant, its time derivative is zero; Ehrenfest's theorem says that derivative equals $\\langle p\\rangle/m$, so $\\langle p\\rangle=0$ must also hold (consistent with the eigenstate's real, symmetric wavefunctions)." },
    ],
    finalAnswer: "Both the direct density argument and Ehrenfest's theorem independently confirm <x> and <p> stay constant for an energy eigenstate.",
  },
  explanation: {
    correctIdea: "Multiple independent derivations agreeing is real evidence of a consistent theory, not a coincidence to explain away.",
    whyCorrect: "This is exactly the kind of cross-check this course emphasized throughout — the harmonic oscillator's two independent derivations of E_n being a prominent earlier example.",
    whyWrong: ["Giving only one of the two arguments misses the synthesis this problem asks for — the point is that two independent routes reach the same conclusion."],
  },
};
