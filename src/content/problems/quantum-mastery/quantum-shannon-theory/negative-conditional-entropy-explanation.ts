import type { ConceptualProblem } from "@/lib/problems/types";

export const negativeConditionalEntropyExplanation: ConceptualProblem = {
  meta: {
    slug: "negative-conditional-entropy-explanation",
    title: "Why S(A|B) = -1 Bit for the Bell State Is Not a Paradox",
    course: "quantum-shannon-theory",
    lesson: "quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures",
    difficulty: "advanced",
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
      ["entangle", "entanglement"],
      ["s(rho_ab) less than s(rho_b)", "joint entropy smaller", "pure global state", "global state is pure", "joint is more pure", "lower entropy than the marginal"],
      ["state merging", "state-merging", "qubits of quantum communication", "communication cost", "epr pairs"],
    ],
    incorrectFeedback:
      "Classically H(AB) >= H(B) always, because a joint distribution can never be more certain than one of its own marginals. Quantum mechanically this can fail: a bipartite state can be globally pure (S(rho_AB)=0, zero entropy) while a REDUCED state (S(rho_B)=1 bit) is maximally mixed. That gap is only possible through entanglement, and the size of the gap is exactly the number of qubits of quantum communication needed for quantum state merging.",
    partialFeedback:
      "You have part of it -- now connect the negative sign specifically to entanglement (not classical correlation) and name what its magnitude actually costs or saves operationally (state merging).",
  },
  hints: [
    { text: "Classically, H(AB) >= H(B) always holds because you can't be more uncertain about a whole joint outcome than about one piece of it alone. Which step of that classical argument fails for quantum states?" },
    { text: "A pure global state has S(rho_AB)=0 by definition, no matter how mixed its individual reduced states are -- this can only happen when A and B are entangled, since a product state's joint entropy would just be the sum of its parts' entropies." },
    { text: "The magnitude |S(A|B)| has an operational meaning: it is the number of qubits needed (or, if negative, generated as spare EPR pairs) in the quantum state merging protocol, when B already holds their share and wants A's full description." },
  ],
  solution: {
    steps: [
      { description: "Classically, $H(AB)\\geq H(B)$ always, because a joint distribution's entropy can never fall below either marginal's -- averaging in $A$'s uncertainty can only add." },
      { description: "For a pure bipartite quantum state, $S(\\rho_{AB})=0$ exactly, regardless of how mixed $\\rho_B$ is on its own; for the Bell state $S(\\rho_B)=1$ bit (maximally mixed), so $S(\\rho_{AB})=0 < S(\\rho_B)=1$, and this gap is possible only because $A$ and $B$ are entangled -- a product state's joint entropy is the sum of its parts' entropies and could never undershoot a marginal this way." },
      { description: "$S(A|B)=S(\\rho_{AB})-S(\\rho_B)=0-1=-1$ bit is exactly $-|S(A|B)|$ where $|S(A|B)|=1$ is the number of qubits of quantum communication the quantum state merging protocol would need to send $A$'s share to whoever holds $B$ -- except here it's negative, meaning the protocol instead generates 1 EPR pair as a byproduct rather than consuming any communication." },
    ],
    finalAnswer: "Negative S(A|B) is possible because a globally pure entangled state can have S(rho_AB) below one of its own reduced-state entropies (impossible classically, since H(AB) >= H(B) always) -- and its magnitude is exactly the state-merging communication cost, here a surplus of 1 EPR pair rather than a cost.",
  },
  explanation: {
    correctIdea: "S(A|B) < 0 signals genuine entanglement: the joint state is more 'pure' (lower entropy) than either of its own parts, which a purely classical joint distribution can never be.",
    whyCorrect: "The classical inequality H(AB) >= H(B) relies on averaging a non-negative conditional entropy H(A|B=b) >= 0 over outcomes of B; the quantum analogue of that averaging step breaks down exactly when A and B are entangled, since there is no valid decomposition of the joint state into 'B is definitely in this state, and then A is some distribution given that' the way a classical joint distribution admits.",
    whyWrong: [
      "Treating S(A|B) = -1 as meaning 'negative information' or an error in the entropy formula: every quantity here (S(rho_AB), S(rho_B)) is computed the ordinary way from valid density matrices; only their difference is negative.",
      "Assuming the negative value implies A can be perfectly predicted with zero remaining uncertainty in the classical sense: rho_A alone is still maximally mixed (S(rho_A)=1 bit) -- the negativity is a joint/marginal comparison, not a claim about A's own entropy.",
    ],
  },
};
