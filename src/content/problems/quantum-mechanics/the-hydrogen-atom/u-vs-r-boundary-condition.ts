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
    { text: "Evaluate radial1s at r=0 before reasoning about the boundary condition." },
    { text: "Now substitute that value into u(r) = r·R(r) at r=0 and see whether the condition is in tension with it." },
    { text: "A product is zero as soon as one factor is. Ask which factor is doing the work here." },
  ],
  solution: {
    steps: [
      { description: "radial1s(0) = 2e^0 = 2, a finite nonzero value." },
      { description: "u(r) = r·radial1s(r), so u(0) = 0 × 2 = 0 — the boundary condition holds automatically." },
      { description: "This confirms u(0)=0 constrains u, not R — R(0) can be (and for 1s, is) nonzero." },
    ],
    finalAnswer: "R(0) = 2, finite and nonzero, and u(0) = 0·2 = 0 holds anyway.",
  },
  explanation: {
    correctIdea: "The boundary condition constrains u, and the factor of r in u = rR satisfies it on its own. R is free to be finite and nonzero at the origin.",
    whyCorrect: "Evaluating radial1s(0) = 2 gives a nonzero R(0) while u(0) = 0 still holds.",
    whyWrong: [
      { optionId: "b", text: "Transfers the constraint from u to R. The factor of r already forces u to vanish, so R is unconstrained by it." },
      { optionId: "c", text: "Reads R = u/r as an indeterminate form. Near the origin u behaves like r·R(0), so the ratio tends to R(0), a finite number." },
      { optionId: "d", text: "Concludes the wavefunction is wrong from a tension that is not there. R(0) ≠ 0 and u(0) = 0 sit together without difficulty." },
    ],
  },
};
