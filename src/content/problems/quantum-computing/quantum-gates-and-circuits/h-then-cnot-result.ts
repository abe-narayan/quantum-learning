import { StateVector } from "@/lib/quantum/state";
import { HADAMARD, applySingleQubitGate, applyCNOT } from "@/lib/quantum/gates";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const afterH = applySingleQubitGate(StateVector.zero(2), HADAMARD, 0);
const bellState = applyCNOT(afterH, 0, 1);

/** Renders a state's nonzero terms the same way `QuantumStateDisplay` does, so this option looks exactly like what the lesson itself shows. */
function ketLatex(state: StateVector): string {
  const terms = state.amplitudes
    .map((amplitude, index) => ({ amplitude, label: state.basisLabel(index) }))
    .filter(({ amplitude }) => amplitude.magnitudeSquared() > 1e-9);
  return terms.map(({ amplitude, label }) => `(${formatAmplitudeLatex(amplitude)})|${label}\\rangle`).join(" + ");
}

export const hThenCnotResult: MultipleChoiceProblem = {
  meta: {
    slug: "h-then-cnot-result",
    title: "H Then CNOT, Starting From |00⟩",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["bell-states", "entanglement", "circuits"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Starting from $|00\\rangle$, apply $H$ to qubit 0, then $\\text{CNOT}(0,1)$. What state results?",
    options: [
      { id: "a", text: `$${ketLatex(bellState)}$` },
      { id: "b", text: "$(0.71)|01\\rangle + (0.71)|10\\rangle$" },
      { id: "c", text: `$${ketLatex(afterH)}$` },
      { id: "d", text: "$|11\\rangle$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "That's the pattern for |Ψ+⟩, not |Φ+⟩ — check which basis states H and CNOT actually connect, starting from |00⟩.",
      c: "That's the state right after H, before CNOT is applied. CNOT is what entangles the two qubits.",
      d: "This has no superposition at all — but H alone already puts qubit 0 into superposition, so the final state can't be a single basis state.",
    },
    defaultIncorrectFeedback: "Work through the two steps in order: apply H to qubit 0 first, then CNOT(0,1).",
  },
  hints: [
    { text: "First, apply H to qubit 0 of |00⟩ only — qubit 1 is untouched at this step." },
    { text: "H|0⟩ = (|0⟩+|1⟩)/√2, so after this step you have a superposition over |00⟩ and |10⟩." },
    { text: "Now apply CNOT(0,1): the |00⟩ term is unaffected (control 0); the |10⟩ term flips its target (control 1)." },
  ],
  solution: {
    steps: [
      {
        description: "Apply $H$ to qubit 0 of $|00\\rangle$.",
        latex: "|00\\rangle \\xrightarrow{H \\text{ on } q_0} \\frac{|00\\rangle+|10\\rangle}{\\sqrt2}",
      },
      {
        description: "Apply $\\text{CNOT}(0,1)$: the $|00\\rangle$ term (control 0) is left alone; the $|10\\rangle$ term (control 1) has its target flipped.",
        latex: "\\frac{|00\\rangle+|10\\rangle}{\\sqrt2} \\xrightarrow{\\text{CNOT}(0,1)} \\frac{|00\\rangle+|11\\rangle}{\\sqrt2}",
      },
    ],
    finalAnswer: `$${ketLatex(bellState)}$`,
  },
  explanation: {
    correctIdea: "H puts qubit 0 into superposition first; CNOT then correlates qubit 1 with whichever branch qubit 0 is in.",
    whyCorrect: "Tracing each term through both gates individually reproduces exactly the Bell state |Φ+⟩.",
    whyWrong: [
      "Stopping after H only (option c) forgets that CNOT still needs to be applied.",
      "The |Ψ+⟩ pattern (option b) would result from starting at a different basis state, not |00⟩.",
    ],
  },
};
