import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const zeroMeanNotSufficientMc: MultipleChoiceProblem = {
  meta: {
    slug: "zero-mean-not-sufficient-mc",
    title: "Why Zero Mean Gradient Isn't the Barren Plateau",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["barren-plateaus", "gradients"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability"],
  },
  question: {
    type: "multiple-choice",
    prompt: "This lesson derives E[∂C/∂θ]=0 exactly, using only an elementary trig integral, true for essentially any circuit depth or qubit count. Why isn't this fact, by itself, the barren plateau problem?",
    options: [
      { id: "a", text: "A zero-mean gradient is true even for well-behaved, easily trainable cost landscapes (e.g. a symmetric bowl shape); the real obstruction is that the gradient's typical size (variance) also shrinks toward zero, specifically for deep, expressive circuits and global cost functions" },
      { id: "b", text: "The zero-mean derivation is actually incorrect for deep circuits, which is why a separate variance argument is needed" },
      { id: "c", text: "Zero mean only holds for n=1 qubit; for larger n the mean becomes nonzero and that's the real problem" },
      { id: "d", text: "Zero mean is unrelated to trainability; the real obstruction is entirely about circuit depth exceeding hardware coherence times" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The zero-mean derivation is fully rigorous and general — it isn't wrong, it's just an incomplete story on its own.",
      c: "The zero-mean result, as derived, holds for any n (it only used that the parameter is marginally uniform over a period) — it's the variance, not the mean, that depends on n.",
      d: "This lesson's argument is about statistical/optimization structure, not hardware coherence times, which are a separate, unrelated concern.",
    },
    defaultIncorrectFeedback: "Recall the lesson's explicit point: zero mean alone describes even well-behaved cost landscapes just fine.",
  },
  hints: [
    { text: "Think of an ordinary bowl-shaped (convex) cost function symmetric around its minimum — its gradient also averages to zero over a symmetric domain." },
    { text: "What actually prevents an optimizer from finding a useful direction is the gradient being small everywhere, not just balanced on average." },
    { text: "The lesson's variance result is what's specifically tied to qubit count and circuit depth." },
  ],
  solution: {
    steps: [
      { description: "Zero mean is a property shared by any landscape symmetric enough for positive and negative gradient directions to balance — including easily trainable ones." },
      { description: "The real obstruction is the gradient's typical magnitude (standard deviation, i.e. √variance) collapsing toward zero as n grows." },
      { description: "That's a statement about variance, specifically shown (cited from concentration of measure) to scale as O(2^-n) for deep, expressive circuits against global cost functions." },
    ],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea: "Barren plateaus are fundamentally a variance (typical-magnitude) phenomenon, not a mean phenomenon.",
    whyCorrect: "This is exactly the distinction the lesson draws between its two results — one elementary and general, one deep and n-dependent.",
    whyWrong: ["Options b, c, and d each misattribute the source or scope of the actual obstruction."],
  },
};
