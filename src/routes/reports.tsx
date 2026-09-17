import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { MonthSwitcher } from "@/components/month-switcher";
import { getMonthSummary, getReport } from "@/lib/finance";
import { useMonth } from "@/lib/month-store";
import { formatYen } from "@/lib/utils";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

const SLICE_COLORS = ["#2c463f", "#4a6b61", "#6d675e", "#a24a3a", "#4a5c78", "#8f877c", "#1b1916"];

function ReportsPage() {
  const { year, month, setMonth } = useMonth();
  const summary = useQuery({
    queryKey: ["summary", year, month],
    queryFn: () => getMonthSummary({ data: { year, month } }),
  });
  const report = useQuery({
    queryKey: ["report", year, month],
    queryFn: () => getReport({ data: { year, month } }),
  });

  const slices = report.data?.slices ?? [];
  const points = report.data?.points ?? [];
  const s = summary.data;

  return (
    <AppShell title="レポート">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-medium tracking-tight">レポート</h1>
        <MonthSwitcher year={year} month={month} onChange={setMonth} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Kpi title="収入" value={s ? formatYen(s.income) : "—"} />
        <Kpi title="支出" value={s ? formatYen(s.expense) : "—"} />
        <Kpi title="収支" value={s ? formatYen(s.net) : "—"} />
      </div>

      <section className="mt-6 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-medium">直近6か月</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={points} barGap={4}>
              <CartesianGrid stroke="#e4ddd0" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#6d675e", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#6d675e", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${Math.round(Number(v) / 10000)}万`}
              />
              <Tooltip
                formatter={(value) => formatYen(Number(value))}
                contentStyle={{ borderRadius: 12, borderColor: "#e4ddd0" }}
              />
              <Bar dataKey="income" name="収入" fill="#2f6b57" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="支出" fill="#a24a3a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-medium">支出の内訳</h2>
        {slices.length === 0 ? (
          <p className="mt-8 pb-6 text-center text-sm text-muted">この月の支出はまだありません。</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 md:items-center">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={slices} dataKey="amount" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={2}>
                    {slices.map((_, i) => (
                      <Cell key={slices[i].name} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatYen(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2">
              {slices.map((slice, i) => (
                <li key={slice.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: SLICE_COLORS[i % SLICE_COLORS.length] }}
                    />
                    {slice.name}
                  </span>
                  <span className="tabular-nums text-muted">{formatYen(slice.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </AppShell>
  );
}

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-xs text-muted">{title}</p>
      <p className="mt-1 font-display text-2xl tabular-nums">{value}</p>
    </div>
  );
}
