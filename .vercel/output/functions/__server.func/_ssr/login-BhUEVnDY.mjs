import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn } from "./client-bt22Lrmv.mjs";
import { a as resolveGoogleProviderId } from "./server-CvvLOtJO.mjs";
import { r as useCurrentUserState, t as BrandLogo } from "./use-current-user-BqmayeMv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BhUEVnDY.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-40 animate-pulse rounded-md bg-border" })
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center px-6 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {
					size: "hero",
					linked: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-relaxed text-muted",
					children: "現金と口座の残高、日々の収支、月次レポートをひとつの場所で。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 space-y-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => signIn(resolveGoogleProviderId(), { callbackURL: "/" }),
						className: "h-11 w-full rounded-md border border-border bg-elevated text-sm font-medium text-fg transition-colors hover:bg-bg",
						children: "Google で続ける"
					})
				})
			]
		})
	});
}
//#endregion
export { Login as component };
