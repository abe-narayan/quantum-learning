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
      { id: "a", text: "CNOT is not a unitary matrix, so the theorem doesn't apply to it." },
      { id: "b", text: "The theorem only forbids cloning $|0\\rangle$; cloning $|1\\rangle$ is always allowed." },
      {
        id: "c",
        text: "Applied to a superposition input, linearity forces CNOT to produce an entangled Bell state, not two independent copies of that superposition.",
      },
      { id: "d", text: "CNOT only works on two qubits, and the theorem only applies to single-qubit devices." },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "c",
    optionFeedback: {
      a: "CNOT is unitary (it's one of the gates used throughout this course). That's not the issue.",
      b: "The theorem forbids cloning any unknown state, and by symmetry a cloner that fails on one basis state generally fails on superpositions of both, not just one basis state specifically.",
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
    finalAnswer: "CNOT correctly copies classical basis states, but linearity forces it to entangle (not clone) a superposition input — exactly the same mechanism the no-cloning proof uses.",
  },
  explanation: {
    correctIdea: "A device correctly copying $|0\\rangle$ and $|1\\rangle$ individually is, by linearity alone, forced to fail at cloning any superposition of them.",
    whyCorrect: "This is literally the no-cloning proof's own contradiction step, run on the specific gate CNOT instead of an abstract unitary U.",
    whyWrong: [
      "CNOT is unitary and does act on two qubits — neither of those properties is what exempts (or fails to exempt) it from the theorem.",
      "The theorem's force is entirely in what linearity requires for superposition inputs, not in any special status of $|0\\rangle$ versus $|1\\rangle$.",
    ],
  },
};
