import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { TOUCH_TARGET_CLASSES } from "@/components/ui/IconButton";

/**
 * ============================================================
 * The 44px hit area in the site chrome
 * ============================================================
 * The header row is the one place on this site where several controls sit
 * side by side at the edge of a phone screen, and it is also the place where
 * the painted control deliberately stays smaller than its target: a row of
 * instrument faces has to share a baseline, so `IconButton` grows the hit
 * area on a transparent `::after` and leaves the 40px face where it is.
 *
 * That idiom is invisible in a rendered box measurement — `getBoundingClient-
 * Rect()` on the button returns 40x40 — which cuts both ways. It made
 * `scripts/audit/responsive.mjs` report five correct controls as failures
 * until it learned to resolve the pseudo-element, and it means a control that
 * simply *forgot* the idiom looks identical in the source to one that has it.
 * So the two facts a browser cannot cheaply re-derive are pinned here:
 * that the shared constant still means "at least 44px, never a shrink", and
 * that the controls which need it still ask for it.
 *
 * It has since grown past the chrome, because the same question — "is the
 * target still bigger than the mark?" — turns out to be un-askable of source
 * anywhere it is asked. The breadcrumbs and the glossary's two alphabets are
 * pinned below for the same reason the navbar's brand link is: a control that
 * dropped the idiom reads identically to one that never had it.
 */

const read = (path: string) => readFileSync(resolve(import.meta.dirname, path), "utf8");
const NAVBAR = read("../Navbar.tsx");
const FOOTER = read("../Footer.tsx");
const LESSON_LAYOUT = read("../../lessons/LessonLayout.tsx");
const PROBLEM_LAYOUT = read("../../problems/ProblemLayout.tsx");
const COURSE_PAGE = read("../../../app/courses/[slug]/page.tsx");
const GLOSSARY_FILTER = read("../../glossary/GlossaryFilter.tsx");

/** The `<nav aria-label="Breadcrumb">…</nav>` block of a layout, source text. */
const breadcrumbOf = (source: string) => {
  const start = source.indexOf('<nav aria-label="Breadcrumb"');
  expect(start, "no breadcrumb nav in this file").toBeGreaterThan(-1);
  const end = source.indexOf("</nav>", start);
  expect(end, "unterminated breadcrumb nav").toBeGreaterThan(start);
  return source.slice(start, end);
};

describe("TOUCH_TARGET_CLASSES", () => {
  it("declares a 44px box centred on the control", () => {
    expect(TOUCH_TARGET_CLASSES).toContain("after:absolute");
    expect(TOUCH_TARGET_CLASSES).toContain("after:h-11");
    expect(TOUCH_TARGET_CLASSES).toContain("after:w-11");
    expect(TOUCH_TARGET_CLASSES).toContain("after:-translate-x-1/2");
    expect(TOUCH_TARGET_CLASSES).toContain("after:-translate-y-1/2");
    // Without `content-['']` the pseudo-element is not generated at all and
    // the whole thing is silently inert — the class list still looks right.
    expect(TOUCH_TARGET_CLASSES).toContain("after:content-['']");
    // `relative`, or the box escapes to some ancestor and covers the wrong
    // region entirely.
    expect(TOUCH_TARGET_CLASSES).toContain("relative");
  });

  it("can only grow a control, never shrink one", () => {
    // `min-h-full`/`min-w-full` are what make this `max(44px, own size)`.
    // Drop them and the constant becomes a hard 44px, which would *shrink*
    // the hit area of any labelled trigger wider than that — the search
    // button with its visible "Search" text, for one.
    expect(TOUCH_TARGET_CLASSES).toContain("after:min-h-full");
    expect(TOUCH_TARGET_CLASSES).toContain("after:min-w-full");
  });
});

