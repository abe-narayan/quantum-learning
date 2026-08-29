import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LESSON_METAS } from "../lessonMeta.generated";
import { COURSES, PILLARS, getCourse } from "../curriculum";
import { GLOSSARY_TERMS } from "../glossary";
import { CONCEPT_NODES } from "../concepts";
import { CURRENT_QUANTUM_META } from "../currentQuantum/metaRegistry";
import { PROBLEM_METAS } from "@/lib/problems/problemMeta.generated";

/**
 * ============================================================
 * Cross-reference integrity
 * ============================================================
 * This site is a dense web of hand-written cross-references, and almost
 * every one of them is an unchecked string: a markdown link to another
 * lesson, a `#anchor` into `/simulators` or `/glossary`, a glossary term's
 * `lessonSlugs`, a concept node's `prerequisiteIds`, a problem's
 * `relatedConcepts`, a hand-kept `(course, module)` pair in a chrome
 * component, a "(Lesson 5)" in prose. None of them is typed, and a broken
 * one does not crash anything — it renders a dead link, an empty list, or a
 * paragraph that cites the wrong lesson, and `next build` reports success.
 *
 * The suites that already existed cover a specific slice each:
 *
 *   - `lessons.test.ts` / `curriculumCoverage.test.ts` — lessonMeta
 *     `prerequisites` and `related` slugs, course/module membership,
 *     acyclicity, reachability.
 *   - `curriculum.test.ts` — course-level `prerequisites`.
 *   - `glossary.test.ts` / `termIds.test.ts` — glossary ids, `relatedIds`
 *     mutuality, and every `<Term id>` in the corpus.
 *   - `problems/registry.test.ts` — a problem's `meta.course` and
 *     `meta.lesson`.
 *   - `design/routes.test.ts` — nav / sitemap / App Router agreement.
 *   - `lessonImages.test.ts` — figure `src`, alt text and attribution.
 *
 * Everything below is a reference kind those suites do NOT resolve. Where a
 * check overlaps one of them it is noted in the test's own comment and is
 * deliberately the cheap, name-the-bad-value version.
 *
 * ---------------------------------------------------------------
 * Read from disk; never import a lesson MDX module
 * ---------------------------------------------------------------
 * Same rule `lessonImages.test.ts` and `routes.test.ts` follow, for the same
 * reason (docs/DEPLOYMENT.md, the build-memory invariant): importing lesson
 * bodies pulls ~219 compiled MDX modules with their KaTeX output through the
 * transform pipeline with no build cache. Every check here is either a
 * `readFileSync` over raw source or a read of a plain-data registry
 * (`lessonMeta.generated.ts`, `problemMeta.generated.ts`, `curriculum.ts`,
 * `glossary.ts`, `concepts.ts`), so the whole file runs in well under a
 * second.
 */

const ROOT = process.cwd();
const LESSONS_ROOT = path.join(ROOT, "src/content/lessons");
const CONTENT_ROOT = path.join(ROOT, "src/content");
const APP_ROOT = path.join(ROOT, "src/app");
const SIMULATORS_PAGE = path.join(APP_ROOT, "simulators/page.tsx");
const CONCEPTS_SOURCE = path.join(ROOT, "src/lib/content/concepts.ts");

function walk(dir: string, extensions: string[], out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, extensions, out);
    else if (extensions.some((extension) => entry.name.endsWith(extension))) out.push(full);
  }
  return out;
}

/** Repo-relative, forward-slashed — the form a failure message should print. */
function repoPath(file: string): string {
  return path.relative(ROOT, file).replace(/\\/g, "/");
}

/** 1-based line number of a character offset, for `file:line` messages. */
function lineOf(source: string, index: number): number {
  return source.slice(0, index).split(/\r?\n/).length;
}

const sourceCache = new Map<string, string>();
function read(file: string): string {
  let text = sourceCache.get(file);
  if (text === undefined) {
    text = fs.readFileSync(file, "utf8");
    sourceCache.set(file, text);
  }
  return text;
}

// ---------------------------------------------------------------------------
// The resolvable universes every reference below is checked against
// ---------------------------------------------------------------------------

const LESSON_SLUGS = new Set(LESSON_METAS.map((meta) => meta.slug));
const LESSON_BY_SLUG = new Map(LESSON_METAS.map((meta) => [meta.slug, meta] as const));
const COURSE_SLUGS = new Set(COURSES.map((course) => course.slug));
const PILLAR_SLUGS = new Set<string>(PILLARS.map((pillar) => pillar.slug));
const GLOSSARY_IDS = new Set(GLOSSARY_TERMS.map((term) => term.id));
const CONCEPT_IDS = new Set(CONCEPT_NODES.map((node) => node.id));
const PROBLEM_SLUGS = new Set(PROBLEM_METAS.map((meta) => meta.slug));

/**
 * The `/simulators` page addresses two different kinds of thing by id —
 * each instrument's mount (`<div id={id}>`, from `SIMULATOR_INDEX`) and each
 * group heading (`<section id={group.id}>`, from `SIMULATOR_GROUPS`) — and
 * both are legitimate `/simulators#…` targets. They are kept apart here
 * because only the *instruments* can be orphaned: a group heading is the
 * page's own internal structure and is not something a lesson would ever be
 * expected to link.
 *
 * Read by regex rather than by importing the page, which pulls in fourteen
 * lazy simulator bundles. The two id lists are separated by slicing the
 * source at the two `const` declarations; the id pattern itself uses
 * `[ \t]` rather than `\s` so a match can never span lines and swallow an
 * instrument id into the group list (which would silently defang the
 * orphan check below).
 */
