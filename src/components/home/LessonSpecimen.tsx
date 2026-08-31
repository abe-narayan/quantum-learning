import Link from "next/link";
import { SectionTitle, TechLabel } from "@/components/ui/Typography";
import { LessonInstrumentLine } from "@/components/lessons/LessonInstrumentLine";
import { QuantumStateDisplay } from "@/components/quantum/QuantumStateDisplay";
import { getCourse } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { getProblemMetaForLesson } from "@/lib/problems/metaRegistry";
import { StateVector } from "@/lib/quantum/state";
import { applyCNOT, applySingleQubitGate, HADAMARD } from "@/lib/quantum/gates";

/**
 * ============================================================
 * The specimen: what one lesson looks like from the inside
 * ============================================================
 * `HowItWorks` above describes a lesson in four beats, and `PredictSection`
 * demonstrates beat 2 live. Beats 1, 3 and 4 were still assertions: a reader
 * asking the tenth first-visit question, "what does a lesson page actually
 * look like?", had nothing on the homepage to look at.
 *
 * A screenshot would have been the wrong answer on a site whose whole claim is
 * that it renders its own physics. So this is the physics, rendered.
 *
 * **Nothing below is written for the homepage.** Every part of it is either a
 * registry read or an engine call:
 *
 *   the lesson's identity, difficulty, module position, length and first
 *     learning objective   `getAllLessonsMeta()` / `getCourse()`
 *   the graded-problem count   `getProblemMetaForLesson()`
 *   the two state vectors   `StateVector.zero(2)` through `HADAMARD` and
 *     `applyCNOT`, which is *the same three lines* the lesson's own MDX runs
 *     in its export block, and `QuantumStateDisplay` is the same component
 *     that renders them there
 *
 * So the specimen cannot drift into a claim the corpus does not support: if
 * the lesson is renamed, re-rated, re-timed or re-ordered, this moves with it,
 * and if the engine's answer ever changed the numbers here would change too.
 * The only authored strings are the framing sentences, and they describe the
 * apparatus rather than the physics.
 *
 * Deliberately *not* the whole lesson. It is one section of one lesson, said
 * so plainly, with a link to the rest — a specimen, not a preview, and not a
 * fifth beat added to a list of four.
 *
 * Server Component, and it has to stay one: `QuantumStateDisplay` and the two
 * registries all reach modules that must never enter a browser bundle. See
 * `src/lib/design/__tests__/clientBoundary.test.ts`, and note that this file
 * imports no compiled `.mdx` module either, which is the build-memory
 * invariant that keeps this off the OOM path.
 */

/** The lesson this specimen is taken from. Chosen because its derivation is
 *  two gates long, needs no calculus, and is the one every reader of the
 *  Computing track meets in their first few hours. If it is ever removed, this
 *  block renders nothing rather than a broken panel. */
const SPECIMEN_SLUG = "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement";

export async function LessonSpecimen() {
  const lessons = await getAllLessonsMeta();
  const lesson = lessons.find((entry) => entry.slug === SPECIMEN_SLUG);
  if (!lesson) return null;

  const course = getCourse(lesson.course);
  const position = course?.modules.findIndex((entry) => entry.slug === lesson.module) ?? -1;
  const problemCount = getProblemMetaForLesson(SPECIMEN_SLUG).length;

  // A single-lesson module inherits the lesson's own title, and this
  // specimen's does: `module: "bell-states-and-entanglement"` under a lesson
  // of the same name. `LessonInstrumentLine` prints that rung immediately
  // below the title this block already set in display type, so the served
  // homepage carried "Bell States and Entanglement" twice, two lines apart.
  // On a lesson page the same pair is separated by a breadcrumb and a lede
  // and reads as orientation; stripped down to a specimen it reads as a dump
  // of registry fields, which is the one thing this section exists not to be.
  // So the module rung is passed only when it says something the line above
  // did not, and a course whose modules are named differently still gets it.
  const moduleTitle = course?.modules[position]?.title;

  // The lesson's own derivation, run here. `StateVector.zero(2)` is |00>;
  // `HADAMARD` on qubit 0 puts the control in superposition; `applyCNOT(0, 1)`
  // flips the target on the |10> branch only. The amplitudes below are
  // whatever those calls return.
  const afterHadamard = applySingleQubitGate(StateVector.zero(2), HADAMARD, 0);
  const bellState = applyCNOT(afterHadamard, 0, 1);

  return (
    <div className="mt-10 border-t border-border pt-10">
      <TechLabel as="p">Specimen</TechLabel>
      <SectionTitle level={3} size="md" className="mt-2">
        One section of one lesson, running here
      </SectionTitle>
      <p className="mt-3 max-w-lede text-sm leading-relaxed text-muted-foreground">
        Not a screenshot. Both state vectors below were computed on this page by the
        same engine the lesson runs, in the components a lesson page uses.
      </p>

      {/* Deliberately **not** wrapped in an `Instrument`. `QuantumStateDisplay`
          is itself an `.instrument` panel, and its own source note rules out
          "a slab inside a panel inside a panel". A lesson page does not put
          those panels inside another panel either: they stand in the reading
          column. So the specimen is a reading column with a rule down its
          left edge, which is what marks it as quoted material, and the two
          instruments sit in it exactly as they sit in the lesson.

          `data-pillar` retints the block to the track the lesson belongs to,
          the same way /learn's two fork cards carry their own track's ramp. */}
      <div
        data-pillar={course?.pillar}
        className="mt-8 max-w-reading border-l-2 border-pillar-edge pl-5 sm:pl-6"
      >
        <p className="tech-label text-subtle-foreground">{course?.title}</p>
        <p className="mt-1 font-display text-xl font-semibold leading-tight text-foreground">
          {lesson.title}
        </p>

        <LessonInstrumentLine
          className="mt-4"
          difficulty={lesson.difficulty}
          moduleTitle={moduleTitle === lesson.title ? undefined : moduleTitle}
          position={position}
          totalModules={course?.modules.length ?? 0}
          estimatedMinutes={lesson.estimatedMinutes}
        />

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Start from two qubits, both zero. Apply a Hadamard to the first one
          only, which puts it in an even superposition and leaves the second
          alone:
        </p>
        <QuantumStateDisplay state={afterHadamard} label="H on qubit 0" />

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Now a controlled NOT, first qubit controlling the second. The
          all-zero branch is left alone; the other branch has its target
          flipped. Nothing in the circuit ever touched the two qubits together,
          and yet:
        </p>
        <QuantumStateDisplay state={bellState} label="then CNOT(0, 1)" />

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Neither qubit now has a state of its own. Proving that no pair of
          single-qubit states multiplies out to this one is the rest of the lesson
          {problemCount > 0 ? (
            <>
              , then {problemCount} graded problems on it, marked against a real
              answer
            </>
          ) : null}
          .
        </p>

        <p className="mt-5 text-sm">
          <Link
            href={`/lessons/${lesson.slug}`}
            className="font-medium text-pillar underline-offset-4 hover:underline"
          >
            Read {lesson.title}
          </Link>{" "}
          <span className="text-subtle-foreground">
            ({lesson.estimatedMinutes} min)
          </span>
        </p>

        <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-subtle-foreground">
          Nothing in the two panels is typed in.
        </p>
      </div>
    </div>
  );
}
