import { conceptGroupPhrases, type ConceptGroup, type ConceptualAnswer } from "../types";
import type { ValidationResult } from "./types";

/**
 * Deliberately simple, deterministic, and safe keyword matching. This is
 * NOT natural-language understanding — a student can technically game it
 * with the right keywords in the wrong context, and a correct answer
 * phrased with none of the listed synonyms will be marked incomplete. It
 * is a documented Phase 1 limitation (see docs/ARCHITECTURE.md §10), not a
 * placeholder for `eval`-ing or otherwise executing the submission, which
 * this system never does.
 *
 * A submission counts as fully correct only if it matches at least one
 * phrase from *every* required concept group (AND across groups, OR
 * within a group).
 *
 * A phrase matches when ANY of three checks passes, each strictly more
 * lenient than the last — so everything the original case-insensitive
 * substring matcher accepted is still accepted, by construction (check 1
 * IS that matcher, unchanged):
 *
 * 1. Legacy: the lowercased phrase is a raw substring of the lowercased
 *    submission.
 * 2. Normalized substring: both sides lowercased, stripped to
 *    `[a-z0-9 ]` with whitespace collapsed, so stray punctuation on
 *    either side ("observed." vs "observed", "can't" vs "cant") no
 *    longer blocks a match.
 * 3. Token subsequence: the phrase's normalized tokens must appear in
 *    order (not necessarily adjacently) in the submission's tokens, where
 *    a submission token matches a phrase token if it starts with it, or
 *    their light stems (trailing "s"/"es" stripped) do. This is what lets
 *    "inner products are preserved" satisfy the phrase
 *    "inner product preserv" despite the interposed "are" and the plural.
 */
export function validateConceptual(answer: ConceptualAnswer, rawAnswer: string): ValidationResult {
  const rawLower = rawAnswer.trim().toLowerCase();
  if (rawLower === "") {
    return { status: "incorrect", message: "Write a short answer before submitting." };
  }

  const submissionNorm = normalize(rawAnswer);
  const submissionTokens = submissionNorm.split(" ").filter(Boolean);

  const groups = answer.requiredConceptGroups;
  const unmatched = groups.filter(
    (group) => !conceptGroupPhrases(group).some((phrase) => phraseMatches(rawLower, submissionNorm, submissionTokens, phrase))
  );

  if (unmatched.length === 0) {
    return { status: "correct", message: "That covers the key idea." };
  }

  const matchedCount = groups.length - unmatched.length;

  // Exactly one idea is blocking correctness and its group names what to
  // say about that: surface the targeted message instead of the generic
  // partial/incorrect feedback.
  if (unmatched.length === 1) {
    const missingFeedback = groupMissingFeedback(unmatched[0]);
    if (missingFeedback !== undefined) {
      return { status: matchedCount > 0 ? "partial" : "incorrect", message: missingFeedback };
    }
  }

  if (matchedCount > 0) {
    return {
      status: "partial",
      message: answer.partialFeedback ?? "You're partly there, but part of the idea is missing.",
    };
  }

  return { status: "incorrect", message: answer.incorrectFeedback };
}

function groupMissingFeedback(group: ConceptGroup): string | undefined {
  return Array.isArray(group) ? undefined : group.missingFeedback;
}

/** Lowercase, strip to `[a-z0-9 ]`, collapse whitespace. Deterministic. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Very light stemming: strip a trailing "es", else a trailing "s" (but not
 * "ss"), only on words long enough that the tail is plausibly a plural or
 * verb inflection. Applied identically to both sides of a comparison, so
 * over-stripping is harmless for matching.
 */
function stem(word: string): string {
  if (word.length > 4 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

function tokensMatch(submissionToken: string, phraseToken: string): boolean {
  return submissionToken.startsWith(phraseToken) || stem(submissionToken).startsWith(stem(phraseToken));
}

function phraseMatches(
  rawLower: string,
  submissionNorm: string,
  submissionTokens: string[],
  phrase: string
): boolean {
  // 1. Legacy behavior, verbatim — the strictly-more-lenient guarantee.
  if (rawLower.includes(phrase.toLowerCase())) return true;

  const phraseNorm = normalize(phrase);
  if (phraseNorm === "") return false;

  // 2. Punctuation/whitespace-insensitive substring.
  if (submissionNorm.includes(phraseNorm)) return true;

  // 3. In-order token subsequence with prefix/stem tolerance.
  const phraseTokens = phraseNorm.split(" ");
  let next = 0;
  for (const token of submissionTokens) {
    if (tokensMatch(token, phraseTokens[next])) {
      next += 1;
      if (next === phraseTokens.length) return true;
    }
  }
  return false;
}
