import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Static-analysis guard for the accessibility/theme/mobile audit pass over
 * layout, search, curriculum, problems, glossary, map, currentQuantum, the
 * pillar landing pages (mechanics/computing/hardware/software), learn/about,
 * the root error/not-found boundaries, and the five owned `ui/` primitives
 * (Button, Badge, Card, Container).
 *
 * Every color in this app is supposed to flow through a design token
 * (`var(--foreground)`, `text-muted-foreground`, `bg-pillar-wash`, ...) so it
 * resolves correctly in both the dark (default) and light ("laboratory
 * notebook") themes. A literal hex/rgb value or a raw Tailwind palette class
 * (`text-slate-400`, `bg-zinc-900`) bypasses that system entirely and, by
 * construction, looks right in exactly one theme.
 *
 * This is the sibling of `ownedNoHardcodedColors.test.ts` (same directory),
 * which guards the *other* audit pass's directories (home/lessons/apex/
 * mastery/quantum + Section/Typography/Panel). That file's own comment notes
 * eight agents editing concurrently and deliberately scopes itself away from
 * everything this file covers — so this file exists to close that gap for
 * the surfaces actually owned here, rather than leaving them unchecked.
 */

const SRC_ROOT = path.resolve(import.meta.dirname, "../../../..");

/** Directories and files this audit pass owns. */
const OWNED_DIRS = [
  "src/components/layout",
  "src/components/search",
  "src/components/curriculum",
  "src/components/problems",
  "src/components/glossary",
  "src/components/map",
  "src/components/currentQuantum",
  "src/app/problems",
  "src/app/glossary",
  "src/app/map",
  "src/app/current-quantum",
  "src/app/mechanics",
  "src/app/computing",
  "src/app/hardware",
  "src/app/software",
  "src/app/learn",
  "src/app/about",
];
const OWNED_FILES = [
  "src/app/not-found.tsx",
  "src/app/error.tsx",
  "src/app/global-error.tsx",
  "src/components/ui/Button.tsx",
  "src/components/ui/Badge.tsx",
  "src/components/ui/Card.tsx",
  "src/components/ui/Container.tsx",
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

/** Hex color literal, 3/4/6/8 digits, e.g. `#0a0e17`, `#fff`. Excludes a `#`
 *  immediately preceded by `&` — an HTML numeric character reference like
 *  `&#8646;` (used for glyphs such as the "⇆" in CurrentQuantumCard) reads
 *  as `#8646` to a naive scan but isn't a color literal at all. */
const HEX_LITERAL = /(?<!&)#[0-9a-fA-F]{3,8}\b/g;

/** `rgb(...)` / `rgba(...)` function literal. */
const RGB_LITERAL = /\brgba?\(/g;

/**
 * Deliberate, reviewed exceptions — a literal that is *correct* in both
 * themes because it isn't standing in for a token that flips (foreground,
 * background, a surface fill, ...), so forcing it onto the token ladder
 * would either be a no-op or actively wrong. Each entry names the exact
 * matched string so an unrelated literal introduced later in the same file
 * still fails the scan.
 *
 * - `SearchOverlay`'s modal backdrop: a scrim exists to dim whatever is
 *   behind it regardless of theme, the same way every dialog overlay in
 *   virtually every design system (this one included, elsewhere) uses a
 *   fixed dark fill rather than a theme-relative one — `--background` at
 *   the same opacity would be a near-invisible near-white wash over the
 *   "laboratory notebook" theme, which defeats the point of a backdrop.
 */
const KNOWN_EXCEPTIONS: Record<string, string[]> = {
  "src/components/search/SearchOverlay.tsx": ["bg-black/50"],
};

describe("audited files use design tokens, not hard-coded colors", () => {
  it("found at least one owned .tsx file to scan", () => {
    // A guard against the scan silently checking nothing if the ownership
    // paths above ever drift from the real directory layout.
    expect(ownedFiles.length).toBeGreaterThan(10);
  });

  it.each(ownedFiles)("%s", (absolutePath) => {
    const relativePath = path.relative(SRC_ROOT, absolutePath).replace(/\\/g, "/");
    const source = stripBlockComments(readFileSync(absolutePath, "utf8"));

    const allowed = new Set(KNOWN_EXCEPTIONS[relativePath] ?? []);

    const rawPaletteMatches = (source.match(RAW_PALETTE_CLASS) ?? []).filter((m) => !allowed.has(m));
    const whiteBlackMatches = (source.match(WHITE_BLACK_CLASS) ?? []).filter((m) => !allowed.has(m));
    const hexMatches = (source.match(HEX_LITERAL) ?? []).filter((m) => !allowed.has(m));
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
