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
//
// There is more than one figure component. <AnnotatedFigure> (a pinned
// photograph with a keyed legend, src/components/narrative/AnnotatedFigure.tsx)
// loads its image through exactly the same plain <img> as <ExternalFigure>
// and is therefore subject to exactly the same CSP block — for a while it was
// invisible to this suite, so the precise failure this file exists to prevent
// could still ship through it. Every check below now runs over the union of
// both components' usages; anything the two genuinely differ on is expressed
// as data in FIGURE_CONTRACTS rather than as a branch inside a test. Adding a
// third figure component means adding one entry there and nothing else.
//
// Beyond CSP, these tests also enforce the editorial invariants that make a
// figure worth having: alt text that describes rather than names, complete
// and correctly-pointed attribution, a caption that says something the alt
// text didn't, and a corpus that doesn't reach for the same stock photograph
// in lesson after lesson.

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

type FigureComponent = "ExternalFigure" | "AnnotatedFigure";

/**
 * What each figure component owes the corpus, as data rather than as
 * per-component branches inside the tests below.
 *
 * The two contracts are NOT identical, and the difference is deliberate:
 * `AnnotatedFigure` additionally requires `pins` (a figure with no pins to
 * key is an `ExternalFigure` — see that component's own doc comment on when
 * converting between the two pays for itself). The attribution attributes
 * are required of both here even though `AnnotatedFigure`'s TypeScript props
 * type marks them optional: optional in the *component* means "renders
 * without a credit line if you truly have nothing to credit", while in the
 * *lesson corpus* an uncredited third-party photograph is a licensing
 * problem, not a styling choice.
 *
 * `minimumUsages` is a deliberately slack lower bound, not a census, so
 * neither authoring new figures nor deleting duplicate ones requires
 * touching this file — it exists only to catch the block regex silently
 * matching nothing (e.g. after a component rename), which would make every
 * other test below pass with zero assertions actually exercised. It was
 * previously pinned at the exact count measured when the suite was written,
 * which went red the moment the corpus's duplicate photographs started being
 * removed: a bound whose job is "the regex still matches something" must not
 * also assert that the corpus never shrinks.
 */
const FIGURE_CONTRACTS: Record<
  FigureComponent,
  {
    requiredTextAttrs: readonly string[];
    requiredExpressionAttrs: readonly string[];
    minimumUsages: number;
  }
> = {
  ExternalFigure: {
    requiredTextAttrs: ["src", "alt", "credit", "creditUrl", "license"],
    requiredExpressionAttrs: [],
    // 154 real usages across the corpus as of 2026-08-29, and falling as the
    // duplicate photographs described below are removed.
    minimumUsages: 120,
  },
  AnnotatedFigure: {
    requiredTextAttrs: ["src", "alt", "credit", "creditUrl", "license"],
    requiredExpressionAttrs: ["pins"],
    // 8 real usages as of 2026-08-29, all hardware/apparatus photographs.
    minimumUsages: 6,
  },
};

const FIGURE_COMPONENTS = Object.keys(FIGURE_CONTRACTS) as FigureComponent[];

/** One figure JSX block, parsed out of a lesson's raw `.mdx` source. */
type FigureUsage = {
  component: FigureComponent;
  file: string;
  raw: string;
  /** `name="value"` attributes, by name. */
  attrs: Map<string, string>;
  /** Names of `name={expression}` and bare-boolean attributes. */
  expressionAttrs: Set<string>;
  /** Human-readable reasons this block broke the one-attribute-per-line
   *  convention the parser depends on; empty for a well-formed block. */
  problems: string[];
};

function figureBlockRe(component: FigureComponent): RegExp {
  return new RegExp(`<${component}\\b[\\s\\S]*?\\/>`, "g");
}

