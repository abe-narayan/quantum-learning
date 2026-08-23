import type { ConceptualProblem } from "@/lib/problems/types";

export const bellStateSeparability: ConceptualProblem = {
  meta: {
    slug: "bell-state-separability",
    title: "Why the Bell State Isn't Separable",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["entanglement", "separability", "bell-states"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Briefly explain why the Bell state $|\\Phi^+\\rangle = \\frac{1}{\\sqrt2}(|00\\rangle+|11\\rangle)$ cannot be written as a product state $|a\\rangle \\otimes |b\\rangle$.",
    placeholder: "Explain in a sentence or two...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["cannot", "can't", "no way", "not possible", "impossible", "no single"],
      ["product state", "separable", "factor", "single-qubit states", "tensor product", "outer product"],
    ],
    incorrectFeedback:
      "Try again — the key idea is about whether the state can be *factored* into two independent single-qubit states.",
    partialFeedback: "You're on the right track, but be explicit about why the product-state structure is impossible here.",
  },
  hints: [
    { text: "Try assuming |Φ+⟩ = |a⟩⊗|b⟩ for some single-qubit states |a⟩, |b⟩, and see what that would require." },
    { text: "Matching coefficients gives four equations relating a₀, a₁, b₀, b₁ to the amplitudes of |Φ+⟩." },
    { text: "Two of those equations force a contradiction — no values satisfy all four at once." },
  ],
  solution: {
    steps: [
      {
        description:
          "Suppose, for contradiction, that $|\\Phi^+\\rangle = |a\\rangle \\otimes |b\\rangle$ for single-qubit states $|a\\rangle=a_0|0\\rangle+a_1|1\\rangle$ and $|b\\rangle=b_0|0\\rangle+b_1|1\\rangle$.",
      },
      {
        description: "Matching coefficients against the Bell state's amplitudes gives four simultaneous equations.",
        latex: "a_0b_0=\\tfrac{1}{\\sqrt2}, \\quad a_0b_1=0, \\quad a_1b_0=0, \\quad a_1b_1=\\tfrac{1}{\\sqrt2}",
      },
      {
        description:
          "From $a_0b_1=0$, either $a_0=0$ or $b_1=0$. If $a_0=0$, then $a_0b_0=0\\neq\\frac{1}{\\sqrt2}$ — a contradiction. If $b_1=0$, then $a_1b_1=0\\neq\\frac{1}{\\sqrt2}$ — also a contradiction.",
      },
    ],
    finalAnswer: "No values of $a_0,a_1,b_0,b_1$ satisfy all four equations — $|\\Phi^+\\rangle$ is entangled, not a product state.",
  },
  explanation: {
    correctIdea: "The Bell state's amplitudes can't be matched by any choice of two single-qubit states' coefficients.",
    whyCorrect: "The equations force a contradiction no matter which of the two cases (a₀=0 or b₁=0) is chosen.",
    whyWrong: [
      "Saying 'it's entangled because it's called a Bell state' just restates the label — it isn't a proof.",
      "Assuming any two normalized single-qubit states can be combined to match these amplitudes ignores that the resulting system of equations is overdetermined and inconsistent.",
    ],
  },
};
