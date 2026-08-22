import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function PlaceholderCard({
  title,
  description,
  tag,
}: {
  title: string;
  description: string;
  tag?: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {tag ? <Badge>{tag}</Badge> : null}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
