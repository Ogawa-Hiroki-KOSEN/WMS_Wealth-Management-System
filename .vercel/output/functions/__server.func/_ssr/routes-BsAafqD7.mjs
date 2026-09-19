import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { r as formatYen } from "./utils-B-tlUbH_.mjs";
import { l as listAccounts, n as AppShell, s as getMonthSummary } from "./finance-BoJ9ptSH.mjs";
import { n as useMonth, t as MonthSwitcher } from "./month-store-DTpMQgVb.mjs";
import { t as TxForm } from "./tx-form-CViPMijS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BsAafqD7.js
var import_jsx_runtime = require_jsx_runtime();
var KIND_LABEL = {
	cash: "現金",
	bank: "銀行",
	ewallet: "電子マネー",
	card: "カード"
};
function Home() {
	const { year, month, setMonth } = useMonth();
	const summary = useQuery({
		queryKey: [
			"summary",
			year,
			month
		],
		queryFn: () => getMonthSummary({ data: {
			year,
			month
		} })
	});
	const accounts = useQuery({
		queryKey: ["accounts"],
		queryFn: () => listAccounts()
	});
	const s = summary.data;
	const openAccounts = (accounts.data ?? []).filter((a) => !a.archived);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "ホーム",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-medium tracking-tight",
					children: "総資産"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSwitcher, {
					year,
					month,
					onChange: setMonth
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 rounded-xl border border-border bg-primary p-6 text-primary-fg shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm opacity-80",
						children: "いま手元にあるお金"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-4xl font-medium tabular-nums tracking-tight",
						children: s ? formatYen(s.total_assets) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid grid-cols-3 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "収入",
								value: s ? formatYen(s.income) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "支出",
								value: s ? formatYen(s.expense) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "収支",
								value: s ? formatYen(s.net) : "—"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-medium",
					children: "口座"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-3 sm:grid-cols-2",
					children: [openAccounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-lg border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-muted",
							children: KIND_LABEL[a.kind] ?? a.kind
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-baseline justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-medium",
								children: a.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl tabular-nums",
								children: formatYen(a.balance)
							})]
						})]
					}, a.id)), openAccounts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "口座はまだありません。"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 rounded-xl border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-medium",
						children: "すばやく記録"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "支出・収入・口座間の振替を追加します。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TxForm, {})
					})
				]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "opacity-70",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 font-medium tabular-nums",
		children: value
	})] });
}
//#endregion
export { Home as component };
