import type { NumericProblem } from "@/lib/problems/types";

/** sin^2(ka) = 1/2 has its first positive root at ka = pi/4. */
const value = Math.PI / 4;

export const hardSphereCrossSectionAtKaHalf: NumericProblem = {
  meta: {
    slug: "hard-sphere-cross-section-at-ka-half",
    title: "Where the Hard Sphere Reaches Half Its Unitarity Bound",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["scattering", "partial-waves", "s-matrix", "unitarity"],
    prerequisites: [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix",
    ],
  },
  question: {
    type: "numeric",
    prompt:
      "For a hard sphere of radius a the s-wave phase shift is exactly δ₀ = −ka, so σ₀ = (4π/k²)sin²(ka). Unitarity of the S-matrix caps any single partial wave, and for l=0 the cap is σ₀^max = 4π/k², reached when the phase shift passes through a quarter turn. At what value of ka does the hard sphere's s-wave cross section first reach exactly half of that cap?",
    inputHint: "the value of ka in radians, to 4 decimal places",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.002,
    incorrectFeedback:
      "Both the cross section and the cap carry the same 4π/k², so form their ratio before putting any numbers in and watch what survives. Set what is left equal to one half, and remember that what is left is a squared sine.",
    nearMisses: [
      {
        value: 1 / Math.sqrt(2),
        tolerance: 0.002,
        feedback:
          "That is sin(ka), stopped one step early. The question asks for ka itself, so the inverse sine still has to be taken.",
      },
      {
        value: Math.PI / 6,
        tolerance: 0.002,
        feedback:
          "That is arcsin(1/2), which solves sin(ka) = 1/2. The cross section is proportional to the square of the sine, so the condition to solve is sin²(ka) = 1/2.",
      },
      {
        value: Math.PI / 2,
        tolerance: 0.002,
        feedback:
          "That is where the s-wave saturates the cap completely, with sin²(ka) = 1. Half the cap is reached earlier, on the way up.",
      },
      {
        value: 0.5,
        tolerance: 0.002,
        feedback:
          "This looks like a comparison against the low-energy limit 4πa² instead of against the unitarity cap. The two denominators differ by a factor of (ka)², which is why the cap ratio depends on ka so differently.",
      },
    ],
  },
  hints: [
    {
      text: "Two cross sections are being compared, and both of them carry a factor of 4π/k². Write the ratio down symbolically before evaluating anything.",
    },
    {
      text: "The ratio depends on ka alone; the sphere's radius and the wavenumber have both dropped out. Set that ratio equal to one half, and note that it is the square of a sine rather than the sine itself.",
    },
    {
      text: "You now need the angle whose squared sine is one half. Undo the square first, then the sine, and give ka in radians rather than degrees.",
    },
  ],
  solution: {
    steps: [
      {
        description: "Form the ratio to the cap. Every factor except the sine cancels, which is what makes the answer a pure number independent of the sphere.",
        latex: "\\frac{\\sigma_0}{\\sigma_0^{\\max}} = \\frac{(4\\pi/k^2)\\sin^2(ka)}{4\\pi/k^2} = \\sin^2(ka)",
      },
      {
        description: "Impose the half-cap condition and take the first positive root.",
        latex: "\\sin^2(ka) = \\tfrac12 \\;\\Rightarrow\\; \\sin(ka) = \\tfrac{1}{\\sqrt2} \\;\\Rightarrow\\; ka = \\tfrac{\\pi}{4} \\approx 0.7854",
      },
      {
        description:
          "For comparison, the more familiar ratio σ₀/(4πa²) equals sin²(ka)/(ka)² and is still about 0.92 at ka = 0.5, whereas the cap ratio there is only about 0.23. The two comparisons answer different questions and behave differently.",
      },
    ],
    finalAnswer: "ka = π/4 ≈ 0.7854",
  },
  explanation: {
    correctIdea:
      "Measuring a partial-wave cross section against its unitarity cap rather than against its low-energy value removes every dimensionful quantity, so what is left is the phase shift and nothing else. The hard sphere's cross section is then simply sin²δ₀ of the maximum a single partial wave is permitted.",
    whyCorrect:
      "Dividing by 4π/k² leaves sin²(ka), so half the cap means sin(ka) = 1/√2 and ka = π/4. That the answer is a pure number, with no reference to a or k, is the signature of a bound that unitarity fixes for every s-wave scatterer alike.",
    whyWrong: [
      "Solving sin(ka) = 1/2 rather than sin²(ka) = 1/2 drops the square that the cross section carries.",
      "Comparing against 4πa² instead of against 4π/k² divides by a quantity that scales differently in ka, and answers a question about the low-energy limit rather than about unitarity.",
    ],
  },
};
