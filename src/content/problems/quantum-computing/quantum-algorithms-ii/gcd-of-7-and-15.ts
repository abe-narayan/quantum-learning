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
      { id: "c", text: "2" },
      { id: "d", text: "3" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "7 would mean 7 divides 15 evenly, which it doesn't (15=2×7+1).",
      c: "2 is the quotient in 15 = 2(7) + 1, not the gcd. Euclid's answer is the last nonzero remainder, which is the 1 sitting on the right of that same line.",
      d: "3 divides 15 but not 7, so it is not a common divisor of the two.",
    },
    defaultIncorrectFeedback: "Apply Euclid's algorithm: 15 = 2(7) + 1, then gcd(7,1) = 1.",
  },
  hints: [
    { text: "15 divided by 7 is 2 remainder 1." },
    { text: "gcd(7,15) = gcd(7,1)." },
    { text: "Euclid stops when the remainder reaches 1, and gcd(anything, 1) = 1." },
  ],
  solution: {
    steps: [{ description: "15=2(7)+1, so gcd(7,15)=gcd(7,1)=1." }],
    finalAnswer: "gcd(7,15) = 1",
  },
  explanation: {
    correctIdea: "7 and 15 share no common factors, confirming 7 was a legitimate choice for the Shor's algorithm worked example.",
    whyCorrect: "7 is prime and does not divide 15, so the only positive integer dividing both is 1. That coprimality is what makes 7 a usable base: if the gcd had come back greater than 1 it would already be a nontrivial factor of 15, and there would be nothing left for the quantum part to do.",
    whyWrong: [
      { optionId: "b", text: "Would need 7 to divide 15 evenly, and 15 = 2(7) + 1 leaves a remainder." },
      { optionId: "c", text: "Reads off the quotient instead of the remainder. Euclid discards the quotient at every step; the gcd is the last nonzero remainder." },
      { optionId: "d", text: "3 divides 15 but not 7, so it is not a common divisor." },
    ],
  },
};
