/**
 * Shared source-text extraction helpers for the generator scripts
 * (`generate-search-index.mjs`, `generate-lesson-registry.mjs`).
 *
 * The core trick (see generate-search-index.mjs's header for the full
 * rationale): a lesson's `lessonMeta` / a problem's `meta` lives inside a
 * file plain Node can't `import()` (MDX needs Next's loader; problem .ts
 * files use `@/...` aliases), so these helpers find the object literal in
 * the source *text*, extract exactly that literal, and evaluate only it —
 * never the surrounding module.
 */
import { readdir } from "node:fs/promises";
import path from "node:path";

/** Recursively collects every file ending in `extension` under `dir`, as slugs relative to `dir` (posix-separated, no extension). */
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

  return slugs;
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
 * string literals AND comments — an apostrophe in a `// don't` comment, or a
 * brace inside a comment, must not confuse the depth/string tracking (both
 * previously could, producing a wrong-but-evaluable slice).
 */
export function findMatchingBrace(source, openIndex) {
  let depth = 0;
  let inString = null;

  for (let i = openIndex; i < source.length; i++) {
    const ch = source[i];
    if (inString) {
      if (ch === "\\") {
        i++; // skip the escaped character
      } else if (ch === inString) {
        inString = null;
      }
      continue;
    }
    if (ch === "/" && source[i + 1] === "/") {
      const nl = source.indexOf("\n", i);
      if (nl === -1) break;
      i = nl;
      continue;
    }
    if (ch === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      if (end === -1) break;
      i = end + 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
    } else if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }

  throw new Error("Unbalanced braces while scanning for the end of an object literal");
}

/**
 * Finds the first match of `keyPattern` (a regex whose match ends in "{",
 * e.g. `/meta:\s*\{/`) in `source`, then extracts and evaluates the object
 * literal that opening brace starts. Only ever evaluates the small,
 * self-contained literal it extracts — not the surrounding file — so this
 * is safe even though the source files themselves import from aliases the
 * generator scripts can't resolve.
 */
export function extractObjectLiteral(source, keyPattern, filePath, label) {
  const match = keyPattern.exec(source);
  if (!match) {
    throw new Error(`${filePath}: could not find ${label} (expected to match ${keyPattern})`);
  }
  const openIndex = match.index + match[0].length - 1;
  const closeIndex = findMatchingBrace(source, openIndex);
  const literal = source.slice(openIndex, closeIndex + 1);
  try {
    // Evaluating our own trusted, plain-data object literal extracted from
    // this repo's source (never user input) — the whole point is to avoid
    // executing the rest of the file, which is what a real `import()`
    // would do.
    return new Function(`"use strict"; return (${literal});`)();
  } catch (err) {
    throw new Error(`${filePath}: failed to evaluate ${label}: ${err.message}`);
  }
}
