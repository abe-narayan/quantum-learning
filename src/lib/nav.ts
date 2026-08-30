export type NavItem = {
  label: string;
  href: string;
  /**
   * Rendered copy. `{problems}` is substituted with the size of the problem
   * corpus by `navDescription` below — never read this field directly at a
   * surface that shows it to a reader.
   */
  description: string;
};

/** The token `navDescription` replaces. Exported so a test can assert no
 *  surface renders it raw. */
export const PROBLEM_COUNT_TOKEN = "{problems}";

/**
 * The copy for one nav item, with the problem corpus's size filled in.
 *
 * The count is *not* imported here, and that is the whole point of this
 * function. `PROBLEM_COUNT` (src/lib/structuredData.ts) is derived by
 * counting `problemMeta.generated.ts`, which no client bundle may touch, and
 * this module is imported by `Navbar` — a client component in the root
 * layout, on all 823 routes. The previous arrangement squared that circle
 * with a second, client-safe derivation: a 556-row slug->pillar table
 * (`components/layout/problemPillarIndex.ts`) whose `.size` was the count.
 * That table was 7.2KB gzip of the 100KB client-data ceiling, downloaded on
 * every route, to state one three-digit number and tint one badge.
 *
 * So the count crosses the boundary the way this codebase already moves
 * server data into the chrome: as a prop, from the server component that can
 * read it (`app/layout.tsx` -> `<Navbar problemCount>`, exactly like
 * `startLessonMinutes`), and read directly by the server components that
 * render it themselves (`app/not-found.tsx`). One derivation, one place,
 * nothing hand-kept, and no corpus-shaped module in the browser.
 */
export function navDescription(item: NavItem, problemCount: number): string {
  return item.description.replaceAll(PROBLEM_COUNT_TOKEN, String(problemCount));
}

/**
 * Where the persistent "Start learning" call to action goes.
 *
 * Deliberately a **lesson**, not `/learn`. `/learn` is already one click
 * away as its own nav item, so pointing the primary button at it made the
 * loudest control in the chrome a duplicate of the link two inches to its
 * left — and it answered "start learning" with another index to choose from
 * rather than with a page that starts teaching. `what-is-a-qubit` is *not*
 * the first lesson of the first track (that would be Mathematical
 * Foundations, in Quantum Mechanics); it is the Quantum Computing track's
 * on-ramp lesson, and that is intentional: it has zero prerequisites, needs
 * no math background, and leads with physical intuition — the genuine
 * beginner entry point. The rigor-first path stays reachable as the other
 * half of /learn's "two ways in" fork.
 *
 * The homepage hero's primary CTA points here too (same label, same
 * destination — one contract), with `/learn` relabeled "Browse the
 * curriculum" wherever it appears as a button.
 *
 * Note this is *not* the prerequisite-graph root (`/map` picks that), which
 * is a different and much less welcoming page for someone on their first
 * visit.
 *
 * The route is `/lessons/<slug>` where the slug is the lesson's path under
 * `src/content/lessons`. Guarded by `src/lib/search/__tests__/index.test.ts`,
 * which asserts the generated search index contains an entry with exactly
 * this href — so a moved or renamed lesson fails a test instead of shipping a
 * 404 on the site's most-clicked button.
 */
/** The lesson's own slug, as `src/content/lessons` and the lesson registry
 *  spell it. Split out from the href so a *server* caller can look this
 *  lesson's real metadata up (`getLessonMeta`) instead of re-deriving the
 *  slug by trimming the route prefix — see the "First lesson · N min" note
 *  in `Hero.tsx` and `Navbar.tsx`, whose duration must come from the data.
 *  This module is imported by client components, so it must never import a
 *  content registry itself. */
export const START_LEARNING_SLUG = "quantum-computing/qubits-and-quantum-states/what-is-a-qubit";

export const START_LEARNING_HREF = `/lessons/${START_LEARNING_SLUG}`;

