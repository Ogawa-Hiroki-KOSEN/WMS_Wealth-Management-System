import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { r as formatYen } from "./utils-B-tlUbH_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as listTransactions, n as AppShell, o as deleteTransaction, r as Button } from "./finance-BoJ9ptSH.mjs";
import { n as useMonth, t as MonthSwitcher } from "./month-store-DTpMQgVb.mjs";
import { t as TxForm } from "./tx-form-CViPMijS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ledger-DaIULKi4.js
var import_jsx_runtime = require_jsx_runtime();
var TYPE_LABEL = {
	income: "収入",
	expense: "支出",
	transfer: "振替"
};
function LedgerPage() {
	const { year, month, setMonth } = useMonth();
	const qc = useQueryClient();
	const txs = useQuery({
		queryKey: [
			"transactions",
			year,
			month
		],
		queryFn: () => listTransactions({ data: {
			year,
			month
		} })
	});
	const del = useMutation({
		mutationFn: (id) => deleteTransaction({ data: { id } }),
		onSuccess: async () => {
			await Promise.all([
				qc.invalidateQueries({ queryKey: ["transactions"] }),
				qc.invalidateQueries({ queryKey: ["accounts"] }),
				qc.invalidateQueries({ queryKey: ["summary"] }),
				qc.invalidateQueries({ queryKey: ["report"] })
			]);
			toast.success("削除しました");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "明細",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-medium tracking-tight",
					children: "明細"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSwitcher, {
					year,
					month,
					onChange: setMonth
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 rounded-xl border border-border bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-muted",
					children: "新規記録"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TxForm, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-6 space-y-2",
				children: [(txs.data ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted",
					children: "この月の記録はまだありません。"
				}), (txs.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: t.type === "transfer" ? `${t.account_name} → ${t.transfer_account_name ?? ""}` : t.category_name ?? "未分類"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 text-xs text-muted",
								children: [
									t.occurred_on,
									" · ",
									TYPE_LABEL[t.type],
									" · ",
									t.account_name,
									t.note ? ` · ${t.note}` : ""
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: `shrink-0 font-display text-lg tabular-nums ${t.type === "income" ? "text-income" : t.type === "expense" ? "text-expense" : "text-transfer"}`,
							children: [t.type === "expense" ? "−" : t.type === "income" ? "+" : "", formatYen(t.amount)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							className: "shrink-0 text-subtle",
							onClick: () => del.mutate(t.id),
							children: "削除"
						})
					]
				}, t.id))]
			})
		]
	});
}
//#endregion
export { LedgerPage as component };
