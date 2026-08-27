import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { GLOSSARY_TERMS } from "@/lib/content/glossary";

/**
 * `<Term id="...">` (src/components/mdx/Term.tsx) resolves its id against
 * `GLOSSARY_TERMS` and **throws at render** when the id has no match. That is
 * the right behaviour for the component — a silently-unglossed term would be
 * worse than a loud failure — but it means one mistyped or optimistically
 * invented id in one of 219 lesson files takes down `next build` for the
 * whole site, and the error surfaces at page-render time rather than anywhere
 * near the edit that caused it.
 *
 * This happened. During the inline-glossary rollout, lesson content and the
 * glossary itself were written in parallel, and nine ids (`superposition`,
 * `entanglement`, `measurement`, …) were used in content before they existed
 * as entries. Nothing failed until a full production build ran.
 *
 * So: check the whole corpus against the whole glossary, in milliseconds, in
 * the unit suite. A bad id now fails next to the file that has it, with the
 * file path in the message, instead of at the end of a five-minute build.
 *
 * Deliberately a source scan rather than an MDX compile: this must stay fast
 * enough to run on every `vitest` invocation, and the question being asked is
 * purely lexical — "does every id written in content exist in the data?" —
 * not "does this file compile", which the build already answers.
 */

const CONTENT_ROOT = join(process.cwd(), "src", "content");

/** Every `<Term id="…">` in the corpus, with the file it came from. */
function collectTermUsages(): { id: string; file: string }[] {
  const usages: { id: string; file: string }[] = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.endsWith(".mdx")) continue;

      const source = readFileSync(full, "utf8");
      // `[^"]*` rather than a stricter slug pattern on purpose: a typo like
      // `id="Born Rule"` should be reported as an unknown id, not skipped by
      // the matcher for not looking like an id.
      for (const match of source.matchAll(/<Term\s+id="([^"]*)"/g)) {
        usages.push({ id: match[1], file: full.slice(process.cwd().length + 1).replace(/\\/g, "/") });
      }
    }
  }

  walk(CONTENT_ROOT);
  return usages;
}

describe("<Term> ids in MDX content", () => {
  const usages = collectTermUsages();
  const known = new Set(GLOSSARY_TERMS.map((term) => term.id));

  it("finds Term usages to check (guards against the matcher silently rotting)", () => {
    // If `Term` is ever renamed or the attribute order changes, the regex
    // above would match nothing and this suite would pass vacuously forever.
    expect(usages.length).toBeGreaterThan(0);
  });

  it("resolves every id against GLOSSARY_TERMS", () => {
    const unresolved = usages.filter((usage) => !known.has(usage.id));

    const report = unresolved.map((usage) => `${usage.id}  <-  ${usage.file}`).sort();

    expect(
      report,
      "these ids throw at render and break `next build`; add the glossary entry or fix the call site"
    ).toEqual([]);
  });

  it("uses no empty ids", () => {
    expect(usages.filter((usage) => usage.id.trim() === "").map((usage) => usage.file)).toEqual([]);
  });
});

/**
 * `GLOSSARY_TERMS` is assembled as
 * `[...CONCEPT_NODES.map(fromConceptNode), ...ADDITIONAL_GLOSSARY_TERMS]`,
 * so an id can be authored twice without either author seeing the other —
 * once as a concept node in `concepts.ts` and once as a hand-written entry in
 * `glossary.ts`. Nothing about that throws. `TERMS_BY_ID` silently keeps
 * whichever comes last, so every `<Term>` in the corpus quietly starts
 * resolving to the shadow definition, `/glossary` renders the entry twice,
 * and any `START_HERE_IDS` reference points at the shadow.
 *
 * That is a worse failure than an unknown id, because it is invisible: the
 * page renders, the build passes, and the definition is simply the wrong one.
 * It nearly happened during this sprint — a checker that grepped only
 * `glossary.ts` reported nine concept-node ids as "missing", and adding them
 * would have shadowed nine real definitions. Hence a test, not a habit.
 */
describe("GLOSSARY_TERMS ids", () => {
  it("are unique across concept nodes and hand-authored entries", () => {
    const seen = new Map<string, number>();
    for (const term of GLOSSARY_TERMS) {
      seen.set(term.id, (seen.get(term.id) ?? 0) + 1);
    }

    const duplicates = [...seen.entries()]
      .filter(([, count]) => count > 1)
      .map(([id, count]) => `${id} x${count}`)
      .sort();

    expect(
      duplicates,
      "an id authored in both concepts.ts and glossary.ts shadows the earlier definition silently"
    ).toEqual([]);
  });

  it("are all kebab-case", () => {
    const malformed = GLOSSARY_TERMS.map((term) => term.id)
      .filter((id) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))
      .sort();
    expect(malformed, "ids are used as URL fragments (/glossary#<id>)").toEqual([]);
  });
});