// The logo already links home, so "Home" as a text link was pure duplication
// — dropped rather than kept for symmetry. The pillar pages moved into
// `TRACK_NAV_ITEMS` (rendered as a grouped "Tracks" dropdown by Navbar.tsx)
// since a flat 11-item bar was flagged repeatedly this session as real,
// user-facing redundancy: Learn/Lessons/Mechanics/Computing/Hardware/Software
// all ultimately render some view of the same curriculum data, and a
// first-time visitor had no way to tell them apart from the labels alone.
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Learn",
    href: "/learn",
    description: "The recommended learning path, from qubits to algorithms.",
  },
  {
    label: "Simulators",
    href: "/simulators",
    // Was "Interactive tools for building intuition about quantum states",
    // which said nothing a reader could not guess from the label and repeated
    // /simulators' own metadata description ("Interactive quantum simulators
    // for building intuition about qubits and circuits") almost word for word.
    // "Building intuition about" was doing filler duty in two files at once.
    //
    // The count is spelled out rather than read from `SIMULATOR_COUNT`: that
    // constant derives itself by building the search index, and this module is
    // imported by `Navbar`, a client component in the root layout, so importing
    // it here would drag `lib/search` into every page's bundle.
    //
    // The figure that has to match it is `SITE_DESCRIPTION` in
    // `lib/structuredData.ts`, which is now the single source `app/layout.tsx`,
    // `app/manifest.ts` and `app/opengraph-image.tsx` all read — this comment
    // used to name those three files as the things to keep in step, which stopped
    // being true when they were converted to import the constant. The only
    // other literals left are /simulators' own two ("Fourteen quantum
    // simulators" in its metadata, "Fourteen live instruments" on the page).
    description: "Fourteen simulators running the real numerics, not scripted animations.",
  },
  {
    label: "Map",
    href: "/map",
    description: "An interactive map of how key concepts depend on each other.",
  },
  {
    label: "Glossary",
    href: "/glossary",
    description: "An alphabetical reference of key terms, each linked to the lesson that covers it.",
  },
  {
    label: "Problems",
    href: "/problems",
    // Was "Practice problems and quizzes to check your understanding", which
    // was boilerplate *and* wrong: there are no quizzes on this site.
    //
    // The count is derived, not typed. It read "549" against a corpus of 556,
    // and this one string is not a footnote: `Navbar` renders it as the native
    // `title` tooltip on the desktop "Problems" link (so on every page), as
    // visible copy in the mobile menu, and `app/not-found.tsx` prints it in the
    // served 404.
    //
    // `{problems}` rather than an interpolated constant: the only derivation
    // of this figure is `PROBLEM_COUNT` in `lib/structuredData.ts`, which
    // counts the generated problem-meta array and therefore cannot be
    // imported from a module `Navbar` reaches. See `navDescription` above for
    // how the number gets here. The unlike case is `SIMULATOR_COUNT`, which
    // genuinely has no server-side source either.
    description: `${PROBLEM_COUNT_TOKEN} problems, marked against a real answer, with the worked solution after.`,
  },
  {
    label: "Current Quantum",
    href: "/current-quantum",
    description: "Real, recent developments in quantum computing and physics, connected back to the curriculum.",
  },
  {
    label: "About",
    href: "/about",
    // Was "Who StudyQuantum is for, and what we're building." The page behind
    // it does not use the first person once — it is written entirely about the
    // curriculum ("It is one connected subject taught in…") — so the nav was
    // promising a voice the destination does not have. It also has a section
    // the old description gave no hint of, and the most distinctive one on the
    // page: what the site deliberately does not claim.
    description: "Who StudyQuantum is for, how it is checked, and what it does not claim.",
  },
];

/**
 * The footer's "Reference" column: the nav's own items plus `/lessons`.
 *
 * `/lessons` is the complete, filterable index of all 219 authored lessons and
 * it appeared in neither the nav nor the footer — reachable only from two
 * spots on `/learn`, which is a lot of site to hide the list of everything on
 * it behind. It stays out of `NAV_ITEMS` deliberately: the top bar already
 * carries "Learn", and a bar with both would be asking a first-time visitor to
 * tell "Learn" from "All lessons" off two labels, which is the exact
 * redundancy that moved the six track pages into a dropdown. The footer is
 * where a reader who has scrolled past everything goes looking for an index,
 * so that is where the index belongs.
 */
export const FOOTER_REFERENCE_ITEMS: NavItem[] = [
  NAV_ITEMS[0],
  {
    label: "All lessons",
    href: "/lessons",
    description: "Every authored lesson, grouped by track and filterable by difficulty.",
  },
  ...NAV_ITEMS.slice(1),
];

/**
 * The six pillar/track pages, grouped under one "Tracks" nav dropdown, in
 * curriculum order (see `PILLAR_ORDER` in `src/lib/design/pillars.ts`).
 *
 * The descriptions below are the **short form** of `PILLARS[].description` in
 * `src/lib/content/curriculum.ts`, and that is a deliberate relationship
 * rather than an accident of two people writing the same blurb twice. Saying
 * so is the point: they were near-duplicates, each slightly different and
 * slightly worse than the curriculum's own, with nothing recording which was
 * canonical, which is how two parallel blurb sets drift.
 *
 * The nav does not read `curriculum.ts` directly, and must not: this module is
 * imported by `Navbar` and `Footer`, both client components on every page, and
 * `curriculum.ts` is a 12KB-gzip data module with its own client budget. One
 * line of nav copy is not worth putting the whole curriculum in every bundle.
 * So the rule is: keep each line below a strict abbreviation of the
 * corresponding `PILLARS` entry, and when that entry changes, shorten it again
 * here.
 */
export const TRACK_NAV_ITEMS: NavItem[] = [
  {
    label: "Mechanics",
    href: "/mechanics",
    description: "The mathematical and physical foundations of quantum theory.",
  },
  {
    label: "Computing",
    href: "/computing",
    description: "Qubits, gates, circuits, and the algorithms that use them.",
  },
  {
    label: "Hardware",
    href: "/hardware",
    description: "How qubits are physically built, controlled, and scaled.",
  },
  {
    label: "Software",
    href: "/software",
    description: "The simulators, compilers, and SDKs behind quantum programs.",
  },
  {
    label: "Mastery",
    href: "/mastery",
    description: "Graduate-level rigor: spectral theory, quantum information theory, and advanced algorithms.",
  },
  {
    label: "Apex",
    href: "/apex",
    description: "The summit of the curriculum: research-depth algorithms, fault tolerance, and complexity theory.",
  },
];
