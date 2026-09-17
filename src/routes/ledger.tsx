import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { MonthSwitcher } from "@/components/month-switcher";
import { TxForm } from "@/components/tx-form";
import { Button } from "@/components/ui/button";
import { deleteTransaction, listTransactions, type TxType } from "@/lib/finance";
import { useMonth } from "@/lib/month-store";
import { formatYen } from "@/lib/utils";

export const Route = createFileRoute("/ledger")({ component: LedgerPage });

const TYPE_LABEL: Record<TxType, string> = {
  income: "収入",
  expense: "支出",
  transfer: "振替",
};

function LedgerPage() {
  const { year, month, setMonth } = useMonth();
  const qc = useQueryClient();
  const txs = useQuery({
    queryKey: ["transactions", year, month],
    queryFn: () => listTransactions({ data: { year, month } }),
  });

  const del = useMutation({
    mutationFn: (id: number) => deleteTransaction({ data: { id } }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["transactions"] }),
        qc.invalidateQueries({ queryKey: ["accounts"] }),
        qc.invalidateQueries({ queryKey: ["summary"] }),
        qc.invalidateQueries({ queryKey: ["report"] }),
      ]);
      toast.success("削除しました");
    },
  });

  return (
    <AppShell title="明細">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-medium tracking-tight">明細</h1>
        <MonthSwitcher year={year} month={month} onChange={setMonth} />
      </div>

      <section className="mt-5 rounded-xl border border-border bg-surface p-5">
        <h2 className="text-sm font-medium text-muted">新規記録</h2>
        <div className="mt-3">
          <TxForm />
        </div>
      </section>

      <ul className="mt-6 space-y-2">
        {(txs.data ?? []).length === 0 && (
          <li className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
            この月の記録はまだありません。
          </li>
        )}
        {(txs.data ?? []).map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {t.type === "transfer"
                  ? `${t.account_name} → ${t.transfer_account_name ?? ""}`
                  : (t.category_name ?? "未分類")}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {t.occurred_on} · {TYPE_LABEL[t.type]} · {t.account_name}
                {t.note ? ` · ${t.note}` : ""}
              </p>
            </div>
            <p
              className={`shrink-0 font-display text-lg tabular-nums ${
                t.type === "income"
                  ? "text-income"
                  : t.type === "expense"
                    ? "text-expense"
                    : "text-transfer"
              }`}
            >
              {t.type === "expense" ? "−" : t.type === "income" ? "+" : ""}
              {formatYen(t.amount)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 text-subtle"
              onClick={() => del.mutate(t.id)}
            >
              削除
            </Button>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
