import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { a as monthEndISO, o as monthStartISO, t as authMiddleware } from "./utils-D-pFCB_f.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as getSql } from "./db-4mSkQB1G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/finance-Dmat4HMx.js
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
var DEFAULT_CATEGORIES = [
	{
		name: "給与",
		kind: "income"
	},
	{
		name: "ボーナス",
		kind: "income"
	},
	{
		name: "副業",
		kind: "income"
	},
	{
		name: "その他収入",
		kind: "income"
	},
	{
		name: "食費",
		kind: "expense"
	},
	{
		name: "交通",
		kind: "expense"
	},
	{
		name: "住居",
		kind: "expense"
	},
	{
		name: "光熱費",
		kind: "expense"
	},
	{
		name: "通信",
		kind: "expense"
	},
	{
		name: "日用品",
		kind: "expense"
	},
	{
		name: "娯楽",
		kind: "expense"
	},
	{
		name: "医療",
		kind: "expense"
	},
	{
		name: "その他支出",
		kind: "expense"
	}
];
var BALANCE_EXPR = `
  a.opening_balance
  + coalesce((
      select sum(case
        when t.type = 'income' then t.amount
        when t.type = 'expense' then -t.amount
        when t.type = 'transfer' then -t.amount
        else 0
      end)
      from transactions t
      where t.user_id = a.user_id and t.account_id = a.id
    ), 0)
  + coalesce((
      select sum(t.amount)
      from transactions t
      where t.user_id = a.user_id
        and t.type = 'transfer'
        and t.transfer_account_id = a.id
    ), 0)
`;
async function ensureDefaults(userId) {
	const sql = await getSql();
	if (((await sql`
    select count(*)::int as n from accounts where user_id = ${userId}
  `)[0]?.n ?? 0) === 0) await sql`
      insert into accounts (user_id, name, kind, opening_balance)
      values (${userId}, ${"現金"}, ${"cash"}, ${0})
    `;
	for (const c of DEFAULT_CATEGORIES) await sql`
      insert into categories (user_id, name, kind)
      values (${userId}, ${c.name}, ${c.kind})
      on conflict (user_id, name, kind) do nothing
    `;
}
var bootstrapFinance_createServerFn_handler = createServerRpc({
	id: "e8f65d557cadf3e1775ba5df0fcab8bdb2b1b43fc9923f1252f6bc4913f70637",
	name: "bootstrapFinance",
	filename: "src/lib/finance.ts"
}, (opts) => bootstrapFinance.__executeServer(opts));
var bootstrapFinance = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(bootstrapFinance_createServerFn_handler, async ({ context }) => {
	await ensureDefaults(context.userId);
	return { ok: true };
});
var listAccounts_createServerFn_handler = createServerRpc({
	id: "7df7af4222db6fc44b85bd4aadb89c0a7403a7d0faaa4d000ee98ef41367fd07",
	name: "listAccounts",
	filename: "src/lib/finance.ts"
}, (opts) => listAccounts.__executeServer(opts));
var listAccounts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAccounts_createServerFn_handler, async ({ context }) => {
	await ensureDefaults(context.userId);
	return (await getSql()).query(`select
         a.id,
         a.name,
         a.kind,
         a.opening_balance,
         a.archived,
         (${BALANCE_EXPR})::int as balance
       from accounts a
       where a.user_id = $1
       order by a.archived, a.id`, [context.userId]);
});
var createAccount_createServerFn_handler = createServerRpc({
	id: "c139b97d19d7718291ce4bff8392c4ca26f27f0911d786d0c0719323d9006e5d",
	name: "createAccount",
	filename: "src/lib/finance.ts"
}, (opts) => createAccount.__executeServer(opts));
var createAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	name: string().trim().min(1).max(40),
	kind: _enum(ACCOUNT_KINDS),
	opening_balance: number().int()
})).handler(createAccount_createServerFn_handler, async ({ context, data }) => {
	return (await (await getSql())`
      insert into accounts (user_id, name, kind, opening_balance)
      values (${context.userId}, ${data.name}, ${data.kind}, ${data.opening_balance})
      returning id
    `)[0];
});
var updateAccount_createServerFn_handler = createServerRpc({
	id: "14ce5db54ba5eae3e0a412383c6e2d393af5962ac46b4404bc785e888a1dfa34",
	name: "updateAccount",
	filename: "src/lib/finance.ts"
}, (opts) => updateAccount.__executeServer(opts));
var updateAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: number().int(),
	name: string().trim().min(1).max(40),
	kind: _enum(ACCOUNT_KINDS),
	archived: boolean()
})).handler(updateAccount_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      update accounts
      set name = ${data.name}, kind = ${data.kind}, archived = ${data.archived}
      where id = ${data.id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var listCategories_createServerFn_handler = createServerRpc({
	id: "8fa8fddf0686804dc8010cca68cb935ca426ea0f8b19c8f96f6763021f7f93ee",
	name: "listCategories",
	filename: "src/lib/finance.ts"
}, (opts) => listCategories.__executeServer(opts));
var listCategories = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCategories_createServerFn_handler, async ({ context }) => {
	await ensureDefaults(context.userId);
	return (await getSql())`
      select id, name, kind
      from categories
      where user_id = ${context.userId}
      order by kind, id
    `;
});
var listTransactions_createServerFn_handler = createServerRpc({
	id: "41e22866a98b8d50007ab710ed7fc2e9e011d334a9dc708655ada7929cab009f",
	name: "listTransactions",
	filename: "src/lib/finance.ts"
}, (opts) => listTransactions.__executeServer(opts));
var listTransactions = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	year: number().int(),
	month: number().int().min(0).max(11)
})).handler(listTransactions_createServerFn_handler, async ({ context, data }) => {
	const from = monthStartISO(data.year, data.month);
	const to = monthEndISO(data.year, data.month);
	return (await getSql())`
      select
        t.id,
        t.account_id,
        a.name as account_name,
        t.transfer_account_id,
        ta.name as transfer_account_name,
        t.category_id,
        c.name as category_name,
        t.type,
        t.amount,
        t.note,
        t.occurred_on
      from transactions t
      join accounts a on a.id = t.account_id
      left join accounts ta on ta.id = t.transfer_account_id
      left join categories c on c.id = t.category_id
      where t.user_id = ${context.userId}
        and t.occurred_on >= ${from}
        and t.occurred_on <= ${to}
      order by t.occurred_on desc, t.id desc
    `;
});
var addTransaction_createServerFn_handler = createServerRpc({
	id: "e26473c5237050adff2eb3c0c56337aeb08dd7cf514f430376c3ba2d6246c3d0",
	name: "addTransaction",
	filename: "src/lib/finance.ts"
}, (opts) => addTransaction.__executeServer(opts));
var addTransaction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	account_id: number().int(),
	transfer_account_id: number().int().nullable(),
	category_id: number().int().nullable(),
	type: _enum(TX_TYPES),
	amount: number().int().positive(),
	note: string().max(200),
	occurred_on: string().regex(/^\d{4}-\d{2}-\d{2}$/)
})).handler(addTransaction_createServerFn_handler, async ({ context, data }) => {
	if (data.type === "transfer") {
		if (!data.transfer_account_id) throw new Error("振替先を選んでください");
		if (data.transfer_account_id === data.account_id) throw new Error("同じ口座へは振替できません");
	}
	const sql = await getSql();
	if (!(await sql`
      select id from accounts
      where id = ${data.account_id} and user_id = ${context.userId}
    `)[0]) throw new Error("口座が見つかりません");
	if (data.transfer_account_id) {
		if (!(await sql`
        select id from accounts
        where id = ${data.transfer_account_id} and user_id = ${context.userId}
      `)[0]) throw new Error("振替先が見つかりません");
	}
	await sql`
      insert into transactions (
        user_id, account_id, transfer_account_id, category_id,
        type, amount, note, occurred_on
      )
      values (
        ${context.userId},
        ${data.account_id},
        ${data.type === "transfer" ? data.transfer_account_id : null},
        ${data.type === "transfer" ? null : data.category_id},
        ${data.type},
        ${data.amount},
        ${data.note.trim()},
        ${data.occurred_on}
      )
    `;
	return { ok: true };
});
var deleteTransaction_createServerFn_handler = createServerRpc({
	id: "82c8247edf704a0ca782e8c4985bd5827ade7929fe9f00b4bd146356c40fa723",
	name: "deleteTransaction",
	filename: "src/lib/finance.ts"
}, (opts) => deleteTransaction.__executeServer(opts));
var deleteTransaction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number().int() })).handler(deleteTransaction_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      delete from transactions
      where id = ${data.id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var getMonthSummary_createServerFn_handler = createServerRpc({
	id: "61cc5f90607f04d0e1abceecc4870500af80cf2cfb1c8eb98f94733d82644dd5",
	name: "getMonthSummary",
	filename: "src/lib/finance.ts"
}, (opts) => getMonthSummary.__executeServer(opts));
var getMonthSummary = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	year: number().int(),
	month: number().int().min(0).max(11)
})).handler(getMonthSummary_createServerFn_handler, async ({ context, data }) => {
	await ensureDefaults(context.userId);
	const from = monthStartISO(data.year, data.month);
	const to = monthEndISO(data.year, data.month);
	const sql = await getSql();
	const flow = await sql`
      select
        coalesce(sum(case when type = 'income' then amount else 0 end), 0)::int as income,
        coalesce(sum(case when type = 'expense' then amount else 0 end), 0)::int as expense
      from transactions
      where user_id = ${context.userId}
        and occurred_on >= ${from}
        and occurred_on <= ${to}
    `;
	const assets = await sql.query(`select coalesce(sum((${BALANCE_EXPR})), 0)::int as total
       from accounts a
       where a.user_id = $1 and a.archived = false`, [context.userId]);
	const income = flow[0]?.income ?? 0;
	const expense = flow[0]?.expense ?? 0;
	return {
		income,
		expense,
		net: income - expense,
		total_assets: assets[0]?.total ?? 0
	};
});
var getReport_createServerFn_handler = createServerRpc({
	id: "163392b543e5476c7d0ee6063cd3e91ab3bb77ec97e02f3bb12cde8ae1ac811d",
	name: "getReport",
	filename: "src/lib/finance.ts"
}, (opts) => getReport.__executeServer(opts));
var getReport = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	year: number().int(),
	month: number().int().min(0).max(11)
})).handler(getReport_createServerFn_handler, async ({ context, data }) => {
	const from = monthStartISO(data.year, data.month);
	const to = monthEndISO(data.year, data.month);
	const sql = await getSql();
	const slices = await sql`
      select coalesce(c.name, ${"未分類"}) as name,
             coalesce(sum(t.amount), 0)::int as amount
      from transactions t
      left join categories c on c.id = t.category_id
      where t.user_id = ${context.userId}
        and t.type = 'expense'
        and t.occurred_on >= ${from}
        and t.occurred_on <= ${to}
      group by coalesce(c.name, ${"未分類"})
      having sum(t.amount) > 0
      order by amount desc
    `;
	const start = new Date(data.year, data.month - 5, 1);
	const rangeStart = monthStartISO(start.getFullYear(), start.getMonth());
	const rows = await sql`
      select
        to_char(date_trunc('month', occurred_on), 'YYYY-MM') as ym,
        coalesce(sum(case when type = 'income' then amount else 0 end), 0)::int as income,
        coalesce(sum(case when type = 'expense' then amount else 0 end), 0)::int as expense
      from transactions
      where user_id = ${context.userId}
        and occurred_on >= ${rangeStart}
        and occurred_on <= ${to}
      group by 1
    `;
	const byYm = new Map(rows.map((r) => [r.ym, r]));
	const points = [];
	for (let i = 5; i >= 0; i -= 1) {
		const d = new Date(data.year, data.month - i, 1);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
		const hit = byYm.get(key);
		points.push({
			label: `${d.getMonth() + 1}月`,
			income: hit?.income ?? 0,
			expense: hit?.expense ?? 0
		});
	}
	return {
		slices,
		points
	};
});
//#endregion
export { addTransaction_createServerFn_handler, bootstrapFinance_createServerFn_handler, createAccount_createServerFn_handler, deleteTransaction_createServerFn_handler, getMonthSummary_createServerFn_handler, getReport_createServerFn_handler, listAccounts_createServerFn_handler, listCategories_createServerFn_handler, listTransactions_createServerFn_handler, updateAccount_createServerFn_handler };
