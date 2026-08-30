import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { COURSES, PILLARS } from "../curriculum";
import {
  GLOSSARY_TERMS,
  START_HERE_IDS,
  TERM_RELATIONS,
  getGlossaryTerm,
  getStartHereTerms,
} from "../glossary";

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * How deep into the curriculum a course sits: the longest prerequisite chain
 * a reader has to finish before they can start it. Both zero-prerequisite
 * courses ("Mathematical Foundations" and "Qubits & Quantum States") are 0.
 *
 * Depth rather than the pillar's own position is what "earliest" means for a
 * glossary link, and the difference is not academic. `physical-qubit` is
 * covered by Physical Qubit Platforms (one course past Qubits & Quantum
 * States) and by Error Correction & Fault Tolerance (five past it). Pillar
 * order alone puts Quantum Computing ahead of Quantum Hardware and would
 * therefore send a reader who met the word on day two to the harder of the
 * two. `exchange-interaction` is worse: pillar order picks Identical
 * Particles, seven courses deep in Quantum Mechanics, over Spin Qubits.
 *
 * Cycles cannot occur (the graph is a DAG, pinned by
 * `curriculumCoverage.test.ts`); the `seen` set is a guard so that a bad edge
 * introduced later fails this file's own assertions rather than hanging it.
 */
function courseDepths(): Map<string, number> {
  const depth = new Map<string, number>();
  const byslug = new Map(COURSES.map((course) => [course.slug, course]));
  const visit = (slug: string, seen: Set<string>): number => {
    if (depth.has(slug)) return depth.get(slug)!;
    if (seen.has(slug)) return 0;
    seen.add(slug);
    const course = byslug.get(slug);
    if (!course) return 0;
    const value = course.prerequisites.length
      ? Math.max(...course.prerequisites.map((prerequisite) => visit(prerequisite, seen))) + 1
      : 0;
    depth.set(slug, value);
    return value;
  };
  for (const course of COURSES) visit(course.slug, new Set());
  return depth;
}

/**
 * Every lesson slug in curriculum order: prerequisite depth first, then the
 * pillar's position in `PILLARS`, then the course's position in `COURSES`,
 * then the module's position inside its course.
 */
function curriculumOrder(): Map<string, number> {
  const depth = courseDepths();
  const pillarRank = new Map(PILLARS.map((pillar, index) => [pillar.slug, index]));
  const ordered = COURSES.map((course, index) => ({ course, index })).sort((a, b) => {
    const depthA = depth.get(a.course.slug)!;
    const depthB = depth.get(b.course.slug)!;
    if (depthA !== depthB) return depthA - depthB;
    const pillarA = pillarRank.get(a.course.pillar)!;
    const pillarB = pillarRank.get(b.course.pillar)!;
    return pillarA - pillarB || a.index - b.index;
  });

  const order = new Map<string, number>();
  let position = 0;
  for (const { course } of ordered) {
    for (const courseModule of course.modules) {
      order.set(`${course.pillar}/${course.slug}/${courseModule.slug}`, position);
      position += 1;
    }
  }
  return order;
}

const CURRICULUM_ORDER = curriculumOrder();

const LESSONS_DIR = path.resolve(import.meta.dirname, "../../../content/lessons");

/** Diacritics stripped, dashes normalized, lowercased — so "Schrödinger" and
 *  "Eastin-Knill" compare the same however they were typed. Deliberately a
 *  local copy rather than an import of `lib/search`'s fold: this file is
 *  asserting a property of the prose, and it should keep saying so if the
 *  search matcher's own folding rules ever change for search's reasons. */
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[‐-―−]/gu, "-");
}

/** Whether `name` appears in `text` as a whole term (a trailing plural "s"
 *  allowed) rather than buried inside a longer word. */
