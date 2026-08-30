import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const twoIndependentProofsOfGroverOptimalityMc: MultipleChoiceProblem = {
  meta: {
    slug: "two-independent-proofs-of-grover-optimality-mc",
    title: "What 'Two Independent Proofs' Actually Establishes",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/query-complexity-and-lower-bounds",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["adversary-method", "polynomial-method", "grover", "proof-technique", "complexity-theory"],
    prerequisites: ["apex/quantum-complexity-theory/query-complexity-and-lower-bounds"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "The quantum adversary method (a state-evolution / distinguishability argument) and the polynomial method (a classical function-approximation-theory argument) share essentially no common machinery, yet both independently prove Grover's Theta(sqrt(N)) query complexity is optimal for unstructured search. Which statement most precisely describes what this 'doubly-proven' status does and does not mean?",
    options: [
      {
        id: "a",
        text: "An unconditional theorem about the query model, checkable line by line, and now confirmed along two structurally independent routes",
      },
      {
        id: "b",
        text: "Both proofs ultimately bound the same distinguishability quantity, so the second is a change of notation rather than independent confirmation",
      },
      {
        id: "c",
        text: "Two independent routes to one bound lift it above the query model, so it now covers explicitly given instances and not only oracles",
      },
      {
        id: "d",
        text: "Being doubly proven puts this in the same category as P != NP, which is likewise supported from several independent directions at once",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "They do not share an object. The adversary method tracks overlaps between quantum states under spectral norms; the polynomial method tracks the degree of a real polynomial approximating a Boolean function, resting on Nisan-Szegedy and Paturi rather than on Ambainis. Neither reduces to the other.",
      c: "Independence strengthens confidence in the proof, not the reach of the claim. Both arguments count oracle calls, and an instance whose structure can be read is not an oracle, so nothing about the setting changes when a second proof arrives.",
      d: "P != NP has no proof by any technique; it is believed on the strength of failed attempts to refute it. Grover's bound can be checked line by line, twice over, which makes it a different category of claim rather than a stronger example of the same one.",
    },
    defaultIncorrectFeedback:
      "Two structurally independent techniques agreeing is what makes Grover's optimality a theorem rather than a belief. Ask separately what that agreement does to your confidence, and what it does to the claim's scope.",
  },
  hints: [
    { text: "Ask what kind of statement (query model vs. time/circuit model, black-box vs. structured problems) each proof technique makes." },
    { text: "Ask what changes when a second, unrelated proof of the same statement appears: your confidence in the statement, or the statement's own scope?" },
    { text: "The correct answer should contrast this doubly-proven theorem with genuinely open, single-technique-unproven questions like P != NP, while still respecting the query model's scope." },
  ],
  solution: {
    steps: [
      { description: "The adversary method and polynomial method use unrelated mathematical machinery (state-evolution distinguishability vs. polynomial degree), so their agreement is genuine independent confirmation, not redundant restatement." },
      { description: "This makes Grover's Theta(sqrt(N)) optimality an unconditional, doubly-proven theorem, unlike P != NP or P != BQP, which have no unconditional proof by any technique." },
      { description: "Both techniques remain query-complexity results relative to a black-box oracle, so neither extends to unconditional claims about NP subseteq BQP or to time-complexity separations for explicitly-given, structured problems." },
    ],
    finalAnswer: "An unconditional theorem confirmed by two structurally independent techniques, still scoped to the black-box query model.",
  },
  explanation: {
    correctIdea:
      "Two structurally independent proof techniques landing on the same bound is stronger evidence of correctness than one proof alone, and it is what distinguishes a proven theorem from a widely believed but unproven conjecture. The theorem's scope is still the black-box query model.",
    whyCorrect:
      "Holding both halves at once is what the lesson asks for: the epistemic strength of independent confirmation, and the limited scope (query model, black-box oracle) that the theorem does not exceed.",
    whyWrong: [
      { optionId: "b", text: "Collapses the two techniques into one. Their core objects (quantum state overlaps against real polynomial degree) and the theorems they lean on (Ambainis against Nisan-Szegedy and Paturi) are different." },
      { optionId: "c", text: "Upgrades scope instead of confidence. Both proofs count oracle calls, so no number of them says anything about a problem whose structure an algorithm can read." },
      { optionId: "d", text: "Puts a checkable theorem in the same box as an unproven belief. P != NP has no proof by any route; this bound has two." },
    ],
  },
};
