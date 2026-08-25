import type { ConceptualProblem } from "@/lib/problems/types";

export const symmetricVersusSelfAdjoint: ConceptualProblem = {
  meta: {
    slug: "symmetric-versus-self-adjoint",
    title: "What Exactly Is the Gap Between Symmetric and Self-Adjoint?",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["self-adjointness", "domains", "conceptual"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Explain precisely what additional condition self-adjointness requires beyond symmetry (⟨φ|Aψ⟩=⟨Aφ|ψ⟩ on D(A)), and why this condition is automatically satisfied for every matrix in finite dimensions.",
    placeholder: "Symmetry only checks the boundary-term / integration-by-parts identity on D(A), while self-adjointness additionally requires...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["domain", "D(A)", "D(A†)", "domain of the adjoint"],
      ["equal", "match", "same", "exactly"],
      ["finite", "matrix", "automatic", "whole space"],
    ],
    incorrectFeedback:
      "Address all three pieces: what domain condition self-adjointness adds, that the domains must match exactly (not just D(A)⊆D(A†)), and why finite dimensions never has to distinguish this.",
    partialFeedback:
      "Good start — now be explicit that D(A)=D(A†) must hold exactly, and connect this to why every finite matrix already satisfies it trivially.",
  },
  hints: [
    { text: "Symmetry is a statement about D(A) only. Self-adjointness compares D(A) to D(A†), a possibly different (larger) set." },
    { text: "It's not enough for D(A) to be contained in D(A†); self-adjointness needs D(A)=D(A†) exactly." },
    { text: "In finite dimensions, every linear operator is automatically defined on the entire space, so D(A)=D(A†)=the whole space trivially — there's no room for the two to differ." },
  ],
  solution: {
    steps: [
      {
        description:
          "Symmetric means ⟨φ|Aψ⟩=⟨Aφ|ψ⟩ holds for φ,ψ restricted to D(A); self-adjoint additionally requires the adjoint's domain D(A†) (the set of φ for which some χ satisfies that identity against every ψ∈D(A)) to equal D(A) exactly, not merely contain it.",
      },
      {
        description:
          "In finite dimensions every linear operator's domain is automatically the whole space ℂⁿ, and so is its adjoint's — so D(A)=D(A†)=ℂⁿ is forced trivially, and symmetric and self-adjoint collapse into the same single condition A=A†.",
      },
    ],
    finalAnswer:
      "Self-adjointness requires D(A)=D(A†) exactly (not just D(A)⊆D(A†)); this is automatic in finite dimensions (both domains are the whole space) but a genuine extra condition on a function space, where an operator like p̂ on a half-line can be symmetric yet admit no self-adjoint extension at all.",
  },
  explanation: {
    correctIdea:
      "The lesson's central distinction: symmetry is a one-domain boundary-term calculation, self-adjointness is a two-domain equality, and only the latter guarantees the physics (real spectrum, unitary time evolution) that Hermitian Operators proved for matrices.",
    whyCorrect:
      "Matches the lesson's explicit definitions and the half-line worked example, where the operator is symmetric on a natural domain but has unequal deficiency indices, so no self-adjoint extension exists.",
    whyWrong: [
      "Saying self-adjoint 'just means A=A†' without addressing domains restates the finite-dimensional shortcut without explaining why it stops being sufficient on a function space.",
    ],
  },
};
