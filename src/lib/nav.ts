export type NavItem = {
  label: string;
  href: string;
  description: string;
};

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
    description: "Interactive tools for building intuition about quantum states.",
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
    description: "Practice problems and quizzes to check your understanding.",
  },
  {
    label: "Current Quantum",
    href: "/current-quantum",
    description: "Real, recent developments in quantum computing and physics, connected back to the curriculum.",
  },
  {
    label: "About",
    href: "/about",
    description: "Who QuantumLearn is for, and what we're building.",
  },
];

/** The six pillar/track pages, grouped under one "Tracks" nav dropdown, in
 *  curriculum order (see `PILLAR_ORDER` in `src/lib/design/pillars.ts`). */
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