function simulatorSections(): { instruments: Set<string>; groups: Set<string>; all: Set<string> } {
  const source = read(SIMULATORS_PAGE);
  const indexAt = source.indexOf("const SIMULATOR_INDEX");
  const groupsAt = source.indexOf("const SIMULATOR_GROUPS");
  if (indexAt < 0 || groupsAt < 0 || groupsAt < indexAt) {
    throw new Error(
      "Could not find `const SIMULATOR_INDEX` … `const SIMULATOR_GROUPS` in src/app/simulators/page.tsx — " +
        "the page was restructured and this parser must be updated, otherwise every /simulators#anchor check " +
        "below passes by rejecting nothing."
    );
  }
  const idsIn = (text: string) =>
    new Set([...text.matchAll(/^[ \t]*id: "([a-z0-9-]+)",$/gm)].map((match) => match[1]));

  const instruments = idsIn(source.slice(indexAt, groupsAt));
  const groups = idsIn(source.slice(groupsAt));
  return { instruments, groups, all: new Set([...instruments, ...groups]) };
}

function simulatorAnchorIds(): Set<string> {
  return simulatorSections().all;
}

/**
 * The `SimulatorId` union as authored in concepts.ts.
 *
 * TypeScript checks that a `simulatorId` field spells one of these; nothing
 * checks that the union itself still matches the page. A member that no
 * longer exists on `/simulators` is a dangling anchor that typechecks.
 */
function declaredSimulatorIds(): string[] {
  const block = read(CONCEPTS_SOURCE).match(/export type SimulatorId =([\s\S]*?);/);
  if (!block) throw new Error("Could not find `export type SimulatorId = …;` in src/lib/content/concepts.ts");
  return [...block[1].matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
}

/** Top-level App Router pages, e.g. "/glossary" — the same walk routes.test.ts does. */
function staticRoutes(): Set<string> {
  const routes = new Set<string>(["/"]);
  for (const entry of fs.readdirSync(APP_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("[") || entry.name.startsWith("_")) continue;
    if (fs.existsSync(path.join(APP_ROOT, entry.name, "page.tsx"))) routes.add(`/${entry.name}`);
  }
  return routes;
}

// ---------------------------------------------------------------------------
// Link collection
// ---------------------------------------------------------------------------

type InternalLink = {
  /** The href exactly as written. */
  href: string;
  /** Path part, query and fragment stripped. */
  pathname: string;
  /** Fragment without the `#`, or "". */
  hash: string;
  /** "src/content/lessons/…​.mdx:412" */
  where: string;
};

/**
 * Every site-internal link written in the MDX corpus: markdown
 * `[text](/path)` and raw `href="/path"` inside JSX. Both forms are checked
 * because lesson content uses both (`<NextDiscovery>` bodies are markdown;
 * a few components take an href attribute).
 */
function collectMdxLinks(): InternalLink[] {
  const links: InternalLink[] = [];
  for (const file of walk(CONTENT_ROOT, [".mdx"])) {
    const source = read(file);
    for (const match of source.matchAll(/\]\((\/[^)\s]*)\)|href="(\/[^"]*)"/g)) {
      const href = (match[1] ?? match[2])!;
      const [beforeHash, hash = ""] = href.split("#");
      links.push({
        href,
        pathname: beforeHash.split("?")[0].replace(/\/$/, "") || "/",
        hash,
        where: `${repoPath(file)}:${lineOf(source, match.index!)}`,
      });
    }
  }
  return links;
}

/**
 * Site-internal paths written as *literal* strings in TS/TSX source —
 * `/simulators/page.tsx`'s per-instrument `lesson.href`, the home sections'
 * hand-picked lesson links, and anything similar added later.
 *
 * Deliberately literal-only: the overwhelming majority of hrefs in
 * components are template literals built from a slug that came out of the
 * registry (`/lessons/${lesson.slug}`), which are correct by construction
 * and cannot be resolved from source text anyway. A three-segment literal
 * lesson path, by contrast, is a hand-typed reference with nothing checking
 * it. Placeholder shapes in doc comments (`/lessons/<slug>`,
 * `/problems/[slug]`) do not match these patterns and are skipped.
 */
