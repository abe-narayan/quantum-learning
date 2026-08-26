import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * ============================================================
 * MDX corpus hazards
 * ============================================================
 * Static lint over all 219 lesson files for failure modes that are
 * *specifically bad here*: they produce no build error, no type error and no
 * console warning, so the only way anyone finds out is by opening the page.
 * With multiple authors editing the corpus, "we'll remember" is not a
 * control — each of these has already happened at least once.
 *
 * This deliberately complements, rather than duplicates,
 * `lessons.test.ts` (which compiles the corpus and validates frontmatter) and
 * `lessonImages.test.ts` (which enforces the CSP `img-src` allow-list).
 * Compiling a lesson does not catch any of the three hazards below: all three
 * compile perfectly and render wrongly.
 */

const LESSONS_DIR = path.resolve(import.meta.dirname, "../../../content/lessons");

/**
 * Every lesson's raw MDX source, found by walking the content directory.
 *
 * Deliberately *not* routed through `getAllLessonsMeta()`: that dynamically
 * imports and compiles all 219 MDX modules (and everything they import),
 * which costs ~150s. Every hazard checked here is a property of the source
 * text that survives compilation, so compiling buys nothing and would make
 * this lint too slow to run often — which is exactly when a lint stops being
 * used. The directory walk also lets the last test see non-`.mdx` strays,
 * which the loader's glob would hide.
 */
function readCorpus(): Array<{ slug: string; source: string }> {
  const files: Array<{ slug: string; source: string }> = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".mdx")) {
        files.push({
          slug: path.relative(LESSONS_DIR, full).replace(/\\/g, "/").replace(/\.mdx$/, ""),
          source: readFileSync(full, "utf8"),
        });
      }
    }
  }

  walk(LESSONS_DIR);
  return files;
}

const corpus = readCorpus();

