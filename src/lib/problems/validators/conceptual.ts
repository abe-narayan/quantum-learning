import type { ConceptualAnswer } from "../types";
import type { ValidationResult } from "./types";

/**
 * Deliberately simple, deterministic, and safe: case-insensitive substring
 * matching against author-supplied keyword groups. This is NOT natural-
 * language understanding — a student can technically game it with the
 * right keywords in the wrong context, and a correct answer phrased with
 * none of the listed synonyms will be marked incomplete. It is a
 * documented Phase 1 limitation (see docs/ARCHITECTURE.md §10), not a
 * placeholder for `eval`-ing or otherwise executing the submission, which
 * this system never does.
 *
 * A submission counts as fully correct only if it matches at least one
 * phrase from *every* required concept group (AND across groups, OR
 * within a group).
 */
export function validateConceptual(answer: ConceptualAnswer, rawAnswer: string): ValidationResult {
  const normalized = rawAnswer.trim().toLowerCase();
  if (normalized === "") {
    return { status: "incorrect", message: "Write a short answer before submitting." };
  }

  const matchedGroups = answer.requiredConceptGroups.filter((group) =>
    group.some((phrase) => normalized.includes(phrase.toLowerCase()))
  );

  if (matchedGroups.length === answer.requiredConceptGroups.length) {
    return { status: "correct", message: "That covers the key idea." };
  }

  if (matchedGroups.length > 0) {
    return {
      status: "partial",
      message: answer.partialFeedback ?? "You're partly there, but part of the idea is missing.",
    };
  }

  return { status: "incorrect", message: answer.incorrectFeedback };
}
