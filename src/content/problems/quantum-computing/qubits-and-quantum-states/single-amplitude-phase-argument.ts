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
      ["one nonzero amplitude", "only one amplitude", "single amplitude", "α=0", "no second amplitude", "only the |1⟩ term"],
      ["global phase", "always global", "nothing to be relative to", "cannot be relative"],
    ],
    incorrectFeedback: "Count how many nonzero amplitudes a state proportional to |1⟩ actually has, then think about what 'relative phase' requires.",
    partialFeedback: "Good — now state explicitly why any phase applied here has to be global rather than relative.",
  },
  hints: [
    { text: "A state proportional to |1⟩ has α=0: only one nonzero amplitude." },
    { text: "'Relative phase' means one amplitude's phase changes relative to another's — that requires at least two nonzero amplitudes to compare." },
    { text: "With only one nonzero amplitude, any phase a gate introduces necessarily multiplies the WHOLE state equally." },
  ],
  solution: {
    steps: [
      { description: "A state proportional to $|1\\rangle$ has exactly one nonzero amplitude." },
      { description: "Relative phase is defined as a phase difference BETWEEN two amplitudes — with only one nonzero amplitude, there is nothing for a phase to be relative to." },
      { description: "So any phase factor a gate introduces here is automatically a global phase on the whole (one-term) state, and global phase is provably unobservable in every basis." },
    ],
    finalAnswer: "No — no experiment can tell them apart. Any phase on a single-amplitude state is necessarily global, and global phase is unobservable by any measurement.",
  },
  explanation: {
    correctIdea: "Relative phase requires two amplitudes to compare; a state with only one nonzero amplitude can only ever pick up a global phase.",
    whyCorrect: "This is exactly why Y|0⟩=i|1⟩ and X|0⟩=|1⟩ land at the same Bloch point: |0⟩ has only one nonzero amplitude after either gate, so the extra i is forced to be global.",
    whyWrong: [
      "Assuming a phase factor like i or −1 is automatically observable because it 'looks different' in the written amplitudes — observability depends on whether it's global or relative, not on how it looks.",
      "Trying to apply the X-basis P(+) formula here — that formula assumes two nonzero amplitudes; with α=0 there's no interference term to depend on any phase.",
    ],
  },
};
