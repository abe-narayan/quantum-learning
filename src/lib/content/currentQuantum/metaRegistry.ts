import type { CurrentQuantumEntryMeta } from "./types";

export type { CurrentQuantumEntryMeta, CurrentQuantumCategory } from "./types";

/**
 * Meta-only view of the "Current Quantum" collection: every entry's slug,
 * date, title, category and related lesson slug, and nothing else.
 *
 * WHY THIS EXISTS (do not re-merge this file into `data.ts`):
 * `ConceptDetailPanel` is a `"use client"` component. It reverse-looks-up
 * the entries that cite a concept's lessons and renders each as a mini-card
 * showing a date, a category chip and a title. That single lookup used to go
 * through `registry.ts` -> `data.ts`, which is the whole corpus: 32 entries
 * of summary prose, "why this matters" prose, source citations, image URLs,
 * alt text, captions and licence attribution, plus the editorial provenance
 * comments above each one. It reached **21.3 KB gzipped of source shipped to
 * the browser so that a panel could print a title and a date**, and it grew
 * every time an entry was added, which is how it blew its budget in
 * `src/lib/design/__tests__/clientBoundary.test.ts` and prompted this split.
 *
 * This is the same boundary `src/lib/problems/metaRegistry.ts` draws against
 * `src/lib/problems/registry.ts`, for the same reason, and the naming
 * deliberately mirrors it. The difference is that the problem metas are
 * *generated* (text-extracted from 547 problem modules by
 * `scripts/generate-problem-registry.mjs`, with `__tests__/metaRegistry.test.ts`
 * pinning them to the real ones). This collection is 32 hand-maintained
 * entries with no build step at all, so a generator would be pure ceremony:
 * the meta is simply *authored here* and the body *authored in `data.ts`*,
 * with no duplicated field between them and therefore nothing to drift.
 *
 * WHAT BREAKS IF SOMEONE RE-MERGES THEM: nothing visibly, which is the
 * problem. `tsc` stays happy, every page renders identically, and the only
 * symptom is that the concept map's client chunk quietly carries the entire
 * collection again: exactly the failure mode `clientBoundary.test.ts`
 * documents for `DailyPuzzle` and the problem corpus. The test suite is what
 * notices: `data.ts` is listed as SERVER_ONLY there, and this file has its
 * own size budget.
 *
 * ADDING AN ENTRY means editing two files: append the meta here and the body
 * (with its citation comment) to `CURRENT_QUANTUM_BODIES` in `data.ts`. You
 * cannot forget the second half: `CURRENT_QUANTUM_BODIES` is typed
 * `Record<CurrentQuantumSlug, ...>` against the slugs below, so a missing or
 * misspelled body is a compile error, and `__tests__/registry.test.ts`
 * checks the pairing again at runtime.
 *
 * ORDERING: kept roughly chronological (oldest first) for ease of
 * hand-editing, and only roughly, since `getAllCurrentQuantumMeta()` re-sorts
 * newest-first for display, so the literal order here is not authoritative.
 *
 * `as const` is load-bearing: it is what gives `CurrentQuantumSlug` below a
 * literal union of the real slugs instead of `string`.
 */
