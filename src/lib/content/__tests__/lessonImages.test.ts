import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getAllLessonSlugs } from "../lessons";

// Regression coverage for the bug where next.config.ts's CSP `img-src`
// directive didn't allow-list the external image hosts every lesson's
// <ExternalFigure> actually points at: every image on the site silently
// rendered as a broken-image icon, while `next build` and `tsc` both
// reported total success (see ExternalFigure.tsx and next.config.ts's CSP
// comment for the full story). These tests operate on the RAW `.mdx` source
// text (not the compiled/loaded lesson module) so they can inspect the
// literal <ExternalFigure ... /> JSX and catch a bad `src`/missing
// attribution before it ever reaches a browser.

const LESSONS_ROOT = path.join(process.cwd(), "src/content/lessons");

/**
 * Parses the exact set of external hosts next.config.ts's CSP `img-src`
 * directive allows straight out of the live config file, so this test suite
 * can't silently drift out of sync with the real CSP the browser enforces
 * (the failure mode this whole file exists to prevent). This is a plain
 * substring/regex extraction, not real TS parsing — deliberately, since
 * next.config.ts's CSP is itself hand-built from plain template-string
 * lines (see its own comments), so a few lines of text extraction here is
 * far more robust than trying to import and evaluate the config module
 * (which pulls in @next/mdx and Next's config-loading machinery) just to
 * read one directive back out.
 */
function getAllowedImageHostsFromNextConfig(): string[] {
  const configSource = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8");
  // Anchored to the start of a line (ignoring leading whitespace) so this
  // only matches the real directive inside the CSP template literal, not an
  // incidental mention of "img-src" inside the file's prose comments above
  // it (e.g. "`img-src` DOES allow-list..." or "a bare `img-src 'self' ...`
  // ") — those aren't at the start of a line, so `^\s*img-src` skips them.
  const imgSrcMatch = configSource.match(/^\s*img-src\s+([^;]+);/m);
  if (!imgSrcMatch) {
    throw new Error(
      "Could not find an `img-src ...;` directive in next.config.ts's CSP header — " +
        "either the CSP was restructured (update this parser) or removed entirely."
    );
  }
  return [...imgSrcMatch[1].matchAll(/https:\/\/([a-zA-Z0-9.-]+)/g)].map((m) => m[1]);
}

/** One <ExternalFigure ... /> JSX block's raw attribute text. */
type FigureUsage = {
  file: string;
  raw: string;
};

const FIGURE_BLOCK_RE = /<ExternalFigure\b[\s\S]*?\/>/g;

function findExternalFigureUsages(mdxSource: string, file: string): FigureUsage[] {
  const matches = mdxSource.match(FIGURE_BLOCK_RE) ?? [];
  return matches.map((raw) => ({ file, raw }));
}

/**
 * Pulls one double-quoted attribute's value out of an <ExternalFigure ... />
 * block. A careful regex (rather than a full JSX parser) is enough here
 * because every one of the 155 real usages across the lesson corpus was
 * verified (during authoring of this test) to consistently write every
 * attribute as `name="value"` on its own line — see the attribute-presence
 * test below, which fails loudly if that convention is ever broken instead
 * of silently passing on a malformed block.
 */
function getAttr(raw: string, name: string): string | undefined {
  const match = raw.match(new RegExp(`\\b${name}="([^"]*)"`));
  return match?.[1];
}

async function loadAllMdxFiles(): Promise<{ slug: string; file: string; source: string }[]> {
  const slugs = await getAllLessonSlugs();
  return slugs.map((slug) => {
    const file = path.join(LESSONS_ROOT, `${slug}.mdx`);
    return { slug, file, source: fs.readFileSync(file, "utf8") };
  });
}

