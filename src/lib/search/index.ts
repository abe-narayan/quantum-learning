import type { Course, LessonMetaWithSlug, Pillar } from "@/lib/content/types";
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
      "A real 1D numerical wavefunction simulator — position and momentum grids, an actual FFT, and genuine time evolution via the split-operator method.",
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
      "Drag the cost angle γ and mixer angle β across a real p=1 QAOA circuit on a few small graphs and watch the genuinely computed expected cut size chase the real brute-force optimum.",
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
const PILLAR_HREF: Record<Pillar, string> = {
  "quantum-mechanics": "/mechanics",
  "quantum-computing": "/computing",
  "quantum-hardware": "/hardware",
  "quantum-software": "/software",
  // No dedicated pillar landing page — Quantum Mastery courses are surfaced
  // from within /learn rather than their own top-level route.
  "quantum-mastery": "/learn",
};

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

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
  lessons: LessonMetaWithSlug[],
  problems: ProblemMeta[],
  courses: Course[]
): SearchEntry[] {
  const coursePillarBySlug = new Map(courses.map((course) => [course.slug, course.pillar]));

  const lessonEntries: SearchEntry[] = lessons.map((lesson) => ({
    type: "lesson",
    title: lesson.title,
    description: lesson.description,
    href: `/lessons/${lesson.slug}`,
    pillar: coursePillarBySlug.get(lesson.course),
  }));

  const problemEntries: SearchEntry[] = problems.map((problem) => {
    const tagSuffix = problem.tags.length > 0 ? ` · ${problem.tags.slice(0, 3).join(", ")}` : "";
    return {
      type: "problem",
      title: problem.title,
      description: `${titleCase(problem.problemType)} problem · ${titleCase(problem.difficulty)}${tagSuffix}`,
      href: `/problems/${problem.slug}`,
      pillar: coursePillarBySlug.get(problem.course),
    };
  });

  const courseEntries: SearchEntry[] = courses.map((course) => ({
    type: "course",
    title: course.title,
    description: course.description,
    href: PILLAR_HREF[course.pillar],
    pillar: course.pillar,
  }));

  return [...lessonEntries, ...problemEntries, ...SIMULATOR_ENTRIES, ...courseEntries];
}
