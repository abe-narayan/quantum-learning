import type { ConceptualProblem } from "@/lib/problems/types";

export const interferenceWithoutEntanglement: ConceptualProblem = {
  meta: {
    slug: "interference-without-entanglement",
    title: "Interference on Entangled vs. Product States",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["interference", "entanglement"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits"],
  },
  question: {
    type: "conceptual",
    prompt:
      "The lesson's main derivation stays a product state throughout, yet still shows genuine interference. Recall the Bell-states lesson's calculation of $(H\\otimes H)|\\Phi^+\\rangle$. What did that calculation show, and how does its result qualitatively differ from this lesson's \"concentrate onto one outcome\" result?",
    placeholder: "(H⊗H) applied to the Bell state...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["bell state", "entangled", "phi+", "φ+"],
      ["unchanged", "same state", "itself", "returns"],
      ["concentrate", "single outcome", "one outcome", "certain"],
    ],
    incorrectFeedback:
      "Be specific about both results: what $(H\\otimes H)|\\Phi^+\\rangle$ equals, and how that compares to this lesson's product-state circuit ending in one certain outcome.",
    partialFeedback: "You have part of it — make sure your answer names both results and contrasts them explicitly.",
  },
  hints: [
    { text: "The Bell-states lesson showed $(H\\otimes H)|\\Phi^+\\rangle = |\\Phi^+\\rangle$ — the state comes back to itself." },
    { text: "This lesson's product-state circuit instead ends at a single definite basis state, not a superposition at all." },
    { text: "Both are genuine interference (phases rearranging amplitudes); they just land in qualitatively different places." },
  ],
  solution: {
    steps: [
      { description: "$(H\\otimes H)|\\Phi^+\\rangle = |\\Phi^+\\rangle$: applying $H$ to both qubits of the Bell state reproduces the exact same entangled superposition, still spread over $|00\\rangle$ and $|11\\rangle$." },
      { description: "This lesson's product-state circuit instead ends at a single, definite basis state with probability 1 — a superposition collapsing (through interference, not measurement) onto one outcome." },
      { description: "Both are interference: phases rearranging where amplitude ends up. They just produce very different kinds of results, because they start from different kinds of states (entangled vs. product)." },
    ],
    finalAnswer:
      "On the Bell state, $H\\otimes H$ reproduces the same entangled superposition; on this lesson's product state, the analogous phase manipulation concentrates everything onto one definite outcome — both are interference, applied to structurally different starting states.",
  },
  explanation: {
    correctIdea: "Interference is a general phenomenon (phases combining constructively or destructively); what specific outcome it produces depends heavily on whether the state going in is entangled or a product state.",
    whyCorrect: "Both examples are legitimate applications of the same underlying mechanism, just with different starting structure and consequently different endpoints.",
  },
};
