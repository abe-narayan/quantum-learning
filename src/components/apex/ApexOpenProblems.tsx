import Link from "next/link";
import { SectionTitle, TechLabel } from "@/components/ui/Typography";
import { Marginalia } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { getCourseHref } from "@/components/curriculum/courseHref";
import { firstAuthoredLessonSlug } from "./readiness";
import type { Course, LessonMetaWithSlug } from "@/lib/content/types";

/**
 * ============================================================
 * Open problems at the frontier
 * ============================================================
 * The brief for this page: Apex's subject matter genuinely sits at the
 * boundary of what is known, and the page needs to say so honestly rather
 * than just being darker than the other five tracks.
 *
 * Each entry therefore carries three things and is only worth rendering if
 * it has all three: what is actually unresolved (`status` + `framing`), why
 * that matters (inside `framing` — the resource estimate, the advantage
 * claim, the algorithm design it decides), and somewhere to go next. That
 * last one is unconditional: an "open problem" with no path is a dead end,
 * so the "Closest coverage" pointer falls back to the course's own module
 * list if its grounding lesson is ever unauthored.
 *
 * `status` is deliberately different per entry rather than a uniform "Open"
 * chip. Two of these five are settled theorems whose frontier is somewhere
 * other than the theorem, and one is not an open problem in physics at all;
 * labelling all five "Open" would be exactly the overclaim this section is
 * supposed to avoid.
 *
 * Every sentence below paraphrases language already present in
 * `curriculum.ts`'s course descriptions or in the grounding lesson's own
 * `lessonMeta`/prose (Kitaev's theorem, the "toolbox that ate quantum
 * algorithms research" framing, the proven-but-pessimistic vs.
 * realistic-but-not-fully-rigorous threshold contrast, the Gottesman-Knill /
 * bond-dimension classical-simulability boundary). Nothing here asserts a
 * result, a date, or a citation that isn't already in that content — see
 * each entry's `grounding` module for the specific lesson it's drawn from.
 */

type Frontier = {
  /** Course slug this framing belongs to — must match a real Apex course. */
  course: string;
  /**
   * A short, specific statement of *what kind of thing* is unresolved here.
   * Deliberately not a uniform "Open" badge: two of these five are settled
   * theorems whose frontier is somewhere other than the theorem, and one is
   * not an open problem in physics at all. Saying which is the honesty this
   * section is for — an undifferentiated "Open" on all five would be the
   * overclaim.
   */
  status: string;
  /** What is genuinely open, or genuinely at the edge, about this course's subject. */
  framing: string;
  /** The module slug (within the same course) that establishes the framing. */
  grounding: string;
};

