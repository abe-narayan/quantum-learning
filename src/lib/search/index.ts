import type { Course, LessonMetaWithSlug, Pillar, PillarInfo } from "@/lib/content/types";
import type { GlossaryTerm } from "@/lib/content/glossary";
import type { ProblemMeta } from "@/lib/problems/types";
import type { SearchEntry } from "./types";

/**
 * Hardcoded from the actual `<section id="...">` entries on
 * src/app/simulators/page.tsx (titles + descriptions copied verbatim, ids
 * matching the real scroll anchors) — there is no programmatic registry of
 * simulators to source this from, so it must be kept in sync by hand if
 * that page's set of simulators ever changes.
 */
const SIMULATOR_ENTRIES: SearchEntry[] = [
  {
    type: "simulator",
    title: "Bloch Sphere Explorer",
    description:
      "Rotate and manipulate a single qubit's state on the Bloch sphere in real time — apply gates, watch the state vector move, and measure.",
    href: "/simulators#bloch-sphere",
  },
  {
    type: "simulator",
    title: "Complex Plane & Amplitude Explorer",
    description:
      "Manipulate a complex amplitude directly — real part, imaginary part, magnitude, and phase — and see how they relate to probability.",
    href: "/simulators#complex-amplitude-explorer",
  },
  {
    type: "simulator",
    title: "Density Matrix Explorer",
    description:
      "Build a single-qubit density matrix live from two mixed-in pure states and watch it move on the Bloch sphere as purity and entropy update.",
    href: "/simulators#density-matrix-explorer",
  },
  {
    type: "simulator",
    title: "2-Qubit State Explorer",
    description:
      "Prepare two-qubit states, apply gates and CNOT, and see entanglement, measurement, and correlation play out with real quantum math.",
    href: "/simulators#two-qubit-explorer",
  },
  {
    type: "simulator",
    title: "Circuit Builder",
    description:
      "Build a real circuit gate by gate on 2 or 3 qubits, then step through it to watch the state vector evolve at every stage.",
    href: "/simulators#circuit-builder",
  },
  {
    type: "simulator",
    title: "CHSH Bell Test",
    description:
      "Pick four measurement angles on a shared entangled pair and watch the real computed CHSH value S update live, crossing the classical bound of 2.",
    href: "/simulators#chsh-bell-test",
  },
  {
    type: "simulator",
    title: "Rabi / Qubit Dynamics Explorer",
    description:
      "Drive a two-level system and watch population oscillate between the ground and excited state via direct numerical integration of the Schrödinger equation.",
    href: "/simulators#rabi-explorer",
  },
  {
    type: "simulator",
    title: "Noise & Decoherence Explorer",
    description:
      "Apply a real Kraus-operator noise channel (amplitude damping or dephasing) to a qubit step by step and watch its Bloch vector shrink toward the channel's fixed point.",
    href: "/simulators#noise-explorer",
  },
  {
    type: "simulator",
    title: "Wavefunction Explorer",
    description:
      "A 1D numerical wavefunction simulator — position and momentum grids, a real FFT, and time evolution via the split-operator method.",
    href: "/simulators#wavefunction-explorer",
  },
  {
    type: "simulator",
    title: "Grover's Algorithm Explorer",
    description:
      "Step through Grover's algorithm one oracle-and-diffusion iteration at a time and watch the marked state's amplitude grow, using the platform's real Grover engine.",
    href: "/simulators#grover-explorer",
  },
  {
    type: "simulator",
    title: "Period-Finding Explorer",
    description:
      "Pick any small composite N, any base a coprime to it, and any number of counting qubits, then watch the real period-finding engine (the QFT-based mechanism behind Shor's algorithm) at work.",
    href: "/simulators#period-finding-explorer",
  },
  {
    type: "simulator",
    title: "Max-Cut QAOA Explorer",
    description:
      "Drag the cost angle γ and mixer angle β across a p=1 QAOA circuit on a few small graphs and watch the computed expected cut size chase the brute-force optimum.",
    href: "/simulators#qaoa-explorer",
  },
  {
    type: "simulator",
    title: "Syndrome Explorer",
    description:
      "Inject a real X or Z error into a 3-qubit repetition code and watch the platform's error-correction engine extract the syndrome and apply the correction — bit-flip and phase-flip, both live.",
    href: "/simulators#syndrome-explorer",
  },
  {
    type: "simulator",
    title: "Cross-Simulator Comparison",
    description:
      "One real qubit state, one set of shared controls, and three of this page's own rendering lenses side by side — the Bloch sphere, the complex amplitude plane, and the probability bar chart.",
    href: "/simulators#compare-states-explorer",
  },
];

