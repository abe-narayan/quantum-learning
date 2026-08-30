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
      {
        phrases: ["pure phase", "|psi|^2 unchanged", "probability density constant", "stationary"],
        missingFeedback:
          "Give the direct argument first. Say what time evolution does to an energy eigenstate, and what survives of that in the probability density.",
      },
      {
        phrases: ["ehrenfest", "d<x>/dt = <p>/m", "derivative is zero", "constant implies zero derivative"],
        missingFeedback:
          "You have the density argument. The question asks for a second, independent one: bring in the theorem about how expectation values move, and say what it gives here.",
      },
    ],
    incorrectFeedback: "Saying an energy eigenstate 'does not change' is the thing to be shown, not the reason. It does change: it acquires a time-dependent factor out front. Two separate arguments then have to explain why that factor leaves both averages fixed.",
    partialFeedback: "You gave one route. The exercise is the agreement of two independent ones: add whichever you left out, either the one that inspects the time-dependent factor directly, or the one that differentiates both averages and evaluates the commutators.",
    modelAnswers: [
      "First argument: an energy eigenstate only picks up a pure phase in time, so the probability density constant follows and any average computed from it cannot move. Second argument: Ehrenfest gives d<x>/dt = <p>/m and the momentum derivative is zero here, so both averages are constant. Two independent routes, same conclusion.",
      "The state evolves by a pure phase, so |psi|^2 unchanged means no average can shift. Independently, Ehrenfest's theorem's derivative is zero for such a state. Both lines of reasoning agree.",
    ],
  },
  hints: [
    { text: "Write the eigenstate's full time dependence out. What multiplies psi(x), and what is that factor's modulus?" },
    { text: "For the second route, forget the eigenstate entirely: start from the general time-derivative of an expectation value, valid for any state at all." },
    { text: "Evaluate the commutator of H with each operator in an energy eigenstate. The two routes should land on the same conclusion by different roads." },
  ],
  solution: {
    steps: [
      { description: "Direct argument: an eigenstate evolves by a pure phase, so $|\\psi(x,t)|^2=|\\psi_n(x)|^2$ is exactly constant, making every expectation value computed from it constant too." },
      { description: "Ehrenfest argument, which never looks at the density at all: for any observable $A$, $d\\langle A\\rangle/dt = (i/\\hbar)\\langle[H,A]\\rangle$. In an energy eigenstate $H$ can be made to act leftward or rightward and returns the same number $E$ either way, so $\\langle[H,A]\\rangle = E\\langle A\\rangle - E\\langle A\\rangle = 0$. Setting $A=x$ and then $A=p$ gives $d\\langle x\\rangle/dt = d\\langle p\\rangle/dt = 0$ directly." },
    ],
    finalAnswer: "Both the direct density argument and Ehrenfest's theorem independently confirm <x> and <p> stay constant for an energy eigenstate.",
  },
  explanation: {
    correctIdea: "Multiple independent derivations agreeing is real evidence of a consistent theory, not a coincidence to explain away.",
    whyCorrect: "This is the kind of cross-check the course emphasized throughout; the harmonic oscillator's two independent derivations of E_n are a prominent earlier example.",
    whyWrong: ["Giving only one of the two arguments misses the synthesis this problem asks for: the point is that two independent routes reach the same conclusion."],
  },
};
