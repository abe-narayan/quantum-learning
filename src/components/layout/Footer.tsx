import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/layout/Wordmark";
import { ROUTE_TO_PILLAR } from "@/components/layout/pillarRoutes";
import { PILLAR_ORDER } from "@/lib/design/pillars";
import { ENTRY_BAR_SHORT } from "@/lib/entryBar";
import { FOOTER_REFERENCE_ITEMS, TRACK_NAV_ITEMS } from "@/lib/nav";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { cn } from "@/lib/utils";

// Same hover/focus/active convention as Navbar.tsx and Button.tsx: the
// transition list + pressed-state scale from Button.tsx, and the focus ring
// convention established by the skip-link in src/app/layout.tsx.
const INTERACTIVE_CLASSES =
  "transition-[color,background-color,transform] active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// A curriculum this size (six pillars, ~200+ lessons) earns a real site
// index, not a row of links — this is deliberately the place a visitor who
// scrolled past everything can still find their way into any pillar, so it
// keeps the "Tracks" dropdown's grouping (Navbar.tsx) rather than flattening
// it back into one undifferentiated list.

export async function Footer() {
  const year = new Date().getFullYear();
  // Derived live, same source `Hero.tsx` uses (`getAllLessonsMeta().length`)
  // — this used to be a hand-typed `LESSON_COUNT = 219` constant that could
  // silently drift from the real count the next time a lesson was added or
  // removed. See docs/UX_REVIEW.md P2-7. `getAllLessonsMeta()` reads the
  // generated metadata registry (a small plain-data array — no MDX module
  // imports; see src/lib/content/lessons.ts), so calling it from the footer
  // of every page is genuinely cheap. That mattered: this exact call used to
  // dynamically import all 219 compiled MDX modules, which put the whole
  // corpus in every static-generation worker just to render this count.
  const lessonCount = (await getAllLessonsMeta()).length;

  return (
    <footer className="relative border-t border-border">
      <Container className="grid gap-10 py-14 sm:grid-cols-[1fr_1.3fr] lg:grid-cols-[1.1fr_1.4fr_1fr] lg:gap-16">
        <div className="max-w-xs">
          <Link
            href="/"
            // The wordmark's mark is 28px here, so the link is a 28px target.
            // Padding cancelled by an equal negative margin lifts the hit area
            // to 44px without moving the paragraph below it, and there is no
            // adjacent target for the expanded box to collide with.
            className={cn("-my-2 inline-flex items-center rounded-(--radius-tight) py-2", INTERACTIVE_CLASSES)}
          >
            <Wordmark markClassName="h-7 w-7" />
          </Link>
          {/* "Built for advanced high-school and early-college students" was
              the narrowest audience statement on the site, and it excluded by
              name the adult self-learner the homepage spends three paragraphs
              welcoming. The entry bar is the honest way to say who this is
              for, and it is the same bar `lib/entryBar.ts` states everywhere
              else.

              It now *is* that bar, rather than a paraphrase of it. "Open to
              anyone who can rearrange an equation" was the pre-correction
              claim, copied here by hand: it promised algebra and nothing
              more, and the corpus needs trigonometry in radians by the second
              lesson of both roots and assumes single-variable calculus from
              the second physics course on. Every other surface that makes
              this claim (the hero, /learn, /about, the tier ladder) was moved
              onto `lib/entryBar.ts`; this footer was the last hand-kept copy,
              which is exactly how the claim came to exist in six incompatible
              wordings the first time.

              `ENTRY_BAR_SHORT` rather than `ENTRY_BAR`, per that module's own
              note: the sentence before it already says what is being
              described, so the footnote form is the grammatical fit, and the
              full three-sentence version would be the longest paragraph in
              the footer by some margin. */}
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A research console for quantum mechanics and quantum computing. {ENTRY_BAR_SHORT}
          </p>
          <p className="tech-label mt-6 text-subtle-foreground">
            {/* "Tracks", not "pillars": /learn, the nav and the homepage all
                say "track" to the reader now, and this footer line sits under
                a column headed "Curriculum" listing those same six. `Pillar`
                stays the internal data/CSS-token name everywhere. */}
            {PILLAR_ORDER.length} tracks · {lessonCount} lessons
          </p>
        </div>

        <nav aria-label="Curriculum tracks">
          <p className="tech-label text-subtle-foreground">Curriculum</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-2">
            {TRACK_NAV_ITEMS.map((item) => {
              const pillar = ROUTE_TO_PILLAR[item.href];
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn("group flex min-h-11 items-start gap-2 rounded-sm", INTERACTIVE_CLASSES)}
                  >
                    <span
                      data-pillar={pillar}
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pillar"
                    />
                    <span>
                      <span className="block text-sm font-medium text-foreground group-hover:text-pillar-text">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <nav aria-label="Reference and tools">
          <p className="tech-label text-subtle-foreground">Reference</p>
          {/* The row pitch comes from the 44px targets themselves rather than
              from a gap sized for 20px line boxes — but not from the targets
              *alone*. `gap-y-0.5` (2px) left two 44px-tall rows two pixels
              apart, which `responsive.mjs --widths 375` reports as "36x44,
              2px to the nearest other target": tall enough, but a thumb aimed
              at "Learn" lands as easily on "All lessons". `gap-y-1.5` (6px)
              costs 4px per row in a footer that has room for it. */}
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:block sm:space-y-1.5">
            {FOOTER_REFERENCE_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  // A bare 14px anchor is a 20px target. Not a WCAG 2.5.8
                  // failure (the 8px gap kept the 24px circles from
                  // intersecting) but well under the 44px floor this site
                  // applies everywhere else, and this is the one place a
                  // reader who scrolled past the whole page can still reach
                  // every section. `min-h-11` rather than the
                  // padding-and-negative-margin trick used on baseline-aligned
                  // links elsewhere: at a 28px row pitch that trick would have
                  // made adjacent targets overlap by 16px, which mis-taps
                  // worse than an undersized target does.
                  //
                  // `flex w-full`, not `inline-flex`. The box used to hug its
                  // label, on the stated grounds that a full-width target in a
                  // two-column phone layout would put the two columns' boxes
                  // against each other — which the 24px `gap-x-6` between
                  // those columns already prevents. What hugging actually
                  // produced was a 36x44 and a 38x44 target ("Learn",
                  // "About"), reported by `responsive.mjs` on every route:
                  // tall enough and half as wide as the floor, in the corner
                  // of the screen where a thumb is least accurate. Filling the
                  // grid cell makes every one of them at least 44 wide, and
                  // the columns stay 24px apart.
                  className={cn("flex min-h-11 w-full items-center rounded-sm text-muted-foreground hover:text-foreground", INTERACTIVE_CLASSES)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <Container className="border-t border-border py-6">
        <p className="text-xs text-muted-foreground">© {year} StudyQuantum. All rights reserved.</p>
      </Container>
    </footer>
  );
}
