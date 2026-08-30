import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * No em dashes in reader-facing content.
 *
 * This is a house rule in `CLAUDE.md` and it has been enforced by nothing but
 * grep, which is how it failed the first time. Getting the corpus to zero took
 * two rounds and 386 corrections, because a fork's "none remaining" self-report
 * was wrong for 22 files. A rule that is real enough to spend 386 edits on is
 * real enough to have a test.
 *
 * Two scopes, drawn where the line can be drawn honestly.
 *
 * **`src/content/**`** is unambiguous: every string in there is lesson prose,
 * problem prose, a hint, a solution or a caption, and all of it reaches a
 * reader.
 *
 * **`src/**\/*.tsx` outside tests** is where UI copy lives. Comments are
 * stripped first, because an em dash in a code comment is fine and this
 * codebase uses them heavily there.
 *
 * `.ts` files are deliberately NOT covered. The only em dashes left in them
 * are inside regex character classes that match the character on purpose,
 * such as `CLAUSE_BREAK_PUNCTUATION = /[.;:!?\n—]/` in the conceptual
 * validator and the unicode-minus normalisation in the numeric one. Telling a
 * regex literal from a string literal needs a parser rather than a regex, and
 * a test that had to carry an allowlist of "these em dashes are fine" would
 * rot into noise. UI strings in `.tsx` cover the reader-facing risk; the rest
 * is code.
 *
 * ## What this does not forbid
 *
 * **En dashes (U+2013) are correct typography and are left alone.** The corpus
 * uses 111 of them and every one that was inspected is right: name pairs
 * (Choi-Jamiolkowski, Cauchy-Schwarz, Fuchs-van de Graaf), numeric and page
 * ranges (119-130, 2000-2002), and axis pairs (the x-z cross-section). Banning
 * those would be a worse rule, not a stricter one.
 *
 * The characters below are banned because each is a way of writing the same
 * parenthetical break the em dash rule exists to remove, so allowing them
 * would let the rule be evaded by codepoint.
 */

const BANNED = [
  { char: "—", name: "em dash (U+2014)" },
  { char: "―", name: "horizontal bar (U+2015)" },
  { char: "⸺", name: "two-em dash (U+2E3A)" },
  { char: "⸻", name: "three-em dash (U+2E3B)" },
];

const CONTENT_ROOT = path.join(process.cwd(), "src/content");

function collect(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...collect(full));
    else if (/\.(mdx|ts)$/.test(entry.name)) found.push(full);
  }
  return found;
}

const files = collect(CONTENT_ROOT);

const SRC_ROOT = path.join(process.cwd(), "src");

/** Every `.tsx` under `src/`, minus test files and their directories. */
function collectUi(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "__tests__") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...collectUi(full));
    else if (entry.name.endsWith(".tsx") && !entry.name.includes(".test.")) found.push(full);
  }
  return found;
}

const uiFiles = collectUi(SRC_ROOT);

describe("reader-facing prose", () => {
  it("scans the whole content corpus, so a pass cannot be vacuous", () => {
    // 219 lessons plus 556 problems, so the floor is far below the real total
    // but high enough that a broken walk fails loudly instead of silently
    // reporting zero offenders across zero files.
    expect(files.length).toBeGreaterThan(700);
  });

  it("contains no em dashes or their longer variants", () => {
    const offenders = scan(files, (file) => readFileSync(file, "utf8"), CONTENT_ROOT);

    expect(
      offenders,
      "Replace each one with punctuation that makes grammatical sense in that " +
        "sentence: a period, comma, colon, semicolon, parentheses, or a " +
        "rewrite. Do not do a blind character substitution, and do not swap in " +
        "an en dash to get past this test."
    ).toEqual([]);
  });

  it("has no em dashes in UI copy either", () => {
    expect(uiFiles.length, "no .tsx components found; the walk has rotted").toBeGreaterThan(80);

    const offenders = scan(uiFiles, (file) => stripComments(readFileSync(file, "utf8")), SRC_ROOT);

    expect(
      offenders,
      "an em dash in a JSX string or JSX text reaches the reader the same way " +
        "lesson prose does. Comments are already excluded, so these are real " +
        "UI strings."
    ).toEqual([]);
  });
});

/** Blanks out `//` and block comments so only real code and copy is checked. */
function stripComments(source: string): string {
  const out: string[] = [];
  let inBlock = false;
  for (const raw of source.split(/\r?\n/)) {
    let line = raw;
    if (inBlock) {
      const end = line.indexOf("*/");
      if (end === -1) {
        out.push("");
        continue;
      }
      line = line.slice(end + 2);
      inBlock = false;
    }
    for (;;) {
      const start = line.indexOf("/*");
      if (start === -1) break;
      const end = line.indexOf("*/", start + 2);
      if (end === -1) {
        line = line.slice(0, start);
        inBlock = true;
        break;
      }
      line = line.slice(0, start) + line.slice(end + 2);
    }
    const lineComment = line.indexOf("//");
    if (lineComment !== -1) {
      const before = line.slice(0, lineComment);
      // Only strip when the `//` is not inside a string and not part of a URL.
      const quotes = (before.match(/["'`]/g) ?? []).length;
      if (quotes % 2 === 0 && !/https?:$/.test(before)) line = before;
    }
    out.push(line);
  }
  return out.join("\n");
}

function scan(
  paths: string[],
  read: (file: string) => string,
  root: string
): string[] {
  const offenders: string[] = [];
  for (const file of paths) {
    const source = read(file);
    for (const { char, name } of BANNED) {
      if (!source.includes(char)) continue;
      source.split(/\r?\n/).forEach((line, index) => {
        if (!line.includes(char)) return;
        const at = line.indexOf(char);
        const excerpt = line.slice(Math.max(0, at - 40), at + 40).trim();
        offenders.push(
          `${path.relative(root, file).replace(/\\/g, "/")}:${index + 1} ${name}  ...${excerpt}...`
        );
      });
    }
  }
  return offenders;
}
