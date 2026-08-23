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
      ["orthogonal", "a≠b", "distinct"],
      ["a=b", "same state", "different norm", "not 1/√2"],
    ],
    incorrectFeedback: "Address both cases explicitly: when a,b are distinct/orthogonal (where 1/√2 happens to be correct) and when a=b (where it is not).",
    partialFeedback: "Good — now be explicit about what the actual norm is in the a=b case for the symmetric combination.",
  },
  hints: [
    { text: "For orthogonal, normalized a≠b: ‖|a⟩⊗|b⟩+|b⟩⊗|a⟩‖²=2, so 1/√2 is exactly right." },
    { text: "For a=b: |a⟩⊗|a⟩+|a⟩⊗|a⟩=2|a⟩⊗|a⟩, which already has norm 2, not √2 — a fixed 1/√2 factor would leave it unnormalized." },
    { text: "Computing the norm dynamically (normalizeVector) handles both cases correctly with one general implementation." },
  ],
  solution: {
    steps: [
      { description: "For orthogonal, individually-normalized a≠b, the unnormalized sum |a⟩⊗|b⟩+|b⟩⊗|a⟩ has norm exactly √2 (its two terms are orthogonal unit vectors), so dividing by √2 is correct." },
      { description: "For a=b, the sum becomes 2|a⟩⊗|a⟩, which has norm exactly 2, not √2 — a fixed 1/√2 factor would leave this case unnormalized (norm √2, not 1)." },
      { description: "Computing the norm directly with normalizeVector handles both cases correctly with a single general implementation, rather than needing a special-cased formula for a=b." },
    ],
    finalAnswer: "1/√2 is correct only when a,b are orthogonal and distinct; at a=b the correct normalization constant is 1/2, not 1/√2 — dynamic normalization handles both without special-casing.",
  },
  explanation: {
    correctIdea: "This is a concrete illustration of why 'smallest correct implementation' sometimes means computing something dynamically rather than hardcoding a textbook-typical special case.",
    whyCorrect: "Matches the lesson's explicit Common Mistakes point about normalization.",
    whyWrong: ["Assuming 1/√2 always applies would silently produce an unnormalized (and therefore physically wrong) state whenever a=b is passed to symmetrize."],
  },
};
