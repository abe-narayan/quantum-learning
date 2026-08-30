import type { NumericAnswer } from "../types";
import type { ValidationResult } from "./types";

/**
 * `rawAnswer` is parsed by an explicit decimal grammar, never `eval` and never
 * a bare `Number(...)`. A submission that isn't a plain decimal or scientific
 * literal ("1/2", "sqrt(2)", "1+1") is rejected as unparseable rather than
 * executed. `Number` alone was too generous in both directions: it accepts
 * "0x1f" (31), "0b101" (5) and "Infinity", none of which a student answering a
 * physics question means, and it rejects "−0.5" written with a real minus sign
 * (U+2212) — which is exactly what you get from copying a value off a rendered
 * page. `parseNumericSubmission` fixes both ends.
 *
 * When the submission is wrong, `answer.nearMisses` (if authored) is
 * checked next: each entry is a recognizable mistake (sign flip, forgot to
 * square, ...) with its own feedback and an optional tolerance window
 * defaulting to the answer's own. Checked only *after* the correct-answer
 * test fails, so a near miss can never shadow the real answer; first
 * matching entry wins, keeping the result deterministic.
 *
 * Tolerance is compared with `<=`, so the boundary is inclusive and a value one
 * ulp outside it is wrong. `toleranceType: "relative"` scales the window by
 * `|value|`; a relative tolerance of 1 or more would make the window reach zero
 * and the opposite sign, which `numeric.test.ts` forbids across the corpus.
 */
export function validateNumeric(answer: NumericAnswer, rawAnswer: string): ValidationResult {
  if (rawAnswer.trim() === "") {
    return { status: "incorrect", message: "Enter a number before submitting." };
  }

  const parsed = parseNumericSubmission(rawAnswer);
  if (parsed === null) {
    return { status: "incorrect", message: unparseableMessage(rawAnswer) };
  }

  const toleranceType = answer.toleranceType ?? "absolute";
  const allowedError = toleranceType === "relative" ? Math.abs(answer.value) * answer.tolerance : answer.tolerance;
  const error = Math.abs(parsed - answer.value);

  if (error <= allowedError) {
    return { status: "correct", message: CORRECT_FALLBACK, note: exactValueNote(answer.value, parsed) };
  }

  for (const nearMiss of answer.nearMisses ?? []) {
    const nearMissTolerance = nearMiss.tolerance ?? answer.tolerance;
    const nearMissAllowedError =
      toleranceType === "relative" ? Math.abs(nearMiss.value) * nearMissTolerance : nearMissTolerance;
    if (Math.abs(parsed - nearMiss.value) <= nearMissAllowedError) {
      return { status: "incorrect", message: nearMiss.feedback };
    }
  }

  return { status: "incorrect", message: answer.incorrectFeedback };
}

/**
 * What a correct numeric answer is told when the problem has no authored
 * `explanation.correctIdea` for `validateAnswer` to use instead.
 *
 * Not "Correct.", which is what this said for the life of the corpus.
 * `Feedback` already prints "Correct" as the result heading, so the whole of
 * the success screen read:
 *
 *   Correct
 *   Correct.
 *
 * The same word twice, and nothing else — against a wrong answer that gets a
 * targeted sentence naming the specific mistake and a block of onward links.
 * Getting the problem right was strictly the poorer experience, which is the
 * wrong way round for the one moment a reader has earned something.
 *
 * Every problem in the corpus authors a `correctIdea`, so in practice this
 * string is a fallback for a data shape rather than a message readers see;
 * it still says something rather than nothing, because a fallback nobody
 * checks is exactly where "Correct." came back last time.
 */
const CORRECT_FALLBACK = "That is the value the problem asks for.";

/**
 * The exact value, when the reader's accepted answer is not already it.
 *
 * A tolerance window means "right", not "identical": a reader who computes
 * 0.92 against an answer of 0.9216 has done the physics and is one rounding
 * away from the number. Showing the exact value there is the one useful thing
 * a grader can add that no authored sentence can, because it depends on what
 * *this* reader typed. Silent when they typed it exactly, where repeating
 * their own answer back is noise.
 *
 * `toPrecision(12)` then back through `Number` for the same reason
 * `AnswerInput.formatNumberForHint` does it: an answer computed from the
 * quantum engine is a float, and printing 0.9216000000000001 to someone who
 * just got it right would be a worse message than none.
 */
