import type { ConceptualProblem } from "@/lib/problems/types";

export const whyNormalizationDiffers: ConceptualProblem = {
  meta: {
    slug: "why-normalization-differs",
    title: "Why the Normalization Constant Isn't Always 1/√2",
    course: "identical-particles",
    lesson: "quantum-mechanics/identical-particles/bosons-and-fermions",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["bosons-fermions", "conceptual"],
    prerequisites: ["quantum-mechanics/identical-particles/bosons-and-fermions"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why this platform's engine computes the normalization constant for symmetrize/antisymmetrize dynamically (via normalizeVector), rather than always using a fixed 1/√2 factor.",
    placeholder: "A fixed 1/√2 factor would be correct only when...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["orthogonal", "distinct", "different states", "not equal", "a and b differ", "two different"],
        missingFeedback:
          "Say when the textbook constant is actually the right one. There is a condition on the two single-particle states.",
      },
      {
        phrases: ["a equals b", "same state", "same single-particle state", "identical states", "both the same", "different norm", "not 1/√2"],
        missingFeedback:
          "You have the case where the fixed factor works. Now say what happens in the case it does not cover, and what the constant has to be there instead.",
      },
    ],
    incorrectFeedback: "You answered that computing it dynamically is 'more robust' in general, which is a coding preference rather than a physics reason. Compute the length of the symmetric combination in two situations, one where the two labels name unrelated vectors and one where they name the same vector, and compare the two answers.",
    partialFeedback: "Now say what the norm actually is in the a=b case for the symmetric combination.",
    modelAnswers: [
      "1/sqrt(2) is only right when a and b are two different orthogonal states. If a equals b the symmetrized vector has a different norm and the correct constant is 1/2, so hardcoding 1/sqrt(2) would be wrong there. Computing the norm dynamically covers both without a special case.",
      "The fixed factor assumes the two single-particle states are distinct and orthogonal. At a equals b the cross terms no longer vanish, so the norm is not the same and the fixed constant is not correct. normalizeVector just measures it instead.",
    ],
  },
  hints: [
    { text: "Take a and b to name two vectors with zero overlap, and expand ‖|a⟩⊗|b⟩+|b⟩⊗|a⟩‖². How many of the four cross terms survive?" },
    { text: "Now set b=a and redo the same expansion. Does the sum still consist of two terms with zero overlap, or does it collapse onto one?" },
    { text: "Compare the two norms you just computed. Only one of them is √2, so ask what a hardcoded 1/√2 would leave behind in the other case." },
  ],
  solution: {
    steps: [
      { description: "For orthogonal, individually-normalized a≠b, the unnormalized sum |a⟩⊗|b⟩+|b⟩⊗|a⟩ has norm exactly √2 (its two terms are orthogonal unit vectors), so dividing by √2 is correct." },
      { description: "For a=b, the sum becomes 2|a⟩⊗|a⟩, which has norm exactly 2, not √2, so a fixed 1/√2 factor would leave this case unnormalized, at norm √2 rather than 1." },
      { description: "Computing the norm directly with normalizeVector handles both cases correctly with a single general implementation, rather than needing a special-cased formula for a=b." },
    ],
    finalAnswer: "1/√2 is correct only when a,b are orthogonal and distinct; at a=b the correct normalization constant is 1/2. Dynamic normalization handles both without special-casing.",
  },
  explanation: {
    correctIdea: "This is a concrete illustration of why 'smallest correct implementation' sometimes means computing something dynamically rather than hardcoding a textbook-typical special case.",
    whyCorrect: "The 1/√2 comes from two cross terms vanishing, which happens only when the two single-particle states are orthogonal. Computing the norm from the vector that was actually built covers the coincident case without a branch.",
    whyWrong: ["Assuming 1/√2 always applies would silently produce an unnormalized (and therefore physically wrong) state whenever a=b is passed to symmetrize."],
  },
};
