import Link from "next/link";
import { Readouts } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { DIFFICULTY_LABEL, type Pillar } from "@/lib/content/types";
import { PILLAR_VISUALS } from "@/lib/design/pillars";

/**
 * The identical closing line every track section on the homepage was writing
 * out by hand: how many courses, how many hours, and the way in.
 *
 * Six near-identical copies of a fifteen-line block is most of what made the
 * page read as a list of cards rather than a descent, the eye learns the
 * shape by the third one and starts skipping. Written once, it can also carry
 * something the copies never did: where this track sits on the difficulty
 * ladder, derived from the real `difficulty` of the courses inside it rather
 * than asserted. That is the homepage's answer to "what here is beginner and
 * what is advanced", printed on every track instead of promised in the
 * abstract.
 */
export function PillarFooter({ pillar }: { pillar: Pillar }) {
  const courses = getCoursesByPillar(pillar);
  const hours = courses.reduce((sum, course) => sum + course.estimatedHours, 0);
  const visual = PILLAR_VISUALS[pillar];

  // The ladder as this track actually spans it. `DIFFICULTY_LABEL`'s key order
  // is the ladder order (foundational -> master), so the first and last rungs
  // present in the track's own courses are its range; a track whose courses
  // are all one rung prints that rung once rather than "X to X".
  const rungs = Object.keys(DIFFICULTY_LABEL) as Array<keyof typeof DIFFICULTY_LABEL>;
  const present = rungs.filter((rung) => courses.some((course) => course.difficulty === rung));
  const range =
    present.length === 0
      ? null
      : present.length === 1
        ? DIFFICULTY_LABEL[present[0]]
        : `${DIFFICULTY_LABEL[present[0]]} to ${DIFFICULTY_LABEL[present[present.length - 1]]}`;

  return (
    <Reveal
      delay={140}
      className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-border pt-8"
    >
      <Readouts
        items={[
          { label: "Courses", value: courses.length },
          { label: "Est. time", value: hours, unit: "hrs" },
          ...(range ? [{ label: "Difficulty", value: range }] : []),
        ]}
      />
      <Link
        href={visual.route}
        className="inline-flex min-h-11 items-center text-sm font-semibold text-pillar hover:underline"
      >
        Enter {visual.short} →
      </Link>
    </Reveal>
  );
}
