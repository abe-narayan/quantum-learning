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
      { id: "c", text: "Any orthonormal basis; the choice does not matter" },
      { id: "d", text: "H′'s own eigenbasis" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The position basis is relevant only if H₀ itself happens to be diagonal there. For the harmonic oscillator's H₀, the natural basis is the number (Fock) basis, not position.",
      c: "The formulas' E_n^(0) terms reference H₀'s eigenvalues at labeled states n, which makes sense only if the matrix indices n,m label H₀'s eigenstates.",
      d: "Diagonalizing H′ itself would defeat the purpose: perturbation theory exists to avoid solving the full (H₀+H′) problem directly.",
    },
    defaultIncorrectFeedback: "The indices n, m in every formula label H₀'s eigenstates, so H' must be expressed as a matrix in that same basis.",
  },
  hints: [
    { text: "The formulas reference E_n^(0) and E_m^(0), which are H₀'s eigenvalues at states labeled n, m." },
    { text: "For H'_mn=⟨m⁽⁰⁾|H'|n⁽⁰⁾⟩ to make sense, the bras and kets must be H₀'s eigenstates." },
    { text: "This is why this course's worked example builds the x⁴ matrix directly in the harmonic oscillator's Fock (number) basis." },
  ],
  solution: {
    steps: [{ description: "The indices n and m in H'_mn are the same labels that appear in E_n^(0) and E_m^(0), and those are H₀'s eigenvalues. For the two to refer to the same states, H' must be written in H₀'s own eigenbasis." }],
    finalAnswer: "H₀'s own eigenbasis, {|n⁽⁰⁾⟩}, since the same indices label the unperturbed energies in the denominators.",
  },
  explanation: {
    correctIdea: "The matrix indices and the energy labels in the denominators are the same indices, which pins the basis down: it has to be the one that diagonalizes H₀.",
    whyCorrect: "The denominators are differences of unperturbed energies labelled by the same indices m and n that index the matrix elements. That forces the two labels to mean the same thing, which is only true in the basis that diagonalizes H₀.",
    whyWrong: [
      { optionId: "b", text: "Fixes a basis in advance. Position is right only when H₀ happens to be diagonal there, which the harmonic oscillator's H₀ is not." },
      { optionId: "c", text: "Drops the coupling between the matrix indices and the energy labels. Change basis and E_n^(0) no longer refers to the state H'_mn is indexed by." },
      { optionId: "d", text: "Diagonalizes the wrong operator, and doing so would require solving the problem perturbation theory exists to avoid." },
    ],
  },
};
