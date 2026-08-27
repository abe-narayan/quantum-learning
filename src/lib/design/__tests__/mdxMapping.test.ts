import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * ============================================================
 * Global MDX component mapping — kept deliberately small
 * ============================================================
 * `src/mdx-components.tsx` maps components into EVERY compiled lesson MDX
 * module's graph: each mapped component is eagerly imported by all ~219
 * lesson pages, whether the lesson uses it or not. For the many
 * `"use client"` components among them, that means every lesson page's
 * client bundle carries the whole mapped set, and every static-generation
 * worker pays the build-memory cost of the whole set.
 *
 * The policy (see the comment on the `components` object in
 * `src/mdx-components.tsx`): the mapping is reserved for components used
 * broadly across the corpus; narrowly-used components are imported
 * explicitly by the few lessons that use them. This is safe to enforce
 * strictly because `loadLesson` (src/lib/content/lessons.ts) does NOT catch
 * import/evaluation errors for known slugs — a lesson using a tag that is
 * neither mapped nor imported fails the build loudly instead of silently
 * rendering a 404.
 *
 * These tests turn that policy into an invariant:
 *  (a) the mapping cannot quietly grow back into a long tail, and
 *  (b) no lesson can reference a component that is neither mapped nor
 *      explicitly imported by that lesson file.
 */

const SRC = path.resolve(import.meta.dirname, "../../..");
const MDX_COMPONENTS_PATH = path.join(SRC, "mdx-components.tsx");
const LESSONS_DIR = path.join(SRC, "content", "lessons");

/** Names imported by `import { A, B } from "..."` / `import A from "..."`. */
function importedNames(source: string): Set<string> {
  const names = new Set<string>();
  for (const m of source.matchAll(/^import\s*(?:type\s*)?\{([^}]+)\}\s*from\s*["'][^"']+["'];?\s*$/gm)) {
    for (const raw of m[1].split(",")) {
      // `A as B` binds B locally
      const name = raw.trim().split(/\s+as\s+/).pop()?.trim();
      if (name) names.add(name);
    }
  }
  for (const m of source.matchAll(/^import\s+([A-Za-z_$][\w$]*)\s+from\s*["'][^"']+["'];?\s*$/gm)) {
    names.add(m[1]);
  }
  return names;
}

/** Capitalized keys of the `components` object literal (shorthand or `key: Value`). */
function mappedComponentNames(source: string): Set<string> {
  const objMatch = source.match(/const components: MDXComponents = \{([\s\S]*?)\n\};/);
  expect(objMatch, "components object literal not found in mdx-components.tsx").toBeTruthy();
  const names = new Set<string>();
  for (const m of objMatch![1].matchAll(/^\s*([A-Za-z][A-Za-z0-9]*)\s*[,:]/gm)) {
    if (/^[A-Z]/.test(m[1])) names.add(m[1]);
  }
  return names;
}

function* walkMdx(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkMdx(p);
    else if (entry.name.endsWith(".mdx")) yield p;
  }
}

/**
 * Remove the segments where `<Tag>` is literal text rather than JSX:
 * fenced code blocks, inline code spans, KaTeX math (`$E<V_0$` would
 * otherwise read as a `<V` tag), quoted JSX attribute values
 * (`question="... the <H> readout ..."`), and string literals after a
 * colon in exported object literals (`description: "... <A> = ..."`).
 * What remains is exactly the compile-relevant JSX surface of the lesson.
 * (The corpus has mixed CRLF/LF line endings — keep regexes \r-tolerant.)
 */
function stripNonJsx(text: string): string {
  return text
    .replace(/^```[^\r\n]*\r?\n[\s\S]*?^```[^\r\n]*$/gm, "")
    .replace(/`[^`\r\n]*`/g, "")
    .replace(/\$\$[\s\S]*?\$\$/g, "")
    .replace(/\$[^$\r\n]*\$/g, "")
    .replace(/="[^"]*"/g, "=\"\"")
    .replace(/:\s*"(?:[^"\\\r\n]|\\.)*"/g, ": \"\"");
}

/** Component names this MDX file defines itself (`export function` / `export const`). */
function locallyDefinedNames(source: string): Set<string> {
  const names = new Set<string>();
  for (const m of source.matchAll(/export\s+(?:async\s+)?function\s+([A-Z][A-Za-z0-9]*)/g)) {
    names.add(m[1]);
  }
  for (const m of source.matchAll(/export\s+const\s+([A-Z][A-Za-z0-9]*)/g)) {
    names.add(m[1]);
  }
  return names;
}

describe("global MDX component mapping", () => {
  const mdxComponentsSource = readFileSync(MDX_COMPONENTS_PATH, "utf8");
  const mapped = mappedComponentNames(mdxComponentsSource);

  it("stays small: at most 30 components imported into every lesson's graph", () => {
    // Every import here lands in all ~219 lesson module graphs (client bundle
    // + build memory). The policy comment in src/mdx-components.tsx explains
    // when a component earns a slot (broad use across the corpus, roughly
    // ≥10 lessons); everything narrower belongs as an explicit import in the
    // lessons that use it. If this assertion fails, move the new component
    // out of the mapping and import it where it is used instead of raising
    // the limit.
    const imported = importedNames(mdxComponentsSource);
    expect(imported.size).toBeLessThanOrEqual(30);
    // Sanity: everything mapped (except the lowercase `table` wrapper, which
    // is defined locally) is actually one of those imports.
    for (const name of mapped) {
      expect(imported.has(name), `mapped component ${name} is not imported`).toBe(true);
    }
  });

  it("every JSX tag in every lesson is mapped, imported by that file, or defined in it", () => {
    const failures: string[] = [];
    let filesChecked = 0;
    for (const file of walkMdx(LESSONS_DIR)) {
      filesChecked++;
      const text = readFileSync(file, "utf8");
      const imported = importedNames(text);
      const local = locallyDefinedNames(text);
      const scannable = stripNonJsx(text);
      const seen = new Set<string>();
      for (const m of scannable.matchAll(/<([A-Z][A-Za-z0-9]*)/g)) {
        const tag = m[1];
        if (seen.has(tag)) continue;
        seen.add(tag);
        if (mapped.has(tag) || imported.has(tag) || local.has(tag)) continue;
        failures.push(
          `${path.relative(SRC, file)}: <${tag}> is not in the global mapping, ` +
            `not imported by the file, and not defined in it — this fails the ` +
            `build (loadLesson does not catch errors for known slugs). ` +
            `Add an explicit import to the lesson.`
        );
      }
    }
    // Guard against the walker silently checking nothing.
    expect(filesChecked).toBeGreaterThan(200);
    expect(failures).toEqual([]);
  });
});