function exactValueNote(value: number, parsed: number): string | undefined {
  if (parsed === value) return undefined;
  const exact = String(Number(value.toPrecision(12)));
  // Also silent when the reader's own text rounds to the same digits we would
  // print: "the exact value is 0.92" under an answer of 0.92 reads as a
  // correction that corrects nothing.
  return String(Number(parsed.toPrecision(12))) === exact ? undefined : `The exact value is ${exact}.`;
}

/**
 * Why a submission was not a number, in the student's terms.
 *
 * The grader's answer to every unparseable submission used to be the same
 * sentence: "That does not look like a number." That is true and useless. The
 * three shapes below are what students actually type into a field whose own
 * format spec says "type a plain number", and each of them is a *correct*
 * value expressed in a form the parser does not read — a unit the prompt asked
 * for ("3.35 eV"), an expression it deliberately refuses to evaluate
 * ("1/sqrt(2)"), a percentage ("50%"). Telling someone their right answer does
 * not look like a number, when the fix is to delete two characters, is the
 * numeric grader's version of marking a correct student wrong.
 *
 * Recognition only. None of these is accepted: a unit cannot be checked
 * against the one the problem meant (eV and keV differ by a thousand and read
 * the same to a parser), and evaluating an expression means running it. The
 * message says what to change.
 */
function unparseableMessage(rawAnswer: string): string {
  const trimmed = rawAnswer.trim();
  if (/^[-+−–—－]?[\d.,\s]*\d\s*%$/.test(trimmed)) {
    return "Enter the value itself rather than a percentage. If the answer is one half, that is 0.5.";
  }
  if (/^[-+−–—－]?[\d.,\s]*\d\s*[^\d\s.,]+$/.test(trimmed)) {
    return "Enter the number on its own, without the unit.";
  }
  if (/[/^√]|\bsqrt\b|\bpi\b|π/i.test(trimmed)) {
    return "Expressions are not evaluated here. Work the value out and enter it as a decimal, for example 0.707 rather than 1/sqrt(2).";
  }
  return "That does not look like a number. Enter a decimal value, for example 0.5.";
}

/** Optional decimal, optional exponent. No hex, no octal, no `Infinity`. */
const DECIMAL_LITERAL = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

/** "1,234,567" or "1,234.5" — grouped thousands, never a decimal comma. */
const GROUPED_THOUSANDS = /^[+-]?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/;

/**
 * The submission as a finite number, or `null` if it is not a plain decimal.
 *
 * Tolerant of what a student actually types — a typographic minus sign, spaces
 * inside the number, thousands separators — and intolerant of everything else,
 * so the set of accepted strings is a grammar rather than whatever `Number`
 * happens to do. A decimal comma ("0,5") is rejected rather than guessed at:
 * "1,5" is 1.5 to half the world and 15 to the other half, and silently
 * picking one would mark a correct answer wrong.
 */
export function parseNumericSubmission(rawAnswer: string): number | null {
  const cleaned = rawAnswer
    .trim()
    // U+2212 minus, U+2013/U+2014 dashes, and the full-width hyphen all read as
    // a minus sign to a person and as garbage to `Number`.
    .replace(/[−–—－]/g, "-")
    // Spaces (including the narrow no-break space some locales group with) and
    // underscores are digit grouping, not content.
    .replace(/[\s_]/g, "")
    // A sentence's worth of punctuation on the end is not part of the number.
    // Without this the grammar was inconsistent rather than strict: "5." parsed
    // as 5 (the decimal point may be trailing) while "0.5." did not parse at
    // all, so whether a full stop cost you the answer depended on whether the
    // answer happened to be an integer. Only a trailing run is removed, so
    // "1,234" keeps its separator and "0,5" is still refused rather than
    // guessed at.
    .replace(/[.,;!?]+$/, "");

  const withoutGrouping = GROUPED_THOUSANDS.test(cleaned) ? cleaned.replace(/,/g, "") : cleaned;
  if (!DECIMAL_LITERAL.test(withoutGrouping)) return null;

  const parsed = Number(withoutGrouping);
  return Number.isFinite(parsed) ? parsed : null;
}
