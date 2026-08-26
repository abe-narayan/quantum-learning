import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NAV_ITEMS, TRACK_NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

// The navbar groups the five track pages under a "Tracks" dropdown to keep
// its top-level item count sane, but the footer has no such pressure — it's
// exactly where a complete, ungrouped site map belongs, so it lists both.
const FOOTER_ITEMS = [...NAV_ITEMS, ...TRACK_NAV_ITEMS];

// Same hover/focus/active convention as Navbar.tsx and Button.tsx: the
// transition list + pressed-state scale from Button.tsx, and the focus ring
// convention established by the skip-link in src/app/layout.tsx.
const INTERACTIVE_CLASSES =
  "transition-[color,background-color,transform] active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground">
              Q
            </span>
            QuantumLearn
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            An interactive platform for learning quantum computing — built for
            advanced high-school and early-college students.
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:flex sm:flex-wrap sm:gap-6">
          {FOOTER_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("rounded-sm text-muted-foreground hover:text-foreground", INTERACTIVE_CLASSES)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>

      <Container className="border-t border-border py-6">
        <p className="text-xs text-muted-foreground">
          © {year} QuantumLearn. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
