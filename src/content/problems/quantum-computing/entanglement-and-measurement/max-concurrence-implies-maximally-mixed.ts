import type { ConceptualProblem } from "@/lib/problems/types";

export const maxConcurrenceImpliesMaximallyMixed: ConceptualProblem = {
  meta: {
    slug: "max-concurrence-implies-maximally-mixed",
    title: "Why C=1 Forces the Reduced State to Be Maximally Mixed",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["concurrence", "purity", "conceptual"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Using the identity C=√(2(1−Tr(ρ_A²))), explain why C=1 forces Tr(ρ_A²) to equal 0.5, not merely 'very mixed' but the exact maximally mixed value.",
    placeholder: "Plug C=1 into the identity and solve...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // "1=√" and "1 = √" both stripped to the bare token "1", so this group
      // matched any answer containing the digit 1 anywhere. Likewise "exactly"
      // on its own was a filler word rather than a claim about the value.
      {
        phrases: ["square both sides", "squaring both sides", "remove the root", "removing the root", "removing the square root", "eliminate the square root", "get rid of the root", "rearrange for tr", "isolate tr", "solve the equation", "solving the equation", "solve for tr", "substitute c=1", "substituting c=1", "put c=1 into", "plug c=1 into"],
        missingFeedback:
          "You have argued that the value is forced. Show the algebra that forces it: what do you do to the identity once you have put the maximum value of C into it?",
      },
      {
        phrases: ["only solution", "only possible value", "unique solution", "uniquely determined", "determined uniquely", "no other value", "no other possibility", "single value", "exactly one value", "one value only", "pins down", "pinned down", "leaves no freedom", "no freedom left", "an equation, not an inequality", "equation rather than an inequality", "cannot be anything else", "can not be anything else", "nothing else is possible"],
        missingFeedback:
          "You did the algebra. Now say what kind of statement the result is, and why that kind of statement admits exactly one answer.",
      },
    ],
    incorrectFeedback: "You argued that maximal concurrence means 'as entangled as possible' and therefore 'as mixed as possible', which is the conclusion restated. Treat the identity as an equation instead: one side is known, so ask how much freedom the other side has left.",
    partialFeedback: "Finish the argument by showing the algebra leaves no other possibility for Tr(ρ_A²).",
    modelAnswers: [
      "Put C=1 into the identity and square both sides: 1 = 2(1 - Tr(rho_A^2)). That is an equation rather than an inequality, so it has only one solution and Tr(rho_A^2) has to be exactly 0.5.",
      "Substituting C=1 and removing the square root gives 1 = 2 - 2Tr(rho_A^2), and solving for Tr leaves no freedom at all: the value is pinned down at 0.5 and cannot be anything else.",
    ],
  },
  hints: [
    { text: "The identity is an equation with two quantities in it, one of which you are told. Put the given number in and see what is left." },
    { text: "You now have an equation in Tr(ρ_A²) alone, with a root sign in the way. Remove the root." },
    { text: "Rearrange for Tr(ρ_A²). Count the answers the equation permits, and say what that count means." },
  ],
  solution: {
    steps: [
      { description: "$1 = \\sqrt{2(1-\\text{Tr}(\\rho_A^2))}$" },
      { description: "Squaring: $1 = 2(1-\\text{Tr}(\\rho_A^2))$, so $1-\\text{Tr}(\\rho_A^2)=0.5$." },
      { description: "$\\text{Tr}(\\rho_A^2) = 0.5$ exactly, with no other value possible." },
    ],
    finalAnswer: "Substituting C=1 and squaring both sides leaves 1 = 2(1 − Tr(ρ_A²)), an equation rather than an inequality, so it pins down a single value: Tr(ρ_A²) = 0.5.",
  },
  explanation: {
    correctIdea: "The identity relating C and Tr(ρ_A²) is an exact algebraic equation, so any specific C value forces exactly one Tr(ρ_A²) value.",
    whyCorrect: "This shows maximal entanglement (C=1) and maximal reduced mixedness (Tr(ρ_A²)=0.5, the minimum possible for a qubit) are not just correlated but mathematically equivalent.",
    whyWrong: ["Saying Tr(ρ_A²) is merely 'close to 0.5' misunderstands that the identity is an exact equation, not an approximation."],
  },
};
