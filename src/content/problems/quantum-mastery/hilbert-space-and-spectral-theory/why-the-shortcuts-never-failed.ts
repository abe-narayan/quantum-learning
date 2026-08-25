import type { ConceptualProblem } from "@/lib/problems/types";

export const whyTheShortcutsNeverFailed: ConceptualProblem = {
  meta: {
    slug: "why-the-shortcuts-never-failed",
    title: "Why the Earlier Curriculum's Shortcuts Never Produced a Wrong Answer",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/capstone-what-rigor-buys-you",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["capstone", "self-adjointness", "synthesis", "conceptual"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/capstone-what-rigor-buys-you"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Explain why every physically-motivated boundary condition the earlier curriculum used (normalizable at infinity, ψ=0 at a hard wall, finite at the origin) turned out to also be the condition making the relevant operator genuinely self-adjoint — and then explain why the half-line momentum operator is not a counterexample to this course's own argument.",
    placeholder: "Physical finiteness conditions and self-adjointness conditions both come from requiring a boundary term to vanish, so...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["boundary term", "vanish", "boundary contribution"],
      ["half-line", "no self-adjoint extension", "deficiency", "momentum on"],
      ["never needed", "never asked", "sidestep", "did not require"],
    ],
    incorrectFeedback:
      "Address all three: why physical and self-adjoint boundary conditions both trace back to a vanishing boundary term, what the half-line momentum operator's deficiency indices show, and why the main curriculum's actual problems never required that specific operator.",
    partialFeedback: "Good — now explain specifically why the half-line case doesn't contradict the pattern, rather than just naming it as an exception.",
  },
  hints: [
    { text: "Both physical normalizability and mathematical self-adjointness ultimately require the same kind of boundary term (from integration by parts / Lagrange's identity) to vanish." },
    { text: "The half-line momentum operator genuinely has no self-adjoint extension (deficiency indices (1,0)) — this is real, not a hypothetical worry." },
    { text: "But the main curriculum's actual Hamiltonians (finite well, infinite well, hydrogen) are built from p², on the whole line or with u(0)=0, never a bare momentum operator on a half-line — so they never encountered the case where the pattern breaks." },
  ],
  solution: {
    steps: [
      {
        description:
          "Physical finiteness (normalizable at infinity, zero at a hard wall) and mathematical self-adjointness both trace back to making the same boundary term (from integration by parts, or Lagrange's identity in the Sturm-Liouville case) vanish — they're two readings of the same algebraic condition, which is why they tend to coincide.",
      },
      {
        description:
          "The half-line momentum operator is a genuine exception to that coincidence: its deficiency indices are (1,0), unequal, so no domain choice makes it self-adjoint at all — physical intuition ('just set ψ(0)=0') would not have produced a consistent answer here.",
      },
      {
        description:
          "This isn't a contradiction of the pattern, because the main curriculum never asked for that specific operator — every Hamiltonian it solved uses p² (not a bare p) on the whole line, or the radial equation's u(0)=0 condition (where p=1 stays nonzero, a different, non-pathological situation) — so it never crossed into the region where the pattern actually fails.",
      },
    ],
    finalAnswer:
      "Physical and self-adjoint boundary conditions coincide because both require the same boundary term to vanish; the half-line momentum operator shows this coincidence isn't automatic, but the main curriculum's actual problems never needed that specific operator, so they never encountered the failure.",
  },
  explanation: {
    correctIdea:
      "The capstone's central synthesis: rigor didn't retroactively fix anything, because the earlier curriculum's instincts and the rigorous theorems were pointing at the same target for a real, derivable reason — but that reason has a genuine limit, worth knowing in advance.",
    whyCorrect: "Matches the lesson's explicit argument connecting boundary-term vanishing to both physical and mathematical conditions, and its explicit half-line exception.",
    whyWrong: [
      "Saying rigor 'doesn't matter' because nothing in the main curriculum ever broke ignores that the half-line case is a real, worked counterexample just one step removed from problems the curriculum did ask.",
    ],
  },
};
