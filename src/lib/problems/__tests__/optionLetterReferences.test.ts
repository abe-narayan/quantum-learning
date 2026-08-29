import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * ============================================================
 * No hardcoded option letters in problem prose
 * ============================================================
 * Multiple-choice options are displayed in a seeded shuffle (see
 * `src/components/problems/optionOrder.ts`), so an option's authored `id` —
 * which across this corpus is literally "a"/"b"/"c"/"d" — is *not* the letter
 * the reader sees beside it. Any sentence that spelled a letter into its prose
 * ("Option b confuses V02 with a different qubit") therefore named whichever
 * choice happened to land in that slot: for most problems, a different answer
 * entirely. The explanation contradicted the page it was printed on, and
 * nothing in the type system, the renderer or a code review could see it.
 *
 * The fix is structural — `whyWrong` entries name an option by `optionId` and
 * the renderer looks up its *current* letter — but nothing stops the next
 * author from typing the letter again. This test is the guard: it reads every
 * problem source as text and fails on a letter reference anywhere outside the
 * options themselves.
 *
 * Read from disk rather than imported: the problem modules import through the
 * `@/` alias and pull in the quantum engine, which is a slow and irrelevant
 * cost for a check that is purely about the authored text. It also means this
 * sees the source *as written*, including entries the registry generator has
 * not picked up yet.
 */

const PROBLEMS_DIR = path.resolve(import.meta.dirname, "../../../content/problems");

/** Every `.ts` problem source under `src/content/problems`, recursively. */
function problemSourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return problemSourceFiles(full);
    return entry.isFile() && entry.name.endsWith(".ts") ? [full] : [];
  });
}

/**
 * Blanks out every `options: [ ... ]` array, preserving line count and column
 * positions so reported line numbers still point at the real source.
 *
 * The options are exempt because an option's own text may legitimately contain
 * the trigger words — "which answer choice a student picks first", a physics
 * distractor that begins "a superposition of..." — and an option describing
 * itself is not a cross-reference to a letter. Everything else (prompts,
 * hints, solution steps, `whyWrong`, `optionFeedback`,
 * `defaultIncorrectFeedback`) is in scope.
 *
 * Bracket depth is counted with a real string-literal scanner rather than a
 * regex: option text is full of LaTeX, and `\left[ ... \right]` inside a quoted
 * string would otherwise unbalance the count and mask (or fail to mask) the
 * wrong span.
 */
function maskOptionBlocks(source: string): string {
  const chars = [...source];
  const marker = "options:";
  for (let start = source.indexOf(marker); start !== -1; start = source.indexOf(marker, start + 1)) {
    // `optionFeedback:` and friends must not be mistaken for `options:`.
    const before = source[start - 1];
    if (before !== undefined && /[\w$]/.test(before)) continue;

    let open = start + marker.length;
    while (open < chars.length && /\s/.test(chars[open])) open++;
    if (chars[open] !== "[") continue;

    let depth = 0;
    let quote: string | null = null;
    let i = open;
    for (; i < chars.length; i++) {
      const ch = chars[i];
      if (quote) {
        if (ch === "\\") i++;
        else if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch;
        continue;
      }
      if (ch === "[") depth++;
      else if (ch === "]" && --depth === 0) break;
    }

    for (let j = open; j <= Math.min(i, chars.length - 1); j++) {
      if (chars[j] !== "\n") chars[j] = " ";
    }
  }
  return chars.join("");
}

/**
 * A reference to an option by letter: "option b", "options (a)", "answer c",
 * "choice \"d\"". The trailing `\b` is what keeps this usable on real prose —
 * without it, "the answer above" and "a choice about the phase" would both
 * fire. Kept deliberately broad on the leading word: the point is to catch the
 * habit, and a false positive costs one rephrase while a false negative ships
 * a lie to a student.
 *
 * Groups are captured so `isIndefiniteArticle` below can inspect the shape of
 * a hit rather than re-parsing the line.
 */
