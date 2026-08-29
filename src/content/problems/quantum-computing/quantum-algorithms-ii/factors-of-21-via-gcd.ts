import { classicalOrder } from "@/lib/quantum/shor";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

function gcd(x: number, y: number): number {
  return y === 0 ? x : gcd(y, x % y);
}
const r = classicalOrder(2, 21);
const half = 2 ** (r / 2);
const f1 = gcd((half - 1) % 21, 21);
const f2 = gcd((half + 1) % 21, 21);
const correctPair = [f1, f2].sort((a, b) => a - b).join(" and ");

export const factorsOf21ViaGcd: MultipleChoiceProblem = {
  meta: {
    slug: "factors-of-21-via-gcd",
    title: "Factoring 21 from Its Order",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["shors-algorithm"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Take a=2, N=21, and the order r=6 (the smallest r with 2^r ≡ 1 mod 21, which you can verify by trial multiplication). Which pair of factors does gcd(2^(r/2)±1, 21) produce?",
    options: [
      { id: "a", text: "3 and 7" },
      { id: "b", text: "1 and 21" },
      { id: "c", text: "7 and 9, the raw values $2^{r/2}\\pm1$ with no gcd taken" },
      { id: "d", text: "1 and 1, from gcd($2^{r/2}$, 21) with the ±1 dropped" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "1 and 21 would mean the reduction failed (trivial factors). Check whether 2^(r/2) is actually ≡ ±1 mod 21 first.",
      c: "These are the inputs to the gcd, not its outputs. 9 does not divide 21 at all; running gcd(7,21) and gcd(9,21) is the step that turns them into factors.",
      d: "Dropping the ±1 is what breaks it. gcd(8,21)=1, a trivial factor, and the whole point of the shift by one is to land on a number sharing a factor with 21.",
    },
    defaultIncorrectFeedback: "Compute 2^(6/2) mod 21 = 2^3 mod 21 first, then take gcd with 21 on both sides.",
  },
  hints: [
    { text: "2^(r/2) = 2^3 = 8." },
    { text: "8 mod 21 = 8, not ±1, so the reduction applies cleanly." },
    { text: "gcd(8-1,21)=gcd(7,21) and gcd(8+1,21)=gcd(9,21)." },
  ],
  solution: {
    steps: [{ description: `gcd(7,21)=7, gcd(9,21)=3, giving factors ${correctPair}.` }],
    finalAnswer: `${correctPair}`,
  },
  explanation: {
    correctIdea: "21=3×7, and the gcd reduction recovers exactly this factorization from the order of 2.",
    whyCorrect: "Matches direct computation via classicalOrder and the gcd reduction.",
    whyWrong: [
      { optionId: "b", text: "Trivial factors are what you get when the reduction fails, and it doesn't fail here: 2^3 = 8, which is not ±1 mod 21." },
      { optionId: "c", text: "Stops at the gcd's inputs. 9 shares a factor with 21 but is not one; the gcd extracts the 3." },
      { optionId: "d", text: "Drops the ±1 shift, which is the step that produces a number sharing a factor with 21. gcd(8,21) is 1." },
    ],
  },
};
