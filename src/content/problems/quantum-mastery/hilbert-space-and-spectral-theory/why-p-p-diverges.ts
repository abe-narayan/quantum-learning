import type { ConceptualProblem } from "@/lib/problems/types";

export const whyPPDiverges: ConceptualProblem = {
  meta: {
    slug: "why-p-p-diverges",
    title: "Why ⟨p|p⟩ Diverges, and Why That's Not a Problem",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["rigged-hilbert-space", "momentum-eigenstates", "conceptual"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Explain directly (using ∫|φ_p(x)|²dx) why ⟨p|p⟩ diverges, and then explain why this does NOT mean the earlier curriculum's use of |p⟩ was mathematically unsound.",
    placeholder: "|φ_p(x)|²=1 everywhere, so ∫|φ_p|²dx = ... Meanwhile, every actual calculation only ever paired |p⟩ against...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["magnitude 1", "|φ_p|²=1", "constant", "never decays"],
      ["diverges", "infinite", "not finite"],
      ["Schwartz", "test function", "wave packet", "nice function", "Φ", "Gelfand"],
    ],
    incorrectFeedback:
      "Address all three: what |φ_p(x)|² equals pointwise, why integrating a nonzero constant over all of ℝ diverges, and what kind of function |p⟩ is actually ever paired against in a real calculation.",
    partialFeedback: "Good — now explain specifically why pairing against a nice (Schwartz/wave-packet) function is what keeps every real calculation finite.",
  },
  hints: [
    { text: "φ_p(x)=e^{ipx/ħ} has |φ_p(x)|²=1 for every x — it never decays." },
    { text: "∫_{-∞}^{∞} 1 dx diverges, so ⟨p|p⟩=∫|φ_p|²dx is infinite by direct computation." },
    { text: "But no real calculation ever computes ⟨p|p⟩ itself — it always pairs |p⟩ against a genuine, decaying wave packet (a Schwartz-class test function), and that integral is always finite." },
  ],
  solution: {
    steps: [
      {
        description: "φ_p(x)=e^{ipx/ħ} has constant magnitude 1 everywhere, so its self-overlap integral is a divergent constant integral.",
        latex: "\\langle p|p\\rangle = \\int_{-\\infty}^{\\infty}|\\phi_p(x)|^2dx = \\int_{-\\infty}^{\\infty}1\\,dx = \\infty",
      },
      {
        description:
          "Every actual use of |p⟩ in the earlier curriculum pairs it against a genuine physical wave packet ψ∈Φ (Schwartz-class, decaying), via ⟨p|ψ⟩=∫φ_p^*(x)ψ(x)dx, which converges because ψ itself decays fast enough — the divergence only ever shows up if you try to pair |p⟩ against itself, which no physical calculation does.",
      },
    ],
    finalAnswer:
      "⟨p|p⟩ diverges because |φ_p|²=1 never decays; this doesn't undermine the earlier curriculum because |p⟩ was only ever paired against genuine decaying wave packets, exactly the pairing the Gelfand triple Φ⊂H⊂Φ′ makes precise.",
  },
  explanation: {
    correctIdea:
      "The lesson's central resolution: the divergence is real and unavoidable if you insist |p⟩∈H, but it never actually threatens any calculation, because every real calculation's use of |p⟩ is a pairing against a nice test function, not a self-overlap.",
    whyCorrect: "Matches the lesson's explicit derivation of ∫|φ_p|²dx=∞ and its Gelfand-triple resolution.",
    whyWrong: [
      "Claiming |p⟩ 'almost' normalizes, or has a 'very large but finite' norm, misstates the actual computation — the integral is exactly infinite, not merely large, and the resolution is a different kind of object, not a rescaled vector.",
    ],
  },
};
