import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lede, Readouts, SectionTitle } from "@/components/ui/Typography";
import { Panel, Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { NAV_ITEMS, START_LEARNING_HREF } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist.",
  // A 404 has no real canonical URL of its own, so unlike every other page
  // it deliberately skips alternates.canonical/openGraph — but it must still
  // tell crawlers not to index it, which was missing before this fix.
  robots: { index: false, follow: true },
};

// Direct links to the entry points a lost visitor is most likely to want,
// pulled from the same NAV_ITEMS the Navbar renders so this list can't drift
// out of sync with the site's actual top-level routes.
const QUICK_LINKS = ["/learn", "/problems", "/simulators", "/glossary"]
  .map((href) => NAV_ITEMS.find((item) => item.href === href))
  .filter((item): item is (typeof NAV_ITEMS)[number] => item !== undefined);

export default function NotFound() {
  return (
    // `tight`, not `className="pt-4 sm:pt-8"`. That class did nothing at all:
    // `Section` sets its vertical padding through an inline `style`, which
    // always beats a class on the same element, so this page has been opening
    // with the full `--rhythm-section` — 72px at 320px wide, where the author
    // asked for 16px, and 136px on a wide desktop. On a 568px-tall phone that
    // is an eighth of the viewport spent on air above a 404, the one page
    // where the reader most needs the way out on screen without scrolling.
    // `tight` is the prop that actually reduces it (to `--rhythm-block`).
    // The same dead override was on /learn's hero until it was found there.
    <Section width="reading" tight>
      <Reveal>
        <Eyebrow>404 · Not found</Eyebrow>
        <SectionTitle level={1} size="xl" className="mt-4">
          This state doesn&rsquo;t exist
        </SectionTitle>
        <Lede className="mt-5 max-w-[42rem]">
          The page, lesson, or simulator you&rsquo;re looking for may have moved, been renamed, or
          never existed in the first place — much like measuring a qubit outside its basis. Try one
          of the destinations below, or press Ctrl K (Cmd K on Mac) to search.
        </Lede>
      </Reveal>

      <Reveal delay={80} className="mt-8">
        <Instrument label="Route readout" footnote="No amplitude, no page — the console falls back to what it knows exists.">
          <Readouts
            items={[
              { label: "Requested state", value: "|ψ_target⟩" },
              { label: "Amplitude", value: "0.000" },
              { label: "Collapsed to", value: "404" },
            ]}
          />
        </Instrument>
      </Reveal>

      {/* "Start learning" means the on-ramp lesson everywhere else on the
          site (Navbar, homepage hero, About) — it pointed at /learn here, so
          a visitor who had just hit a dead end and took the offered way out
          landed on another index to choose from rather than in a lesson.
          /learn is still in the quick links below, under its own name. */}
      <Reveal delay={120} className="mt-8 flex flex-wrap gap-3">
        <Button href={START_LEARNING_HREF}>Start learning</Button>
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </Reveal>

      <Reveal delay={160} className="mt-12">
        <p className="tech-label">Or jump straight to</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {QUICK_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="block">
              <Panel interactive className="p-5">
                <span className="block text-base font-semibold text-foreground">{item.label}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{item.description}</span>
              </Panel>
            </Link>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
