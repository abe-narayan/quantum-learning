import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/layout/Wordmark";
import { ROUTE_TO_PILLAR } from "@/components/layout/pillarRoutes";
import { PILLAR_ORDER } from "@/lib/design/pillars";
import { NAV_ITEMS, TRACK_NAV_ITEMS } from "@/lib/nav";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { cn } from "@/lib/utils";

// Same hover/focus/active convention as Navbar.tsx and Button.tsx: the
// transition list + pressed-state scale from Button.tsx, and the focus ring
// convention established by the skip-link in src/app/layout.tsx.
const INTERACTIVE_CLASSES =
  "transition-[color,background-color,transform] active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

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
            className={cn("inline-flex items-center rounded-[var(--radius-tight)]", INTERACTIVE_CLASSES)}
          >
            <Wordmark markClassName="h-7 w-7" />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A research console for quantum mechanics and quantum computing — built for advanced high-school
            and early-college students.
          </p>
          <p className="tech-label mt-6 text-subtle-foreground">
            {PILLAR_ORDER.length} pillars · {lessonCount} lessons
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
                    className={cn("group flex items-start gap-2 rounded-sm", INTERACTIVE_CLASSES)}
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

        <nav aria-label="Explore">
          <p className="tech-label text-subtle-foreground">Explore</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:block sm:space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn("rounded-sm text-muted-foreground hover:text-foreground", INTERACTIVE_CLASSES)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <Container className="border-t border-border py-6">
        <p className="text-xs text-muted-foreground">© {year} QuantumLearn. All rights reserved.</p>
      </Container>
    </footer>
  );
}
