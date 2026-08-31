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
 * **`.ts` files outside tests** are covered too, but only inside **string
 * literals**, and that distinction is the whole trick. Those files contain em
 * dashes that are entirely correct: the conceptual validator's
 * clause-break character class and the numeric validator's unicode-minus
 * normalisation both match the character on purpose. A regex literal is not a
 * string literal, so scanning only string literals excludes them by
 * construction, with no allowlist to rot. Reader-facing copy really does live
 * in `.ts` (`lib/entryBar.ts`, `lib/nav.ts` and `lib/structuredData.ts` all
 * hold sentences a visitor reads), so leaving that half uncovered was a gap.
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

/**
 * The same characters written so the source file does not contain them.
 *
 * The scan above matches literal codepoints, so every one of these would pass
 * it and still put an em dash in front of a reader: a `—` escape in a
 * string literal, an HTML entity in JSX or MDX, or a `fromCharCode` call.
 * None of them is used anywhere in `src` today, and this is not a suspicion
 * that someone will smuggle one in deliberately. It is that the rule already
 * bans three *other* dash codepoints specifically so it cannot be satisfied by
 * swapping the character, and a rule that can be satisfied by swapping the
 * *encoding* is exactly as hollow. Cheaper to close than to argue about.
 */
const ENCODED = [
  { pattern: /\\u2014|\\u2015|\\u2E3A|\\u2E3B/gi, name: "unicode escape for an em dash" },
  { pattern: /&mdash;|&horbar;/gi, name: "HTML entity for an em dash" },
  { pattern: /&#8212;|&#8213;|&#x2014;|&#x2015;/gi, name: "numeric entity for an em dash" },
  { pattern: /fromCharCode\(\s*8212\s*\)|fromCodePoint\(\s*8212\s*\)/g, name: "charCode em dash" },
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

/** Every `.ts` under `src/`, minus test files, their directories, and content. */
function collectLogic(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "__tests__") continue;
    const full = path.join(dir, entry.name);
    // `src/content` is already covered in full by the first check.
    if (entry.isDirectory()) {
      if (full === CONTENT_ROOT) continue;
      found.push(...collectLogic(full));
    } else if (
      entry.name.endsWith(".ts") &&
      !entry.name.endsWith(".d.ts") &&
      !entry.name.includes(".test.")
    ) {
      found.push(full);
    }
  }
  return found;
}

const logicFiles = collectLogic(SRC_ROOT);

/**
 * Every string literal in a source file, with comments already removed.
 *
 * Scanning literals rather than whole lines is what lets `.ts` be covered at
 * all. A regex literal is not matched here, so the validators' deliberate
 * `[.;:!?\n-]`-style character classes are excluded by construction rather
 * than by an allowlist that would need maintaining.
 */
function stringLiterals(source: string): { text: string; line: number }[] {
  // `[\s\S]` rather than `.` with the `s` flag: dotAll needs an
  // ES2018 target and `tsconfig.json` sets ES2017, so the flag does not
  // typecheck. This matches the same thing, including a backslash escape
  // that spans a line break inside a template literal.
  const pattern = /"(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*'|`(?:[^`\\]|\\[\s\S])*`/g;
  const found: { text: string; line: number }[] = [];
  for (const match of source.matchAll(pattern)) {
    found.push({
      text: match[0],
      line: source.slice(0, match.index ?? 0).split(/\r?\n/).length,
    });
  }
  return found;
}

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

  it("has no em dashes in a string literal in any .ts module", () => {
    expect(
      logicFiles.length,
      "no .ts modules found outside tests; the walk has rotted"
    ).toBeGreaterThan(40);

    const offenders: string[] = [];
    for (const file of logicFiles) {
      const source = stripComments(readFileSync(file, "utf8"));
      for (const literal of stringLiterals(source)) {
        for (const { char, name } of BANNED) {
          if (!literal.text.includes(char)) continue;
          offenders.push(
            `${path.relative(SRC_ROOT, file).replace(/\\/g, "/")}:${literal.line} ${name}  ` +
              literal.text.replace(/\s+/g, " ").slice(0, 90)
          );
        }
      }
    }

    expect(
      offenders,
      "reader-facing copy lives in .ts as well as .tsx (the entry bar, the nav " +
        "descriptions, the site description). Regex literals are not scanned, " +
        "so a character class that matches an em dash on purpose is not a " +
        "finding and does not need an exemption."
    ).toEqual([]);
  });

  it("cannot be satisfied by encoding the character instead", () => {
    const targets = [
      ...files.map((file) => ({ file, root: CONTENT_ROOT, source: readFileSync(file, "utf8") })),
      ...uiFiles.map((file) => ({
        file,
        root: SRC_ROOT,
        source: stripComments(readFileSync(file, "utf8")),
      })),
      ...logicFiles.map((file) => ({
        file,
        root: SRC_ROOT,
        source: stripComments(readFileSync(file, "utf8")),
      })),
    ];

    const offenders: string[] = [];
    for (const { file, root, source } of targets) {
      for (const { pattern, name } of ENCODED) {
        for (const match of source.matchAll(pattern)) {
          const line = source.slice(0, match.index ?? 0).split(/\r?\n/).length;
          offenders.push(
            `${path.relative(root, file).replace(/\\/g, "/")}:${line} ${name}  ${match[0]}`
          );
        }
      }
    }

    expect(
      offenders,
      "an em dash written as an escape, an HTML entity or a charCode reaches " +
        "the reader exactly as the literal character does. Use punctuation " +
        "that makes grammatical sense in the sentence instead."
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
