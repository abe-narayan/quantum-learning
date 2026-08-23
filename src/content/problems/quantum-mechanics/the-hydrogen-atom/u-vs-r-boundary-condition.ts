import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const uVsRBoundaryCondition: MultipleChoiceProblem = {
  meta: {
    slug: "u-vs-r-boundary-condition",
    title: "u(0)=0 vs. R(0)=0: Which Is the Real Boundary Condition?",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/the-radial-equation",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["radial-equation", "boundary-conditions"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/the-radial-equation"],
  },
  question: {
    type: "multiple-choice",
    prompt: "The substitution u(r)=rR(r) requires the boundary condition u(0)=0. What does this imply about R(0) for the 1s state specifically, given radial1s(r)=2e^{-r}?",
    options: [
      { id: "a", text: "R(0)=2, which is finite and nonzero — consistent with u(0)=r·R(0)=0·2=0" },
      { id: "b", text: "R(0) must also be exactly 0, the same as u(0)" },
      { id: "c", text: "R(0) is undefined because u(0)=0 forces division by zero" },
      { id: "d", text: "u(0)=0 is inconsistent with R(0)≠0, so radial1s must be wrong" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "u(0)=0 constrains u, not R directly — R(r)=u(r)/r can stay finite even as the numerator and denominator both go to 0.",
      c: "0/0 is only undefined in general; here u(r)~r·R(0) near r=0, so the limit is exactly R(0), a finite number.",
      d: "radial1s(0)=2·e^0=2, a finite nonzero value — fully consistent with u(0)=r·R(0)|_{r=0}=0.",
    },
    defaultIncorrectFeedback: "Compute radial1s(0) directly, and separately check that u(r)=r·radial1s(r) does go to 0 as r→0.",
  },
  hints: [
    { text: "radial1s(r)=2e^{-r}, so radial1s(0)=2e^0=2." },
    { text: "u(r)=r·R(r), so u(0)=0·R(0)=0 regardless of what finite value R(0) takes." },
    { text: "u(0)=0 is automatically satisfied whenever R(0) is finite — it does not force R(0)=0." },
  ],
  solution: {
    steps: [
      { description: "radial1s(0) = 2e^0 = 2, a finite nonzero value." },
      { description: "u(r) = r·radial1s(r), so u(0) = 0 × 2 = 0 — the boundary condition holds automatically." },
      { description: "This confirms u(0)=0 constrains u, not R — R(0) can be (and for 1s, is) nonzero." },
    ],
    finalAnswer: "(a) R(0)=2, finite and nonzero, with u(0)=0·2=0 still satisfied",
  },
  explanation: {
    correctIdea: "This is exactly the Common Mistakes point from the lesson, checked against the actual verified radial1s function rather than left abstract.",
    whyCorrect: "Direct evaluation of the real engine function radial1s(0)=2 confirms R(0)≠0 while u(0)=0 still holds.",
    whyWrong: ["Concluding R(0) must be 0 conflates the constraint on u with a (false) constraint on R directly."],
  },
};
