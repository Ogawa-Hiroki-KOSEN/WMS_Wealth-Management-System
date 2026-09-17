import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addTransaction,
  listAccounts,
  listCategories,
  type TxType,
} from "@/lib/finance";
import { todayISO } from "@/lib/utils";

export function TxForm({ onDone }: { onDone?: () => void }) {
  const qc = useQueryClient();
  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => listAccounts() });
  const categories = useQuery({ queryKey: ["categories"], queryFn: () => listCategories() });
  const [type, setType] = useState<TxType>("expense");
  const [accountId, setAccountId] = useState<number | "">("");
  const [transferId, setTransferId] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [occurredOn, setOccurredOn] = useState(todayISO);

  const activeAccounts = useMemo(
    () => (accounts.data ?? []).filter((a) => !a.archived),
    [accounts.data],
  );

  const filteredCats = useMemo(
    () => (categories.data ?? []).filter((c) => c.kind === type),
    [categories.data, type],
  );

  const mutation = useMutation({
    mutationFn: () =>
      addTransaction({
        data: {
          account_id: Number(accountId || resolvedAccount),
          transfer_account_id: type === "transfer" ? Number(transferId) : null,
          category_id: type === "transfer" || categoryId === "" ? null : Number(categoryId),
          type,
          amount: Number(amount.replace(/,/g, "")),
          note,
          occurred_on: occurredOn,
        },
      }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["accounts"] }),
        qc.invalidateQueries({ queryKey: ["transactions"] }),
        qc.invalidateQueries({ queryKey: ["summary"] }),
        qc.invalidateQueries({ queryKey: ["report"] }),
      ]);
      setAmount("");
      setNote("");
      toast.success("記録しました");
      onDone?.();
    },
    onError: (err: Error) => toast.error(err.message || "保存に失敗しました"),
  });

  const defaultAccount = activeAccounts[0]?.id;
  const resolvedAccount = accountId === "" ? defaultAccount : accountId;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!resolvedAccount) {
          toast.error("口座を追加してください");
          return;
        }
        if (!Number(amount.replace(/,/g, ""))) {
          toast.error("金額を入力してください");
          return;
        }
        if (accountId === "") setAccountId(resolvedAccount);
        mutation.mutate();
      }}
    >
      <div className="grid grid-cols-3 gap-1 rounded-md bg-bg p-1">
        {(
          [
            ["expense", "支出"],
            ["income", "収入"],
            ["transfer", "振替"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setType(key);
              setCategoryId("");
            }}
            className={`h-10 rounded-sm text-sm font-medium ${
              type === key ? "bg-elevated text-fg shadow-soft" : "text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="account">{type === "transfer" ? "出金口座" : "口座"}</Label>
          <select
            id="account"
            className="h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm"
            value={resolvedAccount ?? ""}
            onChange={(e) => setAccountId(Number(e.target.value))}
          >
            {activeAccounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        {type === "transfer" ? (
          <div className="space-y-1.5">
            <Label htmlFor="to">入金口座</Label>
            <select
              id="to"
              className="h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm"
              value={transferId}
              onChange={(e) => setTransferId(Number(e.target.value))}
            >
              <option value="">選択</option>
              {activeAccounts
                .filter((a) => a.id !== resolvedAccount)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </select>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label htmlFor="cat">カテゴリ</Label>
            <select
              id="cat"
              className="h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">未分類</option>
              {filteredCats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="amount">金額</Label>
          <Input
            id="amount"
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="date">日付</Label>
          <Input
            id="date"
            type="date"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="note">メモ</Label>
        <Input
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="任意"
        />
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "保存中…" : "記録する"}
      </Button>
    </form>
  );
}
