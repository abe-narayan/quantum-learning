import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Static-analysis guard for the theme/light-mode audit pass: every color in
 * this app is supposed to flow through a design token (`var(--foreground)`,
 * `text-muted-foreground`, `bg-pillar-wash`, ...) so it resolves correctly
 * in both the dark (default) and light ("laboratory notebook") themes. A
 * literal hex/rgb value or a raw Tailwind palette class (`text-slate-400`,
 * `bg-zinc-900`) bypasses that system entirely and, by construction, looks
 * right in exactly one theme.
 *
 * `contrast.test.ts` (src/lib/design/__tests__) guards the token palette
 * itself; this guards the call sites this agent owns — the components that
 * *compose* on top of those tokens, where a hard-coded color is most likely
 * to sneak in as "just this one place."
 *
 * Scoped deliberately to the directories/files this pass is responsible
 * for (see AGENTS.md-style ownership split during the dark-first rebuild):
 * eight other agents are editing curriculum/, layout/, search/, simulators/,
 * visualizations/, mdx/, narrative/, problems/, currentQuantum/, glossary/,
 * map/, and various app/ routes concurrently, and some of those
 * legitimately need literals — this test does not, and should not, reach
 * into any of that.
 *
 * ## The literal-hex exception list, in full
 *
 * There are exactly THREE files in this app where a literal colour is
 * correct rather than a violation of "tokens only," and all three are
 * rendered outside any CSS cascade, so a `var(--...)` in them would resolve
 * to nothing:
 *
 *   - `src/app/opengraph-image.tsx`  — Satori (`next/og`) cannot read custom
 *     properties.
 *   - `src/app/apple-icon.tsx`       — same renderer, same constraint.
 *   - `src/app/manifest.ts`          — a JSON manifest consumed by the OS
 *     (`background_color`, `theme_color`); there is no stylesheet involved
 *     at all.
 *
 * The list used to name only the first, which read as "opengraph-image is
 * the one place" and left the other two looking like unflagged violations.
 * Neither scanner in this directory reaches any of the three (`manifest.ts`
 * is not even a `.tsx`), so this comment is the whole enforcement: anything
 * NOT on this list that carries a literal colour is a bug.
 *
 * All three hold *resolved copies* of dark-theme tokens, so retuning
 * `--depth-0`, `--brand`, `--accent` or `--foreground` in globals.css means
 * updating them by hand. Each file names the token it copied in its own
 * header comment.
 */

const SRC_ROOT = path.resolve(import.meta.dirname, "../../../..");

/** Files and directories this pass owns, exactly as scoped in the audit brief. */
const OWNED_DIRS = [
  "src/components/home",
  "src/components/lessons",
  "src/app/apex",
  "src/components/apex",
  "src/app/mastery",
  "src/app/lessons",
  "src/components/quantum",
];
const OWNED_FILES = [
  "src/app/page.tsx",
  "src/components/ui/Section.tsx",
  "src/components/ui/Typography.tsx",
  "src/components/ui/Panel.tsx",
];

function walk(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      // __tests__ directories hold test fixtures/assertions, not markup —
      // and this file itself would otherwise self-match on the pattern
      // documentation in its own comments.
      if (entry === "__tests__") continue;
      files.push(...walk(full));
    } else if (entry.endsWith(".tsx")) {
      files.push(full);
    }
  }
  return files;
}

const ownedFiles = [
  ...OWNED_DIRS.flatMap((dir) => walk(path.join(SRC_ROOT, dir))),
  ...OWNED_FILES.map((file) => path.join(SRC_ROOT, file)),
].sort();

/**
 * Strips block comments so documentation that mentions a forbidden pattern
 * (explaining why to avoid it) doesn't trip the scanner. Every explanatory
 * comment in this codebase uses the block-comment form.
 */
function stripBlockComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "");
}

const RAW_PALETTE_HUES =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const UTILITY_ROOTS =
  "bg|text|border|ring|from|via|to|divide|fill|stroke|outline|decoration|caret|accent|shadow|placeholder";

/** A raw Tailwind palette utility: `text-slate-400`, `hover:bg-zinc-900/60`,
 *  `border-red-500`, etc. — any of the stock palette hues at a numeric
 *  shade, optionally with an alpha modifier. Token-derived utilities
 *  (`text-muted-foreground`, `bg-pillar-wash`, `border-border-strong`) don't
 *  match because they aren't `<root>-<hue>-<number>`. */
const RAW_PALETTE_CLASS = new RegExp(
  `\\b(?:${UTILITY_ROOTS})-(?:${RAW_PALETTE_HUES})-[0-9]{2,3}(?:\\/[0-9]{1,3})?\\b`,
  "g"
);

/** `text-white`, `bg-black/40`, etc. — the literal endpoints, not part of
 *  the numbered palette above. `white-space`/`whitespace-*` don't match:
 *  there's no utility-root hyphen immediately before "white". */
const WHITE_BLACK_CLASS = new RegExp(`\\b(?:${UTILITY_ROOTS})-(?:white|black)(?:\\/[0-9]{1,3})?\\b`, "g");

/** Hex color literal, 3/4/6/8 digits, e.g. `#0a0e17`, `#fff`. */
const HEX_LITERAL = /#[0-9a-fA-F]{3,8}\b/g;

/** `rgb(...)` / `rgba(...)` function literal. */
const RGB_LITERAL = /\brgba?\(/g;

describe("owned files use design tokens, not hard-coded colors", () => {
  it("found at least one owned .tsx file to scan", () => {
    // A guard against the scan silently checking nothing if the ownership
    // paths above ever drift from the real directory layout.
    expect(ownedFiles.length).toBeGreaterThan(10);
  });

  it.each(ownedFiles)("%s", (absolutePath) => {
    const relativePath = path.relative(SRC_ROOT, absolutePath).replace(/\\/g, "/");
    const source = stripBlockComments(readFileSync(absolutePath, "utf8"));

    const rawPaletteMatches = source.match(RAW_PALETTE_CLASS) ?? [];
    const whiteBlackMatches = source.match(WHITE_BLACK_CLASS) ?? [];
    const hexMatches = source.match(HEX_LITERAL) ?? [];
    const rgbMatches = source.match(RGB_LITERAL) ?? [];

    const problems = [
      ...rawPaletteMatches.map((m) => `raw Tailwind palette class "${m}"`),
      ...whiteBlackMatches.map((m) => `literal white/black utility "${m}"`),
      ...hexMatches.map((m) => `hex color literal "${m}"`),
      ...rgbMatches.map(() => `rgb()/rgba() color literal`),
    ];

    expect(
      problems,
      `${relativePath} should use design tokens (var(--...), text-muted-foreground, ` +
        `bg-pillar-wash, ...) instead of: ${problems.join(", ")}`
    ).toEqual([]);
  });
});
