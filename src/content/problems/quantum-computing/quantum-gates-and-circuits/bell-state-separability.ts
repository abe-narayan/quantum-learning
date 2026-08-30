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
      // The prompt already says "cannot be written as a product state", so
      // groups holding the verdict and the words "product state" graded the
      // question itself as a full answer. Both groups now ask for the argument.
      {
        phrases: ["four equations", "system of equations", "all four", "coefficients must satisfy", "match coefficients", "matching coefficients", "comparing coefficients", "expand the product", "expanding the tensor product", "write out the four products"],
        missingFeedback:
          "Do the algebra rather than describing it. Multiply out a general two-qubit product and set its coefficients against the Bell state's, then say what you are left holding.",
      },
      {
        phrases: ["cross terms", "cross-term", "must vanish", "one of them must be zero", "one of the four must be zero", "forces one factor to vanish", "forces a zero", "contradiction", "no solution", "cannot all hold", "can not all hold", "cannot be satisfied", "no assignment", "kills one of the", "kills the"],
        missingFeedback:
          "You have the equations. Now finish the argument: say which two of them force one of the numbers to be zero, and what that does to the other two.",
      },
    ],
    incorrectFeedback:
      "You asserted that the state is entangled, which is the same claim in different words. Assume the opposite instead: suppose it does split into two independent single-qubit pieces, work out what each of the four basis amplitudes would then have to be, and follow the two that are required to be zero to where they lead.",
    partialFeedback: "Now say why: run the four equations to their conclusion and show what each of the two zero-valued ones forces, then what that does to the other two.",
    modelAnswers: [
      "Expand |a>|b> and match coefficients with the Bell state. You get four equations: a0b0 = 1/sqrt2, a1b1 = 1/sqrt2, and the two cross terms a0b1 = 0 and a1b0 = 0. Those force one of the four numbers to be zero, which kills one of the two terms you need, so there is no solution.",
      "Write out the four products of the tensor product and compare coefficients. The cross-term equations must vanish, so one of a0, a1, b0, b1 is zero, but then one of the |00> or |11> amplitudes is zero too. The four equations cannot all hold at once.",
    ],
  },
  hints: [
    { text: "Suppose the state did split. Write |a⟩ and |b⟩ with general coefficients and expand their combination into the four basis terms." },
    { text: "Match those four terms against the Bell state's amplitudes. Two of the four right-hand sides are 0." },
    { text: "Each of those two equations forces one of the four unknowns to vanish. Feed that back into the other two equations and see what they now demand." },
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
          "From $a_0b_1=0$, either $a_0=0$ or $b_1=0$. If $a_0=0$, then $a_0b_0=0\\neq\\frac{1}{\\sqrt2}$, a contradiction. If $b_1=0$, then $a_1b_1=0\\neq\\frac{1}{\\sqrt2}$, also a contradiction.",
      },
    ],
    finalAnswer: "Expanding the product and matching coefficients gives four equations. The two cross terms force $a_0b_1=0$ and $a_1b_0=0$, so one of the four numbers must be zero, and that kills one of the two terms the Bell state needs. No assignment satisfies all four at once, so the state is entangled.",
  },
  explanation: {
    correctIdea: "The Bell state's amplitudes can't be matched by any choice of two single-qubit states' coefficients.",
    whyCorrect: "The equations force a contradiction no matter which of the two cases (a₀=0 or b₁=0) is chosen.",
    whyWrong: [
      "Saying 'it is entangled because it is called a Bell state' restates the label rather than proving anything.",
      "Assuming any two normalized single-qubit states can be combined to match these amplitudes ignores that the resulting system of equations is overdetermined and inconsistent.",
    ],
  },
};
