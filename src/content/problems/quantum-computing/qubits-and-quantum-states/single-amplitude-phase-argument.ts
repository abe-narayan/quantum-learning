import type { ConceptualProblem } from "@/lib/problems/types";

export const singleAmplitudePhaseArgument: ConceptualProblem = {
  meta: {
    slug: "single-amplitude-phase-argument",
    title: "Phase on a Single Amplitude",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/global-and-relative-phase",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["global-phase", "relative-phase"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/global-and-relative-phase"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Two engineers each prepare a qubit proportional to $|1\\rangle$ (so $\\alpha=0$), then each applies a different single-qubit phase gate to it. Can any measurement, in any basis, ever tell their two results apart? Explain in terms of global vs. relative phase.",
    placeholder: "How many nonzero amplitudes does a state proportional to |1⟩ have?",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // "α=0" stripped to the bare token "0", which matched any answer that
      // mentioned |0⟩ at all. The spelled-out forms below carry the claim.
      {
        phrases: ["one nonzero amplitude", "only one amplitude", "single amplitude", "only one nonzero", "no second amplitude", "only the |1⟩ term", "just one term", "one term", "nothing in the |0⟩ slot"],
        missingFeedback:
          "Count first. Say how many nonzero components a state proportional to |1> actually has.",
      },
      {
        phrases: ["always global", "nothing to be relative to", "cannot be relative", "can not be relative", "no relative phase exists", "nothing to compare against", "nothing to compare it against", "only an overall factor", "overall factor", "unobservable", "invisible to every measurement", "drops out of every probability"],
        missingFeedback:
          "You have the count. Now say what kind of phase is the only kind such a state can carry, and why no experiment can see it.",
      },
    ],
    incorrectFeedback: "You answered that the two gates 'apply different phases, so the states differ', which is the assumption to be tested. Count the nonzero coefficients first, then say what 'relative phase' needs in order to exist at all.",
    partialFeedback: "Now say why any phase applied here must be global rather than relative.",
    modelAnswers: [
      "No measurement can tell them apart. A state proportional to |1> has only one nonzero amplitude, so any phase either engineer adds is an overall factor with nothing to be relative to. Global phase is unobservable, so it drops out of every probability in every basis.",
      "Since alpha is zero there is just one term, and a relative phase needs two amplitudes to sit between. So the phase here is always global, invisible to every measurement.",
    ],
  },
  hints: [
    { text: "Write the state out with both coefficients shown explicitly. How many of them are not zero?" },
    { text: "'Relative phase' compares one coefficient's phase against another's. How many coefficients does that comparison need?" },
    { text: "With fewer than that available, any phase a gate introduces multiplies the whole state at once. Say what such a phase is called and what it does to measurement statistics." },
  ],
  solution: {
    steps: [
      { description: "A state proportional to $|1\\rangle$ has exactly one nonzero amplitude." },
      { description: "Relative phase is a phase difference between two amplitudes. With only one nonzero amplitude, there is nothing for a phase to be relative to." },
      { description: "So any phase factor a gate introduces here is automatically a global phase on the whole (one-term) state, and global phase is provably unobservable in every basis." },
    ],
    finalAnswer: "No experiment can tell them apart. Any phase on a single-amplitude state is global, and global phase is unobservable by any measurement.",
  },
  explanation: {
    correctIdea: "Relative phase requires two amplitudes to compare; a state with only one nonzero amplitude can only ever pick up a global phase.",
    whyCorrect: "This is exactly why Y|0⟩=i|1⟩ and X|0⟩=|1⟩ land at the same Bloch point: |0⟩ has only one nonzero amplitude after either gate, so the extra i is forced to be global.",
    whyWrong: [
      "Assuming a phase factor like i or −1 is automatically observable because it looks different written down. Observability depends on whether the phase is global or relative, not on its appearance on the page.",
      "Applying the X-basis P(+) formula here. That formula assumes two nonzero amplitudes; with α=0 there is no interference term for a phase to enter.",
    ],
  },
};
