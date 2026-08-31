import { describe, expect, it, vi } from "vitest";
/* Components are constructed with `createElement` rather than JSX, for the
   reason `src/components/mdx/__tests__/Term.test.ts` documents: vitest's
   `include` is `src/**\/*.test.ts`, and `.ts` files are not parsed for JSX. */
import { renderToStaticMarkup } from "react-dom/server";

import { LESSON_METAS } from "@/lib/content/lessonMeta.generated";
import { PROBLEM_METAS } from "@/lib/problems/problemMeta.generated";
import { COURSES, PILLARS, getCoursesByPillar } from "@/lib/content/curriculum";
import { GLOSSARY_TERMS } from "@/lib/content/glossary";
import { CONCEPT_NODES } from "@/lib/content/concepts";
import { PILLAR_ORDER, PILLAR_VISUALS } from "@/lib/design/pillars";
import { START_LEARNING_HREF } from "@/lib/nav";

/**
 * ============================================================
 * The homepage's orientation layer has to actually orient
 * ============================================================
 * Measured on the page this replaced, in headless Chrome, at the two widths
 * the site promises to work at:
 *
 *   1440x900  the only actions in the first screen were the hero simulator's
 *             own preset buttons. "Start learning" was below the fold.
 *   375x812   **zero** actions in the first screen.
 *
 * A rendered-page harness (`scripts/audit/orientation.mjs`) is what measures
 * that, and it needs a dev server. What a unit test can pin is the part of the
 * failure that was structural rather than visual, and both halves of it had
 * already shipped once on this site:
 *
 *   1. **A destination that is not reachable.** The contents index is now the
 *      only place on the page where most of the site is named, so a typo in
 *      one `href` silently deletes a whole page from the homepage. The same
 *      class of defect put a `/problems/<slug>` that had never existed into
 *      the audit route list, where every "no findings" it ever produced was
 *      measuring the 404 page. Routes are checked against the registries that
 *      `generateStaticParams` builds from, so agreeing with them is the same
 *      thing as the page existing.
 *
 *   2. **A count typed rather than derived.** CLAUDE.md's standing example is
 *      the hand-typed 549 that rendered on every page against a corpus of 556.
 *      Ten figures are rendered here, and each is asserted against the
 *      registry it has to come from, so a literal pasted in place of a
 *      derivation fails rather than ships.
 *
 * Plus the one thing the whole rebuild exists for: the served markup of the
 * hero carries the primary call to action and says the site is free, without
 * any client JavaScript having run. Both are asserted against
 * `renderToStaticMarkup` output, which is the server payload, not the
 * hydrated page.
 */

// The hero mounts two things this test has no use for and cannot render: an
// async server component that walks the whole curriculum, and a
// `next/dynamic` client island with `ssr: false` (which contributes nothing
// to the served HTML anyway, so stubbing it changes nothing about what is
// being asserted).
vi.mock("@/components/curriculum/ContinueLearning", () => ({
  ContinueLearning: () => null,
}));
vi.mock("@/components/simulators/wavefunction-explorer/LazyWavefunctionHeroExplorer", () => ({
  LazyWavefunctionHeroExplorer: () => null,
}));

const { Hero } = await import("@/components/home/Hero");
const { EntryChooser } = await import("@/components/home/EntryChooser");
const { SiteContents } = await import("@/components/home/SiteContents");

/** Routes with no dynamic segment. Kept in step with `src/app/**` by hand,
 *  exactly as `src/lib/design/__tests__/routeInventory.test.ts` does. */
const STATIC_ROUTES = new Set([
  "/",
  "/about",
  "/learn",
  "/lessons",
  "/simulators",
  "/problems",
  "/glossary",
  "/map",
  "/current-quantum",
]);

/** A pillar's landing route is NOT `/${pillar}`; `PILLAR_VISUALS` owns the
 *  mapping, so it is derived here rather than retyped. */
const PILLAR_ROUTES = new Set(PILLAR_ORDER.map((pillar) => PILLAR_VISUALS[pillar].route));
const LESSON_ROUTES = new Set(LESSON_METAS.map((lesson) => `/lessons/${lesson.slug}`));

function routeExists(href: string): boolean {
  const [path] = href.split("#");
  return STATIC_ROUTES.has(path) || PILLAR_ROUTES.has(path) || LESSON_ROUTES.has(path);
}

/** Every `href` in a rendered fragment, in document order. */
function hrefsFrom(markup: string): string[] {
  return [...markup.matchAll(/href="([^"]*)"/g)].map((match) => match[1]);
}

/** Renders an async Server Component to the markup a browser would be served.
 *  `renderToStaticMarkup` cannot await a component itself, so the component is
 *  awaited first and only its returned tree is rendered. */
