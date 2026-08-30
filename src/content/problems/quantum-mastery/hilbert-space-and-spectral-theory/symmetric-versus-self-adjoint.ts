import type { ConceptualProblem } from "@/lib/problems/types";

export const symmetricVersusSelfAdjoint: ConceptualProblem = {
  meta: {
    slug: "symmetric-versus-self-adjoint",
    title: "What Exactly Is the Gap Between Symmetric and Self-Adjoint?",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness",
    difficulty: "master",
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
      {
        phrases: [
          "domain of the adjoint",
          "adjoint's domain",
          "domain of A dagger",
          "adjoint has its own domain",
          "where the adjoint lives",
        ],
        missingFeedback:
          "Symmetry is checked on the vectors A itself is defined on, and nothing more. Self-adjointness compares that collection with a second one belonging to A†. Name the standard word for such a collection; it is the word your answer is missing.",
      },
      {
        phrases: [
          "domains are equal",
          "domains must be equal",
          "domains coincide",
          "same domain",
          "equal domain",
          "domains match",
          "both domains",
          "domains agree",
          "the same set of vectors",
        ],
        missingFeedback:
          "You have named the two collections but not the relation required between them. Containment one way round is what symmetry already gives you. Self-adjointness demands more than that; say exactly how much more.",
      },
      {
        phrases: ["finite", "matrix", "automatic", "whole space", "entire space"],
        missingFeedback:
          "You have the extra condition. Now say why nobody ever meets it in a linear algebra course: on what set of vectors is an operator in n dimensions defined, and on what set is its adjoint?",
      },
    ],
    incorrectFeedback:
      "Symmetry and self-adjointness are checked against different things, and the answer has to say what. Symmetry asks only that ⟨Aψ,φ⟩ = ⟨ψ,Aφ⟩ hold for vectors A is already defined on. Self-adjointness asks something further about where A† is defined, and 'contained in' is too weak. Then explain why the distinction never came up in the earlier curriculum's setting, where every operator is defined everywhere.",
    partialFeedback:
      "Good start. Two things still need stating exactly: that 'contained in' is too weak a relation between the two collections of vectors involved, and why the earlier curriculum never had to notice, because there every operator is defined everywhere.",
    modelAnswers: [
      "Symmetry only checks the identity on D(A). Self-adjointness additionally requires that the domain of the adjoint is not bigger: the two domains must be equal, not merely nested. In finite dimensions every matrix is defined on the whole space and so is its adjoint, so the domains coincide automatically and the distinction never shows up.",
      "The extra condition is an equality of domains. The adjoint has its own domain, and self-adjointness demands the same set of vectors. For a matrix both are the entire space, so it holds automatically.",
    ],
  },
  hints: [
    { text: "Symmetry is a statement about the vectors A is defined on, and only those. Self-adjointness compares that collection with a possibly larger one belonging to A†." },
    { text: "Containment one way round is not enough. Say what the stronger requirement is." },
    { text: "In the setting the earlier curriculum worked in, every operator is defined on every vector, and so is its adjoint, so there is no room for the two collections to differ." },
  ],
  solution: {
    steps: [
      {
        description:
          "Symmetric means ⟨φ|Aψ⟩=⟨Aφ|ψ⟩ holds for φ,ψ restricted to D(A); self-adjoint additionally requires the adjoint's domain D(A†) (the set of φ for which some χ satisfies that identity against every ψ∈D(A)) to equal D(A) exactly, not merely contain it.",
      },
      {
        description:
          "In finite dimensions every linear operator's domain is the whole space ℂⁿ, and so is its adjoint's, so D(A)=D(A†)=ℂⁿ is forced trivially and symmetric and self-adjoint collapse into the same single condition A=A†.",
      },
    ],
    finalAnswer:
      "Self-adjointness requires the adjoint's domain to equal D(A) exactly, not merely to contain it. In finite dimensions both domains are the whole space, so the requirement holds automatically and the distinction never surfaces; on a function space it is a genuine extra condition, and p̂ on a half-line is symmetric while admitting no self-adjoint extension at all.",
  },
  explanation: {
    correctIdea:
      "The lesson's central distinction: symmetry is a one-domain boundary-term calculation, self-adjointness is a two-domain equality, and only the latter guarantees the physics (real spectrum, unitary time evolution) that Hermitian Operators proved for matrices.",
    whyCorrect:
      "Symmetry constrains A only on the vectors it is defined for; self-adjointness additionally pins down where A† is defined, and containment one way round is not enough. The half-line momentum operator shows the gap is real: it is symmetric, its deficiency indices are unequal, and no choice of domain repairs it.",
    whyWrong: [
      "Saying self-adjoint 'just means A=A†' without addressing domains restates the finite-dimensional shortcut without explaining why it stops being sufficient on a function space.",
    ],
  },
};
