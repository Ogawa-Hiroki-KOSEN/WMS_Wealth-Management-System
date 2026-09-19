import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { o as todayISO } from "./utils-B-tlUbH_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as addTransaction, l as listAccounts, r as Button, u as listCategories } from "./finance-BoJ9ptSH.mjs";
import { n as Label, t as Input } from "./label-Dt7dsmzq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tx-form-CViPMijS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TxForm({ onDone }) {
	const qc = useQueryClient();
	const accounts = useQuery({
		queryKey: ["accounts"],
		queryFn: () => listAccounts()
	});
	const categories = useQuery({
		queryKey: ["categories"],
		queryFn: () => listCategories()
	});
	const [type, setType] = (0, import_react.useState)("expense");
	const [accountId, setAccountId] = (0, import_react.useState)("");
	const [transferId, setTransferId] = (0, import_react.useState)("");
	const [categoryId, setCategoryId] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [occurredOn, setOccurredOn] = (0, import_react.useState)(todayISO);
	const activeAccounts = (0, import_react.useMemo)(() => (accounts.data ?? []).filter((a) => !a.archived), [accounts.data]);
	const filteredCats = (0, import_react.useMemo)(() => (categories.data ?? []).filter((c) => c.kind === type), [categories.data, type]);
	const mutation = useMutation({
		mutationFn: () => addTransaction({ data: {
			account_id: Number(accountId || resolvedAccount),
			transfer_account_id: type === "transfer" ? Number(transferId) : null,
			category_id: type === "transfer" || categoryId === "" ? null : Number(categoryId),
			type,
			amount: Number(amount.replace(/,/g, "")),
			note,
			occurred_on: occurredOn
		} }),
		onSuccess: async () => {
			await Promise.all([
				qc.invalidateQueries({ queryKey: ["accounts"] }),
				qc.invalidateQueries({ queryKey: ["transactions"] }),
				qc.invalidateQueries({ queryKey: ["summary"] }),
				qc.invalidateQueries({ queryKey: ["report"] })
			]);
			setAmount("");
			setNote("");
			toast.success("記録しました");
			onDone?.();
		},
		onError: (err) => toast.error(err.message || "保存に失敗しました")
	});
	const defaultAccount = activeAccounts[0]?.id;
	const resolvedAccount = accountId === "" ? defaultAccount : accountId;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		onSubmit: (e) => {
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
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-1 rounded-md bg-bg p-1",
				children: [
					["expense", "支出"],
					["income", "収入"],
					["transfer", "振替"]
				].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setType(key);
						setCategoryId("");
					},
					className: `h-10 rounded-sm text-sm font-medium ${type === key ? "bg-elevated text-fg shadow-soft" : "text-muted"}`,
					children: label
				}, key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "account",
							children: type === "transfer" ? "出金口座" : "口座"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "account",
							className: "h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm",
							value: resolvedAccount ?? "",
							onChange: (e) => setAccountId(Number(e.target.value)),
							children: activeAccounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: a.id,
								children: a.name
							}, a.id))
						})]
					}),
					type === "transfer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "to",
							children: "入金口座"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "to",
							className: "h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm",
							value: transferId,
							onChange: (e) => setTransferId(Number(e.target.value)),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "選択"
							}), activeAccounts.filter((a) => a.id !== resolvedAccount).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: a.id,
								children: a.name
							}, a.id))]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "cat",
							children: "カテゴリ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "cat",
							className: "h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm",
							value: categoryId,
							onChange: (e) => setCategoryId(e.target.value ? Number(e.target.value) : ""),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "未分類"
							}), filteredCats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "amount",
							children: "金額"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "amount",
							inputMode: "numeric",
							placeholder: "0",
							value: amount,
							onChange: (e) => setAmount(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "date",
							children: "日付"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "date",
							type: "date",
							value: occurredOn,
							onChange: (e) => setOccurredOn(e.target.value)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "note",
					children: "メモ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "note",
					value: note,
					onChange: (e) => setNote(e.target.value),
					placeholder: "任意"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				disabled: mutation.isPending,
				children: mutation.isPending ? "保存中…" : "記録する"
			})
		]
	});
}
//#endregion
export { TxForm as t };
