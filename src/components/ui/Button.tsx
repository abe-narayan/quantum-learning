import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

// `rounded-full` (the previous shape) reads as a soft SaaS pill — the exact
// generic look the instrument language avoids. A tight, near-rectangular
// radius (the same `--radius-tight` every small control in the chrome now
// uses) reads instead as a mechanical switch: precise corners, not a chip.
const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-tight)] font-medium transition-[color,background-color,border-color,transform] duration-[--dur-fast] ease-[--ease-instrument] active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // The inset highlight is the same "machined face catching light" move as
  // `.panel` in globals.css (a top highlight via inset box-shadow), scaled
  // down for a control this size — it's what keeps a flat brand-fill button
  // from reading as a plain colored rectangle.
  primary:
    "border border-transparent bg-brand text-brand-foreground shadow-[inset_0_1px_0_color-mix(in_srgb,white_22%,transparent)] hover:opacity-90",
  secondary: "border border-border-strong bg-surface text-foreground hover:border-pillar-edge hover:bg-surface-muted",
  ghost: "border border-transparent text-foreground hover:border-border hover:bg-surface-muted",
};

// `lg` already clears the 44px target minimum on its own painted box
// (py-2.5 + text-base = 44px). `sm` (32px) and `md` (36px) do not, so they
// carry a transparent `::after` that grows the *hit* area to 44px tall while
// the painted face stays exactly where it was — the same technique
// `IconButton`'s `TOUCH_TARGET_CLASSES` uses, and for the same reason:
// inflating the visible control would break the shared baseline every row of
// instrument controls on this site lines up on.
//
// Deliberately vertical-only (`after:w-full`, not `after:w-11`): buttons on
// this site sit in horizontal rows far more often than vertical stacks, so a
// horizontal expansion is the one that would make two adjacent controls steal
// each other's taps. Vertically, the expansion is 6px/side for `sm` and
// 4px/side for `md`, which stays inside the `gap-2` (8px) minimum the stacked
// cases use.
const TOUCH_FLOOR =
  "relative after:absolute after:left-0 after:top-1/2 after:h-11 after:w-full after:min-h-full after:-translate-y-1/2 after:content-['']";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: `px-3 py-1.5 text-sm ${TOUCH_FLOOR}`,
  md: `px-4 py-2 text-sm ${TOUCH_FLOOR}`,
  lg: "px-5 py-2.5 text-base",
};

// Omit the props we redeclare below (with narrower/different types, e.g.
// `type` and `onClick`) so the native HTML attribute types don't conflict
// with them — everything else (aria-*, data-*, etc.) passes through as-is
// and is spread onto the rendered element, not just accepted by the type.
type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled" | "onClick" | "className" | "children">;
type NativeAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick" | "className" | "children">;

export type ButtonProps = NativeButtonProps &
  NativeAnchorProps & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    children: ReactNode;
    href?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  };

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  type,
  disabled,
  onClick,
  ...rest
}: ButtonProps) {
  const classes = cn(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className);

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} disabled={disabled} className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