function namesWholeTerm(text: string, name: string): boolean {
  const isWord = (character: string | undefined) =>
    character !== undefined && /[\p{L}\p{N}]/u.test(character);
  for (let from = 0; ; from += 1) {
    const at = text.indexOf(name, from);
    if (at === -1) return false;
    const after = text[at + name.length];
    if (!isWord(text[at - 1]) && (!isWord(after) || after === "s")) return true;
    from = at;
  }
}

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
    // "Real" was in this test's name and not in its body: it only counted the
    // slugs. `/glossary` renders each one as "Covered in <lesson title>", and a
    // slug with no file behind it is a promise the page cannot keep — the
    // deeper-reading route is the whole of what a glossary entry offers an
    // advanced reader past the definition itself.
    const realSlugs = new Set(
      mdxFiles(LESSONS_DIR).map((file) =>
        path.relative(LESSONS_DIR, file).replace(/\\/g, "/").replace(/\.mdx$/, "")
      )
    );
    expect(realSlugs.size, "found no lesson MDX to check slugs against").toBeGreaterThan(100);

    const dangling: string[] = [];
    for (const term of GLOSSARY_TERMS) {
      expect(
        ["foundational", "intermediate", "advanced", "master"],
        `glossary entry "${term.id}" has an unexpected level`
      ).toContain(term.level);
      expect(
        term.lessonSlugs.length,
        `glossary entry "${term.id}" lists no lessons`
      ).toBeGreaterThan(0);
      for (const slug of term.lessonSlugs) {
        if (!realSlugs.has(slug)) dangling.push(`${term.id} -> ${slug}`);
      }
    }
    expect(dangling, "these glossary entries cite a lesson that does not exist").toEqual([]);
  });

  it("lists every entry's lessons in curriculum order", () => {
    // `lessonSlugs` is a coverage list with no inherent order, and every
    // surface that renders it renders it in array order: `/glossary` prints
    // "Covered in <first lesson>", and `/map`'s detail panel and outline do
    // the same. So the first entry is the one a reader clicks, and it has to
    // be the earliest lesson that covers the term rather than whichever one
    // the author happened to type first.
    //
    // The version of this that actually hurt: a reader in Error Correction &
    // Fault Tolerance meets "code distance", follows the gloss, and lands in
    // Apex's Surface Codes in Depth. Forty-four of 273 entries opened on a
    // lesson that was not their earliest, and a further sixteen research-tier
    // entries listed no lesson below Mastery at all even though an
    // intermediate lesson covered them; those sixteen were re-pointed by hand
    // and this assertion keeps the order they were put in.
    //
    // Sorting is deliberately not done at runtime. `glossary.ts` is
    // SERVER_ONLY and `concepts.ts` carries a 14KB client budget
    // (`lib/design/__tests__/clientBoundary.test.ts`), so importing
    // `curriculum.ts` from either to sort would push the whole course table
    // into every client bundle that reaches the concept map. The arrays are
    // authored in order instead, and this test is what holds them there.
    expect(CURRICULUM_ORDER.size, "curriculum has no modules to order against").toBeGreaterThan(200);
    expect(GLOSSARY_TERMS.length, "no glossary entries to check").toBeGreaterThan(200);

    const unplaceable: string[] = [];
    const misordered: string[] = [];

    for (const term of GLOSSARY_TERMS) {
      for (const slug of term.lessonSlugs) {
        if (!CURRICULUM_ORDER.has(slug)) unplaceable.push(`${term.id} -> ${slug}`);
      }
      const sorted = [...term.lessonSlugs].sort(
        (a, b) => (CURRICULUM_ORDER.get(a) ?? Infinity) - (CURRICULUM_ORDER.get(b) ?? Infinity)
      );
      if (sorted.join("|") !== term.lessonSlugs.join("|")) {
        misordered.push(`${term.id}: opens on ${term.lessonSlugs[0]}, earliest is ${sorted[0]}`);
      }
    }

    // Checked before the ordering itself: a slug the curriculum cannot place
    // would sort to the end and could make the ordering assertion pass for
    // the wrong reason.
    expect(
      unplaceable,
      "these lesson slugs match no module in COURSES, so they cannot be ordered"
    ).toEqual([]);

    expect(
      misordered,
      `these entries do not list their lessons in curriculum order:\n  ${misordered.join("\n  ")}`
    ).toEqual([]);
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

  it("gives every entry somewhere to read next", () => {
    // `relatedIds` is the only way out of an entry other than the lessons it
    // cites, and the design note on `TERM_RELATIONS` says the traffic is
    // meant to run both ways: down from the research entry to the plain one,
    // up from the plain one to the entry that generalizes it. An entry with
    // an empty list is a stop, and the sweep that produced this assertion
    // found 43 of them, 39 in the Mastery and Apex tiers — the exact reader
    // the two-directional design was built for, arriving at a dead end.
    const stops = GLOSSARY_TERMS.filter((term) => term.relatedIds.length === 0).map(
      (term) => term.id
    );
    expect(stops, `glossary entries with no cross-reference out: ${stops.join(", ")}`).toEqual([]);
  });

  it("never defines two entries in terms of each other's first sentence", () => {
    // Circularity a reader can actually hit. Every glossary is a web of
    // mutual reference and that is fine: what is not fine is A's *opening*
    // sentence resting on B while B's opening sentence rests on A, because
    // then the reader who follows the link is returned to where they started
    // no wiser. Three such pairs were live: `amplitude` was "the number
    // multiplying a basis state in a superposition" while `superposition`
    // was "a combination of basis states with complex amplitudes";
    // `born-rule` and `measurement` each deferred to the other; and
    // `grovers-algorithm` opened by naming amplitude amplification, whose
    // entry opened by naming Grover.
    //
    // Later sentences are deliberately not checked. An entry is allowed, and
    // expected, to reach outward once it has put something in the reader's
    // hands; the contract this pins is only that the first sentence lands.
    // `[\s\S]` rather than `.` with the `s` flag: tsconfig targets ES2017 and
    // the dotAll flag does not typecheck below ES2018. Same behaviour, no flag.
    const firstSentence = (definition: string) =>
      fold(definition.match(/^[\s\S]*?[.?!](?=\s|$)/)?.[0] ?? definition);

    // One entry is "named" by the folded form of its title with any
    // parenthetical dropped, plus whatever the parenthetical itself held
    // ("Amplitude (Probability Amplitude)" is named by both). Short names are
    // skipped: "Norm", "Span" and "Trace" are ordinary English words that
    // appear in dozens of definitions meaning something else entirely, and a
    // rule that cannot tell those apart would report noise rather than
    // circularity.
    const namesOf = (title: string): string[] => {
      const folded = fold(title);
      const names = [
        folded.replace(/\(.*?\)/g, " ").replace(/\s+/gu, " ").trim(),
        ...[...folded.matchAll(/\(([^)]*)\)/g)].map((match) => match[1].trim()),
      ];
      return names.map((name) => name.replace(/[.,]/g, "").trim()).filter((name) => name.length >= 5);
    };

    const lexicon = GLOSSARY_TERMS.flatMap((term) =>
      namesOf(term.title).map((name) => ({ id: term.id, name }))
    );

    const opens = new Map<string, Set<string>>();
    for (const term of GLOSSARY_TERMS) {
      const sentence = firstSentence(term.definition);
      const named = new Set<string>();
      for (const { id, name } of lexicon) {
        if (id !== term.id && namesWholeTerm(sentence, name)) named.add(id);
      }
      opens.set(term.id, named);
    }

    const cycles: string[] = [];
    for (const term of GLOSSARY_TERMS) {
      for (const other of opens.get(term.id) ?? []) {
        if (term.id < other && opens.get(other)?.has(term.id)) {
          cycles.push(`${term.id} <-> ${other}`);
        }
      }
    }

    expect(
      cycles,
      `these entries open by defining each other, so a reader following the link learns nothing: ${cycles.join(
        "; "
      )}`
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
