import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatYen } from "./utils-D-pFCB_f.mjs";
import { c as getReport, n as AppShell, s as getMonthSummary } from "./finance-CKcMseoN.mjs";
import { n as useMonth, t as MonthSwitcher } from "./month-store-DL9swSHt.mjs";
import { a as CartesianGrid, c as Cell, i as XAxis, l as ResponsiveContainer, n as BarChart, o as Bar, r as YAxis, s as Pie, t as PieChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-DkP6VBle.js
var import_jsx_runtime = require_jsx_runtime();
var SLICE_COLORS = [
	"#2c463f",
	"#4a6b61",
	"#6d675e",
	"#a24a3a",
	"#4a5c78",
	"#8f877c",
	"#1b1916"
];
function ReportsPage() {
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
	const report = useQuery({
		queryKey: [
			"report",
			year,
			month
		],
		queryFn: () => getReport({ data: {
			year,
			month
		} })
	});
	const slices = report.data?.slices ?? [];
	const points = report.data?.points ?? [];
	const s = summary.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "レポート",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-medium tracking-tight",
					children: "レポート"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSwitcher, {
					year,
					month,
					onChange: setMonth
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						title: "収入",
						value: s ? formatYen(s.income) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						title: "支出",
						value: s ? formatYen(s.expense) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						title: "収支",
						value: s ? formatYen(s.net) : "—"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-xl border border-border bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-medium",
					children: "直近6か月"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: points,
							barGap: 4,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "#e4ddd0",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: {
										fill: "#6d675e",
										fontSize: 12
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: {
										fill: "#6d675e",
										fontSize: 11
									},
									axisLine: false,
									tickLine: false,
									tickFormatter: (v) => `${Math.round(Number(v) / 1e4)}万`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (value) => formatYen(Number(value)),
									contentStyle: {
										borderRadius: 12,
										borderColor: "#e4ddd0"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "income",
									name: "収入",
									fill: "#2f6b57",
									radius: [
										4,
										4,
										0,
										0
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "expense",
									name: "支出",
									fill: "#a24a3a",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-xl border border-border bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-medium",
					children: "支出の内訳"
				}), slices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 pb-6 text-center text-sm text-muted",
					children: "この月の支出はまだありません。"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-4 md:grid-cols-2 md:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: slices,
								dataKey: "amount",
								nameKey: "name",
								innerRadius: 52,
								outerRadius: 80,
								paddingAngle: 2,
								children: slices.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: SLICE_COLORS[i % SLICE_COLORS.length] }, slices[i].name))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (value) => formatYen(Number(value)) })] })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: slices.map((slice, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-2.5 rounded-full",
									style: { background: SLICE_COLORS[i % SLICE_COLORS.length] }
								}), slice.name]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted",
								children: formatYen(slice.amount)
							})]
						}, slice.name))
					})]
				})]
			})
		]
	});
}
function Kpi({ title, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-2xl tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { ReportsPage as component };