function collectLiteralSourceLinks(): InternalLink[] {
  const links: InternalLink[] = [];
  const files = walk(path.join(ROOT, "src"), [".ts", ".tsx"]).filter(
    (file) => !file.includes(`${path.sep}__tests__${path.sep}`)
  );
  for (const file of files) {
    const source = read(file);
    for (const match of source.matchAll(
      /["'`](\/lessons\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+|\/courses\/[a-z0-9-]+|\/problems\/[a-z0-9-]+)(#[a-z0-9-]+)?["'`]/g
    )) {
      links.push({
        href: match[1] + (match[2] ?? ""),
        pathname: match[1],
        hash: (match[2] ?? "").replace("#", ""),
        where: `${repoPath(file)}:${lineOf(source, match.index!)}`,
      });
    }
  }
  return links;
}

/** Resolves one internal link; returns a human-readable reason, or null. */
function brokenReason(
  link: InternalLink,
  simulatorIds: Set<string>,
  routes: Set<string>
): string | null {
  const { pathname, hash } = link;

  if (pathname.startsWith("/lessons/")) {
    const slug = pathname.slice("/lessons/".length);
    if (!LESSON_SLUGS.has(slug)) return `no lesson "${slug}" exists`;
    return null;
  }
  if (pathname.startsWith("/courses/")) {
    const slug = pathname.slice("/courses/".length);
    if (!COURSE_SLUGS.has(slug)) return `no course "${slug}" exists in curriculum.ts`;
    return null;
  }
  if (pathname.startsWith("/problems/")) {
    const slug = pathname.slice("/problems/".length);
    if (!PROBLEM_SLUGS.has(slug)) return `no problem "${slug}" exists in the registry`;
    return null;
  }
  if (pathname === "/simulators" && hash) {
    if (!simulatorIds.has(hash)) return `/simulators has no section with id "${hash}"`;
    return null;
  }
  if (pathname === "/glossary" && hash) {
    if (!GLOSSARY_IDS.has(hash)) return `no glossary entry has id "${hash}"`;
    return null;
  }
  if (pathname === "/learn" && hash) {
    // CurriculumExplorer renders `<section id={pillar.slug}>` per pillar.
    if (!PILLAR_SLUGS.has(hash)) return `/learn has no anchor "${hash}" (its anchors are pillar slugs)`;
    return null;
  }
  if (pathname === "/map" || pathname.startsWith("/api")) return null;
  if (!routes.has(pathname)) return `no App Router page renders "${pathname}"`;
  return null;
}

describe("every internal link in the MDX corpus resolves", () => {
  const links = collectMdxLinks();
  const simulatorIds = simulatorAnchorIds();
  const routes = staticRoutes();

  it("finds the links to check (guards the guard)", () => {
    // If the matcher ever stops matching — a change in how content writes
    // links, a move to a component instead of markdown — every assertion
    // below would pass by having nothing to assert on. 246 links across the
    // corpus on 2026-08-29; the floor is a slack lower bound, not a census.
    expect(
      links.length,
      "found almost no internal links in the MDX corpus — the matcher in collectMdxLinks() has rotted"
    ).toBeGreaterThan(150);
  });

  it("points every /lessons/… link at a lesson that exists", () => {
    const broken = links
      .filter((link) => link.pathname.startsWith("/lessons/"))
      .map((link) => ({ link, reason: brokenReason(link, simulatorIds, routes) }))
      .filter(({ reason }) => reason !== null)
      .map(({ link, reason }) => `${link.where}  ${link.href} — ${reason}`);

    expect(
      broken,
      "a lesson link that does not resolve renders as a dead link and 404s; fix the slug or restore the lesson"
    ).toEqual([]);
  });

  it("points every #anchor link at an anchor that exists", () => {
    const broken = links
      .filter((link) => link.hash !== "")
      .map((link) => ({ link, reason: brokenReason(link, simulatorIds, routes) }))
      .filter(({ reason }) => reason !== null)
      .map(({ link, reason }) => `${link.where}  ${link.href} — ${reason}`);

    expect(
      broken,
      "an anchor that no longer matches its target scrolls nowhere and reports no error — rename the anchor or the link"
    ).toEqual([]);
  });

  it("points every other internal link at a real route", () => {
    const broken = links
      .filter((link) => !link.pathname.startsWith("/lessons/") && link.hash === "")
      .map((link) => ({ link, reason: brokenReason(link, simulatorIds, routes) }))
      .filter(({ reason }) => reason !== null)
      .map(({ link, reason }) => `${link.where}  ${link.href} — ${reason}`);

    expect(broken, "lesson prose links to a page the App Router does not serve").toEqual([]);
  });

  it("never links a lesson to itself", () => {
    // A self-link is always a copy-paste artifact: the reader is offered
    // "read this next" and lands back where they already are.
    const selfLinks: string[] = [];
    for (const file of walk(LESSONS_ROOT, [".mdx"])) {
      const slug = repoPath(file).slice("src/content/lessons/".length).replace(/\.mdx$/, "");
      const source = read(file);
      for (const match of source.matchAll(/\]\((\/lessons\/[a-z0-9/-]+)\)/g)) {
        if (match[1].slice("/lessons/".length) === slug) {
          selfLinks.push(`${repoPath(file)}:${lineOf(source, match.index!)} links to itself`);
        }
      }
    }
    expect(selfLinks, "a lesson offering itself as the next thing to read is a dead end").toEqual([]);
  });
});