/** The real pillar landing page each course is shown on (there's no per-course route). */
// Every pillar has a real landing page now, Quantum Mastery included — it was
// the last holdout and this table used to point it at /learn.
//
// This deliberately restates the routes rather than importing them from
// `src/lib/design/pillars.ts`, which is where they actually live. The reason
// is a hard constraint on this file, documented at length in
// `scripts/generate-search-index.mjs`: that script imports this module
// directly under plain Node (which strips types but resolves neither the
// `@/...` path alias nor extension-less specifiers), so this file's only
// *runtime* imports must be ones plain Node can follow. Every other import
// here is `import type`, which is erased. A value import of PILLAR_VISUALS
// breaks `npm run generate:search-index`, and therefore `predev`/`prebuild` —
// which is exactly how this comment came to be written.
//
// The duplication is guarded instead of trusted:
// `src/lib/design/__tests__/pillars.test.ts` asserts this map matches the
// pillar-identity table entry for entry, and that every route in it is backed
// by a real App Router page.
const PILLAR_HREF: Record<Pillar, string> = {
  "quantum-mechanics": "/mechanics",
  "quantum-computing": "/computing",
  "quantum-hardware": "/hardware",
  "quantum-software": "/software",
  "quantum-mastery": "/mastery",
  apex: "/apex",
};

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * A lesson's metadata plus the bounded term set extracted from its `.mdx`
 * body by `scripts/generate-search-index.mjs` (via
 * `lib/search/lessonKeywords.ts`).
 *
 * Declared here rather than added to `LessonMetaWithSlug` because it is not
 * lesson metadata: nothing on the site reads it, no lesson author writes it,
 * and it exists solely to be carried into `search-index.json`. Optional so
 * that every existing caller of `buildSearchIndex` — including the unit tests,
 * which hand it hand-written fixtures — still compiles and simply produces
 * entries without the field.
 */
type IndexedLesson = LessonMetaWithSlug & { keywords?: string };

/**
 * Builds the flat, site-wide search index from already-resolved lesson,
 * problem, and course metadata, plus the hardcoded simulator list above.
 *
 * Deliberately pure and synchronous, with NO filesystem or Next.js-specific
 * dependencies — every import above is type-only (fully erased at runtime,
 * so none of their `@/...` aliases ever need to resolve), and `courses` is
 * taken as a parameter rather than imported from `curriculum.ts` directly.
 * That makes this whole module safe to `import()` directly from a plain
 * Node script — see `scripts/generate-search-index.mjs`, which can't run
 * inside Next's bundler (so can't dynamically `import()` MDX lesson
 * modules or resolve `@/...` aliases at all) and instead gathers
 * `lessons`/`problems` via lightweight text parsing of the source files and
 * `courses` via a direct `import()` of `curriculum.ts` (itself dependency-free
 * at runtime), then hands all three to this function to assemble
 * `public/search-index.json` at build time. The client-side search overlay
 * fetches that JSON lazily rather than any of this ever running per-request
 * or being embedded in a page's payload — see
 * `src/components/search/SearchOverlay.tsx`.
 */
