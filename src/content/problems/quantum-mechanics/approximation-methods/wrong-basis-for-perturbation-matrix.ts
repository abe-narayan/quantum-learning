import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const wrongBasisForPerturbationMatrix: MultipleChoiceProblem = {
  meta: {
    slug: "wrong-basis-for-perturbation-matrix",
    title: "Which Basis Must H′ Be Expressed In?",
    course: "approximation-methods",
    lesson: "quantum-mechanics/approximation-methods/time-independent-perturbation-theory",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["perturbation-theory"],
    prerequisites: ["quantum-mechanics/approximation-methods/time-independent-perturbation-theory"],
  },
  question: {
    type: "multiple-choice",
    prompt: "The formulas E_n^(1)=H'_nn and E_n^(2)=Σ|H'_mn|²/(E_n^(0)-E_m^(0)) require H' to be written as a matrix in which basis?",
    options: [
      { id: "a", text: "H₀'s own eigenbasis, {|n⁽⁰⁾⟩}" },
      { id: "b", text: "The position basis, regardless of what H₀ is" },
      { id: "c", text: "Any orthonormal basis — the choice doesn't matter" },
      { id: "d", text: "H′'s own eigenbasis" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The position basis is only relevant if H₀ itself happens to be diagonal there — for the harmonic oscillator's H₀, the natural basis is the number/Fock basis, not position.",
      c: "The formulas' E_n^(0) terms specifically reference H₀'s eigenvalues at labeled states n — this only makes sense if the matrix indices n,m label H₀'s eigenstates.",
      d: "Diagonalizing H′ itself would defeat the purpose — perturbation theory specifically avoids needing to solve the full (H₀+H′) problem directly.",
    },
    defaultIncorrectFeedback: "The indices n, m in every formula label H₀'s eigenstates specifically — H' must be expressed as a matrix using that same basis.",
  },
  hints: [
    { text: "The formulas reference E_n^(0) and E_m^(0), which are H₀'s eigenvalues at states labeled n, m." },
    { text: "For H'_mn=⟨m⁽⁰⁾|H'|n⁽⁰⁾⟩ to make sense, the bras and kets must be H₀'s eigenstates." },
    { text: "This is why this course's worked example builds the x⁴ matrix directly in the harmonic oscillator's Fock (number) basis." },
  ],
  solution: {
    steps: [{ description: "H' must be expressed as a matrix in H₀'s own eigenbasis, since every formula's indices label H₀'s eigenstates specifically." }],
    finalAnswer: "(a) H₀'s own eigenbasis",
  },
  explanation: {
    correctIdea: "This setup step is easy to skip past, but is exactly why the worked example builds x⁴ using annihilationOperator/creationOperator (which act naturally in the Fock basis), rather than in some other representation.",
    whyCorrect: "Matches the lesson's explicit 'Setup: H₀'s eigenbasis' section.",
    whyWrong: ["Choosing an arbitrary basis would make ⟨m|H'|n⟩ meaningless relative to the specific E_n^(0), E_m^(0) values the formula needs."],
  },
};
