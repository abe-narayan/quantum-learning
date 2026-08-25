import Link from "next/link";
import type { ReactElement } from "react";
import { Container } from "@/components/ui/Container";
import { PILLARS, getCoursesByPillar } from "@/lib/content/curriculum";
import type { Pillar } from "@/lib/content/types";

const PILLAR_ROUTES: Record<Pillar, string> = {
  "quantum-mechanics": "/mechanics",
  "quantum-computing": "/computing",
  "quantum-hardware": "/hardware",
  "quantum-software": "/software",
  // Quantum Mastery has no dedicated pillar landing page — it's a deeper
  // track surfaced from within /learn once a visitor has progressed, not a
  // fifth beginner-facing tile in this "four pillars" homepage section (see
  // the PILLARS.filter below), so this route only matters if some other
  // caller ever iterates PILLAR_ROUTES directly.
  "quantum-mastery": "/learn",
};

/**
 * Small, unique, hand-drawn-feeling line-mark per pillar — deliberately not
 * an icon-library import. Each is a single `currentColor` stroke path so it
 * inherits whichever rule color (`--brand`/`--accent`) the caller sets.
 */
const PILLAR_GLYPHS: Record<Pillar, (props: { className?: string }) => ReactElement> = {
  "quantum-mechanics": ({ className }) => (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M3 22 C 8 10, 14 10, 20 22 S 32 34, 37 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  "quantum-computing": ({ className }) => (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="19" cy="21" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="19" y1="21" x2="30" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="9" r="2.25" fill="currentColor" />
    </svg>
  ),
  "quantum-hardware": ({ className }) => (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="11" y="11" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="11" y1="16" x2="5" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="11" y1="24" x2="5" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="29" y1="16" x2="35" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="29" y1="24" x2="35" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="11" x2="16" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="29" x2="24" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  "quantum-software": ({ className }) => (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M17 7 C 11 7 13 15 8 17 C 13 19 11 27 17 27"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 7 C 29 7 27 15 32 17 C 27 19 29 27 23 27"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  // Not rendered in this section today (see the PILLARS.filter below) but
  // required for Record<Pillar, ...> exhaustiveness.
  "quantum-mastery": ({ className }) => (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M20 4 L24 16 L36 20 L24 24 L20 36 L16 24 L4 20 L16 16 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
};

export function PillarsOverview() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            Four pillars, one platform
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Everything a quantum curriculum needs
          </h2>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.filter((pillar) => pillar.slug !== "quantum-mastery").map((pillar, index) => {
            const ruleColor = index % 2 === 0 ? "var(--brand)" : "var(--accent)";
            const courses = getCoursesByPillar(pillar.slug);
            const totalHours = courses.reduce((sum, course) => sum + course.estimatedHours, 0);
            const Glyph = PILLAR_GLYPHS[pillar.slug];

            return (
              <div key={pillar.slug}>
                <div className="h-0.5 w-12" style={{ backgroundColor: ruleColor }} aria-hidden="true" />
                <Glyph className="mt-5 h-9 w-9" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{pillar.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
                <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
                  {courses.length} {courses.length === 1 ? "course" : "courses"} · {totalHours}h
                </p>
                <Link
                  href={PILLAR_ROUTES[pillar.slug]}
                  className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
                >
                  Explore {pillar.title} →
                </Link>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
