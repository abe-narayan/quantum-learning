import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  GLOSSARY_TERMS,
  START_HERE_IDS,
  TERM_RELATIONS,
  getGlossaryTerm,
  getStartHereTerms,
} from "../glossary";

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const LESSONS_DIR = path.resolve(import.meta.dirname, "../../../content/lessons");

function mdxFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) mdxFiles(full, out);
    else if (entry.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

describe("glossary integrity", () => {
  it("every id is unique", () => {
    // Ids are the anchor `/glossary#<id>` scrolls to *and* the key
    // `<Term id="…">` resolves against, so a duplicate would silently make
    // one of the two entries unreachable from every lesson that glosses it.
    const seen = new Map<string, number>();
    for (const term of GLOSSARY_TERMS) {
      seen.set(term.id, (seen.get(term.id) ?? 0) + 1);
    }
    const duplicates = [...seen].filter(([, count]) => count > 1).map(([id]) => id);
    expect(duplicates, `duplicate glossary ids: ${duplicates.join(", ")}`).toEqual([]);
  });

  it("every id is kebab-case", () => {
    for (const term of GLOSSARY_TERMS) {
      expect(
        KEBAB_CASE.test(term.id),
        `glossary id "${term.id}" is not kebab-case (lowercase alphanumerics separated by single hyphens)`
      ).toBe(true);
    }
  });

  it("every entry has a non-empty title and definition", () => {
    for (const term of GLOSSARY_TERMS) {
      expect(term.title.trim(), `glossary entry "${term.id}" has an empty title`).not.toBe("");
      expect(
        term.definition.trim().length,
        `glossary entry "${term.id}" has an empty or near-empty definition`
      ).toBeGreaterThan(20);
    }
  });

  it("every declared cross-reference resolves to a real entry", () => {
    // `relatedIds` on the rendered terms is filtered to known ids so the page
    // can never emit a dead `#anchor`. That filter would also hide a typo, so
    // the *declaration* is what gets checked here.
    for (const [id, targets] of Object.entries(TERM_RELATIONS)) {
      expect(getGlossaryTerm(id), `TERM_RELATIONS declares unknown source id "${id}"`).toBeDefined();
      for (const target of targets) {
        expect(
          getGlossaryTerm(target),
          `TERM_RELATIONS["${id}"] references unknown glossary id "${target}"`
        ).toBeDefined();
      }
    }
  });

  it("cross-references are mutual and never self-referential", () => {
    for (const term of GLOSSARY_TERMS) {
      expect(term.relatedIds, `glossary entry "${term.id}" relates to itself`).not.toContain(term.id);
      for (const relatedId of term.relatedIds) {
        const other = getGlossaryTerm(relatedId);
        expect(other, `glossary entry "${term.id}" relates to unknown id "${relatedId}"`).toBeDefined();
        expect(
          other!.relatedIds,
          `"${term.id}" relates to "${relatedId}" but not the other way round`
        ).toContain(term.id);
      }
    }
  });

  it("every Start here id resolves, is unique, and is beginner-level", () => {
    expect(new Set(START_HERE_IDS).size, "START_HERE_IDS contains a duplicate").toBe(
      START_HERE_IDS.length
    );

    const startHere = getStartHereTerms();
    expect(
      startHere.length,
      `START_HERE_IDS contains an id with no glossary entry: ${START_HERE_IDS.filter(
        (id) => !getGlossaryTerm(id)
      ).join(", ")}`
    ).toBe(START_HERE_IDS.length);

    for (const term of startHere) {
      expect(
        term.level,
        `"${term.id}" is in the Start here tier but is marked ${term.level}`
      ).toBe("foundational");
    }
  });

  it("every entry carries a level and at least one real lesson slug", () => {
    for (const term of GLOSSARY_TERMS) {
      expect(
        ["foundational", "intermediate", "advanced", "master"],
        `glossary entry "${term.id}" has an unexpected level`
      ).toContain(term.level);
      expect(
        term.lessonSlugs.length,
        `glossary entry "${term.id}" lists no lessons`
      ).toBeGreaterThan(0);
    }
  });

  it("resolves every <Term id> used anywhere in the lesson corpus", () => {
    // `Term` throws at render on an unknown id (by design — a missing gloss
    // must fail loudly), which means a typo'd or not-yet-written id breaks
    // `npm run build` for the whole site. `lessonRender.test.ts` catches it
    // too, but only after rendering all 219 lessons; this is the cheap,
    // fast, unambiguous version that names the bad id directly.
    //
    // It also settles a recurring false alarm: ~60 glossary entries are not
    // written in `glossary.ts` at all — `GLOSSARY_TERMS` merges them in from
    // `CONCEPT_NODES` (`concepts.ts`). Grepping `glossary.ts` for `id: "…"`
    // therefore "finds" ids missing that resolve perfectly well. Resolution
    // is what matters, so resolution is what is asserted.
    const files = mdxFiles(LESSONS_DIR);
    expect(files.length, "found no lesson MDX to scan").toBeGreaterThan(100);

    const unresolved: string[] = [];
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(/<Term\s+id=["']([^"']+)["']/g)) {
        if (!getGlossaryTerm(match[1])) {
          unresolved.push(`${path.relative(LESSONS_DIR, file).replace(/\\/g, "/")}: "${match[1]}"`);
        }
      }
    }

    expect(
      [...new Set(unresolved)],
      "these <Term id> call sites have no glossary entry and will throw at render"
    ).toEqual([]);
  });

  it("keeps a genuine beginner layer, not only research vocabulary", () => {
    // The regression this guards: the glossary drifting back to being
    // top-heavy. Terms a reader meets in the first two modules of a course
    // must stay present and stay marked foundational.
    const foundational = GLOSSARY_TERMS.filter((term) => term.level === "foundational");
    expect(foundational.length).toBeGreaterThanOrEqual(40);

    for (const id of [
      "amplitude",
      "coherence",
      "expectation-value",
      "hadamard-gate",
      "pauli-matrices",
      "physical-qubit",
      "schrodinger-equation",
      "shot",
      "wavefunction",
    ]) {
      expect(getGlossaryTerm(id), `beginner glossary entry "${id}" went missing`).toBeDefined();
    }
  });
});
