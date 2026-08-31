import { Section } from "@/components/ui/Section";
import { SectionTitle, TechLabel } from "@/components/ui/Typography";
import { FadeRule } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion/Reveal";

/**
 * ============================================================
 * Act plate
 * ============================================================
 * The chapter break between groups of track sections.
 *
 * The homepage used to be seven sections of equal weight, which is what made
 * a page full of real material read as a list: six tracks arrived in a row,
 * each announcing itself the same way, with nothing saying why one followed
 * another. The plates give the descent three named movements instead:
 * understand the physics, build the machine, reach the edge. A reader who
 * stops after one act has still finished something.
 *
 * It also carries the background's caption. Every track section used to print
 * its own `Field: ...` line, six times down the page, in the one voice least
 * likely to be read. Here it appears three times, at exactly the points where
 * the environment behind the page actually changes, and it says the same thing
 * twice on purpose: once in plain language, so a first-time visitor
 * understands that the moving thing behind the text is depicting the subject
 * rather than decorating it, and once in the technical voice, so a reader who
 * knows what a Bloch sphere is can tell that it is a real physical system and
 * not an ambient particle effect. Two levels of legibility, four lines of copy.
 *
 * Deliberately outside every `PillarBand`, so a plate takes the site's default
 * identity color rather than borrowing the track on either side of it. The
 * break between two acts should not look like it belongs to either.
 */
export function ActPlate({
  id,
  act,
  title,
  premise,
  fieldPlain,
  fieldTechnical,
}: {
  /** Anchors `aria-labelledby` to this plate's own heading. */
  id: string;
  /** Roman numeral, shown in the technical voice above the title. */
  act: string;
  title: string;
  /** One sentence on what the two tracks under this plate have in common. */
  premise: string;
  /** What the background is doing here, for someone who has never seen it. */
  fieldPlain: string;
  /** The same thing, named. */
  fieldTechnical: string;
}) {
  return (
    <Section tight width="wide" aria-labelledby={id}>
      <Reveal>
        <div className="flex items-center gap-4">
          <TechLabel className="shrink-0 text-pillar">Act {act}</TechLabel>
          <FadeRule className="min-w-0 flex-1" />
        </div>

        <SectionTitle id={id} level={2} size="md" className="mt-4 max-w-3xl">
          {title}
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{premise}</p>

        <div className="mt-6 max-w-2xl border-l-2 border-border-strong pl-4">
          <TechLabel>Behind the page</TechLabel>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{fieldPlain}</p>
          <p className="mt-1 font-tech text-xs leading-relaxed text-subtle-foreground">
            {fieldTechnical}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