describe("MDX corpus hazards", () => {
  it("reads every authored lesson", () => {
    // Guards the guard: if the slug-to-path assumption above ever breaks, the
    // rest of this file would silently pass over an empty corpus.
    expect(corpus.length).toBeGreaterThan(200);
    for (const { slug, source } of corpus) {
      expect(source.length, `${slug} is empty`).toBeGreaterThan(0);
    }
  });

  /**
   * HAZARD 1 — `//` inside a top-level `export` block.
   *
   * MDX parses top-level `export` statements as ESM, but the surrounding
   * document is still markdown-ish; a `//` line comment inside such a block
   * terminates the export early and silently swallows *every subsequent
   * export in the file*. The lesson then has no `lessonMeta`, the route
   * resolves to nothing, and the page 404s with no error anywhere in the
   * build. Block comments are fine — only `//` triggers it.
   */
  it("has no `//` comments inside top-level export blocks", () => {
    const offenders: string[] = [];

    for (const { slug, source } of corpus) {
      const lines = source.split(/\r?\n/);
      let depth = 0;
      let inExport = false;

      lines.forEach((line, index) => {
        if (!inExport && /^export\s/.test(line)) inExport = true;
        if (!inExport) return;

        // Strip string literals before counting braces or looking for `//`,
        // so a URL ("https://...") or a brace inside prose can't fool us.
        const stripped = line
          .replace(/"(?:[^"\\]|\\.)*"/g, '""')
          .replace(/'(?:[^'\\]|\\.)*'/g, "''")
          .replace(/`(?:[^`\\]|\\.)*`/g, "``");

        if (/(^|[^:])\/\//.test(stripped)) {
          offenders.push(`${slug}:${index + 1}`);
        }

        depth += (stripped.match(/[{[(]/g) ?? []).length;
        depth -= (stripped.match(/[}\])]/g) ?? []).length;
        if (depth <= 0) {
          depth = 0;
          inExport = false;
        }
      });
    }

    expect(offenders, "`//` inside an MDX export block silently 404s the lesson").toEqual([]);
  });

  /**
   * HAZARD 2 — `$$` sharing a line with formula content inside a JSX
   * component.
   *
   * Display math delimited by `$$` is fine in plain markdown. Inside a custom
   * JSX component's children, a `$$` that shares its line with the formula
   * breaks the MDX parser's closing-tag detection, and the component swallows
   * the rest of the document. The fix is always the same: put `$$` on its own
   * line. One authoring pass introduced five of these in a single run, which
   * is why this is checked mechanically rather than by review.
   */
  it("never puts `$$` on the same line as formula content inside a JSX component", () => {
    const offenders: string[] = [];

    for (const { slug, source } of corpus) {
      const lines = source.split(/\r?\n/);
      let jsxDepth = 0;

      lines.forEach((line, index) => {
        const trimmed = line.trim();

        if (jsxDepth > 0 && trimmed.includes("$$")) {
          // Legal: a line that is exactly `$$` (opening or closing a block).
          const isBareDelimiter = trimmed === "$$";
          // Legal: a complete single-line inline block, `$$ x = y $$`.
          const isSelfContained = /^\$\$[^$]+\$\$$/.test(trimmed);
          if (!isBareDelimiter && !isSelfContained) {
            offenders.push(`${slug}:${index + 1}`);
          }
        }

        // Track only *custom component* tags (capitalised), which is the case
        // that breaks. Self-closing tags never open a child scope.
        for (const match of line.matchAll(/<(\/?)([A-Z][A-Za-z0-9]*)\b[^>]*?(\/?)>/g)) {
          const [, closing, , selfClosing] = match;
          if (selfClosing === "/") continue;
          jsxDepth += closing === "/" ? -1 : 1;
        }
        if (jsxDepth < 0) jsxDepth = 0;
      });
    }

    expect(
      offenders,
      "`$$` sharing a line with content inside a JSX component breaks closing-tag detection",
    ).toEqual([]);
  });

  /**
   * HAZARD 3 — raw LaTeX passed as an `EquationReveal` term chip label.
   *
   * `EquationReveal`'s `terms[].symbol` is a short plain-text/Unicode chip
   * label and is deliberately never typeset through KaTeX. Passing LaTeX
   * source renders visible `^{...}` / `_{...}` / `\frac` syntax inside the
   * chip button — broken-looking math, on exactly the lessons formal enough
   * to reach for the component. This shipped once on a `master`-difficulty
   * lesson about the Wigner-Eckart theorem.
   */
  it("passes no raw LaTeX as an EquationReveal term chip label", () => {
    // Sub/superscript braces and any backslash command are the tells. A bare
    // `^` or `_` without braces is left alone: Unicode labels legitimately
    // contain things like `a_1` in prose form.
    const LATEX_TELLS = /(\^\{|_\{|\\[a-zA-Z]{2,})/;
    const offenders: string[] = [];

    for (const { slug, source } of corpus) {
      if (!source.includes("EquationReveal")) continue;
      const lines = source.split(/\r?\n/);

      lines.forEach((line, index) => {
        const match = line.match(/\bsymbol:\s*(["'])((?:[^\\]|\\.)*?)\1/);
        if (!match) return;
        if (LATEX_TELLS.test(match[2])) {
          offenders.push(`${slug}:${index + 1} — ${match[2]}`);
        }
      });
    }

    expect(
      offenders,
      "EquationReveal `symbol` is a plain-text/Unicode chip label, not LaTeX source",
    ).toEqual([]);
  });

  /**
   * HAZARD 4 — editor/build temp files left in tracked content.
   *
   * Atomic-write tooling leaves `*.tmp.<pid>.<hash>` siblings behind when a
   * write is interrupted. They are invisible to the lesson loader (it only
   * globs `.mdx`) but they do get committed, and a half-written copy of a
   * lesson sitting next to the real one is a genuine hazard for whoever
   * greps the corpus next.
   */

  /**
   * HAZARD 5 — a lesson uses a component that is neither imported in that file
   * nor registered globally.
   *
   * MDX resolves an unknown capitalised tag to `undefined` at render time, so
   * the failure surfaces as a React error on that one page — not as a build
   * error, and not on any page a spot-check is likely to open. With 219
   * lessons, 66 globally-registered components, and per-file imports in every
   * single file, "did I import that?" is not something review reliably
   * catches. This is the check that would have caught the seven new
   * visualization components being used before they were registered.
   */
  it("only uses components that are registered globally or imported locally", () => {
    const registry = readFileSync(
      path.resolve(import.meta.dirname, "../../../mdx-components.tsx"),
      "utf8",
    );

    // The `components` map's keys: either `Name,` shorthand or `Name: X,`.
    const registered = new Set<string>();
    const mapBody = registry.slice(registry.indexOf("const components"), registry.indexOf("export function useMDXComponents"));
    for (const match of mapBody.matchAll(/^\s{2}([A-Z][A-Za-z0-9]*)\s*[,:]/gm)) {
      registered.add(match[1]);
    }

    // Tags MDX/markdown provides itself, plus the ones the pipeline injects.
    const BUILT_IN = new Set(["Fragment"]);

    const offenders: string[] = [];
    // Guards the guard. The scan strips code fences and quoted strings before
    // looking for tags (see below), and an over-eager strip would silently
    // leave nothing to check — a test that can no longer fail. Track what was
    // actually seen and assert it is a plausible number.
    const seenAcrossCorpus = new Set<string>();

    for (const { slug, source } of corpus) {
      const localImports = new Set<string>();
      for (const match of source.matchAll(/^import\s+(?:\{([^}]*)\}|([A-Za-z0-9_]+))\s+from/gm)) {
        if (match[1]) {
          for (const name of match[1].split(",")) {
            const cleaned = name.replace(/as.*$/, "").replace(/type/, "").trim();
            if (cleaned) localImports.add(cleaned);
          }
        } else if (match[2]) {
          localImports.add(match[2]);
        }
      }

      // Strip fenced code, inline code and quoted strings before looking for
      // tags. Lessons legitimately write expectation values in ASCII as
      // `<A>` / `<H>` inside prop strings and prose, which is notation, not
      // JSX — scanning the raw source reports those as missing components.
      const scannable = source
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`[^`\n]*`/g, "")
        .replace(/"(?:[^"\\]|\\.)*"/g, '""')
        .replace(/'(?:[^'\\]|\\.)*'/g, "''");

      const used = new Set<string>();
      for (const match of scannable.matchAll(/<([A-Z][A-Za-z0-9]*)[\s/>]/g)) {
        used.add(match[1]);
      }

      for (const name of used) {
        seenAcrossCorpus.add(name);
        if (registered.has(name) || localImports.has(name) || BUILT_IN.has(name)) continue;
        offenders.push(`${slug} uses <${name}> but neither imports nor has it registered`);
      }
    }

    expect(registered.size, "parsed no components out of mdx-components.tsx").toBeGreaterThan(40);
    expect(
      seenAcrossCorpus.size,
      "the tag scan found almost no components — the strip step is probably too aggressive",
    ).toBeGreaterThan(30);
    expect(offenders, "an unregistered component renders as undefined at runtime, with no build error").toEqual([]);
  });

  it("leaves no editor temp files in the lesson corpus", () => {
    const strays: string[] = [];

    function walk(dir: string) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (!entry.name.endsWith(".mdx")) {
          strays.push(path.relative(LESSONS_DIR, full).replace(/\\/g, "/"));
        }
      }
    }

    walk(LESSONS_DIR);
    expect(strays, "non-.mdx files found in the lesson corpus").toEqual([]);
  });
});
