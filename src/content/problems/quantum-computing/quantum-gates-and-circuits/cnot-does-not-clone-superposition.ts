import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const cnotDoesNotCloneSuperposition: MultipleChoiceProblem = {
  meta: {
    slug: "cnot-does-not-clone-superposition",
    title: "Why CNOT Isn't a Counterexample to No-Cloning",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["no-cloning", "cnot", "linearity"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "CNOT satisfies $\\text{CNOT}(|0\\rangle\\otimes|0\\rangle)=|0\\rangle\\otimes|0\\rangle$ and $\\text{CNOT}(|1\\rangle\\otimes|0\\rangle)=|1\\rangle\\otimes|1\\rangle$, which looks exactly like cloning $|0\\rangle$ and $|1\\rangle$. Why doesn't this contradict the no-cloning theorem?",
    options: [
      { id: "a", text: "CNOT copies $|+\\rangle$ too: $\\text{CNOT}(|+\\rangle\\otimes|0\\rangle)=|+\\rangle\\otimes|+\\rangle$, so the theorem has an exception for the Hadamard basis." },
      { id: "b", text: "The second qubit ends up with the control's value but not its phase, so the two output qubits fall short of being identical copies." },
      {
        id: "c",
        text: "On a superposition input, linearity forces CNOT to output an entangled state, not two copies.",
      },
      { id: "d", text: "The theorem constrains single-qubit devices only, and CNOT acts on a two-qubit register." },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "c",
    optionFeedback: {
      a: "Expand it out instead of assuming it: $|+\\rangle\\otimes|0\\rangle=\\frac{1}{\\sqrt2}(|00\\rangle+|10\\rangle)$, and CNOT sends that to $\\frac{1}{\\sqrt2}(|00\\rangle+|11\\rangle)$, the Bell state. Correct cloning would need $|+\\rangle\\otimes|+\\rangle=\\frac12(|00\\rangle+|01\\rangle+|10\\rangle+|11\\rangle)$, which has four terms, not two.",
      b: "Phase is not the missing ingredient. Run the linearity step and you get $\\frac{1}{\\sqrt2}(|00\\rangle+|11\\rangle)$, in which neither qubit is in $|+\\rangle$ at all: each one on its own is completely unpolarized. The output is entangled, not a slightly degraded pair of copies.",
      d: "The theorem is about whether a device can clone an arbitrary *unknown state* onto a blank qubit, regardless of how many qubits the device itself uses.",
    },
    defaultIncorrectFeedback: "Think about what CNOT does to $|+\\rangle\\otimes|0\\rangle$, not just to $|0\\rangle\\otimes|0\\rangle$ and $|1\\rangle\\otimes|0\\rangle$ individually.",
  },
  hints: [
    { text: "CNOT correctly reproduces $|b\\rangle\\otimes|b\\rangle$ for the classical basis states $b=0,1$ individually." },
    { text: "But a cloning device has to work for every possible input state, including superpositions like $|+\\rangle$." },
    { text: "Apply linearity to $|+\\rangle\\otimes|0\\rangle=\\frac{1}{\\sqrt2}(|00\\rangle+|10\\rangle)$ and compare the result to $|+\\rangle\\otimes|+\\rangle$." },
  ],
  solution: {
    steps: [
      {
        description: "CNOT correctly maps the two basis-state inputs individually.",
        latex: "\\text{CNOT}(|0\\rangle\\otimes|0\\rangle)=|0\\rangle\\otimes|0\\rangle, \\quad \\text{CNOT}(|1\\rangle\\otimes|0\\rangle)=|1\\rangle\\otimes|1\\rangle",
      },
      {
        description: "But by linearity, its action on $|+\\rangle\\otimes|0\\rangle$ is forced by these two facts, not free to be chosen separately.",
        latex: "\\text{CNOT}(|+\\rangle\\otimes|0\\rangle) = \\frac{1}{\\sqrt2}\\big(\\text{CNOT}(|00\\rangle)+\\text{CNOT}(|10\\rangle)\\big) = \\frac{1}{\\sqrt2}(|00\\rangle+|11\\rangle)",
      },
      {
        description: "This is the entangled Bell state $|\\Phi^+\\rangle$, not $|+\\rangle\\otimes|+\\rangle=\\frac12(|00\\rangle+|01\\rangle+|10\\rangle+|11\\rangle)$, which is what correct cloning of $|+\\rangle$ would require.",
      },
    ],
    finalAnswer: "CNOT correctly copies classical basis states, but linearity forces it to entangle a superposition input rather than clone it, the same mechanism the no-cloning proof uses.",
  },
  explanation: {
    correctIdea: "A device correctly copying $|0\\rangle$ and $|1\\rangle$ individually is, by linearity alone, forced to fail at cloning any superposition of them.",
    whyCorrect: "This is the no-cloning proof's own contradiction step, run on the specific gate CNOT instead of an abstract unitary U.",
    whyWrong: [
      { optionId: "a", text: "Assumes the copy rule extends to |+⟩ instead of deriving it. Linearity gives (|00⟩+|11⟩)/√2, a two-term state, where |+⟩⊗|+⟩ has four equal terms." },
      { optionId: "b", text: "Diagnoses a lost phase. Nothing is lost: the amplitudes are all still there, redistributed into a correlation between the two qubits that leaves neither one in |+⟩ on its own." },
      { optionId: "d", text: "Counts the device's qubits rather than what it is asked to copy. The theorem is about copying an unknown state onto a blank qubit, whatever hardware does the copying." },
    ],
  },
};
