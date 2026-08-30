import type { ConceptualProblem } from "@/lib/problems/types";

export const whyTheShortcutsNeverFailed: ConceptualProblem = {
  meta: {
    slug: "why-the-shortcuts-never-failed",
    title: "Why the Earlier Curriculum's Shortcuts Never Produced a Wrong Answer",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/capstone-what-rigor-buys-you",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["capstone", "self-adjointness", "synthesis", "conceptual"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/capstone-what-rigor-buys-you"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Explain why every physically-motivated boundary condition the earlier curriculum used (normalizable at infinity, ψ=0 at a hard wall, finite at the origin) turned out to also be the condition making the relevant operator genuinely self-adjoint. Then explain why the half-line momentum operator is not a counterexample to this course's own argument.",
    placeholder: "Physical finiteness conditions and self-adjointness conditions both come from requiring a boundary term to vanish, so...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["boundary term", "vanish", "boundary contribution"],
        missingFeedback:
          "Both kinds of condition are doing the same algebraic job. Name the object in Lagrange's identity that each of them exists to kill.",
      },
      {
        phrases: ["half-line", "no self-adjoint extension", "deficiency", "momentum on"],
        missingFeedback:
          "You have the coincidence. The question also asks you to face the exception: name the operator that is symmetric and yet cannot be made self-adjoint at all.",
      },
      {
        phrases: ["never needed", "never asked", "sidestep", "did not require", "never came up", "never arose", "did not arise", "does not arise", "no earlier problem", "never encountered", "ever asked for it", "never uses that operator"],
        missingFeedback:
          "You have the exception. Now say why it does not sink the argument: what is true of every problem the earlier curriculum actually posed?",
      },
    ],
    incorrectFeedback:
      "Three claims are wanted, not one. Say what single quantity both the physical requirement and the mathematical one force to zero, so the coincidence stops looking like luck. Then produce the counterexample the lesson gives: an operator on a restricted region with no self-adjoint completion at all. Then explain why the Hamiltonians the main curriculum actually solved never put a reader in that situation.",
    partialFeedback: "Good. The exception still needs handling rather than merely naming. Say why the case where the pattern breaks never arose in the main curriculum, so that the pattern's success there was earned rather than accidental.",
    modelAnswers: [
      "Both kinds of condition come from the same place: making the boundary term in Lagrange's identity vanish. Requiring the wavefunction to be normalizable, or to die at a wall, is exactly what kills that boundary contribution, which is also what self-adjointness needs. The half-line momentum operator shows the coincidence is not automatic, since it has no self-adjoint extension at all, but the earlier curriculum never needed that operator.",
      "Physical finiteness and self-adjointness both amount to the same boundary term vanishing, so the physically motivated choices were the right ones. Momentum on a half-line is a genuine exception, with no self-adjoint extension, but no earlier problem ever asked for it.",
    ],
  },
  hints: [
    { text: "Both physical normalizability and mathematical self-adjointness ultimately require the same kind of boundary term (from integration by parts, or Lagrange's identity) to vanish." },
    { text: "The half-line momentum operator has no self-adjoint extension at all, with deficiency indices (1,0). That is real, not a hypothetical worry." },
    { text: "The main curriculum's Hamiltonians (finite well, infinite well, hydrogen) are built from p², on the whole line or with u(0)=0, never a bare momentum operator on a half-line, so they never met the case where the pattern breaks." },
  ],
  solution: {
    steps: [
      {
        description:
          "Physical finiteness (normalizable at infinity, zero at a hard wall) and mathematical self-adjointness both trace back to making the same boundary term vanish, whether it arrives from integration by parts or from Lagrange's identity in the Sturm-Liouville case. They are two readings of the same algebraic condition, which is why they tend to coincide.",
      },
      {
        description:
          "The half-line momentum operator is a genuine exception to that coincidence. Its deficiency indices are (1,0), unequal, so no domain choice makes it self-adjoint at all, and physical intuition ('just set ψ(0)=0') would not have produced a consistent answer here.",
      },
      {
        description:
          "This is not a contradiction of the pattern, because the main curriculum never asked for that specific operator. Every Hamiltonian it solved uses p², not a bare p, on the whole line, or the radial equation's u(0)=0 condition (where p=1 stays nonzero, a different and non-pathological situation), so it never crossed into the region where the pattern fails.",
      },
    ],
    finalAnswer:
      "Physical and self-adjoint boundary conditions coincide because both require the same boundary term to vanish; the half-line momentum operator shows this coincidence isn't automatic, but the main curriculum's actual problems never needed that specific operator, so they never encountered the failure.",
  },
  explanation: {
    correctIdea:
      "The capstone's central synthesis: rigor did not retroactively fix anything, because the earlier curriculum's instincts and the rigorous theorems were pointing at the same target for a real, derivable reason. That reason has a genuine limit, worth knowing in advance.",
    whyCorrect: "Both readings, physical and mathematical, come down to the same boundary term being zero, which is why they kept agreeing. The half-line momentum operator has deficiency indices (1,0) and no self-adjoint extension at all, so the agreement is not automatic; the earlier curriculum simply never used that operator.",
    whyWrong: [
      "Saying rigor 'doesn't matter' because nothing in the main curriculum ever broke ignores that the half-line case is a real, worked counterexample just one step removed from problems the curriculum did ask.",
    ],
  },
};
