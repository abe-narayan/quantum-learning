import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * ============================================================
 * /about's "On this page" anchors
 * ============================================================
 * /about is the page a reader opens when they are deciding whether to believe
 * the curriculum, and the two sections that answer that — how the content is
 * checked, and what the site refuses to claim — sat about 2,400px and 3,400px
 * down a 4,916px page at 375px wide. The strip of in-page anchors at the top
 * is the shortest route to them.
 *
 * An `href="#foo"` with no `id="foo"` in the document does nothing at all: no
 * navigation, no console error, no failing build. The heading is right there
 * in the same file, so the only way the link and the target come apart is a
 * later edit to one of them — which is exactly the edit nobody re-tests. Read
 * as source rather than rendered because the page is an async server component
 * that walks the lesson and problem registries to build its readouts, and the
 * question here is about static markup.
 */

const PAGE = readFileSync(path.resolve(import.meta.dirname, "../../app/about/page.tsx"), "utf8");

/** The `ABOUT_SECTIONS` entries, read out of the page's own source. */
const sections = [...PAGE.matchAll(/\{ id: "([^"]+)", label: "([^"]+)" \}/g)].map((match) => ({
  id: match[1],
  label: match[2],
}));

describe("/about section anchors", () => {
  it("declares the four sections the page is built from", () => {
    expect(sections.map((section) => section.id)).toEqual([
      "how-it-is-taught",
      "who-it-is-for",
      "verification",
      "scope",
    ]);
  });

  it("has exactly one heading carrying each anchor id", () => {
    for (const section of sections) {
      const occurrences = [...PAGE.matchAll(new RegExp(`id="${section.id}"`, "g"))].length;
      expect(occurrences, `#${section.id} has ${occurrences} targets, not 1`).toBe(1);
      // On a heading, not on some wrapper: the browser scrolls the id into
      // view, and landing on a panel's top edge with the heading above the
      // fold reads as landing in the wrong place.
      expect(PAGE, `#${section.id} is not on an h2`).toMatch(
        new RegExp(`<h2[^>]*\\n?\\s*id="${section.id}"|<h2 id="${section.id}"`),
      );
    }
  });

  it("clears the sticky header when it scrolls a section into view", () => {
    // The header is `sticky top-0` at `h-16` (64px). Without a scroll margin
    // the browser puts the heading at y=0, i.e. underneath the header, so the
    // anchor appears to land one heading too far down.
    for (const section of sections) {
      const heading = PAGE.slice(PAGE.indexOf(`id="${section.id}"`));
      expect(
        heading.slice(0, 200),
        `#${section.id} scrolls under the sticky header`,
      ).toContain("scroll-mt-");
    }
  });

  it("keeps each chip a 44px target", () => {
    // Four chips wrapping onto two rows on a phone, which is the arrangement
    // WCAG 2.5.8's spacing exception cannot rescue. Same `inline-flex
    // min-h-11` idiom the footer's reference links and the breadcrumbs use.
    const strip = PAGE.slice(PAGE.indexOf('aria-label="On this page"'));
    expect(strip.slice(0, 1200)).toContain("inline-flex min-h-11 items-center");
  });
});
