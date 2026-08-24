import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[color,background-color,transform] active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand text-brand-foreground hover:opacity-90",
  secondary: "border border-border bg-surface text-foreground hover:bg-surface-muted",
  ghost: "text-foreground hover:bg-surface-muted",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
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
