import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The 44 × 44 CSS-px minimum hit area (WCAG 2.5.5 Target Size (Enhanced),
 * and the same number both platform HIGs use), applied **without changing
 * how big the control looks**.
 *
 * The naive fix — bumping `h-10 w-10` to `h-11 w-11` — inflates the visible
 * chrome: the hover fill and focus ring grow with it, and a 44px control sits
 * 4px taller than every neighbouring 40px control in the same header row, so
 * a row of instrument buttons stops sharing one baseline. The design language
 * here is "mounted equipment," and equipment faces line up.
 *
 * So the *painted* box stays exactly where it was and a transparent
 * `::after` centred on the control carries the hit area instead. Pointer
 * events on a pseudo-element belong to its originating element, so the
 * expanded region activates the button just like the icon does.
 *
 * `min-h-full`/`min-w-full` keep this safe for controls that are already
 * larger than 44px in one axis (a labelled trigger, say): the hit area is
 * `max(44px, own size)`, never a *shrink*.
 *
 * The expansion is 2px per side for a 40px control. Chrome controls are
 * spaced `gap-1.5` (6px) apart, so two adjacent expanded targets still leave
 * a 2px gap between them — no silent overlap where one button steals the
 * other's taps. Anything using this in a denser stack has to check that
 * arithmetic itself, which is why this is an opt-in constant rather than
 * something folded into `Button`'s base classes.
 */
export const TOUCH_TARGET_CLASSES =
  "relative after:absolute after:left-1/2 after:top-1/2 after:h-11 after:w-11 after:min-h-full after:min-w-full after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']";

/** Geometry only — the painted 40px face. Colour, border, hover and focus
 *  treatment stay with the caller, because the chrome deliberately runs two
 *  of them (the theme toggle's bordered face vs. the menu button's bare
 *  one) and this primitive is not the place to flatten that. */
const ICON_BUTTON_CLASSES =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-(--radius-tight)";

export type IconButtonProps = Omit<ComponentPropsWithRef<"button">, "children" | "className" | "type"> & {
  /** The icon. Give the button an `aria-label` — an SVG-only button has no
   *  accessible name otherwise. */
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
};

/**
 * The shared square icon control used across the site chrome (menu button,
 * theme toggle). Exists so the 44px hit area above is declared in exactly
 * one place and cannot regress the next time one of these is restyled.
 */
export function IconButton({ className, children, type, ...rest }: IconButtonProps) {
  return (
    <button type={type ?? "button"} className={cn(ICON_BUTTON_CLASSES, TOUCH_TARGET_CLASSES, className)} {...rest}>
      {children}
    </button>
  );
}
