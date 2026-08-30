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
      {
        phrases: ["bell state", "entangled", "phi+", "φ+"],
        missingFeedback:
          "You have described this lesson's result. The question also asks you to recall the earlier calculation; name the state it was performed on.",
        anchors: {
          "φ+": "The Bell-state label written in symbols strips to nothing, so it is matched raw; it is what a student types who names the state rather than describing it.",
        },
      },
      {
        phrases: ["unchanged", "same state", "itself", "returns"],
        missingFeedback:
          "You have named the earlier calculation's starting point. Now say what came out the other side of it, which is the whole point of the comparison.",
      },
      {
        phrases: ["concentrate", "single outcome", "one outcome", "certain"],
        missingFeedback:
          "You have the earlier result. Now contrast it with this lesson's: say what this derivation's interference does to the spread over possible results.",
      },
    ],
    incorrectFeedback:
      "You said both circuits 'show interference', which the question grants. Name the two end results as vectors: what the earlier lesson's calculation produced, and where this lesson's circuit lands. Then contrast them.",
    partialFeedback: "Name both results and contrast them explicitly.",
    modelAnswers: [
      "Applying H to both qubits of the Bell state gives back the same entangled state, unchanged. In this lesson the product state's phases instead concentrate everything onto one outcome, which you then get with certainty. Both are interference, but the starting states are structurally different.",
      "(H tensor H) on the Bell state returns |Phi+> itself, so nothing visible happens to the entangled superposition. Here the analogous phase manipulation on a product state concentrates the amplitude onto a single outcome.",
    ],
  },
  hints: [
    { text: "Go back to the earlier lesson and find what $(H\\otimes H)$ did to the two-qubit state it studied there. Write the answer down." },
    { text: "Now write down where this lesson's product-state circuit ends. Is it a superposition at all?" },
    { text: "Put the two answers side by side. One circuit ends where it began; the other ends somewhere very specific. Say which is which." },
  ],
  solution: {
    steps: [
      { description: "$(H\\otimes H)|\\Phi^+\\rangle = |\\Phi^+\\rangle$: applying $H$ to both qubits of the Bell state reproduces the exact same entangled superposition, still spread over $|00\\rangle$ and $|11\\rangle$." },
      { description: "This lesson's product-state circuit instead ends at a single definite basis state with probability 1: a superposition concentrated onto one outcome through interference, not measurement." },
      { description: "Both are interference: phases rearranging where amplitude ends up. They just produce very different kinds of results, because they start from different kinds of states (entangled vs. product)." },
    ],
    finalAnswer:
      "On the Bell state, $H\\otimes H$ reproduces the same entangled superposition; on this lesson's product state, the analogous phase manipulation concentrates everything onto one definite outcome. Both are interference, applied to structurally different starting states.",
  },
  explanation: {
    correctIdea: "Interference is a general phenomenon (phases combining constructively or destructively); what specific outcome it produces depends heavily on whether the state going in is entangled or a product state.",
    whyCorrect: "Both examples are legitimate applications of the same underlying mechanism, just with different starting structure and consequently different endpoints.",
  },
};