describe("lesson image invariants (ExternalFigure + CSP img-src)", () => {
  it("next.config.ts's CSP img-src directive parses to a non-empty host list", () => {
    // Sanity check on the parser itself: if this ever comes back empty, every
    // other test below would trivially "pass" by rejecting all hosts, which
    // would hide a real regression instead of catching one. Pinning the
    // exact current hosts here also means this test fails (loudly, with a
    // clear diff) the moment someone edits next.config.ts's CSP, prompting a
    // deliberate update rather than a silent drift.
    const hosts = getAllowedImageHostsFromNextConfig();
    expect(hosts).toEqual(["upload.wikimedia.org", "www.nist.gov"]);
  });

  it("finds ExternalFigure usages in the lesson corpus (sanity check for the regex itself)", async () => {
    const files = await loadAllMdxFiles();
    const totalUsages = files.reduce(
      (sum, { source, file }) => sum + findExternalFigureUsages(source, file).length,
      0
    );
    // There are 155 real <ExternalFigure> usages in the corpus as of the
    // authoring of this test (verified via a one-off script scan). Assert a
    // generous lower bound rather than an exact count so authoring new
    // lessons/figures doesn't require touching this test, while still
    // catching the regex silently matching nothing (e.g. after a component
    // rename) instead of quietly passing with zero assertions exercised.
    expect(totalUsages).toBeGreaterThanOrEqual(155);
  });

  it("every <ExternalFigure> src is https and points at a CSP-allow-listed host", async () => {
    const allowedHosts = new Set(getAllowedImageHostsFromNextConfig());
    const files = await loadAllMdxFiles();

    for (const { source, file } of files) {
      for (const { raw } of findExternalFigureUsages(source, file)) {
        const src = getAttr(raw, "src");
        expect(src, `<ExternalFigure> in ${file} has no src attribute:\n${raw}`).toBeTruthy();

        let url: URL;
        try {
          url = new URL(src!);
        } catch {
          throw new Error(`<ExternalFigure src="${src}"> in ${file} is not a valid absolute URL`);
        }

        expect(
          url.protocol,
          `<ExternalFigure src="${src}"> in ${file} must use https:, not ${url.protocol}`
        ).toBe("https:");

        expect(
          allowedHosts.has(url.hostname),
          `<ExternalFigure src="${src}"> in ${file} points at host "${url.hostname}", which is ` +
            `NOT in next.config.ts's CSP img-src allow-list (${[...allowedHosts].join(", ")}). ` +
            `Either fix the src or add the host to next.config.ts's img-src directive — ` +
            `otherwise this image will silently render as a broken-image icon in the browser.`
        ).toBe(true);
      }
    }
  });

  it("every <ExternalFigure> has non-empty alt, credit, creditUrl, and license attributes", async () => {
    const requiredAttrs = ["alt", "credit", "creditUrl", "license"] as const;
    const files = await loadAllMdxFiles();

    for (const { source, file } of files) {
      for (const { raw } of findExternalFigureUsages(source, file)) {
        for (const attr of requiredAttrs) {
          const value = getAttr(raw, attr);
          expect(
            value && value.trim().length > 0,
            `<ExternalFigure> in ${file} is missing a non-empty "${attr}" attribute:\n${raw}`
          ).toBe(true);
        }
      }
    }
  });

  it("no lesson bypasses ExternalFigure with a raw <img> tag", async () => {
    // ExternalFigure.tsx itself legitimately renders a plain <img> internally
    // (see that file's own comment for why) — this guards lesson content
    // only, ensuring every lesson image goes through the standardized
    // component (and therefore through the two tests above) instead of some
    // ad-hoc <img src="..."> that would skip these invariants entirely.
    const files = await loadAllMdxFiles();
    const rawImgRe = /<img[\s>]/i;

    for (const { source, file } of files) {
      expect(
        rawImgRe.test(source),
        `${file} contains a raw <img> tag — use <ExternalFigure> instead so CSP/attribution ` +
          `invariants are enforced.`
      ).toBe(false);
    }
  });
});
