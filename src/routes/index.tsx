import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { MonthSwitcher } from "@/components/month-switcher";
import { TxForm } from "@/components/tx-form";
import { getMonthSummary, listAccounts } from "@/lib/finance";
import { useMonth } from "@/lib/month-store";
import { formatYen } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

const KIND_LABEL: Record<string, string> = {
  cash: "現金",
  bank: "銀行",
  ewallet: "電子マネー",
  card: "カード",
};

function Home() {
  const { year, month, setMonth } = useMonth();
  const summary = useQuery({
    queryKey: ["summary", year, month],
    queryFn: () => getMonthSummary({ data: { year, month } }),
  });
  const accounts = useQuery({
    queryKey: ["accounts"],
    queryFn: () => listAccounts(),
  });

  const s = summary.data;
  const openAccounts = (accounts.data ?? []).filter((a) => !a.archived);

  return (
    <AppShell title="ホーム">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-medium tracking-tight">総資産</h1>
        <MonthSwitcher year={year} month={month} onChange={setMonth} />
      </div>

      <section className="mt-5 rounded-xl border border-border bg-primary p-6 text-primary-fg shadow-soft">
        <p className="text-sm opacity-80">いま手元にあるお金</p>
        <p className="mt-2 font-display text-4xl font-medium tabular-nums tracking-tight">
          {s ? formatYen(s.total_assets) : "—"}
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
          <Stat label="収入" value={s ? formatYen(s.income) : "—"} />
          <Stat label="支出" value={s ? formatYen(s.expense) : "—"} />
          <Stat label="収支" value={s ? formatYen(s.net) : "—"} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-medium">口座</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {openAccounts.map((a) => (
            <article
              key={a.id}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <p className="text-xs font-medium tracking-wide text-muted">
                {KIND_LABEL[a.kind] ?? a.kind}
              </p>
              <div className="mt-1 flex items-baseline justify-between gap-3">
                <h3 className="text-base font-medium">{a.name}</h3>
                <p className="font-display text-xl tabular-nums">{formatYen(a.balance)}</p>
              </div>
            </article>
          ))}
          {openAccounts.length === 0 && (
            <p className="text-sm text-muted">口座はまだありません。</p>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-xl font-medium">すばやく記録</h2>
        <p className="mt-1 text-sm text-muted">支出・収入・口座間の振替を追加します。</p>
        <div className="mt-4">
          <TxForm />
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="opacity-70">{label}</p>
      <p className="mt-1 font-medium tabular-nums">{value}</p>
    </div>
  );
}
