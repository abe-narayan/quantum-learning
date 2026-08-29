import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const twoImplementationsCrossCheck: MultipleChoiceProblem = {
  meta: {
    slug: "two-implementations-cross-check",
    title: "Why Two Different Code Paths Agreeing Is Meaningful",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["variational-algorithms"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Why does the QuantumCircuit-based VQE matching Quantum Algorithms II's matrix-based exactGroundStateEnergy serve as a genuine correctness check?",
    options: [
      { id: "a", text: "The two compute the same physics along independent code paths, so agreement rules out bugs that live in only one of them" },
      { id: "b", text: "Both ultimately call the same gate-application helpers, so a matching result confirms those helpers are correct" },
      { id: "c", text: "The matrix computation is the reference implementation, so any circuit result matching it inherits its correctness" },
      { id: "d", text: "VQE converges to the ground-state energy for any correct ansatz, so agreement confirms the ansatz was chosen well" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "If they shared a common layer, a bug in that layer would corrupt both results identically and the check would pass anyway. What gives the check its force is that they do not share one: one builds a circuit as data and dispatches through gate application, the other multiplies ansatz matrices directly.",
      c: "Calling one path the reference just relabels the assumption. Neither is trusted in advance; the evidence comes from two independent paths landing on the same number.",
      d: "This assumes what is being tested. Whether the code converges to the right energy is the claim under check, not a premise it can lean on.",
    },
    defaultIncorrectFeedback: "Ask what would have to be true for the two results to agree despite a bug. Agreement is evidence only to the extent the two paths could have disagreed.",
  },
  hints: [
    { text: "Ask what a cross-check would prove if both paths shared the buggy code." },
    { text: "A bug in one implementation shows up as a disagreement only if the other implementation does not share it." },
    { text: "The QuantumCircuit path and the matrix path share no gate-application code, which is what makes the agreement worth something." },
  ],
  solution: {
    steps: [{ description: "The two implementations reach the same physics along paths that share no code: one assembles a circuit as data and dispatches through gate-application functions, the other multiplies ansatz matrices directly. A bug in either path would have to be mirrored by a matching bug in the other to survive, so agreement is real evidence." }],
    finalAnswer: "Because the two paths share no code: agreement rules out bugs that could live in only one of them.",
  },
  explanation: {
    correctIdea: "A cross-check is worth as much as the independence of the things being crossed. Shared code means a shared bug passes unnoticed.",
    whyCorrect: "Matches the lesson's Physical Interpretation section.",
    whyWrong: [
      { optionId: "b", text: "Would make the check vacuous. A shared layer is where a common bug would hide." },
      { optionId: "c", text: "Grants one path authority it has not earned. The evidence is symmetric between them." },
      { optionId: "d", text: "Assumes the conclusion. Correct convergence is the thing under test." },
    ],
  },
};
