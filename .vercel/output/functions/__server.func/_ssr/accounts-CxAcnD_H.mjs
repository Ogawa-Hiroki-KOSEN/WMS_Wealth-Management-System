import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { r as formatYen } from "./utils-B-tlUbH_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as createAccount, f as updateAccount, l as listAccounts, n as AppShell, r as Button, t as ACCOUNT_KINDS } from "./finance-BoJ9ptSH.mjs";
import { n as Label, t as Input } from "./label-Dt7dsmzq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/accounts-CxAcnD_H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KIND_LABEL = {
	cash: "現金",
	bank: "銀行",
	ewallet: "電子マネー",
	card: "カード"
};
function AccountsPage() {
	const qc = useQueryClient();
	const accounts = useQuery({
		queryKey: ["accounts"],
		queryFn: () => listAccounts()
	});
	const [name, setName] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("bank");
	const [opening, setOpening] = (0, import_react.useState)("0");
	const create = useMutation({
		mutationFn: () => createAccount({ data: {
			name,
			kind,
			opening_balance: Number(opening.replace(/,/g, "")) || 0
		} }),
		onSuccess: async () => {
			setName("");
			setOpening("0");
			await qc.invalidateQueries({ queryKey: ["accounts"] });
			await qc.invalidateQueries({ queryKey: ["summary"] });
			toast.success("口座を追加しました");
		},
		onError: (e) => toast.error(e.message)
	});
	const archive = useMutation({
		mutationFn: (row) => updateAccount({ data: {
			id: row.id,
			name: row.name,
			kind: row.kind,
			archived: !row.archived
		} }),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: ["accounts"] });
			await qc.invalidateQueries({ queryKey: ["summary"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "口座",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium tracking-tight",
				children: "口座"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "現金・銀行・電子マネー・カードを分けて管理します。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 grid gap-3 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2",
				onSubmit: (e) => {
					e.preventDefault();
					if (!name.trim()) {
						toast.error("名前を入力してください");
						return;
					}
					create.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5 sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "新しい口座"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "n",
							children: "名前"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "n",
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "みずほ銀行"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "k",
							children: "種類"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "k",
							className: "h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm",
							value: kind,
							onChange: (e) => setKind(e.target.value),
							children: ACCOUNT_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k,
								children: KIND_LABEL[k]
							}, k))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "o",
							children: "開始残高"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "o",
							inputMode: "numeric",
							value: opening,
							onChange: (e) => setOpening(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: create.isPending,
							children: "追加"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-2",
				children: (accounts.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: KIND_LABEL[a.kind]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: a.name
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl tabular-nums",
							children: formatYen(a.balance)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => archive.mutate(a),
							children: a.archived ? "復元" : "非表示"
						})
					]
				}, a.id))
			})
		]
	});
}
//#endregion
export { AccountsPage as component };