const FRONTIERS: Frontier[] = [
  {
    course: "algorithmic-frontiers",
    status: "Open — a direction, not a single unsolved theorem",
    framing:
      "Block encoding and the quantum singular value transformation now unify Grover's algorithm, Hamiltonian simulation, and linear-systems solving as one construction — this course's own capstone calls it the framework that has quietly absorbed most of quantum algorithms research since 2016. The open edge isn't one unsolved theorem; it's how far the construction still generalizes: which matrices admit efficient block encodings, and what a new choice of signal-processing polynomial buys that hasn't been tried yet.",
    grounding: "capstone-the-toolbox-that-ate-quantum-algorithms",
  },
  {
    course: "fault-tolerance-frontiers",
    status: "Proved — but the proved number is not the number engineering uses",
    framing:
      "The threshold theorem is proved: below a constant physical error rate, concatenated encoding drives logical error arbitrarily low. But that proof's threshold is deliberately pessimistic. The number a real device has to beat instead is a specific decoder's numerically estimated, architecture-specific threshold — and closing the gap between the rigorous bound and the realistic one is the actual content of a resource estimate.",
    grounding: "the-threshold-theorem",
  },
  {
    course: "quantum-complexity-theory",
    status: "Settled one level down, open one level up",
    framing:
      "Kitaev's theorem settles the Local Hamiltonian problem: it is QMA-complete, quantum computing's own analogue of Cook-Levin. What stays open sits one level up — this course's capstone is an honest, current map of exactly what is proven, what is conjectured, and what remains unresolved about quantum advantage, including the real gap between an oracle separation and an unconditional one.",
    grounding: "capstone-what-we-know-and-dont",
  },
  {
    course: "simulation-and-compilation-frontiers",
    status: "Two regimes characterized; what lies between them is not",
    framing:
      "Two independent boundaries — the Gottesman-Knill theorem for stabilizer circuits, and the tensor-network bond-dimension bound for low-entanglement states — each mark out a family of circuits a classical computer provably can simulate efficiently. Neither settles the region between them: a circuit that is neither close to stabilizer nor low in entanglement has no known argument deciding it either way. That gap is why an advantage claim is always argued against a specific classical algorithm rather than against a theorem, and why every real advantage experiment is engineered to sit outside both provable regions at once.",
    grounding: "when-classical-simulation-works",
  },
  {
    course: "research-methods-and-synthesis",
    status: "Not an open problem — the working skill the other four require",
    framing:
      "Not a new open problem in physics — the frontier's actual working skill. This course's premise is that everything built across the rest of this platform is already enough to check a real paper's claim against its stated assumptions; the only thing left to practice is doing that deliberately, on a document whose author isn't in the room to clarify what they meant.",
    grounding: "how-to-read-a-quantum-computing-paper",
  },
];

export function ApexOpenProblems({
  courses,
  lessons,
}: {
  courses: Course[];
  lessons: LessonMetaWithSlug[];
}) {
  const courseBySlug = new Map(courses.map((course) => [course.slug, course]));

  return (
    <ol className="border-t border-border">
      {FRONTIERS.map((entry, index) => {
        const course = courseBySlug.get(entry.course);
        if (!course) return null;
        const groundingLesson = lessons.find(
          (lesson) => lesson.course === entry.course && lesson.module === entry.grounding
        );
        // An "open problem" with nowhere to go is a dead end, so the pointer
        // is unconditional: normally the specific lesson that gets closest
        // to the boundary, and — if that module is ever unauthored — the
        // course itself, which always exists. Never nothing.
        const groundingHref = groundingLesson
          ? `/lessons/${groundingLesson.slug}`
          : getCourseHref(course.slug, firstAuthoredLessonSlug(course.slug, lessons));
        const groundingTitle = groundingLesson
          ? groundingLesson.title
          : `${course.title} — full module list`;
        const n = String(index + 1).padStart(2, "0");

        return (
          <li key={entry.course} className="border-b border-border">
            <Reveal
              as="div"
              delay={index * 70}
              className="grid gap-4 py-9 sm:grid-cols-[3.5rem_1fr] sm:gap-8 sm:py-11"
            >
              <span aria-hidden="true" data-decorative="" className="font-tech text-3xl leading-none text-subtle-foreground">
                {n}
              </span>
              <div>
                <SectionTitle level={3} size="sm">
                  <Link
                    href={getCourseHref(course.slug, groundingLesson?.slug)}
                    className="transition-colors duration-[--dur-fast] ease-[--ease-mech] hover:text-pillar-text focus-visible:text-pillar-text"
                  >
                    {course.title}
                  </Link>
                </SectionTitle>
                <p className="mt-2 max-w-[46rem] text-sm text-pillar-text">
                  <span className="tech-label text-subtle-foreground">Status — </span>
                  {entry.status}
                </p>
                <p className="mt-3 max-w-[46rem] text-[0.95rem] leading-relaxed text-muted-foreground">
                  {entry.framing}
                </p>
                <Marginalia className="mt-4 lg:mt-2">
                  <TechLabel as="p">Closest coverage</TechLabel>
                  <Link
                    href={groundingHref}
                    className="mt-1 flex min-h-11 items-center text-foreground transition-colors duration-[--dur-fast] ease-[--ease-mech] hover:text-pillar-text focus-visible:text-pillar-text"
                  >
                    {groundingTitle} →
                  </Link>
                </Marginalia>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