describe("every literal internal path hard-coded in TS/TSX source resolves", () => {
  const links = collectLiteralSourceLinks();
  const simulatorIds = simulatorAnchorIds();
  const routes = staticRoutes();

  it("finds hand-written literal paths to check (guards the guard)", () => {
    // 16 distinct literal lesson paths on 2026-08-29 — most of them
    // `/simulators`'s per-instrument "the lesson that introduces this"
    // links, which nothing else validates.
    expect(
      links.length,
      "found no literal /lessons|/courses|/problems paths in TS/TSX — collectLiteralSourceLinks() has rotted"
    ).toBeGreaterThan(8);
  });

  it("resolves every one of them", () => {
    const broken = links
      .map((link) => ({ link, reason: brokenReason(link, simulatorIds, routes) }))
      .filter(({ reason }) => reason !== null)
      .map(({ link, reason }) => `${link.where}  ${link.href} — ${reason}`);

    expect(
      broken,
      "a hand-typed path in a component is not derived from any registry, so nothing but this test notices when its target moves"
    ).toEqual([]);
  });
});

describe("every simulator reference points at a real instrument on /simulators", () => {
  const sections = simulatorSections();
  const anchors = sections.all;

  it("finds the instrument ids on the page (guards the guard)", () => {
    // Fourteen instruments and five group headings on 2026-08-29, parsed
    // separately so a parser that merged the two could never quietly turn
    // the orphan check below into a no-op.
    expect(sections.instruments.size, "parsed no ids out of SIMULATOR_INDEX").toBeGreaterThanOrEqual(14);
    expect(sections.groups.size, "parsed no ids out of SIMULATOR_GROUPS").toBeGreaterThanOrEqual(3);
    for (const groupId of sections.groups) {
      expect(
        sections.instruments.has(groupId),
        `"${groupId}" was parsed as both an instrument and a group — the id parser is matching across declarations`
      ).toBe(false);
    }
  });

  it("backs every member of the SimulatorId union with a section on the page", () => {
    // `SimulatorId` is a string union, so TypeScript catches a misspelling
    // at a `simulatorId:` call site — but not a union member whose section
    // has since been renamed or removed on `/simulators`. That combination
    // typechecks and links nowhere.
    const declared = declaredSimulatorIds();
    expect(declared.length, "parsed no members out of the SimulatorId union").toBeGreaterThan(10);
    const missing = declared.filter((id) => !anchors.has(id));
    expect(
      missing,
      "these SimulatorId members have no matching section on /simulators — every /simulators#<id> built from them scrolls nowhere"
    ).toEqual([]);
  });

  it("resolves every concept node's and glossary term's simulatorId", () => {
    const broken = [
      ...CONCEPT_NODES.filter((node) => node.simulatorId && !anchors.has(node.simulatorId)).map(
        (node) => `concept "${node.id}" -> "${node.simulatorId}"`
      ),
      ...GLOSSARY_TERMS.filter((term) => term.simulatorId && !anchors.has(term.simulatorId)).map(
        (term) => `glossary "${term.id}" -> "${term.simulatorId}"`
      ),
    ];
    expect(
      broken,
      "the concept panel and the glossary entry both render this as a `/simulators#<id>` link — a stale id renders a link that goes nowhere"
    ).toEqual([]);
  });

  it("has at least one lesson, concept or glossary entry pointing at every instrument", () => {
    // The orphan direction: an instrument nothing in the corpus sends a
    // reader to is only ever found by scrolling `/simulators` itself.
    // Group headings are excluded by construction — `sections.instruments`
    // is parsed from `SIMULATOR_INDEX` alone.
    const referenced = new Set<string>();
    for (const node of CONCEPT_NODES) if (node.simulatorId) referenced.add(node.simulatorId);
    for (const term of GLOSSARY_TERMS) if (term.simulatorId) referenced.add(term.simulatorId);
    for (const file of walk(LESSONS_ROOT, [".mdx"])) {
      const source = read(file);
      for (const match of source.matchAll(/\/simulators#([a-z0-9-]+)/g)) referenced.add(match[1]);
      // A lesson that embeds the instrument inline counts too: the reader
      // meets it in context, which is the stronger form of the same link.
      for (const match of source.matchAll(/<Lazy([A-Za-z]+)\b/g)) {
        referenced.add(
          match[1]
            .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
            .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
            .toLowerCase()
        );
      }
    }

    const orphans = [...sections.instruments].filter((id) => !referenced.has(id));
    expect(
      orphans,
      "these instruments are reachable only by scrolling /simulators — give each a lesson that embeds or links it, or retire it"
    ).toEqual([]);
  });
});

describe("every lesson slug written into the glossary and the concept map resolves", () => {
  // `glossary.test.ts` has a test named "every entry carries a level and at
  // least one real lesson slug" — but it only asserts `lessonSlugs.length >
  // 0`. Nothing has ever resolved those slugs, in either file, despite both
  // files' doc comments promising they were "verified against the real file
  // paths". A stale slug here empties the "Where this appears" list on
  // `/glossary` and the lesson list in the concept map's detail panel, with
  // no error anywhere.
  it("resolves every glossary term's lessonSlugs", () => {
    const broken: string[] = [];
    for (const term of GLOSSARY_TERMS) {
      for (const slug of term.lessonSlugs) {
        if (!LESSON_SLUGS.has(slug)) broken.push(`glossary "${term.id}" -> "${slug}"`);
      }
    }
    expect(
      broken,
      "a glossary entry pointing at a lesson that no longer exists silently renders one fewer link on /glossary"
    ).toEqual([]);
  });

  it("resolves every concept node's lessonSlugs", () => {
    const broken: string[] = [];
    for (const node of CONCEPT_NODES) {
      for (const slug of node.lessonSlugs) {
        if (!LESSON_SLUGS.has(slug)) broken.push(`concept "${node.id}" -> "${slug}"`);
      }
      expect(
        node.lessonSlugs.length,
        `concept "${node.id}" lists no lessons — the /map detail panel would have nowhere to send the reader`
      ).toBeGreaterThan(0);
    }
    expect(
      broken,
      "a concept node pointing at a missing lesson leaves the /map detail panel with a shorter list and no error"
    ).toEqual([]);
  });

  it("checks a corpus of the expected size (guards the guard)", () => {
    expect(GLOSSARY_TERMS.length).toBeGreaterThan(200);
    expect(CONCEPT_NODES.length).toBeGreaterThan(50);
  });

  it("resolves every lessonMeta.related slug", () => {
    // Deliberate cheap-side redundancy, exactly the tradeoff
    // `curriculumCoverage.test.ts` documents for `prerequisites`. That file
    // moved the prerequisite-slug check off `lessons.test.ts` (which resolves
    // both, but only after importing all 219 compiled MDX modules — minutes,
    // gigabytes, and a timeout raised twice) and left `related` behind. So
    // `related` is *guarded*, but only by the suite nobody runs while
    // editing. This is the millisecond version; the slug set it reads is the
    // same generated registry, so the two can never disagree.
    const broken: string[] = [];
    for (const meta of LESSON_METAS) {
      for (const related of meta.related ?? []) {
        if (!LESSON_SLUGS.has(related.slug)) broken.push(`lesson "${meta.slug}" -> "${related.slug}"`);
      }
    }
    expect(
      broken,
      "LessonMetaStrip's \"Related elsewhere\" list silently drops an entry whose slug no longer resolves"
    ).toEqual([]);
  });
});

describe("the concept graph's own edges resolve", () => {
  // `prerequisitePath.test.ts` walks these edges but skips any id that
  // does not resolve (`if (!byId.has(prereqId)) continue`) — so every one of
  // its tests passes on a graph full of dangling edges. Resolution itself
  // was never asserted anywhere.
  it("resolves every prerequisiteId to a real concept node", () => {
    const broken: string[] = [];
    for (const node of CONCEPT_NODES) {
      for (const prerequisiteId of node.prerequisiteIds) {
        if (!CONCEPT_IDS.has(prerequisiteId)) broken.push(`concept "${node.id}" -> "${prerequisiteId}"`);
      }
    }
    expect(
      broken,
      "getPrerequisitePath() silently drops an unknown prerequisite, so a typo here shortens a reader's route through the map with no error"
    ).toEqual([]);
  });

  it("has no cycles in the concept prerequisite graph", () => {
    const byId = new Map(CONCEPT_NODES.map((node) => [node.id, node] as const));
    const VISITING = 1;
    const VISITED = 2;
    const state = new Map<string, 1 | 2>();
    const cycles: string[] = [];

    function visit(id: string, trail: string[]): void {
      const status = state.get(id);
      if (status === VISITED) return;
      if (status === VISITING) {
        cycles.push([...trail, id].join(" -> "));
        return;
      }
      state.set(id, VISITING);
      for (const prerequisiteId of byId.get(id)?.prerequisiteIds ?? []) {
        if (!byId.has(prerequisiteId)) continue; // reported by the test above
        visit(prerequisiteId, [...trail, id]);
      }
      state.set(id, VISITED);
    }

    for (const node of CONCEPT_NODES) visit(node.id, []);
    expect(cycles, "a cycle makes the /map prerequisite route unsatisfiable — nothing can be learned first").toEqual([]);
  });

  it("gives every concept node a glossary entry to link to", () => {
    // `GLOSSARY_TERMS` is built as CONCEPT_NODES ++ ADDITIONAL_GLOSSARY_TERMS,
    // so this holds by construction today — which is exactly why it is worth
    // pinning: `ConceptDetailPanel` renders `/glossary#{node.id}`
    // unconditionally, so the day that construction changes, every concept
    // panel on `/map` grows a dead anchor.
    const missing = CONCEPT_NODES.filter((node) => !GLOSSARY_IDS.has(node.id)).map((node) => node.id);
    expect(missing, "ConceptDetailPanel links /glossary#<concept id> for every node").toEqual([]);
  });
});

describe("every lesson slug a problem points at resolves", () => {
  // `problems/registry.test.ts` checks `meta.course` and `meta.lesson`.
  // It does not check `meta.prerequisites` (lesson slugs) or the
  // `relatedConcepts` array, and nothing checks that a problem's course and
  // its lesson's course are the same course.
  it("resolves every problem's meta.prerequisites", () => {
    const broken: string[] = [];
    for (const meta of PROBLEM_METAS) {
      for (const prerequisite of meta.prerequisites ?? []) {
        if (!LESSON_SLUGS.has(prerequisite)) broken.push(`problem "${meta.slug}" -> "${prerequisite}"`);
      }
    }
    expect(broken, "a problem's prerequisite lesson slug is rendered as a link; a stale one 404s").toEqual([]);
  });

  it("resolves every relatedConcepts entry in the problem corpus", () => {
    // `relatedConcepts` lives on the `Problem` object, not on `ProblemMeta`,
    // so it is absent from the generated meta registry entirely — reading the
    // authored source is the only way to check it without importing all 547
    // problem modules and the quantum engine behind them.
    const broken: string[] = [];
    let checked = 0;
    for (const file of walk(path.join(CONTENT_ROOT, "problems"), [".ts"])) {
      const source = read(file);
      for (const block of source.matchAll(/relatedConcepts:\s*\[([\s\S]*?)\]/g)) {
        for (const entry of block[1].matchAll(/"([^"]+)"/g)) {
          checked += 1;
          if (!LESSON_SLUGS.has(entry[1])) {
            broken.push(`${repoPath(file)}:${lineOf(source, block.index!)} -> "${entry[1]}"`);
          }
        }
      }
    }
    expect(checked, "found no relatedConcepts entries — the matcher has rotted").toBeGreaterThan(0);
    expect(broken, "relatedConcepts entries are lesson slugs; a stale one silently drops the cross-link").toEqual([]);
  });

  it("files every problem under the same course as the lesson it is attached to", () => {
    // Both fields resolve individually (registry.test.ts), and can still
    // disagree: `/problems` filters and the course checkpoint sample read
    // `meta.course`, while `PracticeLinks` on the lesson page reads
    // `meta.lesson`. When the two name different courses the problem shows up
    // in one course's practice set while its own lesson lives in another.
    const mismatched: string[] = [];
    for (const meta of PROBLEM_METAS) {
      if (!meta.lesson) continue;
      const lesson = LESSON_BY_SLUG.get(meta.lesson);
      if (!lesson) continue; // registry.test.ts owns the dangling case
      if (lesson.course !== meta.course) {
        mismatched.push(
          `problem "${meta.slug}" declares course "${meta.course}" but its lesson "${meta.lesson}" belongs to "${lesson.course}"`
        );
      }
    }
    expect(mismatched, "fix whichever of the two fields is wrong — they cannot both be right").toEqual([]);
  });

  it("attaches every problem to a lesson (no problem is an orphan)", () => {
    // `meta.lesson` is optional on the type, and `PracticeLinks` — the only
    // place a reader meets a problem in context — keys off it. A problem
    // without one is reachable only from the `/problems` catalog. All 547
    // carry one as of 2026-08-29; if a deliberately course-level problem is
    // ever authored, record that decision here rather than deleting the test.
    const orphans = PROBLEM_METAS.filter((meta) => !meta.lesson).map((meta) => meta.slug);
    expect(
      orphans,
      "these problems are attached to no lesson, so no lesson's practice list ever links them"
    ).toEqual([]);
  });
});

describe("every hand-kept course/module pair in the chrome resolves", () => {
  /**
   * Two components carry a hand-authored table of `(course, grounding
   * module)` pairs — `ApexOpenProblems` (the open-research framings on
   * `/apex`) and `MasteryResultsIndex` (the landmark results on `/mastery`).
   * Both resolve the pair at render with `lessons.find(...)` and fall back
   * silently to the course page when it misses, so a renamed module turns a
   * pointed "here is the lesson that establishes this" link into a generic
   * one with no error and no visual difference worth noticing.
   */
  const TABLES = [
    "src/components/apex/ApexOpenProblems.tsx",
    "src/components/mastery/MasteryResultsIndex.tsx",
  ] as const;

  it("finds the tables and their entries (guards the guard)", () => {
    let entries = 0;
    for (const table of TABLES) {
      const source = read(path.join(ROOT, table));
      entries += [...source.matchAll(/^\s*course: "([a-z0-9-]+)",$/gm)].length;
    }
    // Five entries in each table on 2026-08-29.
    expect(entries, "parsed no `course: \"…\"` entries out of the chrome tables").toBeGreaterThanOrEqual(8);
  });

  it("resolves each entry's course, module, and the lesson behind that module", () => {
    const broken: string[] = [];
    for (const table of TABLES) {
      const file = path.join(ROOT, table);
      const source = read(file);
      // Entries are authored as `course: "…"` followed, within the same
      // object literal, by `grounding: "…"`. Pairing them positionally is
      // safe because that ordering is what both files write; a file that
      // stops doing so trips the count check above.
      const courses = [...source.matchAll(/^\s*course: "([a-z0-9-]+)",$/gm)];
      const groundings = [...source.matchAll(/^\s*grounding: "([a-z0-9-]+)",$/gm)];
      expect(
        groundings.length,
        `${table} has ${courses.length} course entries but ${groundings.length} grounding entries — the pairing this test relies on no longer holds`
      ).toBe(courses.length);

      for (const [index, courseMatch] of courses.entries()) {
        const courseSlug = courseMatch[1];
        const moduleSlug = groundings[index][1];
        const where = `${table}:${lineOf(source, groundings[index].index!)}`;
        const course = getCourse(courseSlug);
        if (!course) {
          broken.push(`${where} names course "${courseSlug}", which is not in curriculum.ts`);
          continue;
        }
        if (!course.modules.some((courseModule) => courseModule.slug === moduleSlug)) {
          broken.push(`${where} names module "${moduleSlug}", which course "${courseSlug}" does not have`);
          continue;
        }
        const hasLesson = LESSON_METAS.some(
          (meta) => meta.course === courseSlug && meta.module === moduleSlug
        );
        if (!hasLesson) {
          broken.push(`${where} grounds on "${courseSlug}/${moduleSlug}", which has no authored lesson`);
        }
      }
    }
    expect(
      broken,
      "these entries fall back to the course page instead of the lesson they name, silently — fix the slug"
    ).toEqual([]);
  });
});

describe("every Current Quantum entry points at a lesson that exists", () => {
  // `currentQuantum/__tests__/registry.test.ts` checks that both halves of
  // the collection agree on their slugs and that the per-lesson lookups
  // agree with each other — but it never resolves `relatedLessonSlug`
  // against the lesson corpus, so a renamed lesson turns the card's "why
  // this matters" link into a 404 while every existing test stays green.
  it("resolves relatedLessonSlug for every entry", () => {
    expect(CURRENT_QUANTUM_META.length, "guards the guard — the collection should not be empty").toBeGreaterThan(10);
    const broken = CURRENT_QUANTUM_META.filter(
      (meta) => !LESSON_SLUGS.has(meta.relatedLessonSlug)
    ).map((meta) => `"${meta.slug}" -> "${meta.relatedLessonSlug}"`);
    expect(broken, "the Current Quantum card renders this as its only outbound lesson link").toEqual([]);
  });
});

describe("every ordinal lesson reference in prose points at a lesson the course has", () => {
  /**
   * Prose cites sibling lessons positionally — "(Lesson 5)", "Module 2's
   * derived error bound" — and a course page numbers its lessons `01, 02,
   * …` straight off `course.modules` order. Nothing connects the two. Insert
   * a lesson, reorder a module, or move content between lessons (all of
   * which happened this sprint) and every one of these citations silently
   * points one lesson off, still reading perfectly.
   *
   * What is checkable without judging the physics: the number must exist in
   * the course being cited, and a lesson must never cite its own position.
   * A citation that names another course first ("Angular Momentum & Spin,
   * Lesson 1") is resolved against *that* course.
   */
  const orderedByCourse = new Map<string, { slug: string; title: string }[]>();
  for (const course of COURSES) {
    const byModule = new Map<string, typeof LESSON_METAS>();
    for (const meta of LESSON_METAS) {
      if (meta.course !== course.slug) continue;
      byModule.set(meta.module, [...(byModule.get(meta.module) ?? []), meta]);
    }
    orderedByCourse.set(
      course.slug,
      course.modules.flatMap((courseModule) =>
        [...(byModule.get(courseModule.slug) ?? [])]
          .sort((a, b) => a.order - b.order)
          .map((meta) => ({ slug: meta.slug, title: meta.title }))
      )
    );
  }

  /** "Angular Momentum & Spin" -> "angular momentum and spin", etc. */
  function normalizeTitle(value: string): string {
    return value
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
  const COURSE_TITLES = COURSES.map((course) => ({
    slug: course.slug,
    normalized: normalizeTitle(course.title),
  }));

  type Citation = { where: string; kind: string; number: number; courseSlug: string; selfSlug: string };

  function collectCitations(): Citation[] {
    const citations: Citation[] = [];
    for (const file of walk(LESSONS_ROOT, [".mdx"])) {
      const selfSlug = repoPath(file).slice("src/content/lessons/".length).replace(/\.mdx$/, "");
      const selfCourse = LESSON_BY_SLUG.get(selfSlug)?.course;
      if (!selfCourse) continue;
      const source = read(file);
      for (const match of source.matchAll(/\b(Lesson|Module)\s+(\d+)\b/g)) {
        // A citation that names another course in the run-up belongs to that
        // course, not this one. 140 characters is enough to span the
        // line-wrapped "(Angular\nMomentum & Spin, Lesson 1)" form the corpus
        // actually uses, and short enough not to swallow an unrelated course
        // mentioned a paragraph earlier.
        const lead = normalizeTitle(source.slice(Math.max(0, match.index! - 140), match.index!));
        const named = COURSE_TITLES.find(
          (course) => course.slug !== selfCourse && lead.includes(course.normalized)
        );
        citations.push({
          where: `${repoPath(file)}:${lineOf(source, match.index!)}`,
          kind: match[1],
          number: Number(match[2]),
          courseSlug: named?.slug ?? selfCourse,
          selfSlug,
        });
      }
    }
    return citations;
  }

  const citations = collectCitations();

  it("finds the citations to check (guards the guard)", () => {
    // 125 across the corpus on 2026-08-29.
    expect(citations.length, "found no `Lesson N` / `Module N` citations — the matcher has rotted").toBeGreaterThan(60);
  });

  it("cites a position the course actually has", () => {
    const broken = citations
      .filter((citation) => {
        const ordered = orderedByCourse.get(citation.courseSlug) ?? [];
        return citation.number < 1 || citation.number > ordered.length;
      })
      .map(
        (citation) =>
          `${citation.where}  "${citation.kind} ${citation.number}" — course "${citation.courseSlug}" has ${
            (orderedByCourse.get(citation.courseSlug) ?? []).length
          } lessons`
      );
    expect(
      broken,
      "prose cites a lesson number past the end of its course — the reader is sent to a lesson that does not exist"
    ).toEqual([]);
  });

  it("never cites the lesson doing the citing", () => {
    // "Lesson 4 proved …" written inside lesson 4 is always the residue of a
    // move: the sentence used to live somewhere else, or the lesson it named
    // was renumbered underneath it.
    const broken = citations
      .filter((citation) => {
        const ordered = orderedByCourse.get(citation.courseSlug) ?? [];
        return ordered[citation.number - 1]?.slug === citation.selfSlug;
      })
      .map((citation) => `${citation.where}  "${citation.kind} ${citation.number}" is this lesson's own position`);
    expect(
      broken,
      "a lesson citing itself by number means the citation was renumbered out from under the prose"
    ).toEqual([]);
  });
});

describe("prose that promises a photograph has one", () => {
  /**
   * The one prose claim that is mechanically checkable, and the one this
   * sprint made most likely to break: several lessons had photographs
   * replaced with computed figures. A sentence that says "the photograph
   * below" survives that edit intact and is simply, quietly wrong.
   *
   * Deliberately narrow. "The table below" / "the diagram below" are NOT
   * checked, because the corpus renders both through named components
   * (`<BB84RoundTable>`, `<PipelineDiagram>`, inline `<svg>`) that no regex
   * can enumerate without either false positives or an allowlist that would
   * need touching on every new component — an unreliable check is worse than
   * none. "Photograph" is different: exactly two components in the corpus
   * put a photograph on the page, and `lessonImages.test.ts` already
   * guarantees every photograph goes through one of them.
   */
  // Only the words that can mean *nothing but* a photograph. "Pictured
  // above", "shown above", "the figure below" are all used in this corpus for
  // computed SVGs and named visualization components, which no regex can
  // enumerate — matching them produces false positives on correct prose,
  // and a check that cries wolf gets deleted. "The photograph" cannot mean an
  // inline <svg>.
  const PHOTO_PROMISE =
    /\b(?:the|this|that)\s+(?:photograph|photo)\b|\bphotograph(?:ed)?\s+(?:above|below)\b/i;

  it("finds prose to check and lessons with figures (guards the guard)", () => {
    const withFigures = walk(LESSONS_ROOT, [".mdx"]).filter((file) =>
      /<(ExternalFigure|AnnotatedFigure)\b/.test(read(file))
    );
    expect(withFigures.length, "no lesson has a figure component — the detector has rotted").toBeGreaterThan(50);
  });

  it("has a figure component in every lesson whose prose points at a photograph", () => {
    const broken: string[] = [];
    for (const file of walk(LESSONS_ROOT, [".mdx"])) {
      const source = read(file);
      if (/<(ExternalFigure|AnnotatedFigure)\b/.test(source)) continue;
      source.split(/\r?\n/).forEach((line, index) => {
        // Skip JSX attribute lines: alt text, captions and `explanation="…"`
        // legitimately describe an image that lives in a sibling attribute.
        if (/^\s*[a-zA-Z]+="/.test(line)) return;
        if (PHOTO_PROMISE.test(line)) {
          broken.push(`${repoPath(file)}:${index + 1}  ${line.trim().slice(0, 120)}`);
        }
      });
    }
    expect(
      broken,
      "this lesson's prose points the reader at a photograph, but the lesson has no <ExternalFigure>/<AnnotatedFigure>. " +
        "Either the figure was replaced by a computed one and the sentence was not updated, or the figure was dropped."
    ).toEqual([]);
  });
});

describe("the committed search index agrees with the corpus", () => {
  /**
   * `public/search-index.json` is produced by
   * `npm run generate:search-index` (a `pre*` hook on dev/build/test) and
   * committed. It is what `/`'s search box actually serves, so an entry
   * pointing at a renamed lesson is a 404 a reader reaches from search while
   * every page on the site links correctly. Nothing compared the two.
   */
  const INDEX_PATH = path.join(ROOT, "public/search-index.json");

  type IndexEntry = { href?: string };
  function entries(): IndexEntry[] {
    const parsed = JSON.parse(read(INDEX_PATH)) as IndexEntry[] | { entries?: IndexEntry[] };
    return Array.isArray(parsed) ? parsed : (parsed.entries ?? []);
  }

  it("has entries to check (guards the guard)", () => {
    expect(entries().length, "the committed search index is empty").toBeGreaterThan(500);
  });

  it("resolves every lesson and glossary href it serves", () => {
    const broken: string[] = [];
    for (const entry of entries()) {
      const href = entry.href ?? "";
      if (href.startsWith("/lessons/") && !LESSON_SLUGS.has(href.slice("/lessons/".length))) {
        broken.push(href);
      }
      if (href.startsWith("/glossary#") && !GLOSSARY_IDS.has(href.slice("/glossary#".length))) {
        broken.push(href);
      }
    }
    expect(
      [...new Set(broken)],
      "the committed search index points at content that no longer exists — re-run `npm run generate:search-index`"
    ).toEqual([]);
  });

  it("indexes every authored lesson", () => {
    const indexed = new Set(
      entries()
        .map((entry) => entry.href ?? "")
        .filter((href) => href.startsWith("/lessons/"))
        .map((href) => href.slice("/lessons/".length))
    );
    const missing = [...LESSON_SLUGS].filter((slug) => !indexed.has(slug));
    expect(
      missing,
      "these lessons cannot be found from the search box — re-run `npm run generate:search-index`"
    ).toEqual([]);
  });
});
