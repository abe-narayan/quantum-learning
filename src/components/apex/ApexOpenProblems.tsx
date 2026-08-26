import Link from "next/link";
import { SectionTitle, TechLabel } from "@/components/ui/Typography";
import { Marginalia } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import type { Course, LessonMetaWithSlug } from "@/lib/content/types";

/**
 * ============================================================
 * Open problems at the frontier
 * ============================================================
 * The brief for this page: Apex's subject matter genuinely sits at the
 * boundary of what is known, and the page needs to say so honestly rather
 * than just being darker than the other five pillars.
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
  /** What is genuinely open, or genuinely at the edge, about this course's subject. */
  framing: string;
  /** The module slug (within the same course) that establishes the framing. */
  grounding: string;
};

const FRONTIERS: Frontier[] = [
  {
    course: "algorithmic-frontiers",
    framing:
      "Block encoding and the quantum singular value transformation now unify Grover's algorithm, Hamiltonian simulation, and linear-systems solving as one construction — this course's own capstone calls it the framework that has quietly absorbed most of quantum algorithms research since 2016. The open edge isn't one unsolved theorem; it's how far the construction still generalizes: which matrices admit efficient block encodings, and what a new choice of signal-processing polynomial buys that hasn't been tried yet.",
    grounding: "capstone-the-toolbox-that-ate-quantum-algorithms",
  },
  {
    course: "fault-tolerance-frontiers",
    framing:
      "The threshold theorem is proved: below a constant physical error rate, concatenated encoding drives logical error arbitrarily low. But that proof's threshold is deliberately pessimistic. The number a real device has to beat instead is a specific decoder's numerically estimated, architecture-specific threshold — and closing the gap between the rigorous bound and the realistic one is the actual content of a resource estimate.",
    grounding: "the-threshold-theorem",
  },
  {
    course: "quantum-complexity-theory",
    framing:
      "Kitaev's theorem settles the Local Hamiltonian problem: it is QMA-complete, quantum computing's own analogue of Cook-Levin. What stays open sits one level up — this course's capstone is an honest, current map of exactly what is proven, what is conjectured, and what remains unresolved about quantum advantage, including the real gap between an oracle separation and an unconditional one.",
    grounding: "capstone-what-we-know-and-dont",
  },
  {
    course: "simulation-and-compilation-frontiers",
    framing:
      "Two independent boundaries — the Gottesman-Knill theorem for stabilizer circuits, and the tensor-network bond-dimension bound for low-entanglement states — together mark out exactly which circuits a classical computer can simulate efficiently. That boundary is the working definition of quantum advantage, and every real advantage experiment is engineered specifically to sit outside both regions at once.",
    grounding: "when-classical-simulation-works",
  },
  {
    course: "research-methods-and-synthesis",
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
                  {course.title}
                </SectionTitle>
                <p className="mt-3 max-w-[46rem] text-[0.95rem] leading-relaxed text-muted-foreground">
                  {entry.framing}
                </p>
                {groundingLesson ? (
                  <Marginalia className="mt-4 lg:mt-2">
                    <TechLabel as="p">Grounded in</TechLabel>
                    <Link
                      href={`/lessons/${groundingLesson.slug}`}
                      className="mt-1 block text-foreground transition-colors duration-[--dur-fast] ease-[--ease-mech] hover:text-pillar-text focus-visible:text-pillar-text"
                    >
                      {groundingLesson.title} →
                    </Link>
                  </Marginalia>
                ) : null}
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