const LETTER_REFERENCE = /\b(?:option|options|answer|choice)s?(\s*)([("“])?\s*([a-d])\b/gi;

/**
 * The one systematic false positive, carved out deliberately: the English
 * indefinite article. "Each answers a different question", "the choice a
 * student makes first" — the trigger word is a noun and the "a" after it is an
 * article, not a label. Six such sentences exist in the corpus today and every
 * one of them is correct prose; flagging them would push authors to reword
 * writing that was never wrong, which is how a guard test gets disabled.
 *
 * The carve-out is as narrow as the grammar allows: it applies only to the
 * letter "a", only when the letter is undelimited (a real reference in this
 * corpus is written "option (a)" or "Option a." — never bare mid-sentence),
 * and only when a word follows it, which is what makes it an article rather
 * than a label. "Option a." and "options (a), (b)" are still caught.
 */
function isIndefiniteArticle(match: RegExpExecArray, line: string): boolean {
  const [whole, gap, delimiter, letter] = match;
  if (letter.toLowerCase() !== "a" || delimiter !== undefined || gap.length === 0) return false;
  return /^\s+[A-Za-z]/.test(line.slice(match.index + whole.length));
}

/**
 * Fields whose value is a bare string the reader sees as a *statement*, and
 * which the check above cannot see into.
 *
 * `LETTER_REFERENCE` needs a trigger word ("option", "answer", "choice") and
 * then whitespace or a delimiter before the letter. `finalAnswer: "(a)"` has
 * neither: the field name is the only thing playing the role of "answer", and
 * it is separated from the value by a colon the regex never looks past. So a
 * solution whose entire boxed answer was the label of an option sailed through
 * — and the boxed answer is the one line a reader who gives up will read.
 * `correctIdea` and `whyCorrect` sit next to it in `SolutionPanel` and have the
 * same shape, so they are checked here too.
 *
 * These fields have no object form to escape to (see `WhyWrongEntry`, which
 * does): the fix is always to state the answer's content.
 */
const LABEL_BEARING_FIELDS = ["finalAnswer", "correctIdea", "whyCorrect"];

/**
 * A parenthesized option label — "(a)", "( b )" — anywhere in a value.
 *
 * Two things keep real prose and real mathematics out of this, and both are
 * built into the pattern rather than bolted on afterwards:
 *
 *  - The ")" must follow the letter directly. That is the same carve-out
 *    `isIndefiniteArticle` makes above: "an operator (a $2\times2$ matrix)"
 *    puts a word between the letter and the paren, so it is left alone.
 *  - Nothing may be attached to the "(" on its left. An option label stands on
 *    its own; a domain or a function application hangs off a name. "D(A)=D(A†)"
 *    and "H(B)" are mathematics, and this is what tells them apart from a
 *    label. Lowercase-only does the rest, since every option id in this corpus
 *    is lowercase while single-letter operator names are conventionally capital.
 */
const PARENTHESIZED_LABEL = /(?<![A-Za-z0-9_$])\(\s*[a-d]\s*\)/;

/** A value that *is* a label and nothing else: "a", "b.", "C)". */
const LABEL_ONLY_VALUE = /^\s*[a-d]\s*[.:)\]]?\s*$/i;

/**
 * Reads the string literal starting at `open` (which must index a quote),
 * returning its raw contents and the index just past its closing quote.
 *
 * Raw contents: a template literal's `${...}` interpolations are left as
 * written rather than evaluated, which is what we want. Several problems
 * compute their `finalAnswer` from the engine (`` `(${syndrome[0]},...)` ``),
 * and reading them raw keeps the parentheses in that expression from looking
 * like a label.
 */
function readStringLiteral(source: string, open: number): { value: string; end: number } {
  const quote = source[open];
  let i = open + 1;
  for (; i < source.length; i++) {
    if (source[i] === "\\") i++;
    else if (source[i] === quote) break;
  }
  return { value: source.slice(open + 1, i), end: i + 1 };
}

/** Every `<field>: "..."` value in the source, for the fields named above. */
function labelBearingValues(source: string): { field: string; value: string; line: number }[] {
  const found: { field: string; value: string; line: number }[] = [];
  for (const field of LABEL_BEARING_FIELDS) {
    const marker = `${field}:`;
    for (let at = source.indexOf(marker); at !== -1; at = source.indexOf(marker, at + 1)) {
      // `myFinalAnswer:` and the like must not be mistaken for the field.
      const before = source[at - 1];
      if (before !== undefined && /[\w$]/.test(before)) continue;

      let open = at + marker.length;
      while (open < source.length && /\s/.test(source[open])) open++;
      if (!['"', "'", "`"].includes(source[open])) continue;

      const { value } = readStringLiteral(source, open);
      found.push({ field, value, line: source.slice(0, at).split("\n").length });
    }
  }
  return found;
}

const HOW_TO_FIX = [
  "Option letters are assigned at render time from a seeded shuffle of the",
  "options (src/components/problems/optionOrder.ts), so the authored id",
  '("a", "b", ...) is NOT the letter the reader sees. Prose naming a letter',
  "names the wrong choice for most readers.",
  "",
  "Fix it one of two ways:",
  "",
  '  1. Use the object form of a `whyWrong` entry so the UI can render the',
  "     letter that option is actually displayed under:",
  "",
  '         whyWrong: ["Option b confuses the two registers."]',
  "     becomes",
  '         whyWrong: [{ optionId: "b", text: "confuses the two registers" }]',
  "",
  "  2. Anywhere the object form is not available (`optionFeedback`,",
  "     `defaultIncorrectFeedback`, hints, solution steps, prompts), describe",
  "     the option by its content instead of its letter:",
  "",
  '         "Option c forgets to square the amplitude."',
  "     becomes",
  '         "Reading the amplitude as a probability forgets the square."',
  "",
  "See `WhyWrongEntry` in src/lib/problems/types.ts.",
].join("\n");

const HOW_TO_FIX_LABEL = [
  "A boxed answer, or a stated correct idea, that names an option label tells",
  "the reader nothing: the letters come from a seeded shuffle at render time",
  '(src/components/problems/optionOrder.ts), so the authored id ("a", "b", ...)',
  "is not the letter beside that option on their screen.",
  "",
  "There is no object form for these fields. State the answer's content:",
  "",
  '        finalAnswer: "(a)"',
  "  becomes",
  '        finalAnswer: "2 merge-then-split operations."',
  "",
  '        finalAnswer: "(a) Smaller"',
  "  becomes",
  '        finalAnswer: "n̄ gets smaller: raising ω grows the exponential in',
  '                      the denominator."',
  "",
  "A good `finalAnswer` reads on its own, with the option list out of sight.",
].join("\n");

describe("problem prose never hardcodes an option letter", () => {
  const files = problemSourceFiles(PROBLEMS_DIR);

  it("finds the problem corpus on disk", () => {
    // A wrong path would make every check below vacuously pass — the one
    // failure mode a guard test must not have.
    expect(files.length).toBeGreaterThan(400);
  });

  it("has no letter reference outside the authored options", () => {
    const offenders: string[] = [];

    for (const file of files) {
      const masked = maskOptionBlocks(readFileSync(file, "utf8"));
      masked.split("\n").forEach((line, index) => {
        LETTER_REFERENCE.lastIndex = 0;
        for (let match = LETTER_REFERENCE.exec(line); match; match = LETTER_REFERENCE.exec(line)) {
          if (isIndefiniteArticle(match, line)) continue;
          offenders.push(
            `${path.relative(PROBLEMS_DIR, file).replaceAll("\\", "/")}:${index + 1}  …${match[0].trim()}…\n    ${line.trim()}`
          );
          break; // One report per line is enough to send an author to it.
        }
      });
    }

    expect(
      offenders,
      `${offenders.length} hardcoded option-letter reference(s) in problem prose:\n\n` +
        `${offenders.join("\n\n")}\n\n${HOW_TO_FIX}\n`
    ).toEqual([]);
  });

  it("has no solution or explanation field that names an option label", () => {
    const offenders: string[] = [];

    for (const file of files) {
      // Unmasked: these fields live outside `options: [...]` by construction,
      // and masking would only risk blanking a value that spans one.
      const source = readFileSync(file, "utf8");
      for (const { field, value, line } of labelBearingValues(source)) {
        if (!PARENTHESIZED_LABEL.test(value) && !LABEL_ONLY_VALUE.test(value)) continue;
        offenders.push(
          `${path.relative(PROBLEMS_DIR, file).replaceAll("\\", "/")}:${line}\n    ${field}: ${JSON.stringify(value)}`
        );
      }
    }

    expect(
      offenders,
      `${offenders.length} option label(s) standing in for an answer:\n\n` +
        `${offenders.join("\n\n")}\n\n${HOW_TO_FIX_LABEL}\n`
    ).toEqual([]);
  });
});
