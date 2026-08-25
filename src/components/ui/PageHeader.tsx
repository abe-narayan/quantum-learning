import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
