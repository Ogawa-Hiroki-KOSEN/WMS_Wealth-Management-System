import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Navigate, f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as authMiddleware } from "./utils-D-pFCB_f.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { a as hasGateSessionMarker } from "./server-BTVRX8ur.mjs";
import { i as LayoutDashboard, r as ListPlus, s as ChartColumn, t as Wallet } from "../_libs/lucide-react.mjs";
import { n as createSsrRpc } from "./router-BslbQkPD.mjs";
import { n as useCurrentUserState, t as useCurrentUser } from "./use-current-user-DG6UNzh9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/finance-CKcMseoN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var NAV = [
	{
		to: "/",
		label: "ホーム",
		icon: LayoutDashboard
	},
	{
		to: "/ledger",
		label: "明細",
		icon: ListPlus
	},
	{
		to: "/accounts",
		label: "口座",
		icon: Wallet
	},
	{
		to: "/reports",
		label: "レポート",
		icon: ChartColumn
	}
];
function AppShell({ title, children }) {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-bg px-4 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-40 animate-pulse rounded-md bg-border" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-border/70" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-xl bg-border/50" })
			]
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg pb-24 md:pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-border/80 bg-bg/85 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-5xl items-center justify-between px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "font-display text-xl font-medium tracking-tight text-fg",
							children: "所持金"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-sm text-muted sm:inline",
							children: title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden max-w-40 truncate text-sm text-muted sm:inline",
							children: user.displayName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-5xl gap-8 px-4 pt-6 md:grid-cols-[180px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden md:flex md:flex-col md:gap-1",
					children: NAV.map((item) => {
						const active = pathname === item.to;
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors", active ? "bg-primary text-primary-fg" : "text-muted hover:bg-border/60 hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-4",
								strokeWidth: 1.75
							}), item.label]
						}, item.to);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 backdrop-blur-md md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-lg grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)]",
					children: NAV.map((item) => {
						const active = pathname === item.to;
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium", active ? "text-primary" : "text-subtle"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-5",
								strokeWidth: 1.75
							}), item.label]
						}, item.to);
					})
				})
			})
		]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-transform duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:bg-primary/90",
			secondary: "bg-elevated text-fg border border-border hover:bg-surface",
			ghost: "text-fg hover:bg-border/50",
			danger: "bg-expense text-primary-fg hover:bg-expense/90"
		},
		size: {
			default: "h-11 rounded-md px-4 text-sm",
			sm: "h-9 rounded-sm px-3 text-sm",
			lg: "h-12 rounded-md px-5 text-base",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var ACCOUNT_KINDS = [
	"cash",
	"bank",
	"ewallet",
	"card"
];
var TX_TYPES = [
	"income",
	"expense",
	"transfer"
];
createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("e8f65d557cadf3e1775ba5df0fcab8bdb2b1b43fc9923f1252f6bc4913f70637"));
var listAccounts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7df7af4222db6fc44b85bd4aadb89c0a7403a7d0faaa4d000ee98ef41367fd07"));
var createAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	name: string().trim().min(1).max(40),
	kind: _enum(ACCOUNT_KINDS),
	opening_balance: number().int()
})).handler(createSsrRpc("c139b97d19d7718291ce4bff8392c4ca26f27f0911d786d0c0719323d9006e5d"));
var updateAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: number().int(),
	name: string().trim().min(1).max(40),
	kind: _enum(ACCOUNT_KINDS),
	archived: boolean()
})).handler(createSsrRpc("14ce5db54ba5eae3e0a412383c6e2d393af5962ac46b4404bc785e888a1dfa34"));
var listCategories = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8fa8fddf0686804dc8010cca68cb935ca426ea0f8b19c8f96f6763021f7f93ee"));
var listTransactions = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	year: number().int(),
	month: number().int().min(0).max(11)
})).handler(createSsrRpc("41e22866a98b8d50007ab710ed7fc2e9e011d334a9dc708655ada7929cab009f"));
var addTransaction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	account_id: number().int(),
	transfer_account_id: number().int().nullable(),
	category_id: number().int().nullable(),
	type: _enum(TX_TYPES),
	amount: number().int().positive(),
	note: string().max(200),
	occurred_on: string().regex(/^\d{4}-\d{2}-\d{2}$/)
})).handler(createSsrRpc("e26473c5237050adff2eb3c0c56337aeb08dd7cf514f430376c3ba2d6246c3d0"));
var deleteTransaction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number().int() })).handler(createSsrRpc("82c8247edf704a0ca782e8c4985bd5827ade7929fe9f00b4bd146356c40fa723"));
var getMonthSummary = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	year: number().int(),
	month: number().int().min(0).max(11)
})).handler(createSsrRpc("61cc5f90607f04d0e1abceecc4870500af80cf2cfb1c8eb98f94733d82644dd5"));
var getReport = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	year: number().int(),
	month: number().int().min(0).max(11)
})).handler(createSsrRpc("163392b543e5476c7d0ee6063cd3e91ab3bb77ec97e02f3bb12cde8ae1ac811d"));
//#endregion
export { createAccount as a, getReport as c, listTransactions as d, updateAccount as f, addTransaction as i, listAccounts as l, AppShell as n, deleteTransaction as o, Button as r, getMonthSummary as s, ACCOUNT_KINDS as t, listCategories as u };
