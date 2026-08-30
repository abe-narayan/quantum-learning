import type { NumericProblem } from "@/lib/problems/types";

export const blockEncodingSubnormalizationFactorOfAUnitaryBlock: NumericProblem = {
  meta: {
    slug: "block-encoding-subnormalization-factor-of-a-unitary-block",
    title: "Reading the Subnormalization Factor Off a Block",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "numeric",
    tags: ["block-encoding", "lcu", "subnormalization", "operator-norm"],
    prerequisites: ["apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries"],
  },
  question: {
    type: "numeric",
    prompt:
      "A designer wants to apply M = 2X + Z to a system qubit, and follows this lesson's LCU recipe with U₀ = X at coefficient α₀ = 2 and U₁ = Z at coefficient α₁ = 1, on one ancilla qubit (qubit 0) plus the system qubit (qubit 1). Running the resulting PREPARE, SELECT, PREPARE† circuit on all four computational basis states and reassembling the 4×4 unitary column by column, its ancilla-|0⟩ block (rows and columns 00 and 01) comes out as the matrix with entries 1/3 and 2/3 on the top row and 2/3 and -1/3 on the bottom row. That block is not M. It is M divided by some factor c. What is c?",
    inputHint: "a number, to two decimal places if it is not a whole number",
  },
  answer: {
    type: "numeric",
    value: 3,
    tolerance: 0.01,
    incorrectFeedback:
      "Every entry of the given block is the corresponding entry of M divided by the same number, so one entrywise comparison settles it. Then check that the number you read off is the one the construction itself introduced, and not a property of M measured on its own. The lesson's derivation says where the factor comes from: PREPARE contributes one square-root weight and PREPARE† contributes a second, and the two multiply.",
    nearMisses: [
      {
        value: 2.236,
        tolerance: 0.03,
        feedback:
          "2.236 is ‖M‖, the largest singular value of 2X + Z. That number is what the admissibility condition ‖A‖ ≤ 1 is about, not what LCU divides by. Dividing M by its own norm would give a block with entries 0.447 and 0.894, which is not the block you were handed.",
      },
      {
        value: 2,
        feedback:
          "2 is m, the number of unitaries in the sum and the number of ancilla basis states PREPARE spreads over. The factor the construction introduces is built from how large the coefficients are, not from how many of them there are, and here α₀ = 2 and α₁ = 1 are not the same size.",
      },
      {
        value: 5,
        feedback:
          "5 is α₀² + α₁². Squaring is one step too many: PREPARE's amplitude on |i⟩ is the square root of a normalized coefficient, and the two square roots (one from PREPARE, one from PREPARE†) multiply back to the coefficient itself, so what appears in the denominator is a sum of the coefficients rather than of their squares.",
      },
      {
        value: 1,
        feedback:
          "1 would mean the block is M itself, which no unitary can offer: M has an entry of magnitude 2, and every entry of a unitary matrix is bounded by 1. That impossibility is exactly why a subnormalization factor has to exist at all.",
      },
    ],
  },
  hints: [
    { text: "PREPARE does not weight the two ancilla values equally here. The coefficients α₀ = 2 and α₁ = 1 differ, and the amplitude PREPARE puts on |i⟩ is the square root of a normalized coefficient." },
    { text: "Push |0⟩_anc|ψ⟩ through the three stages and collect what multiplies U_i on the branch that survives the ⟨0|_anc projection. Exactly two factors reach that branch: one from PREPARE, one from PREPARE†." },
    { text: "You now have a weighted sum of X and Z that has to equal the given block. Set it against 2X + Z term by term; both terms turn out to carry the same denominator, and that denominator is c." },
  ],
  solution: {
    steps: [
      {
        description:
          "The three-stage sandwich gives $\\langle0|\\text{PREPARE}^\\dagger|i\\rangle\\langle i|\\text{PREPARE}|0\\rangle=\\alpha_i/\\lVert\\alpha\\rVert_1$, so the ancilla-$|0\\rangle$ block is $\\sum_i(\\alpha_i/\\lVert\\alpha\\rVert_1)U_i=M/\\lVert\\alpha\\rVert_1$. Here $\\lVert\\alpha\\rVert_1=\\alpha_0+\\alpha_1=2+1=3$, so $c=3$.",
      },
      {
        description:
          "Check it entrywise. $M=2X+Z=\\begin{pmatrix}1&2\\\\2&-1\\end{pmatrix}$, and $M/3=\\begin{pmatrix}1/3&2/3\\\\2/3&-1/3\\end{pmatrix}$, which is the block the circuit produced.",
      },
      {
        description:
          "Built with this platform's own engine: PREPARE is the rotation $R_y(2\\arccos\\sqrt{2/3})$ on the ancilla, SELECT is an anti-controlled $X$ (a CNOT conjugated by $X$ on the ancilla) followed by a controlled-$Z$, and PREPARE$^\\dagger$ is $R_y(-2\\arccos\\sqrt{2/3})$. Running that sequence on all four basis states reconstructs the $4\\times4$ unitary; $U^\\dagger U$ differs from the identity by $5.6\\times10^{-17}$, and $3\\times$(top-left block) reproduces $2X+Z$ with maximum entrywise deviation $0$.",
      },
      {
        description:
          "The factor is not optional bookkeeping. $\\lVert M\\rVert=\\sqrt5\\approx2.236>1$, so $M$ could not sit inside any unitary unshrunk; the construction shrinks it by $\\lVert\\alpha\\rVert_1=3$, which is more shrinkage than the norm alone would demand, and every downstream result has to be scaled back up by that same $3$.",
      },
    ],
    finalAnswer:
      "c = 3, the ℓ₁ norm ‖α‖₁ = α₀ + α₁ = 2 + 1. The circuit block-encodes M/3, and results read off the ancilla-|0⟩ branch have to be multiplied by 3 to recover M's action.",
  },
  explanation: {
    correctIdea:
      "LCU never block-encodes the operator you asked for. It block-encodes that operator divided by the ℓ₁ norm of its coefficient vector, because PREPARE has to spread a normalized state over the menu of unitaries and PREPARE† collects a second copy of the same square-root weight.",
    whyCorrect:
      "Unitarity caps every entry of U at magnitude 1, so an operator carrying an entry of 2 cannot appear as a literal sub-block; something has to divide it. Which divisor appears is fixed by the construction rather than by M: the amplitude √(αᵢ/‖α‖₁) is applied twice, once on the way in and once on the way out, and the product αᵢ/‖α‖₁ is what multiplies Uᵢ on the surviving branch.",
    whyWrong: [
      "Reaching for ‖M‖ because the lesson's admissibility condition is stated as ‖A‖ ≤ 1. That condition says which operators can be block-encoded at all; it does not compute the factor a particular construction pays. Here the two differ, √5 against 3, and only the second one reproduces the block.",
      "Counting terms instead of weighting them. The number of unitaries m fixes how many ancilla basis states PREPARE has to spread over; it says nothing about how far the operator gets shrunk, which is ‖α‖₁. The two agree only when every coefficient happens to be 1, and here m = 2 against ‖α‖₁ = 3.",
      "Treating the subnormalization as harmless. It is where the technique's cost lives: the success probability of the post-selection falls with the square of this factor, which is why reducing ‖α‖₁ for large Hamiltonians is an open research problem rather than a preprocessing detail.",
    ],
  },
};
