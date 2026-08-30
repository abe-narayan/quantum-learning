import type { NumericProblem } from "@/lib/problems/types";

export const ladderLoweringCoefficient: NumericProblem = {
  meta: {
    slug: "ladder-lowering-coefficient",
    title: "A Lowering-Operator Coefficient",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["harmonic-oscillator", "ladder-operators"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator"],
  },
  question: {
    type: "numeric",
    prompt: "Using $a|n\\rangle=\\sqrt{n}\\,|n-1\\rangle$, find the coefficient $c$ such that $a|4\\rangle = c\\,|3\\rangle$.",
    inputHint: "a number",
  },
  answer: {
    type: "numeric",
    value: 2,
    tolerance: 0.01,
    incorrectFeedback:
      "The rule reads the level the operator acts on, not the one it produces. Substitute the starting level under the root, and report the root rather than what sits under it.",
    nearMisses: [
      {
        value: Math.sqrt(3),
        tolerance: 0.01,
        feedback: "√3 uses the level you land on. The rule takes its n from the level the operator acts on.",
      },
      { value: 4, feedback: "4 is n itself, still sitting under the root. The rule takes the square root of it." },
      {
        value: Math.sqrt(5),
        tolerance: 0.01,
        feedback: "√5 is the raising coefficient √(n+1), which belongs to a†|4⟩. Lowering reads n, not n+1.",
      },
    ],
  },
  hints: [
    { text: "The lowering operator's coefficient is read off the level it acts on, not the level it produces." },
    { text: "Substitute the starting level for $n$ in the rule the prompt gives, and keep the square root in place." },
    {
      text: "Three numbers are plausible under that root: the level you start on, the level you land on, and one above. Only one of them is the $n$ the rule names.",
    },
  ],
  solution: {
    steps: [{ description: "Apply the lowering rule with $n=4$.", latex: "a|4\\rangle = \\sqrt4\\,|3\\rangle = 2|3\\rangle" }],
    finalAnswer: "$c = 2$",
  },
  explanation: {
    correctIdea:
      "The lowering-operator coefficient is the square root of the level the operator acts on, not of the level it produces.",
    whyCorrect:
      "The rule reads the occupation of the state it is handed, which is why applying $a$ to $|0\\rangle$ contributes a factor of $\\sqrt0$ and returns nothing at all. That vanishing factor is exactly what terminates the ladder from below and puts a floor under the spectrum.",
    whyWrong: [
      "Using √3, the level the state lands on, instead of √4, the level it starts on, is the most common slip, and it is the one that would break the ladder's termination at n=0.",
    ],
  },
};
