import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NAV_ITEMS } from "@/lib/nav";

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
const QUICK_LINKS = ["/learn", "/lessons", "/simulators", "/glossary"]
  .map((href) => NAV_ITEMS.find((item) => item.href === href))
  .filter((item): item is (typeof NAV_ITEMS)[number] => item !== undefined);

export default function NotFound() {
  return (
    <Container className="py-16 sm:py-24">
      <PageHeader
        eyebrow="404"
        title="This state doesn't exist"
        description="The page, lesson, or simulator you're looking for may have moved, been renamed, or never existed in the first place — much like measuring a qubit outside its basis. Try one of the destinations below, or press Ctrl K (Cmd K on Mac) to search."
      />

      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/learn" variant="secondary">
          Start learning
        </Button>
      </div>

      <div className="mt-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Or jump straight to
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {QUICK_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="block">
              <Card className="transition-colors hover:border-brand/40">
                <span className="block text-base font-semibold text-foreground">{item.label}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{item.description}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