export function buildSearchIndex(
  lessons: IndexedLesson[],
  problems: ProblemMeta[],
  courses: Course[],
  terms: GlossaryTerm[],
  /** The six track landing pages. Passed in rather than imported for the same
   *  reason everything else here is: this module is loaded by
   *  `scripts/generate-search-index.mjs` under plain Node, which resolves no
   *  `@/...` alias, so its only runtime imports must be ones Node can follow.
   *  Defaulted so existing callers that only want a count still compile. */
  pillars: PillarInfo[] = []
): SearchEntry[] {
  const coursePillarBySlug = new Map(courses.map((course) => [course.slug, course.pillar]));
  // The course a lesson/problem lives in, by title. A result row that says
  // only "Bell States · Quantum Computing" makes a reader guess; one that says
  // which *course* it sits in tells them whether it's the page they mean.
  const courseTitleBySlug = new Map(courses.map((course) => [course.slug, course.title]));

  // The lesson body's term set rides along here and nowhere else. It is the
  // only reason a stuck reader's query ("power series", "half angle",
  // "theta/2") reaches the lesson that teaches it — see
  // `lib/search/lessonKeywords.ts` for what is extracted, the 600-character
  // per-lesson cap that keeps this file's growth linear in lesson *count*,
  // and why problems are given no such field.
  //
  // Omitted rather than emitted empty when a caller has none, so the JSON
  // stays byte-identical to what it was for every entry kind that has no
  // keywords, and `SearchEntry.keywords` reads as genuinely optional.
  const lessonEntries: SearchEntry[] = lessons.map((lesson) => ({
    type: "lesson",
    title: lesson.title,
    description: lesson.description,
    href: `/lessons/${lesson.slug}`,
    pillar: coursePillarBySlug.get(lesson.course),
    course: courseTitleBySlug.get(lesson.course),
    ...(lesson.keywords ? { keywords: lesson.keywords } : {}),
  }));

  const problemEntries: SearchEntry[] = problems.map((problem) => {
    const tagSuffix = problem.tags.length > 0 ? ` · ${problem.tags.slice(0, 3).join(", ")}` : "";
    return {
      type: "problem",
      title: problem.title,
      description: `${titleCase(problem.problemType)} problem · ${titleCase(problem.difficulty)}${tagSuffix}`,
      href: `/problems/${problem.slug}`,
      pillar: coursePillarBySlug.get(problem.course),
      course: courseTitleBySlug.get(problem.course),
    };
  });

  const courseEntries: SearchEntry[] = courses.map((course) => ({
    type: "course",
    title: course.title,
    description: course.description,
    // Deliberately NOT `PILLAR_HREF[course.pillar]`. Searching a course title
    // and landing on the pillar landing page — where you then have to find
    // that same course again in a list of eight — is a dead end dressed up as
    // a result. `/courses/<slug>` is a real, statically generated page for
    // every course (`src/app/courses/[slug]/page.tsx`).
    //
    // This duplicates `getCourseHref()` in
    // `src/components/curriculum/courseHref.ts` rather than importing it, for
    // the same reason `PILLAR_HREF` above is duplicated: this module is
    // imported by `scripts/generate-search-index.mjs` under plain Node, which
    // resolves no `@/...` alias. `src/lib/design/__tests__/routes.test.ts`
    // asserts the two agree, so they cannot drift silently.
    href: `/courses/${course.slug}`,
    pillar: course.pillar,
  }));

  // Glossary terms.
  //
  // These belong in the *same* search box as everything else because a
  // newcomer's most common query is a word they just hit and didn't
  // recognise ("decoherence", "ancilla", "unitary") — not a lesson title. A
  // search that can't answer a bare single word fails precisely the reader
  // it matters most to.
  //
  // Baked in here, at build time, rather than imported by the search overlay
  // at runtime: `src/lib/content/glossary.ts` is a large prose corpus with a
  // client-bundle budget (`src/lib/design/__tests__/clientBoundary.test.ts`),
  // and the overlay already fetches this prebuilt JSON lazily — so the terms
  // ride along at zero extra client-bundle cost. Do not add a client-side
  // import of the glossary module to `src/components/search/**`.
  //
  // `/glossary#<id>` is the canonical deep link to one entry: the same anchor
  // `GlossaryFilter` renders (`id={term.id}`) and the same one `<Term>` links
  // to (`src/components/mdx/Term.tsx`). Not a dead end either — a glossary
  // entry links on to the lessons that cover the term.
  //
  // The whole definition is carried as the description, not a truncation: it
  // is what makes a term findable by *description* as well as by name, for a
  // reader who only remembers what the thing does. The result row clamps it.
  const termEntries: SearchEntry[] = terms.map((term) => ({
    type: "term",
    title: term.title,
    description: term.definition,
    href: `/glossary#${term.id}`,
    pillar: term.pillar,
  }));

  // Track landing pages. Six entries, and the reason they exist is narrow and
  // real: typing a subject name — "hardware", "mechanics", "software" —
  // returned lessons *about* that subject and never the section itself, so the
  // one query a disoriented newcomer is most likely to type was the one query
  // that could not take them to the obvious place. `PILLAR_HREF` is the route
  // table for exactly this, guarded against the design-system table by
  // `src/lib/design/__tests__/pillars.test.ts`.
  const trackEntries: SearchEntry[] = pillars.map((pillar) => ({
    type: "track",
    title: pillar.title,
    description: pillar.description,
    href: PILLAR_HREF[pillar.slug],
    pillar: pillar.slug,
  }));

  return [
    ...termEntries,
    ...lessonEntries,
    ...problemEntries,
    ...SIMULATOR_ENTRIES,
    ...courseEntries,
    ...trackEntries,
  ];
}
