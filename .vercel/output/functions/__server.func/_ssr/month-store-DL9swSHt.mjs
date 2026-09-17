import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as formatMonthLabel } from "./utils-D-pFCB_f.mjs";
import { a as ChevronRight, o as ChevronLeft } from "../_libs/lucide-react.mjs";
import { r as Button } from "./finance-CKcMseoN.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/month-store-DL9swSHt.js
var import_jsx_runtime = require_jsx_runtime();
function MonthSwitcher({ year, month, onChange }) {
	function shift(delta) {
		const d = new Date(year, month + delta, 1);
		onChange(d.getFullYear(), d.getMonth());
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				className: "size-10",
				onClick: () => shift(-1),
				"aria-label": "前月",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "min-w-28 text-center font-display text-lg font-medium tracking-tight",
				children: formatMonthLabel(year, month)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				className: "size-10",
				onClick: () => shift(1),
				"aria-label": "翌月",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
			})
		]
	});
}
var now = /* @__PURE__ */ new Date();
var useMonth = create((set) => ({
	year: now.getFullYear(),
	month: now.getMonth(),
	setMonth: (year, month) => set({
		year,
		month
	})
}));
//#endregion
export { useMonth as n, MonthSwitcher as t };
