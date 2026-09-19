import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-B-tlUbH_.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatYen(amount) {
	return new Intl.NumberFormat("ja-JP", {
		style: "currency",
		currency: "JPY",
		maximumFractionDigits: 0
	}).format(amount);
}
function todayISO() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function monthStartISO(year, monthIndex) {
	return `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;
}
function monthEndISO(year, monthIndex) {
	const last = new Date(year, monthIndex + 1, 0).getDate();
	return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
}
function formatMonthLabel(year, monthIndex) {
	return `${year}年${monthIndex + 1}月`;
}
//#endregion
export { monthStartISO as a, monthEndISO as i, formatMonthLabel as n, todayISO as o, formatYen as r, cn as t };
