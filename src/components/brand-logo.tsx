import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function BrandLogo({
  size = "header",
  linked = true,
}: {
  size?: "header" | "hero";
  linked?: boolean;
}) {
  const mark = (
    <span className="inline-flex min-w-0 flex-col items-start gap-1">
      <img
        src="/wms.svg"
        alt="WMS"
        className={cn(
          "w-auto object-contain object-left",
          size === "hero" ? "h-10 sm:h-12" : "h-7",
        )}
      />
      <span
        className={cn(
          "font-medium tracking-wide text-muted",
          size === "hero" ? "text-sm" : "sr-only",
        )}
      >
        資産管理システム
      </span>
    </span>
  );

  if (!linked) return mark;
  return (
    <Link to="/" className="min-w-0" aria-label="WMS 資産管理システム">
      {mark}
    </Link>
  );
}
