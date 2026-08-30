import type { ConceptualProblem } from "@/lib/problems/types";

export const whyPPDiverges: ConceptualProblem = {
  meta: {
    slug: "why-p-p-diverges",
    title: "Why ⟨p|p⟩ Diverges, and Why That's Not a Problem",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["rigged-hilbert-space", "momentum-eigenstates", "conceptual"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Explain directly (using ∫|φ_p(x)|²dx) why ⟨p|p⟩ diverges, and then explain why this does not mean the earlier curriculum's use of |p⟩ was mathematically unsound.",
    placeholder: "|φ_p(x)|²=1 everywhere, so ∫|φ_p|²dx = ... Meanwhile, every actual calculation only ever paired |p⟩ against...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["magnitude 1", "modulus squared is 1", "squared magnitude is 1", "constant", "never decays"],
        missingFeedback:
          "Compute the modulus squared of the momentum eigenfunction first. Say what it equals at each point and how it behaves far from the origin.",
      },
      {
        phrases: ["diverges", "infinite", "not finite"],
        missingFeedback:
          "You have the integrand. Now say what integrating it over all of space gives you.",
      },
      {
        phrases: ["Schwartz", "test function", "wave packet", "nice function", "Gelfand", "rigged"],
        missingFeedback:
          "You have the divergence. Now defend the earlier curriculum: say what |p> was ever actually paired with in a real calculation, and why that pairing stays finite.",
      },
    ],
    incorrectFeedback:
      "Three things have to appear, and skipping any one of them leaves the paradox standing. Say what |φ_p(x)|² comes out to at each point x. Say what the integral of that over the whole line does. Then say what |p⟩ is actually ever paired against when a real calculation uses it, because that is what dissolves the apparent contradiction.",
    partialFeedback: "Good. The last piece is about practice rather than algebra: name the kind of object |p⟩ is always paired with in a real calculation, and say why that pairing stays finite even though the self-pairing does not.",
    modelAnswers: [
      "|phi_p(x)|^2 is 1 everywhere and never decays, so the integral over all x is infinite and <p|p> diverges. That does not break anything earlier, because |p> was only ever paired against a genuine normalizable wave packet, and that pairing is what the rigged Hilbert space makes precise.",
      "The modulus squared is a constant, so integrating it over the whole line is not finite. Every real calculation only ever hits |p> with a nice test function from the Schwartz space, so the divergence never enters any actual result.",
    ],
  },
  hints: [
    { text: "φ_p(x)=e^{ipx/ħ} has |φ_p(x)|²=1 at every x. Ask what that says about how it behaves far from the origin." },
    { text: "Now integrate that over the whole real line and say what comes out." },
    { text: "No real calculation ever asks for ⟨p|p⟩ on its own. It always pairs |p⟩ against a genuine, decaying profile. Name the class such profiles belong to, and check that integral instead." },
  ],
  solution: {
    steps: [
      {
        description: "φ_p(x)=e^{ipx/ħ} has constant magnitude 1 everywhere, so its self-overlap integral is a divergent constant integral.",
        latex: "\\langle p|p\\rangle = \\int_{-\\infty}^{\\infty}|\\phi_p(x)|^2dx = \\int_{-\\infty}^{\\infty}1\\,dx = \\infty",
      },
      {
        description:
          "Every actual use of |p⟩ in the earlier curriculum pairs it against a genuine physical wave packet ψ∈Φ (Schwartz-class, decaying), via ⟨p|ψ⟩=∫φ_p^*(x)ψ(x)dx, which converges because ψ itself decays fast enough. The divergence only shows up if you pair |p⟩ against itself, which no physical calculation does.",
      },
    ],
    finalAnswer:
      "⟨p|p⟩ diverges because |φ_p|²=1 never decays. This does not undermine the earlier curriculum, because |p⟩ was only ever paired against genuine decaying wave packets, the pairing the Gelfand triple Φ⊂H⊂Φ′ makes precise.",
  },
  explanation: {
    correctIdea:
      "The lesson's central resolution: the divergence is real and unavoidable if you insist |p⟩∈H, but it never actually threatens any calculation, because every real calculation's use of |p⟩ is a pairing against a nice test function, not a self-overlap.",
    whyCorrect: "|φ_p|² equals 1 at every x, so the self-pairing integrates a nonzero constant over an infinite line and cannot converge. No earlier calculation is damaged by this, because |p⟩ was only ever paired against a decaying profile, and the Gelfand triple Φ ⊂ H ⊂ Φ′ is what makes that pairing legitimate.",
    whyWrong: [
      "Claiming |p⟩ 'almost' normalizes, or has a 'very large but finite' norm, misstates the computation. The integral is infinite, not merely large, and the resolution is a different kind of object, not a rescaled vector.",
    ],
  },
};
