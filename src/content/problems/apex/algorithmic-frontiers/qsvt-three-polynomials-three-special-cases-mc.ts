import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const qsvtThreePolynomialsThreeSpecialCasesMc: MultipleChoiceProblem = {
  meta: {
    slug: "qsvt-three-polynomials-three-special-cases-mc",
    title: "Three Polynomials, Three Algorithms",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/the-quantum-singular-value-transformation",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "multiple-choice",
    tags: ["qsvt", "quantum-signal-processing", "hamiltonian-simulation", "amplitude-amplification", "linear-systems"],
    prerequisites: ["apex/algorithmic-frontiers/the-quantum-singular-value-transformation"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "One QSVT circuit template is run three times on the same block encoding of a Hermitian A. Only the phase sequence Φ changes, so only the polynomial P changes. The three targets are (i) a truncated Jacobi-Anger expansion of $e^{-ixt}$, (ii) a bounded polynomial tracking $1/x$ everywhere outside a regularized window around $x=0$, and (iii) a steep Chebyshev polynomial carrying small $x$ sharply toward 1. Which pairing of each target with the algorithm it recovers, together with the reason, is right?",
    options: [
      {
        id: "a",
        text: "(i) Hamiltonian simulation, (ii) linear systems, (iii) amplitude amplification, because P lands on the singular values, so approximating $e^{-ixt}$ evolves them, $1/x$ inverts them, and steepening raises a small one.",
      },
      {
        id: "b",
        text: "(i) Hamiltonian simulation, (ii) amplitude amplification, (iii) linear systems, because $1/x$ grows without bound at zero, which is what lifting a small amplitude needs, while a bounded Chebyshev $T_d$ suits a solver.",
      },
      {
        id: "c",
        text: "(i) amplitude amplification, (ii) linear systems, (iii) Hamiltonian simulation, because $e^{-ixt}$ rotates a two-dimensional subspace the way a Grover iterate does, while a steep real polynomial tracks time evolution.",
      },
      {
        id: "d",
        text: "(i) Hamiltonian simulation, (ii) linear systems, (iii) amplitude amplification, because P lands on the singular vectors, rotating each $|u_i\\rangle$ into whichever subspace that particular algorithm reads out at the end.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The shape of $1/x$ near zero is suggestive and it is the wrong cue. Amplitude amplification wants a polynomial that is bounded by 1 on $[-1,1]$, since QSP can only realize bounded polynomials, and that carries a small σ up toward 1: a Chebyshev polynomial does exactly that. The $1/x$ approximation is large where the matrix is nearly singular because $A^{-1}$ is, which is the linear-systems problem, not the amplification problem.",
      c: "A Grover iterate is indeed a rotation in a two-dimensional subspace, but so is every QSVT layer: the whole construction is built out of $W(\\sigma_i)$ rotations inside decoupled $\\mathcal H_i$. What separates the cases is which polynomial the sequence realizes, and $e^{-ixt}$ is the one whose truncation reproduces time evolution, not the one that steepens small singular values.",
      d: "The pairing is right and the mechanism is not, and the mechanism is the whole theorem. QSVT produces $P(A)=\\sum_i P(\\sigma_i)|u_i\\rangle\\langle v_i|$: the singular vectors on both sides are the ones $A$ already had, untouched, and only the numbers multiplying them change. A construction that moved the singular vectors would not be a function of $A$ at all.",
    },
    defaultIncorrectFeedback:
      "Two things have to be right at once: which polynomial belongs to which algorithm, and what the polynomial is applied to. An answer that lands the pairing on a mechanism the theorem does not claim is not the better answer.",
  },
  hints: [
    { text: "Write the theorem's output down before matching anything: it says which objects P is evaluated on and which objects come through the construction unchanged." },
    { text: "For each target, ask what the corresponding algorithm wants done to a number in $[0,1]$. One wants it turned into a phase, one wants it turned into its reciprocal, one wants a small value made large." },
    { text: "Two of the four readings agree on the pairing and disagree on the mechanism. Settle that half against the boxed formula for $P(A)$, and ask which factor in $\\sum_i P(\\sigma_i)|u_i\\rangle\\langle v_i|$ the phase sequence is able to change." },
  ],
  solution: {
    steps: [
      {
        description:
          "The theorem fixes the mechanism first: for a block-encoded $A=\\sum_i\\sigma_i|u_i\\rangle\\langle v_i|$, the QSVT sequence block-encodes $P(A)=\\sum_iP(\\sigma_i)|u_i\\rangle\\langle v_i|$. The singular vectors are carried through as they stood; the only thing a phase sequence can change is the number attached to each one.",
      },
      {
        description:
          "Target (i): $e^{-ixt}$ is not a polynomial, but its truncated Jacobi-Anger (Chebyshev) expansion is, at a degree growing with $t$ and $\\log(1/\\varepsilon)$. Applying it to $H$'s singular values reproduces $e^{-iHt}$ to accuracy $\\varepsilon$, which is Hamiltonian simulation, at the query complexity Low and Chuang proved near-optimal.",
      },
      {
        description:
          "Target (ii): $1/x$ is unbounded at the origin, so no phase sequence realizes it; a bounded polynomial matching it away from a regularized window does exist, and applying that one produces a state proportional to $A^{-1}|b\\rangle$. That is the QSVT-based linear-systems solver that supersedes HHL's phase-estimation construction.",
      },
      {
        description:
          "Target (iii): a steep polynomial pushing small $\\sigma=\\sqrt p$ toward 1 is amplitude amplification, generalized from Grover's reflection about the uniform superposition to a reflection about whatever state-preparation circuit is on hand. One call to the block encoding is the $d=1$ case; a full Grover iterate, being two reflections, is $d=2$.",
      },
    ],
    finalAnswer:
      "(i) Hamiltonian simulation, (ii) linear systems, (iii) amplitude amplification. P is applied to the singular values; the singular vectors pass through unchanged, which is why one circuit template with three phase sequences recovers three separately-invented algorithms.",
  },
  explanation: {
    correctIdea:
      "The three algorithms differ only in what they want done to a number between 0 and 1, and QSVT is the machine that does an arbitrary bounded polynomial to every such number in a matrix's spectrum at once.",
    whyCorrect:
      "Each singular value sits in its own two-dimensional invariant subspace where the block encoding acts exactly as the QSP rotation $W(\\sigma_i)$, so a single globally-chosen phase sequence evaluates the same P at every σᵢ in parallel. Turning σ into a phase gives time evolution, into its reciprocal gives an inverse, into something near 1 gives amplification, and the singular vectors never move because nothing in the sequence acts on the register they live in.",
    whyWrong: [
      "Reading a polynomial's growth near the origin as amplification. Amplification needs a bounded map that lifts small inputs toward 1; a reciprocal is unbounded, which is precisely why the linear-systems case needs a regularized window and pays for it in condition number.",
      "Matching by mathematical genre rather than by the polynomial. Every case in the construction is a rotation in a two-dimensional subspace, so 'it is a rotation, therefore Grover' selects nothing.",
      "Moving the transformation onto the singular vectors. The whole reason one circuit serves every matrix dimension is that the invariant subspaces are decoupled and untouched; a construction that rotated the singular vectors would not be a polynomial of A.",
    ],
  },
};
