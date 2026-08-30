import type { ConceptualProblem } from "@/lib/problems/types";

export const whichStepWasQuantum: ConceptualProblem = {
  meta: {
    slug: "which-step-was-quantum",
    title: "Identifying the One Quantum Step in the Factor-15 Pipeline",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/worked-example-factoring-15",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["shors-algorithm", "conceptual"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/worked-example-factoring-15"],
  },
  question: {
    type: "conceptual",
    prompt: "List every step in the factor-15 worked example, and identify which single one required quantum interference rather than ordinary classical computation.",
    placeholder: "List: choosing a, checking gcd, the period-finding circuit, reading the peak, computing a^(r/2), the final gcd's...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["period-finding", "period finding", "order-finding", "finding the period", "quantum circuit", "qft", "measurement distribution"],
        missingFeedback:
          "You have listed the classical steps. Now name the single step that cannot be done that way, and say what it uses that pen and paper does not have.",
      },
      {
        phrases: ["gcd", "greatest common divisor", "everything else", "every other step", "all the other steps", "the rest of the steps", "ordinary arithmetic", "ordinary computer", "normal computer", "done by hand"],
        missingFeedback:
          "You have identified the quantum step. Now be explicit about the remainder: list the operations in the worked example that a laptop could do unaided, so the contrast is visible.",
      },
    ],
    incorrectFeedback: "You named 'Shor's algorithm' as the quantum step, which is the whole pipeline rather than one step in it. Enumerate the steps and test each one against a plain laptop.",
    partialFeedback: "You have named the quantum step. Now characterize the rest of the pipeline: what kind of machine would each remaining step need?",
    modelAnswers: [
      "Choosing a, taking the gcd, reading the peak, computing a^(r/2) and the two final gcds are all ordinary arithmetic you could do by hand. The only step that needs the machine is period finding, because that is where the QFT interferes the register into a peaked distribution.",
      "Every other step is classical: the gcd computations and the continued-fraction post-processing included. Only the period-finding circuit uses quantum interference.",
    ],
  },
  hints: [
    { text: "List the steps of the worked example in order, from choosing a to reading off the factors." },
    { text: "For each step in turn, ask whether an ordinary laptop could do it in a fraction of a second." },
    { text: "Exactly one step fails that test. Say which, and what physical effect it needs that arithmetic cannot supply." },
  ],
  solution: {
    steps: [
      { description: "Choosing a, checking gcd(a,N)=1, computing a^(r/2) mod N, and the two final gcd computations are all ordinary classical arithmetic." },
      { description: "Only the period-finding circuit's QFT-based interference step, the one producing the sharp probability peaks, requires a quantum computer." },
    ],
    finalAnswer: "Every other step, the gcd computations and the continued-fraction post-processing included, is ordinary arithmetic. Only period-finding needs the quantum machine, because that is where the QFT interferes the modular-exponentiation register into a distribution peaked on multiples of the period.",
  },
  explanation: {
    correctIdea: "Shor's algorithm's quantum speedup is concentrated in exactly one narrow subroutine, not spread across the whole pipeline.",
    whyCorrect: "Each of the other steps is something a classical machine does in polynomial time already: a gcd, a modular exponentiation on one input, a continued-fraction expansion. Only the step that needs every input evaluated at once and then interfered has no classical counterpart of the same cost.",
    whyWrong: ["Claiming multiple steps are quantum overstates the algorithm's reliance on quantum hardware. The scope of that reliance is the point of the question."],
  },
};
