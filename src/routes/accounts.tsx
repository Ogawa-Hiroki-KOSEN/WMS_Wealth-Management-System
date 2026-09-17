import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ACCOUNT_KINDS,
  createAccount,
  listAccounts,
  updateAccount,
  type AccountKind,
} from "@/lib/finance";
import { formatYen } from "@/lib/utils";

export const Route = createFileRoute("/accounts")({ component: AccountsPage });

const KIND_LABEL: Record<AccountKind, string> = {
  cash: "現金",
  bank: "銀行",
  ewallet: "電子マネー",
  card: "カード",
};

function AccountsPage() {
  const qc = useQueryClient();
  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => listAccounts() });
  const [name, setName] = useState("");
  const [kind, setKind] = useState<AccountKind>("bank");
  const [opening, setOpening] = useState("0");

  const create = useMutation({
    mutationFn: () =>
      createAccount({
        data: {
          name,
          kind,
          opening_balance: Number(opening.replace(/,/g, "")) || 0,
        },
      }),
    onSuccess: async () => {
      setName("");
      setOpening("0");
      await qc.invalidateQueries({ queryKey: ["accounts"] });
      await qc.invalidateQueries({ queryKey: ["summary"] });
      toast.success("口座を追加しました");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const archive = useMutation({
    mutationFn: (row: { id: number; name: string; kind: AccountKind; archived: boolean }) =>
      updateAccount({
        data: { id: row.id, name: row.name, kind: row.kind, archived: !row.archived },
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["accounts"] });
      await qc.invalidateQueries({ queryKey: ["summary"] });
    },
  });

  return (
    <AppShell title="口座">
      <h1 className="font-display text-3xl font-medium tracking-tight">口座</h1>
      <p className="mt-1 text-sm text-muted">現金・銀行・電子マネー・カードを分けて管理します。</p>

      <form
        className="mt-6 grid gap-3 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) {
            toast.error("名前を入力してください");
            return;
          }
          create.mutate();
        }}
      >
        <div className="space-y-1.5 sm:col-span-2">
          <p className="text-sm font-medium">新しい口座</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="n">名前</Label>
          <Input id="n" value={name} onChange={(e) => setName(e.target.value)} placeholder="みずほ銀行" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="k">種類</Label>
          <select
            id="k"
            className="h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value as AccountKind)}
          >
            {ACCOUNT_KINDS.map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="o">開始残高</Label>
          <Input
            id="o"
            inputMode="numeric"
            value={opening}
            onChange={(e) => setOpening(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full" disabled={create.isPending}>
            追加
          </Button>
        </div>
      </form>

      <ul className="mt-6 space-y-2">
        {(accounts.data ?? []).map((a) => (
          <li
            key={a.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">{KIND_LABEL[a.kind]}</p>
              <p className="font-medium">{a.name}</p>
            </div>
            <p className="font-display text-xl tabular-nums">{formatYen(a.balance)}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => archive.mutate(a)}
            >
              {a.archived ? "復元" : "非表示"}
            </Button>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