describe("the chrome's undersized controls", () => {
  it("gives the navbar's brand link the shared hit area", () => {
    // Below 400px `Wordmark`'s label is `sr-only`, so this link is the 32x32
    // mark alone — the smallest target in the chrome, at the screen edge
    // where a thumb is least accurate. Measured at 32x32 at both 320 and
    // 375px before this. The mark itself must stay 32px: the header row's
    // width budget at 320px is accounted for to the pixel in Navbar's own
    // comment, so the growth has to happen on the pseudo-element.
    const brandLink = NAVBAR.slice(NAVBAR.indexOf('href="/"'), NAVBAR.indexOf("<Wordmark"));
    expect(brandLink).toContain("TOUCH_TARGET_CLASSES");
  });

  it("keeps the footer's brand link at a 44px box", () => {
    // A different idiom, and deliberately so: the footer mark is 28px with a
    // paragraph directly under it, so padding cancelled by an equal negative
    // margin lifts the target without moving the text. There is no adjacent
    // control for the grown box to collide with there.
    const brandLink = FOOTER.slice(FOOTER.indexOf('href="/"'), FOOTER.indexOf("<Wordmark"));
    expect(brandLink).toMatch(/-my-2[\s\S]*py-2/);
  });

  it("keeps every footer reference link a full 44px row", () => {
    // `min-h-11` rather than the padding trick, because these sit at a 28px
    // pitch and the padding trick would overlap adjacent targets by 16px —
    // which mis-taps worse than an undersized target does. They stay
    // `inline-flex` (so the box hugs the label) on purpose too: the list is
    // two columns on a phone, and a full-width target would put the two
    // columns' boxes against each other.
    expect(FOOTER).toContain("inline-flex min-h-11 items-center rounded-sm");
  });
});

describe("undersized targets outside the chrome", () => {
  it("keeps every breadcrumb crumb a 44px target on all three layouts", () => {
    // `.tech-label` is 11px, so a crumb with no box of its own measures 13px
    // tall, and `gap-y-1` leaves 4px between the rows this nav wraps into on a
    // phone. WCAG 2.5.8's spacing exception needs a 24px circle centred on an
    // undersized target to reach no other target; at 13 + 4 those circles
    // overlap, so there was no exception to fall back on and the three
    // breadcrumbs were an AA failure across 800+ pages, not merely a miss
    // against this codebase's stricter 44px floor.
    //
    // Checked as "every crumb that is a link has the box", not "the file
    // mentions min-h-11 somewhere", because the failure mode is one crumb
    // added later without it — which is exactly how `LessonLayout` and the
    // course page came to differ from `ProblemLayout`, which already had it.
    for (const [name, source] of [
      ["LessonLayout", LESSON_LAYOUT],
      ["ProblemLayout", PROBLEM_LAYOUT],
      ["courses/[slug]/page", COURSE_PAGE],
    ] as const) {
      const crumbs = breadcrumbOf(source);
      const links = crumbs.match(/<Link\b/g)?.length ?? 0;
      const boxed = crumbs.match(/min-h-11/g)?.length ?? 0;
      expect(links, `${name} breadcrumb has no links`).toBeGreaterThan(0);
      expect(boxed, `${name} has a breadcrumb link with no 44px box`).toBe(links);
    }
  });

  it("keeps the glossary's touch A-Z at 44x44 and its mouse rail at 24x24", () => {
    // Two copies of one alphabet, `lg:hidden` and `hidden lg:flex`, and the
    // sizes are deliberately different: 26 adjacent targets 2px apart is the
    // classic mis-tap row under a thumb, while at `lg` the pointer is a mouse
    // and a 44px rail would be 1194px tall, i.e. an index you have to scroll
    // to read. Pinned because the touch strip was `h-11 w-8` for a while,
    // which reads as a considered pair of numbers rather than as one
    // dimension that had been left short of the site's own floor.
    expect(GLOSSARY_FILTER).toContain("flex h-11 w-11 shrink-0 items-center justify-center rounded");
    expect(GLOSSARY_FILTER).not.toContain("h-11 w-8");
    expect(GLOSSARY_FILTER).toContain("flex h-6 w-6 items-center justify-center rounded");
  });
});
