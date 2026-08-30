/**
 * Shared source-text extraction helpers for the generator scripts
 * (`generate-search-index.mjs`, `generate-lesson-registry.mjs`,
 * `generate-problem-registry.mjs`).
 *
 * The core trick (see generate-search-index.mjs's header for the full
 * rationale): a lesson's `lessonMeta` / a problem's `meta` lives inside a
 * file plain Node can't `import()` (MDX needs Next's loader; problem .ts
 * files use `@/...` aliases), so these helpers find the object literal in
 * the source *text*, extract exactly that literal, and evaluate only it —
 * never the surrounding module.
 *
 * Everything here is written to FAIL LOUDLY. A generator that silently skips
 * a malformed file, or that quietly extracts the wrong block, produces a
 * green build with a lesson missing from search/catalogs/`generateStaticParams`
 * — the single worst outcome this pipeline can have, because nothing
 * downstream notices. Every helper below throws with the offending file path
 * rather than returning a partial or best-effort result.
 */
import { readdir, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * The two key patterns the generators scan for, defined ONCE here.
 *
 * This is not stylistic tidying. Two different generators extract the SAME
 * `meta: {...}` block out of every problem file — `generate-problem-registry.mjs`
 * (whose output is drift-tested against the real modules by
 * `src/lib/problems/__tests__/metaRegistry.test.ts`) and
 * `generate-search-index.mjs` (whose output is not). When those patterns were
 * two separate literals in two files, "they must stay identical" was a
 * comment, i.e. an invariant enforced by nobody: editing one to fix an
 * extraction bug would leave the other selecting a different block, and the
 * only symptom would be a search index quietly describing problems by the
 * wrong metadata. Sharing one frozen pattern object makes the divergence
 * unrepresentable; `scripts/__tests__/crossGenerator.test.ts` additionally
 * asserts both generators select byte-identical blocks for every real
 * problem file, so the invariant survives even if someone re-inlines a
 * pattern.
 *
 * Both are anchored to a line that *starts* (modulo indentation) with the
 * key. A bare `/\bmeta:\s*\{/` would happily match `optionFeedback: { meta:`
 * or a `meta:` key nested in some earlier object in the file.
 *
 * Neither is global/sticky — see `extractObjectLiteral`, which rejects those
 * outright because `lastIndex` carries between files.
 */
export const PROBLEM_META_KEY_RE = /^\s*meta:\s*\{/m;
export const LESSON_META_KEY_RE = /^\s*export const lessonMeta\s*=\s*\{/m;

/**
 * Recursively collects every file ending in `extension` under `dir`, as slugs
 * relative to `dir` (posix-separated, no extension).
 *
 * The result is sorted with `compareSlugs` before it is returned. `readdir`
 * order is filesystem-dependent (NTFS hands back a B-tree order, ext4 a hash
 * order), so an unsorted walk would make every generated artifact's element
 * order machine-dependent. Callers sort again — that is deliberate belt and
 * braces, and it is free because the list is already ordered.
 */
export async function walk(dir, extension, base = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const slugs = [];

  for (const entry of entries) {
    const relativePath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      slugs.push(...(await walk(path.join(dir, entry.name), extension, relativePath)));
    } else if (entry.name.endsWith(extension)) {
      slugs.push(relativePath.slice(0, -extension.length));
    }
  }

  return slugs.sort(compareSlugs);
}

/**
 * Deterministic, locale-independent slug ordering. `localeCompare` (used
 * previously) collates via ICU, so two machines with different ICU builds or
 * locales could emit differently-ordered — but both "valid" — generated
 * files, creating git-diff noise in checked-in artifacts. Plain code-unit
 * comparison is identical everywhere.
 */
export function compareSlugs(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Finds the index of the `}` that closes the `{` at `openIndex`, respecting
 * string literals (all three quote styles), template-literal `${…}`
 * interpolations, and comments.
 *
 * Each of those is a real, previously-lived failure mode, not a hypothetical:
 * an apostrophe in a `// don't` comment used to flip the scanner into string
 * state, and a `}` inside a comment used to end the scan early — both
 * producing a wrong-but-*evaluable* slice, which is the dangerous kind of
 * wrong. Template interpolation is the same class of bug one lesson away: in
 * `` `a ${ {x: 1} } b` `` the braces inside the interpolation are code, not
 * string content, and a scanner that treats the whole template as opaque text
 * mis-counts them the moment the interpolation contains a brace or a nested
 * backtick.
 *
 * The scanner is a small context stack rather than a single `inString` flag:
 * the base frame is the object literal, a quote pushes a string frame, and
 * `${` inside a template string pushes a fresh *code* frame with its own
 * brace depth (popped by the `}` that closes the interpolation). That is
 * exactly the nesting JS itself allows.
 *
 * DELIBERATELY NOT HANDLED: regular-expression literals. Distinguishing `/`
 * as division from `/` as a regex start needs real expression-level parsing,
 * and a regex literal has no business inside the plain-data metadata blocks
 * these generators read. If one ever appears, the failure is loud, not
 * silent: either the braces stop balancing (this function throws) or the
 * evaluated value is not plain data (`assertPlainData` throws).
 */
export function findMatchingBrace(source, openIndex) {
  if (source[openIndex] !== "{") {
    // Guards against a `keyPattern` whose match does not end at the opening
    // brace. Without this the scan would start mid-expression, latch onto the
    // NEXT `{` it happened to find, and return that unrelated block's closing
    // brace — a silently wrong slice from a silently wrong pattern.
    throw new Error(
      `findMatchingBrace: expected "{" at index ${openIndex}, found ` +
        `${JSON.stringify(source[openIndex] ?? "<end of input>")}. The key pattern must end at the opening brace.`
    );
  }

  // Innermost frame last. `string` is the quote character when the frame is a
  // string literal; `depth` is the unclosed-brace count of a code frame;
  // `interpolation` marks a code frame opened by `${`, which is closed by a
  // `}` at depth 0 rather than by counting down past it.
  const stack = [{ string: null, depth: 0, interpolation: false }];

  for (let i = openIndex; i < source.length; i++) {
    const frame = stack[stack.length - 1];
    const ch = source[i];

    if (frame.string) {
      if (ch === "\\") {
        i++; // skip the escaped character (LaTeX bodies are dense with these)
      } else if (frame.string === "`" && ch === "$" && source[i + 1] === "{") {
        stack.push({ string: null, depth: 0, interpolation: true });
        i++; // consume the "{" of "${" without counting it as a brace
      } else if (ch === frame.string) {
        stack.pop();
      }
      continue;
    }

    if (ch === "/" && source[i + 1] === "/") {
      const nl = source.indexOf("\n", i);
      if (nl === -1) break; // unterminated: fall through to the throw below
      i = nl;
      continue;
    }
    if (ch === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      if (end === -1) break; // unterminated: fall through to the throw below
      i = end + 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      stack.push({ string: ch, depth: 0, interpolation: false });
      continue;
    }
    if (ch === "{") {
      frame.depth++;
      continue;
    }
    if (ch === "}") {
      if (frame.interpolation && frame.depth === 0) {
        stack.pop(); // back into the template literal this `${` interrupted
        continue;
      }
      frame.depth--;
      if (frame.depth === 0 && !frame.interpolation) return i;
    }
  }

  throw new Error("Unbalanced braces while scanning for the end of an object literal");
}

/**
 * Throws unless `value` is a tree of plain JSON data (string / finite number /
 * boolean / null / array / plain object), which is what every consumer of an
 * extracted literal assumes.
 *
 * This exists because the generators serialize what they extract with
 * `JSON.stringify`, and `JSON.stringify` is *silently lossy* for everything
 * else: a function value, a `Symbol`, or a `RegExp` disappears (or becomes
 * `{}`) with no error, so a mis-extracted or accidentally-non-literal block
 * would ship as a plausible-looking generated file with fields quietly
 * missing. `undefined` is allowed and dropped, matching TypeScript's optional
 * -property semantics (`lesson?: string`). `NaN`/`Infinity` are rejected
 * because `JSON.stringify` turns them into `null`.
 */
export function assertPlainData(value, label, pathParts = []) {
  const where = pathParts.length ? `${label}${pathParts.join("")}` : label;

  if (value === null || value === undefined) return;
  const type = typeof value;
  if (type === "string" || type === "boolean") return;
  if (type === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(`${where} is ${String(value)}, which JSON.stringify would silently write as null`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => assertPlainData(item, label, [...pathParts, `[${i}]`]));
    return;
  }
  if (type === "object") {
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) {
      throw new Error(
        `${where} is a ${value.constructor?.name ?? "non-plain"} instance, not a plain object literal`
      );
    }
    for (const [key, item] of Object.entries(value)) {
      assertPlainData(item, label, [...pathParts, `.${key}`]);
    }
    return;
  }

  throw new Error(`${where} has type "${type}", which is not plain JSON data`);
}

/**
 * Finds the first match of `keyPattern` (a regex whose match ends in "{",
 * e.g. `PROBLEM_META_KEY_RE`) in `source`, then extracts and evaluates the
 * object literal that opening brace starts. Only ever evaluates the small,
 * self-contained literal it extracts — not the surrounding file — so this
 * is safe even though the source files themselves import from aliases the
 * generator scripts can't resolve.
 *
 * Global/sticky patterns are rejected rather than accommodated. `exec` on a
 * `/g` or `/y` regex advances `lastIndex` and resumes from it on the next
 * call, so a shared pattern reused across a 547-file walk would start
 * matching mid-file and silently return a DIFFERENT block (or no match at
 * all) for every file after the first. "First match in this source" is the
 * only meaning these callers want, and a non-global pattern is the only way
 * to say it unambiguously.
 */
export function extractObjectLiteral(source, keyPattern, filePath, label) {
  if (keyPattern.global || keyPattern.sticky) {
    throw new Error(
      `extractObjectLiteral: key pattern ${keyPattern} must not be global or sticky. ` +
        `lastIndex carries between calls and would make extraction order-dependent.`
    );
  }
  const match = keyPattern.exec(source);
  if (!match) {
    throw new Error(`${filePath}: could not find ${label} (expected to match ${keyPattern})`);
  }
  const openIndex = match.index + match[0].length - 1;
  let closeIndex;
  try {
    closeIndex = findMatchingBrace(source, openIndex);
  } catch (err) {
    throw new Error(`${filePath}: could not delimit ${label}: ${err.message}`);
  }
  const literal = source.slice(openIndex, closeIndex + 1);
  let value;
  try {
    // Evaluating our own trusted, plain-data object literal extracted from
    // this repo's source (never user input) — the whole point is to avoid
    // executing the rest of the file, which is what a real `import()`
    // would do.
    value = new Function(`"use strict"; return (${literal});`)();
  } catch (err) {
    throw new Error(`${filePath}: failed to evaluate ${label}: ${err.message}`);
  }
  try {
    assertPlainData(value, label);
  } catch (err) {
    throw new Error(`${filePath}: ${err.message}`);
  }
  return value;
}

/**
 * Writes one generated artifact: LF-normalized, and via a temp file + rename
 * so the destination is never observed half-written.
 *
 * LINE ENDINGS. The corpus is mixed (122 of 219 lesson `.mdx` files are CRLF,
 * the rest LF) and, more to the point, `core.autocrlf=true` checkouts hand
 * the *generator scripts themselves* CRLF line endings. Every generated file
 * is a CRLF-sensitive template literal (the `AUTO-GENERATED` header, the
 * import lines) concatenated with `JSON.stringify(…, null, 2)` output, which
 * is always LF. So on such a checkout the emitted file would be MIXED — CRLF
 * header, LF body — where the committed blobs are pure LF, producing a
 * ~200KB whole-file diff on someone else's machine that has nothing to do
 * with content. Normalizing here makes the bytes a pure function of the
 * corpus, independent of how the repo was checked out.
 *
 * The normalization is provably data-safe: `JSON.stringify` escapes a real
 * carriage return inside a string as the two characters `\` `r`, so the only
 * raw CRLF in these outputs comes from the script sources' own template
 * literals. Lone `\r` is deliberately left alone.
 *
 * TEMP FILE + RENAME. Two reasons. (1) A crash or a full disk mid-write would
 * otherwise leave a truncated `registry.generated.ts` that still parses —
 * i.e. a build that succeeds with problems missing. `rename` is atomic on
 * POSIX and effectively atomic (`MoveFileEx` + `REPLACE_EXISTING`) on
 * Windows, so the destination flips from old to new in one step. (2) On
 * Windows, opening an existing file with `O_TRUNC` fails outright if another
 * process holds it without `FILE_SHARE_WRITE` — a running `next dev`, a file
 * watcher, an editor, or an antivirus scanner mid-scan. libuv surfaces some
 * of those as the bare `UNKNOWN: unknown error, open '…'` that
 * `public/search-index.json` has actually produced in this repo. Writing a
 * fresh temp file sidesteps the truncating open, and the rename is retried a
 * few times because the same transient lock can briefly hit the rename too.
 *
 * The retry is bounded and the final failure is RETHROWN with the diagnosis
 * attached. A generator that swallowed this would leave a stale index behind
 * and report success, which is the failure mode this whole file is built to
 * prevent.
 */
const TRANSIENT_WRITE_CODES = new Set(["EPERM", "EACCES", "EBUSY", "UNKNOWN"]);

export async function writeGenerated(outputPath, contents) {
  const normalized = contents.replace(/\r\n/g, "\n");
  // Dot-prefixed and pid-tagged: invisible to the generators' own `walk`
  // (which matches on `.ts`/`.mdx` suffixes) and unique per process, so two
  // concurrent runs can't clobber each other's staging file.
  const tempPath = path.join(
    path.dirname(outputPath),
    `.${path.basename(outputPath)}.${process.pid}.tmp`
  );

  const fail = (err) => {
    throw new Error(
      `Failed to write ${outputPath} (${err.code ?? "no code"}: ${err.message}). ` +
        `On Windows this is almost always another process holding the file open, usually a running ` +
        `\`next dev\`, an editor, a file watcher, or an antivirus scanner. Stop the dev server and ` +
        `re-run. The previous version of the file has been left intact.`,
      { cause: err }
    );
  };

  try {
    await writeFile(tempPath, normalized, "utf8");
  } catch (err) {
    fail(err);
  }

  const delays = [0, 50, 150, 400, 1000];
  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt] > 0) await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
    try {
      await rename(tempPath, outputPath);
      return;
    } catch (err) {
      if (attempt < delays.length - 1 && TRANSIENT_WRITE_CODES.has(err.code)) continue;
      await unlink(tempPath).catch(() => {});
      fail(err);
    }
  }
}