const TEXT_ATTR_LINE_RE = /^([A-Za-z][A-Za-z0-9]*)="([^"]*)"$/;
const EXPRESSION_ATTR_LINE_RE = /^([A-Za-z][A-Za-z0-9]*)=\{/;
const BOOLEAN_ATTR_LINE_RE = /^([A-Za-z][A-Za-z0-9]*)$/;

/**
 * Splits one figure block into its attributes.
 *
 * A line-oriented parser (rather than a full JSX parser) is enough here
 * because every one of the real usages across the lesson corpus was verified
 * — at authoring time, and again on every run by the "one attribute per
 * line" test below — to write the component name, then every attribute as
 * `name="value"` or `name={expression}` on its own line, then a closing `/>`
 * on its own line. That convention is what makes text extraction safe, so
 * this parser *records* every deviation from it in `problems` instead of
 * quietly skipping the line: a malformed block must fail loudly, not slip
 * past the attribute checks by simply appearing to have no attributes.
 *
 * Reading attributes line-by-line rather than with a whole-block
 * `name="..."` regex also matters for `AnnotatedFigure`, whose `pins={[...]}`
 * array contains free prose in `label:` fields. A block-wide regex would
 * happily read an attribute out of a pin label; consuming the braced
 * expression as one opaque unit cannot.
 */
function parseFigureBlock(component: FigureComponent, file: string, raw: string): FigureUsage {
  const problems: string[] = [];
  const attrs = new Map<string, string>();
  const expressionAttrs = new Set<string>();
  const lines = raw.split(/\r?\n/);

  if (lines[0].trim() !== `<${component}`) {
    problems.push(
      `the opening line is ${JSON.stringify(lines[0].trim())} — expected \`<${component}\` alone on its line`
    );
  }
  const lastLine = lines[lines.length - 1].trim();
  if (lastLine !== "/>") {
    // Also the symptom of the block regex having stopped at a `/>` that
    // appeared *inside* an attribute value rather than at the real end of
    // the tag, which would silently truncate everything after it.
    problems.push(`the closing line is ${JSON.stringify(lastLine)} — expected \`/>\` alone on its line`);
  }

  let index = 1;
  while (index < lines.length - 1) {
    const line = lines[index].trim();
    if (line === "") {
      index += 1;
      continue;
    }

    const textAttr = line.match(TEXT_ATTR_LINE_RE);
    if (textAttr) {
      if (attrs.has(textAttr[1])) problems.push(`attribute "${textAttr[1]}" is written twice`);
      attrs.set(textAttr[1], textAttr[2]);
      index += 1;
      continue;
    }

    const expressionAttr = line.match(EXPRESSION_ATTR_LINE_RE);
    if (expressionAttr) {
      // Consume the whole braced expression (`pins={[ ... ]}`, `number={3}`)
      // as one opaque unit, so its contents can never be mistaken for
      // attributes of the figure itself.
      let depth = 0;
      let end = index;
      for (; end < lines.length - 1; end += 1) {
        for (const character of lines[end]) {
          if (character === "{") depth += 1;
          else if (character === "}") depth -= 1;
        }
        if (depth === 0) break;
      }
      if (depth !== 0) {
        problems.push(`attribute "${expressionAttr[1]}" opens a \`{\` that never closes inside the tag`);
        break;
      }
      expressionAttrs.add(expressionAttr[1]);
      index = end + 1;
      continue;
    }

    const booleanAttr = line.match(BOOLEAN_ATTR_LINE_RE);
    if (booleanAttr) {
      expressionAttrs.add(booleanAttr[1]);
      index += 1;
      continue;
    }

    problems.push(
      `line ${JSON.stringify(line)} is neither \`name="value"\` nor \`name={expression}\` on its own line`
    );
    index += 1;
  }

  return { component, file, raw, attrs, expressionAttrs, problems };
}

function findFigureUsages(mdxSource: string, file: string): FigureUsage[] {
  return FIGURE_COMPONENTS.flatMap((component) =>
    (mdxSource.match(figureBlockRe(component)) ?? []).map((raw) =>
      parseFigureBlock(component, file, raw)
    )
  );
}

/** Shorthand for a figure's `name="value"` attribute, or `undefined`. */
function attr(figure: FigureUsage, name: string): string | undefined {
  return figure.attrs.get(name);
}

/** A figure's identity in a failure message: `<Component src="..."> in file`. */
function describeFigure(figure: FigureUsage): string {
  return `<${figure.component} src="${attr(figure, "src") ?? "(none)"}"> in ${figure.file}`;
}

async function loadAllMdxFiles(): Promise<{ slug: string; file: string; source: string }[]> {
  const slugs = await getAllLessonSlugs();
  return slugs.map((slug) => {
    const file = path.join(LESSONS_ROOT, `${slug}.mdx`);
    return { slug, file, source: fs.readFileSync(file, "utf8") };
  });
}

// Read and parse the corpus once for the whole file rather than once per
// test: every test below walks all ~220 lessons, and the sources cannot
// change mid-run.
let cachedFigures: Promise<FigureUsage[]> | null = null;

function collectAllFigures(): Promise<FigureUsage[]> {
  cachedFigures ??= loadAllMdxFiles().then((files) =>
    files.flatMap(({ source, file }) => findFigureUsages(source, file))
  );
  return cachedFigures;
}

describe("lesson image invariants (ExternalFigure + AnnotatedFigure + CSP img-src)", () => {
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

  it("finds usages of every figure component in the lesson corpus (sanity check for the regex itself)", async () => {
    const figures = await collectAllFigures();

    for (const component of FIGURE_COMPONENTS) {
      const found = figures.filter((figure) => figure.component === component).length;
      expect(
        found,
        `Found ${found} <${component}> usages in the lesson corpus, fewer than the ${FIGURE_CONTRACTS[component].minimumUsages} ` +
          `this suite expects. Either the component was renamed (update FIGURE_CONTRACTS and the block regex) or a large ` +
          `number of figures were deleted — until then every other check in this file is running against nothing.`
      ).toBeGreaterThanOrEqual(FIGURE_CONTRACTS[component].minimumUsages);
    }
  });

  it("every figure block writes one attribute per line, the convention this suite's parser depends on", async () => {
    // The parser above extracts attributes by line. If an author ever writes
    // two attributes on one line, wraps a value across lines, or uses single
    // quotes, the extraction would find no attribute there and every check
    // below would pass by vacuum. This test is what turns that into a loud
    // failure instead.
    const figures = await collectAllFigures();

    for (const figure of figures) {
      expect(
        figure.problems,
        `${describeFigure(figure)} does not follow the one-attribute-per-line convention ` +
          `(${figure.problems.join("; ")}). Rewrite the tag with \`<${figure.component}\` on its own line, each ` +
          `attribute as \`name="value"\` or \`name={expression}\` on its own line, and \`/>\` on its own line:\n${figure.raw}`
      ).toEqual([]);
    }
  });

  it("every figure src is https and points at a CSP-allow-listed host", async () => {
    const allowedHosts = new Set(getAllowedImageHostsFromNextConfig());
    const figures = await collectAllFigures();

    for (const figure of figures) {
      const src = attr(figure, "src");
      expect(
        src,
        `<${figure.component}> in ${figure.file} has no src attribute:\n${figure.raw}`
      ).toBeTruthy();

      let url: URL;
      try {
        url = new URL(src!);
      } catch {
        throw new Error(`${describeFigure(figure)} is not a valid absolute URL`);
      }

      expect(
        url.protocol,
        `${describeFigure(figure)} must use https:, not ${url.protocol}`
      ).toBe("https:");

      expect(
        allowedHosts.has(url.hostname),
        `${describeFigure(figure)} points at host "${url.hostname}", which is ` +
          `NOT in next.config.ts's CSP img-src allow-list (${[...allowedHosts].join(", ")}). ` +
          `Either fix the src or add the host to next.config.ts's img-src directive — ` +
          `otherwise this image will silently render as a broken-image icon in the browser.`
      ).toBe(true);
    }
  });

  it("every figure has the non-empty attributes its own component requires", async () => {
    const figures = await collectAllFigures();

    for (const figure of figures) {
      const contract = FIGURE_CONTRACTS[figure.component];

      for (const name of contract.requiredTextAttrs) {
        const value = attr(figure, name);
        expect(
          value !== undefined && value.trim().length > 0,
          `<${figure.component}> in ${figure.file} is missing a non-empty "${name}" attribute — ` +
            `every ${figure.component} in the corpus must carry ${contract.requiredTextAttrs.join(", ")}:\n${figure.raw}`
        ).toBe(true);
      }

      for (const name of contract.requiredExpressionAttrs) {
        expect(
          figure.expressionAttrs.has(name),
          `<${figure.component}> in ${figure.file} is missing a "${name}={...}" attribute. ` +
            `A ${figure.component} without ${name} has nothing this component exists to do — use <ExternalFigure> ` +
            `instead if the image only needs one caption:\n${figure.raw}`
        ).toBe(true);
      }
    }
  });

  it("no lesson bypasses the figure components with a raw <img> tag", async () => {
    // ExternalFigure.tsx and AnnotatedFigure.tsx both legitimately render a
    // plain <img> internally (see ExternalFigure's own comment for why) —
    // this guards lesson content only, ensuring every lesson image goes
    // through one of the standardized components (and therefore through the
    // tests above) instead of some ad-hoc <img src="..."> that would skip
    // these invariants entirely.
    const files = await loadAllMdxFiles();
    const rawImgRe = /<img[\s>]/i;

    for (const { source, file } of files) {
      expect(
        rawImgRe.test(source),
        `${file} contains a raw <img> tag — use <ExternalFigure> or <AnnotatedFigure> instead so CSP/attribution ` +
          `invariants are enforced.`
      ).toBe(false);
    }
  });

  it("no photograph is used as filler across more lessons than the corpus allows", async () => {
    // An audit during this sprint found 80 of 191 figures were duplicates:
    // the Google Sycamore chip photo in 7 lessons across 4 pillars, von
    // Neumann's portrait in 6, a NIST ion-trapping photo in 5. An image
    // legitimately revisited in a second lesson is fine; the same stock chip
    // in seven is filler, and it teaches the reader that the figures aren't
    // worth looking at.
    //
    // Measured 2026-08-29, partway through the sprint's deduplication: 162
    // figures over 144 distinct srcs, 13 srcs appearing in more than one
    // lesson, and a worst case of 4 lessons sharing one src (the NIST
    // ion-trapping photo and the Sycamore chip, both down from 5 and 7 an
    // hour earlier). The cap is set at that measured worst case, so the gains
    // already made are locked in and any new sharing beyond today's worst
    // offender fails. Lower it as the remaining duplicates are retired.
    const MAX_LESSONS_SHARING_ONE_IMAGE = 4;

    const figures = await collectAllFigures();
    const lessonsBySrc = new Map<string, Set<string>>();
    for (const figure of figures) {
      const src = attr(figure, "src");
      if (!src) continue;
      // Distinct lesson FILES, not figure count: a lesson that reuses one
      // image twice within itself is a different (and much rarer) problem.
      const lessons = lessonsBySrc.get(src) ?? new Set<string>();
      lessons.add(figure.file);
      lessonsBySrc.set(src, lessons);
    }

    const overused = [...lessonsBySrc.entries()]
      .filter(([, lessons]) => lessons.size > MAX_LESSONS_SHARING_ONE_IMAGE)
      .sort((a, b) => b[1].size - a[1].size);

    expect(
      overused.map(
        ([src, lessons]) =>
          `${src} appears in ${lessons.size} lessons:\n    ${[...lessons].join("\n    ")}`
      ),
      `One image is doing duty in more than ${MAX_LESSONS_SHARING_ONE_IMAGE} lessons. Replace the weakest ` +
        `copies with a figure specific to what that lesson is actually teaching, or drop the figure — a photo ` +
        `the reader has already seen four times carries no information.`
    ).toEqual([]);
  });

  /**
   * Alt text found to break the rules below when this check was written
   * (2026-08-29). Every entry is a real defect awaiting a content fix, not an
   * exemption: they are listed by their exact current value so that editing
   * the alt text at all takes the figure back under the live check, and so a
   * NEW figure can never be written this way. The list must only ever shrink
   * — an entry whose alt text has since been rewritten is simply dead and
   * should be deleted the next time anyone touches this file.
   *
   * Fifteen of the sixteen open with "Photograph of ..."; a screen reader has
   * already announced the element as an image before it reaches the alt text,
   * so those two words are dead air in the position where the description
   * should be. "Photograph of physicist Paul Dirac from 1933" wants to be
   * "Paul Dirac in 1933, in a suit and tie, seated at his desk" — what the
   * reader would see, not what the file is.
   */
  const KNOWN_ALT_TEXT_DEFECTS = new Set([
    // quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform.mdx
    "A photograph of helium light split into a colorful spectrum of discrete lines by a diffraction grating",
    // quantum-computing/qubits-and-quantum-states/dirac-notation.mdx
    "Photograph of physicist Paul Dirac from 1933",
    // quantum-computing/qubits-and-quantum-states/the-bloch-sphere.mdx
    "Photograph of physicist Felix Bloch at Stanford University, 1961",
    // quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization.mdx
    "Richard Feynman, 1959",
    // quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise.mdx
    "Photograph of mathematician Alexander Holevo",
    // quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces.mdx
    "Photograph of physicist Charles H. Bennett, IBM Fellow",
    // quantum-mastery/symmetry-scattering-and-semiclassical-methods/the-adiabatic-theorem-and-berry-phase.mdx
    "Photograph of physicist Michael Berry at the International Advanced School on Frontiers in Optics and Photonics, Armenia, 2014",
    // quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix.mdx
    "Photograph of Ernest Rutherford's experimental apparatus at the Cavendish Laboratory, Cambridge, early 20th century",
    // quantum-mechanics/approximation-methods/the-wkb-approximation.mdx
    "Photograph of physicist Hendrik Kramers, taken around 1928 in Ann Arbor, Michigan",
    // quantum-mechanics/classical-to-quantum/from-classical-to-quantum-probability.mdx
    "Photograph of a double-slit interference pattern of sunlight, showing alternating bright and dark fringes",
    // quantum-mechanics/classical-to-quantum/position-and-momentum.mdx
    "Photograph of a single-slit diffraction pattern from a blue laser, a bright central band flanked by fainter side bands",
    // quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator.mdx
    "Photograph of a metal tuning fork calibrated to 659 Hz",
    // quantum-mechanics/classical-to-quantum/why-complex-amplitudes.mdx
    "Photograph of Newton's rings, concentric circular interference fringes between two glass surfaces",
    // quantum-mechanics/identical-particles/bosons-and-fermions.mdx
    "Photograph of liquid helium violently boiling, then suddenly falling still as it crosses the lambda point into its superfluid phase",
    // quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels.mdx
    "A photograph of the visible hydrogen emission spectrum, showing four discrete colored lines (Hα red, Hβ cyan, Hγ blue, Hδ violet) against a black background",
    // quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier.mdx
    "Photograph of the original 1981 scanning tunneling microscope built by Binnig and Rohrer at IBM Zurich, on display at the Deutsches Museum",
  ]);

  it("every figure's alt text describes the image instead of naming it", async () => {
    // A screen reader announces the element as an image on its own, so an alt
    // text that opens by saying so spends the reader's first words on nothing.
    // "Diagram of ..." / "Schematic of ..." / "Illustration of ..." are
    // deliberately NOT flagged: those name a genuine kind of image, and
    // whether a figure is a photograph of an apparatus or a schematic of one
    // changes how the description should be read.
    const REDUNDANT_OPENER_RE =
      /^(an?\s+)?(image|photo|photograph|picture|screenshot)\s+(of|showing|depicting|that shows)\b/i;
    // A shorter alt than this is a caption or a name ("Richard Feynman,
    // 1959"), not a description of what is in the frame. Measured against the
    // corpus on 2026-08-29: the shortest legitimate alt texts are ~35
    // characters ("David Hilbert, photographed in 1912"), so this floor
    // catches naming without demanding padding of a portrait.
    const MIN_ALT_CHARACTERS = 30;
    const MIN_ALT_WORDS = 4;

    const figures = await collectAllFigures();

    for (const figure of figures) {
      const alt = (attr(figure, "alt") ?? "").trim();
      if (KNOWN_ALT_TEXT_DEFECTS.has(alt)) continue;

      expect(alt.length > 0, `${describeFigure(figure)} has empty alt text.`).toBe(true);

      const words = alt.split(/\s+/).filter(Boolean).length;
      expect(
        alt.length >= MIN_ALT_CHARACTERS && words >= MIN_ALT_WORDS,
        `${describeFigure(figure)} has alt="${alt}" (${alt.length} characters, ${words} words), too short to be ` +
          `a description. Alt text must say what a reader would see in the frame, not name the subject — the ` +
          `caption is where the name and the date belong.`
      ).toBe(true);

      expect(
        REDUNDANT_OPENER_RE.test(alt),
        `${describeFigure(figure)} has alt="${alt}", which opens by announcing that it is an image. A screen ` +
          `reader has already said so; delete the opener and start with the description itself.`
      ).toBe(false);
    }
  });

  it("every figure's attribution is complete and its creditUrl points at the image it credits", async () => {
    // A credit pointing at the wrong page is worse than no credit: it looks
    // like due diligence while misattributing the work. Wikimedia is the
    // corpus's dominant source and its URLs are mechanically checkable — the
    // file name in an `upload.wikimedia.org` src is exactly the file name of
    // its Commons `File:` page — so this test checks that pairing rather than
    // merely that a creditUrl exists.
    const figures = await collectAllFigures();

    for (const figure of figures) {
      const src = attr(figure, "src") ?? "";
      const creditUrl = attr(figure, "creditUrl") ?? "";

      let url: URL;
      try {
        url = new URL(creditUrl);
      } catch {
        throw new Error(
          `${describeFigure(figure)} has creditUrl="${creditUrl}", which is not an absolute URL. ` +
            `Link the source page the image actually came from.`
        );
      }
      expect(
        url.protocol,
        `${describeFigure(figure)} has creditUrl="${creditUrl}" — attribution links must be https:, not ${url.protocol}`
      ).toBe("https:");

      const srcHost = new URL(src).hostname;
      if (srcHost !== "upload.wikimedia.org") {
        expect(
          url.hostname,
          `${describeFigure(figure)} is hosted on ${srcHost} but credits ${url.hostname}. The credit link should ` +
            `point at the source's own page for this image.`
        ).toBe(srcHost);
        continue;
      }

      const isWikimediaCredit =
        url.hostname === "commons.wikimedia.org" || url.hostname.endsWith(".wikipedia.org");
      expect(
        isWikimediaCredit,
        `${describeFigure(figure)} loads a Wikimedia-hosted image but credits "${creditUrl}", which is not a ` +
          `Wikimedia page. Link the image's Commons File: page (or the author's user page) instead.`
      ).toBe(true);

      const filePage = url.pathname.match(/^\/wiki\/File:(.+)$/);
      const authorPage = /^\/wiki\/(User|Special|Category):/.test(url.pathname);
      expect(
        filePage !== null || authorPage,
        `${describeFigure(figure)} credits "${creditUrl}", which is neither a File: page nor an author page. ` +
          `A Wikimedia credit must land on the page that carries the image's licence and authorship.`
      ).toBe(true);

      if (!filePage) continue;

      // `.../commons/thumb/1/1c/Name.jpg/1280px-Name.jpg` and
      // `.../commons/1/1c/Name.jpg` both carry the original file name in the
      // segment after the two hash-prefix directories.
      const srcFileName = new URL(src).pathname.match(/\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+)/);
      if (!srcFileName) continue;

      const normalize = (value: string) => {
        let decoded = value;
        try {
          decoded = decodeURIComponent(value);
        } catch {
          // A malformed escape means the URL is broken in its own right; the
          // literal comparison below still reports the mismatch usefully.
        }
        return decoded.replace(/_/g, " ").trim();
      };

      expect(
        normalize(filePage[1]),
        `${describeFigure(figure)} credits "${creditUrl}", whose File: page is a different file from the one the ` +
          `src loads. Point creditUrl at https://commons.wikimedia.org/wiki/File:${srcFileName[1]} — a credit ` +
          `link to the wrong file is a misattribution, not a formatting nit.`
      ).toBe(normalize(srcFileName[1]));
    }
  });

  it("no figure's caption merely repeats its alt text", async () => {
    // Alt and caption are read by the same person in sequence: a screen
    // reader announces the alt text, then reads the figcaption. When they are
    // the same sentence the reader hears it twice and learns nothing the
    // second time. Alt describes what is in the frame; the caption says why
    // this lesson is showing it.
    const figures = await collectAllFigures();

    for (const figure of figures) {
      const alt = (attr(figure, "alt") ?? "").trim();
      const caption = (attr(figure, "caption") ?? "").trim();
      if (!alt || !caption) continue;

      const normalize = (value: string) => value.replace(/\s+/g, " ").toLowerCase();
      expect(
        normalize(caption) === normalize(alt),
        `${describeFigure(figure)} has a caption identical to its alt text ("${caption}"). A screen-reader user ` +
          `hears this sentence twice. Keep the alt as the description of the frame and rewrite the caption to say ` +
          `what the figure is doing in this lesson.`
      ).toBe(false);
    }
  });
});