export const CURRENT_QUANTUM_META = [
  {
    slug: "shors-algorithm-1994",
    date: "1994-11",
    title: "Shor's Algorithm Shows Quantum Computers Could Break RSA",
    category: "algorithms",
    relatedLessonSlug: "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding",
  },
  {
    slug: "first-quantum-teleportation-1997",
    date: "1997-12-11",
    title: "First Experimental Demonstration of Quantum Teleportation",
    category: "historical experiment",
    relatedLessonSlug: "quantum-computing/quantum-gates-and-circuits/quantum-teleportation",
  },
  {
    slug: "ibm-nmr-factors-15-2001",
    date: "2001-12-20",
    title: "IBM's NMR Quantum Computer Factors 15 Using Shor's Algorithm",
    category: "hardware milestone",
    relatedLessonSlug: "quantum-computing/quantum-algorithms-ii/worked-example-factoring-15",
  },
  {
    slug: "micius-satellite-entanglement-2017",
    date: "2017-06-15",
    title: "China's Micius Satellite Distributes Entanglement Over 1,200 km and Violates a Bell Inequality",
    category: "quantum networking",
    relatedLessonSlug: "quantum-computing/entanglement-and-measurement/the-chsh-inequality",
  },
  {
    slug: "google-sycamore-quantum-supremacy-2019",
    date: "2019-10-23",
    title: "Google's Sycamore Processor Claims \"Quantum Supremacy\"",
    category: "hardware milestone",
    relatedLessonSlug: "quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage",
  },
  {
    slug: "nobel-prize-2022-bell-tests",
    date: "2022-10-04",
    title: "Nobel Prize in Physics Awarded for Bell Inequality Experiments",
    category: "historical experiment",
    relatedLessonSlug: "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables",
  },
  {
    slug: "ibm-quantum-utility-2023",
    date: "2023-06-14",
    title: "IBM Demonstrates \"Quantum Utility\" Using Error Mitigation, Not Error Correction",
    category: "algorithms",
    relatedLessonSlug: "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation",
  },
  {
    slug: "ligo-squeezed-light-quantum-sensing-2023",
    date: "2023-10-30",
    title: "LIGO Uses Squeezed Light to Push Past the Ordinary Quantum Noise Limit",
    category: "sensing",
    relatedLessonSlug: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states",
  },
  {
    slug: "harvard-quera-logical-qubits-2023",
    date: "2023-12-06",
    title: "48 Error-Corrected Logical Qubits Demonstrated on a Neutral-Atom Processor",
    category: "error correction",
    relatedLessonSlug: "quantum-hardware/physical-qubit-platforms/neutral-atoms",
  },
  {
    slug: "nist-post-quantum-cryptography-standards-2024",
    date: "2024-08-13",
    title: "NIST Finalizes Its First Post-Quantum Cryptography Standards",
    category: "cryptography",
    relatedLessonSlug: "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding",
  },
  {
    slug: "google-willow-below-threshold-2024",
    date: "2024-12-09",
    title: "Google's Willow Chip Achieves Below-Threshold Error Correction",
    category: "error correction",
    relatedLessonSlug: "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction",
  },
  {
    slug: "northwestern-teleportation-over-internet-fiber-2024",
    date: "2024-12-20",
    title: "Quantum Teleportation Demonstrated Over Live Internet Fiber",
    category: "quantum networking",
    relatedLessonSlug: "quantum-hardware/physical-qubit-platforms/photonic-qubits",
  },
  {
    slug: "ibm-nighthawk-loon-2025",
    date: "2025-11-12",
    title: "IBM Unveils Nighthawk and Loon on Its Path to Fault-Tolerant Quantum Computing",
    category: "hardware milestone",
    relatedLessonSlug: "quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance",
  },
  {
    slug: "ionq-record-two-qubit-fidelity-2025",
    date: "2025-10-21",
    title: "IonQ Sets a New Trapped-Ion Two-Qubit Gate Fidelity Record: 99.99%",
    category: "hardware milestone",
    relatedLessonSlug: "quantum-hardware/physical-qubit-platforms/trapped-ions",
  },
  {
    slug: "bell-1964-epr-paradox-inequality",
    date: "1964-11",
    title: "John Bell Derives the Inequality That Makes Entanglement Testable",
    category: "historical experiment",
    relatedLessonSlug: "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables",
  },
  {
    slug: "feynman-simulating-physics-with-computers-1981",
    date: "1981-05",
    title: "Feynman Proposes Using Quantum Systems to Simulate Quantum Physics",
    category: "historical experiment",
    relatedLessonSlug: "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization",
  },
  {
    slug: "ibm-vqe-beh2-kandala-2017",
    date: "2017-09-14",
    title: "IBM Runs VQE on Real Hardware to Find Molecular Ground-State Energies",
    category: "algorithms",
    relatedLessonSlug: "quantum-computing/quantum-algorithms-ii/vqe-a-worked-toy-example",
  },
  {
    slug: "google-hartree-fock-chemistry-2020",
    date: "2020-08-28",
    title: "Google Simulates a Chemical Reaction Mechanism on a Superconducting Processor",
    category: "algorithms",
    relatedLessonSlug: "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits",
  },
  {
    slug: "china-integrated-quantum-communication-network-2021",
    date: "2021-01-06",
    title: "China Links Fiber and Satellite QKD Into a 4,600 km Quantum Network",
    category: "quantum networking",
    relatedLessonSlug: "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution",
  },
  {
    slug: "army-rydberg-spectrum-analyzer-2021",
    date: "2021-01-27",
    title: "Army Researchers Build a Rydberg-Atom Sensor Spanning 0 to 20 GHz",
    category: "sensing",
    relatedLessonSlug: "quantum-hardware/physical-qubit-platforms/neutral-atoms",
  },
  {
    slug: "ustc-62-qubit-quantum-walk-2021",
    date: "2021-05-28",
    title: "A 62-Qubit Processor Runs Single- and Two-Particle Quantum Walks",
    category: "algorithms",
    relatedLessonSlug: "quantum-mastery/advanced-algorithms-and-complexity/quantum-walks",
  },
  {
    slug: "harvard-telecom-quantum-memory-network-2024",
    date: "2024-05-15",
    title: "Harvard Entangles Two Diamond Quantum Memories Over Telecom Fiber",
    category: "quantum networking",
    relatedLessonSlug: "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
  },
  {
    slug: "tokyo-tech-diamond-magnetometer-meg-2024",
    date: "2024-06-05",
    title: "A Diamond Quantum Magnetometer Reaches Sub-10-Picotesla Sensitivity",
    category: "sensing",
    relatedLessonSlug: "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
  },
  {
    slug: "quantinuum-microsoft-reliable-logical-qubits-2024",
    date: "2024-04-03",
    title: "Microsoft and Quantinuum Cut Logical Error Rates 800x Below Physical Ones",
    category: "error correction",
    relatedLessonSlug: "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead",
  },
  {
    slug: "aws-ocelot-cat-qubits-2025",
    date: "2025-02-27",
    title: "AWS Unveils Ocelot, a Chip Built on Error-Biased \"Cat Qubits\"",
    category: "error correction",
    relatedLessonSlug: "quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different",
  },
  {
    slug: "oxford-distributed-quantum-computing-2025",
    date: "2025-02-05",
    title: "Oxford Teleports a Logic Gate Between Two Separate Quantum Processors",
    category: "quantum networking",
    relatedLessonSlug: "quantum-computing/quantum-gates-and-circuits/quantum-teleportation",
  },
  {
    slug: "quantinuum-certified-randomness-2025",
    date: "2025-04-10",
    title: "Quantinuum Demonstrates Cryptographically Certified Quantum Randomness",
    category: "cryptography",
    relatedLessonSlug: "quantum-software/simulating-quantum-systems/computational-cost-and-scaling",
  },
  {
    slug: "harvard-quera-96-logical-qubits-2025",
    date: "2025-12-09",
    title: "Harvard/QuEra/MIT Team Doubles the Logical-Qubit Record to 96 on One Neutral-Atom Processor",
    category: "error correction",
    relatedLessonSlug: "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead",
  },
  {
    slug: "dwave-onchip-cryogenic-control-2026",
    date: "2026-01-06",
    title: "D-Wave Demonstrates On-Chip Cryogenic Control for Gate-Model Qubits",
    category: "hardware milestone",
    relatedLessonSlug: "quantum-hardware/control-and-readout/control-electronics",
  },
  {
    slug: "quantinuum-helios-iceberg-logical-qubits-2026",
    date: "2026-02-25",
    title: "Quantinuum Runs Up to 94 Encoded Logical Qubits on a 98-Qubit Processor",
    category: "error correction",
    relatedLessonSlug: "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead",
  },
  {
    slug: "microsoft-quantinuum-carbon-tesseract-nature-2026",
    date: "2026-06-10",
    title: "Microsoft and Quantinuum Publish 800x Logical Error Suppression in Nature",
    category: "error correction",
    relatedLessonSlug: "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map",
  },
  {
    slug: "google-rl-control-error-correction-2026",
    date: "2026-07-08",
    title: "Google Uses Reinforcement Learning to Keep Error Correction Calibrated Mid-Computation",
    category: "error correction",
    relatedLessonSlug: "quantum-hardware/control-and-readout/calibration",
  },
] as const satisfies readonly CurrentQuantumEntryMeta[];

/** Literal union of every real entry slug, derived from the array above. */
export type CurrentQuantumSlug = (typeof CURRENT_QUANTUM_META)[number]["slug"];

/**
 * Every entry's meta, newest first.
 *
 * This is the one place the collection's public ordering is decided,
 * mirroring how `getAllProblemMeta()` / `getAllLessonsMeta()` each own their
 * catalog's ordering rather than leaving it to call sites. `registry.ts`'s
 * full-entry twin is built on top of this, so the two can never disagree.
 */
export function getAllCurrentQuantumMeta(): CurrentQuantumEntryMeta[] {
  return [...CURRENT_QUANTUM_META].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/**
 * Every entry that links back to a given lesson slug, newest first: the
 * meta-only twin of `getEntriesForLesson` in `registry.ts`.
 *
 * This is the function the concept map's client panel calls. If you need the
 * summary, source or figure as well, you are on a server component: use
 * `getEntriesForLesson` instead.
 */
export function getCurrentQuantumMetaForLesson(lessonSlug: string): CurrentQuantumEntryMeta[] {
  return getAllCurrentQuantumMeta().filter((meta) => meta.relatedLessonSlug === lessonSlug);
}
