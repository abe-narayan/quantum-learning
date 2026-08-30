import type { ConceptualProblem } from "@/lib/problems/types";

export const negativeConditionalEntropyExplanation: ConceptualProblem = {
  meta: {
    slug: "negative-conditional-entropy-explanation",
    title: "Why S(A|B) = -1 Bit for the Bell State Is Not a Paradox",
    course: "quantum-shannon-theory",
    lesson: "quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["conditional-entropy", "entanglement", "state-merging"],
    prerequisites: ["quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures"],
  },
  question: {
    type: "conceptual",
    prompt:
      "For the Bell state |Phi+>, S(A|B) = S(rho_AB) - S(rho_B) = 0 - 1 = -1 bit, while classically H(A|B) >= 0 always. Explain what makes this possible (why it isn't a contradiction), what the negative value physically means, and what operational meaning its magnitude has.",
    placeholder: "Think about how S(rho_AB) can be smaller than S(rho_B) alone, and what that says about entanglement vs. classical correlation...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["entangle", "entanglement"],
        missingFeedback:
          "You have described the arithmetic. Now name the physical resource present here and absent from any classical joint distribution.",
      },
      {
        phrases: ["joint entropy smaller", "pure global state", "global state is pure", "globally pure", "joint is more pure", "lower entropy than the marginal", "below its own", "below one of its own", "smaller than the marginal"],
        missingFeedback:
          "You have named the resource. Now say how the entropy of the pair as a whole sits relative to the entropy of one half, since that is what makes the number negative.",
      },
      {
        phrases: ["state merging", "state-merging", "qubits of quantum communication", "communication cost", "epr pairs"],
        missingFeedback:
          "The question asks for an operational meaning too. Say what protocol the magnitude counts the price of, and in what units.",
      },
    ],
    incorrectFeedback:
      "Start from the classical inequality H(AB) >= H(B) and identify exactly which step of its justification has no quantum counterpart. Then produce the concrete two-qubit example where S(rho_AB) sits below S(rho_B), name the property of that example which makes it possible, and give the protocol whose resource count is what |S(A|B)| measures.",
    partialFeedback:
      "You have part of it. Now connect the negative sign specifically to entanglement rather than classical correlation, and name what its magnitude costs or saves operationally, in state merging.",
    modelAnswers: [
      "It is possible because the joint state is globally pure while its parts are not: the joint entropy is smaller than the marginal S(rho_B), which no classical joint distribution can manage since H(AB) >= H(B) always. The negative value is a signature of genuine entanglement, and its magnitude is the state merging cost, here a surplus of one EPR pair rather than a price to pay.",
      "For a Bell state the global state is pure, so the joint is more pure than either part. That is exactly the entanglement showing up. Operationally the magnitude counts qubits of quantum communication in state-merging, and a negative value means you gain EPR pairs instead of spending them.",
    ],
  },
  hints: [
    { text: "Classically, H(AB) >= H(B) holds because you cannot be more uncertain about a whole joint outcome than about one piece of it. Which step of that argument has no quantum analogue?" },
    { text: "A state that is pure as a whole has S(rho_AB)=0 however mixed its parts are. What has to be true of A and B for that to happen?" },
    { text: "|S(A|B)| has an operational reading in a specific protocol from this course: when B already holds its share and wants a full description of A, what resource does the protocol consume, or hand back?" },
  ],
  solution: {
    steps: [
      { description: "Classically, $H(AB)\\geq H(B)$ always, because a joint distribution's entropy can never fall below either marginal's: averaging in $A$'s uncertainty can only add." },
      { description: "For a pure bipartite quantum state, $S(\\rho_{AB})=0$ exactly, regardless of how mixed $\\rho_B$ is on its own. For the Bell state $S(\\rho_B)=1$ bit (maximally mixed), so $S(\\rho_{AB})=0 < S(\\rho_B)=1$. This gap is possible only because $A$ and $B$ are entangled; a product state's joint entropy is the sum of its parts' entropies and could never undershoot a marginal this way." },
      { description: "$S(A|B)=S(\\rho_{AB})-S(\\rho_B)=0-1=-1$ bit, and $|S(A|B)|=1$ is the number of qubits of quantum communication the state-merging protocol would need to send $A$'s share to whoever holds $B$. Here the sign is negative, so the protocol instead generates 1 EPR pair as a byproduct rather than consuming any communication." },
    ],
    finalAnswer: "Negative S(A|B) is possible because a globally pure entangled state can have S(rho_AB) below one of its own reduced-state entropies, which is impossible classically since H(AB) >= H(B) always. Its magnitude is the state-merging communication cost, here a surplus of 1 EPR pair rather than a cost.",
  },
  explanation: {
    correctIdea: "S(A|B) < 0 signals genuine entanglement: the joint state is more 'pure' (lower entropy) than either of its own parts, which a purely classical joint distribution can never be.",
    whyCorrect: "The classical inequality H(AB) >= H(B) relies on averaging a non-negative conditional entropy H(A|B=b) >= 0 over outcomes of B; the quantum analogue of that averaging step breaks down exactly when A and B are entangled, since there is no valid decomposition of the joint state into 'B is definitely in this state, and then A is some distribution given that' the way a classical joint distribution admits.",
    whyWrong: [
      "Treating S(A|B) = -1 as meaning 'negative information' or an error in the entropy formula: every quantity here (S(rho_AB), S(rho_B)) is computed the ordinary way from valid density matrices; only their difference is negative.",
      "Assuming the negative value implies A can be perfectly predicted with zero remaining uncertainty in the classical sense. rho_A alone is still maximally mixed (S(rho_A)=1 bit); the negativity is a joint-versus-marginal comparison, not a claim about A's own entropy.",
    ],
  },
};
