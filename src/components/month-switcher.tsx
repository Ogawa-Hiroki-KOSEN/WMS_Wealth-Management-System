import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMonthLabel } from "@/lib/utils";

export function MonthSwitcher({
  year,
  month,
  onChange,
}: {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}) {
  function shift(delta: number) {
    const d = new Date(year, month + delta, 1);
    onChange(d.getFullYear(), d.getMonth());
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="size-10" onClick={() => shift(-1)} aria-label="前月">
        <ChevronLeft className="size-5" />
      </Button>
      <p className="min-w-28 text-center font-display text-lg font-medium tracking-tight">
        {formatMonthLabel(year, month)}
      </p>
      <Button variant="ghost" size="icon" className="size-10" onClick={() => shift(1)} aria-label="翌月">
        <ChevronRight className="size-5" />
      </Button>
    </div>
  );
}
