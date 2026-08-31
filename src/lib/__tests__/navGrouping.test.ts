import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  NAV_ITEMS,
  PRIMARY_NAV_ITEMS,
  REFERENCE_NAV_ITEMS,
  TRACK_NAV_ITEMS,
  FOOTER_REFERENCE_ITEMS,
} from "@/lib/nav";

/**
 * ============================================================
 * The header's grouping of the top-level nav
 * ============================================================
 * `src/lib/design/__tests__/routes.test.ts` already asserts that every href in
 * `NAV_ITEMS` and `TRACK_NAV_ITEMS` has a page on disk and an entry in the
 * sitemap. That is the "does it resolve" half. This file is the other half:
 * that the *bar* still offers every one of those destinations after they were
 * split into a flat group and a dropdown group, and that the label a reader
 * clicks names the page they land on.
 *
 * Why it needs a test at all. The desktop bar no longer renders `NAV_ITEMS`
 * directly; it renders `PRIMARY_NAV_ITEMS` plus a "Reference" dropdown over
 * `REFERENCE_NAV_ITEMS`. Those two are derived from `NAV_ITEMS` by href, so a
 * *renamed* route fails loudly at module load (`navItem` throws). What nothing
 * catches is a route **added** to `NAV_ITEMS` and put in neither group: it
 * would still be in the footer, still in the sitemap, still in the mobile
 * drawer — and simply absent from the desktop header, on every page, with no
 * error anywhere. That is the exact shape of failure this codebase keeps
 * finding after it ships, so it is pinned here.
 *
 * Reads Navbar.tsx as source rather than rendering it: the component is a
 * client component that subscribes to the field store and `usePathname`, and
 * the questions below ("is this array rendered anywhere in the bar") are
 * answerable from the text without standing a React tree up.
 */

const SRC = path.resolve(import.meta.dirname, "../..");
const read = (relative: string) => readFileSync(path.join(SRC, relative), "utf8");
const NAVBAR = read("components/layout/Navbar.tsx");
const APP = path.join(SRC, "app");

describe("the desktop bar's grouping of NAV_ITEMS", () => {
  it("covers every top-level destination exactly once", () => {
    const grouped = [...PRIMARY_NAV_ITEMS, ...REFERENCE_NAV_ITEMS].map((item) => item.href);
    expect(
      [...grouped].sort(),
      "a NAV_ITEMS route in neither group is missing from the desktop header on every page, silently",
    ).toEqual([...NAV_ITEMS.map((item) => item.href)].sort());
    expect(new Set(grouped).size, "a route in both groups renders twice in the bar").toBe(
      grouped.length,
    );
  });

  it("holds the same objects as NAV_ITEMS, not copies of them", () => {
    // The point of deriving both groups with `navItem(href)` is that the
    // label and description are written down once. A future edit that
    // inlines an object literal into either group would compile, render, and
    // then drift from `NAV_ITEMS` — which is what the footer and the 404
    // page still read.
    for (const item of [...PRIMARY_NAV_ITEMS, ...REFERENCE_NAV_ITEMS]) {
      expect(NAV_ITEMS, `${item.href} is a copy, not the NAV_ITEMS entry`).toContain(item);
    }
  });

  it("renders both groups and both dropdowns in the header", () => {
    for (const symbol of [
      "PRIMARY_NAV_ITEMS",
      "REFERENCE_NAV_ITEMS",
      "TRACK_NAV_ITEMS",
      // The drawer still lists NAV_ITEMS flat: the desktop grouping exists
      // because of a width budget a drawer does not have, and a disclosure
      // inside a disclosure is the wrong shape on a phone.
      "NAV_ITEMS",
    ]) {
      expect(NAVBAR, `Navbar no longer renders ${symbol}`).toContain(symbol);
    }
    expect(NAVBAR).toContain('panelId="tracks-dropdown-panel"');
    expect(NAVBAR).toContain('panelId="reference-dropdown-panel"');
  });

  it("gives the two dropdown panels distinct ids", () => {
    // Both panels are rendered by the same component and both point
    // `aria-controls` at their own id. Two panels sharing one id makes the
    // second `aria-controls` resolve to the first panel — valid HTML, wrong
    // relationship, and invisible without a screen reader.
    const ids = [...NAVBAR.matchAll(/panelId="([^"]+)"/g)].map((match) => match[1]);
    expect(ids.length).toBeGreaterThan(1);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps every destination reachable without opening a dropdown, somewhere", () => {
    // The footer is the no-disclosure route to everything: a reader who
    // cannot or will not operate a dropdown still reaches all seven.
    const footer = new Set(FOOTER_REFERENCE_ITEMS.map((item) => item.href));
    for (const item of NAV_ITEMS) {
      expect(footer, `${item.href} is behind a disclosure everywhere`).toContain(item.href);
    }
  });
});

describe("nav labels name their destinations", () => {
  /** `buildPageMetadata({ title: "…" })` from a route's own page.tsx. */
  function pageTitle(href: string): string {
    const source = readFileSync(path.join(APP, href.replace(/^\//, ""), "page.tsx"), "utf8");
    const match = source.match(/buildPageMetadata\(\{\s*\n?\s*title:\s*"([^"]+)"/);
    expect(match, `no buildPageMetadata title in ${href}/page.tsx`).not.toBeNull();
    return match![1];
  }

  const normalise = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  it("matches each label against the title of the page it opens", () => {
    // The failure this catches is "Map": the label was a truncation of the
    // destination's own name ("Concept Map"), not a synonym for it, and a
    // one-word label that is a strict prefix of the page title tells a
    // first-time visitor nothing about what is behind it. Checked as
    // containment in either direction so a longer, more descriptive label
    // ("All lessons" over "Lessons") still passes.
    const mismatched: string[] = [];
    for (const item of [...NAV_ITEMS, ...TRACK_NAV_ITEMS]) {
      const label = normalise(item.label);
      const title = normalise(pageTitle(item.href));
      if (!title.includes(label) && !label.includes(title)) {
        mismatched.push(`${item.href}: nav says "${item.label}", page says "${pageTitle(item.href)}"`);
      }
    }
    expect(mismatched, "a nav label promises a page by a name that page does not use").toEqual([]);
  });

  it("gives every item copy that says more than its own label", () => {
    // A description that only restates the label is the state "Map" was in
    // ("An interactive map of how key concepts depend on each other"): it
    // is the surface the dropdown panel and the mobile drawer render under
    // the name, so it is the only thing standing between a reader and an
    // unexplained noun.
    for (const item of [...NAV_ITEMS, ...TRACK_NAV_ITEMS]) {
      expect(item.description.length, `${item.href} has no real description`).toBeGreaterThan(30);
      expect(
        normalise(item.description),
        `${item.href}'s description is its label again`,
      ).not.toBe(normalise(item.label));
    }
  });

  it("keeps em dashes out of reader-facing nav copy", () => {
    // Same rule the rest of the site's prose is held to; these strings are
    // rendered as visible copy in the dropdown panels and the mobile drawer,
    // not just as tooltips.
    for (const item of [...NAV_ITEMS, ...TRACK_NAV_ITEMS]) {
      expect(item.label + item.description, `${item.href} uses an em dash`).not.toMatch(/[—–]/);
    }
  });
});