async function markupOf(component: () => Promise<React.ReactElement>): Promise<string> {
  return renderToStaticMarkup(await component());
}

describe("the homepage entry chooser", () => {
  it("offers four ways in, every one of them a page that exists", async () => {
    const hrefs = hrefsFrom(await markupOf(EntryChooser));

    // Four cards plus the two links in the closing "already know this?" line.
    expect(hrefs.length).toBeGreaterThanOrEqual(4);
    for (const href of hrefs) {
      expect(routeExists(href), `${href} is not a route this site builds`).toBe(true);
    }
    expect(new Set(hrefs).size, "two doors point at the same page").toBe(hrefs.length);
  });

  it("leads with the same lesson every other primary action on the site opens", async () => {
    const hrefs = hrefsFrom(await markupOf(EntryChooser));
    expect(hrefs[0]).toBe(START_LEARNING_HREF);
  });

  it("keeps a way past the introduction for a reader who already knows the subject", async () => {
    const hrefs = hrefsFrom(await markupOf(EntryChooser));
    expect(hrefs).toContain(PILLAR_VISUALS["quantum-mastery"].route);
    expect(hrefs).toContain(PILLAR_VISUALS.apex.route);
  });

  it("states what the site assumes, in the one wording that owns that claim", async () => {
    const markup = await markupOf(EntryChooser);
    // Not the sentence itself: `lib/entryBar.ts` owns it and `entryBar.test.ts`
    // pins its fragments. What matters here is that this section is where it
    // is said, since the hero no longer says it.
    expect(markup).toContain("school algebra and trigonometry");
  });
});

describe("the homepage contents index", () => {
  it("reaches every major destination in one click", async () => {
    const hrefs = new Set(hrefsFrom(await markupOf(SiteContents)));

    for (const href of [
      "/learn",
      "/lessons",
      "/problems",
      "/simulators",
      "/glossary",
      "/map",
      "/current-quantum",
      PILLAR_VISUALS["quantum-mastery"].route,
      PILLAR_VISUALS.apex.route,
      "/about",
    ]) {
      expect(hrefs.has(href), `the homepage no longer links to ${href}`).toBe(true);
    }
  });

  it("links only to pages that exist, and never twice to the same one", async () => {
    const hrefs = hrefsFrom(await markupOf(SiteContents));
    for (const href of hrefs) {
      expect(routeExists(href), `${href} is not a route this site builds`).toBe(true);
    }
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("derives every figure it prints from the registry that owns it", async () => {
    const markup = await markupOf(SiteContents);

    for (const figure of [
      `${COURSES.length} courses`,
      `${PILLARS.length} tracks`,
      `${LESSON_METAS.length} lessons`,
      `${PROBLEM_METAS.length} graded`,
      `${GLOSSARY_TERMS.length} terms`,
      `${CONCEPT_NODES.length} concepts`,
      `${getCoursesByPillar("quantum-mastery").length} courses`,
      `${getCoursesByPillar("apex").length} courses`,
    ]) {
      expect(markup, `"${figure}" is not what the index renders`).toContain(figure);
    }
  });
});

describe("the homepage hero, as served", () => {
  it("puts the primary call to action in the HTML, with no JavaScript run", async () => {
    const markup = await markupOf(Hero);
    const hrefs = hrefsFrom(markup);

    expect(hrefs).toContain(START_LEARNING_HREF);
    expect(markup).toContain("Start learning");
    // The secondary action, labelled as browsing rather than as a second
    // "start": one contract, one primary destination.
    expect(hrefs).toContain("/learn");
  });

  it("says the site is free, in its own element rather than mid-sentence", async () => {
    const markup = await markupOf(Hero);
    // The word on its own, in the display voice, is the whole point: it was
    // previously a subordinate clause in the second sentence of the second
    // paragraph, where the measurement found nobody reading it.
    expect(markup).toMatch(/>Free</);
  });

  it("names both halves of the subject and the price of entry", async () => {
    const markup = await markupOf(Hero);
    expect(markup).toContain("Quantum mechanics and quantum computing");
    expect(markup).toContain("No account");
  });

  it("carries exactly one h1", async () => {
    const markup = await markupOf(Hero);
    expect([...markup.matchAll(/<h1[\s>]/g)]).toHaveLength(1);
  });

  it("derives its scale readouts rather than printing a remembered number", async () => {
    const markup = await markupOf(Hero);
    expect(markup).toContain(`>${LESSON_METAS.length}<`);
    expect(markup).toContain(`>${PROBLEM_METAS.length}<`);
  });
});
