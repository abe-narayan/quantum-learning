import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const gcdOf7And15: MultipleChoiceProblem = {
  meta: {
    slug: "gcd-of-7-and-15",
    title: "Confirming gcd(7, 15) = 1",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/worked-example-factoring-15",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["shors-algorithm"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/worked-example-factoring-15"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Using Euclid's algorithm, what is gcd(7, 15)?",
    options: [
      { id: "a", text: "1" },
      { id: "b", text: "7" },
      { id: "c", text: "15" },
      { id: "d", text: "3" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "7 would mean 7 divides 15 evenly, which it doesn't (15=2×7+1).",
      c: "15 would mean 15 divides 7, impossible since 15>7.",
      d: "3 isn't a common divisor of both 7 and 15 — 3 doesn't divide 7 at all.",
    },
    defaultIncorrectFeedback: "Apply Euclid's algorithm: 15 = 2(7) + 1, then gcd(7,1) = 1.",
  },
  hints: [
    { text: "15 divided by 7 is 2 remainder 1." },
    { text: "gcd(7,15) = gcd(7,1)." },
    { text: "gcd(anything, 1) = 1." },
  ],
  solution: {
    steps: [{ description: "15=2(7)+1, so gcd(7,15)=gcd(7,1)=1." }],
    finalAnswer: "gcd(7,15) = 1",
  },
  explanation: {
    correctIdea: "7 and 15 share no common factors, confirming 7 was a legitimate choice for the Shor's algorithm worked example.",
    whyCorrect: "This is exactly the coprimality check the worked example's Step 1 requires before proceeding.",
    whyWrong: [
      { optionId: "b", text: "Would need 7 to divide 15 evenly, and 15 = 2(7) + 1 leaves a remainder." },
      { optionId: "c", text: "Would need 15 to divide 7, which is impossible for the larger of the two." },
      { optionId: "d", text: "3 divides 15 but not 7, so it is not a common divisor." },
    ],
  },
};
