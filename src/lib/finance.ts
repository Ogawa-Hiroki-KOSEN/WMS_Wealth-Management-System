import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { monthEndISO, monthStartISO } from "@/lib/utils";

export const ACCOUNT_KINDS = ["cash", "bank", "ewallet", "card"] as const;
export type AccountKind = (typeof ACCOUNT_KINDS)[number];

export const TX_TYPES = ["income", "expense", "transfer"] as const;
export type TxType = (typeof TX_TYPES)[number];

const DEFAULT_CATEGORIES: { name: string; kind: "income" | "expense" }[] = [
  { name: "給与", kind: "income" },
  { name: "ボーナス", kind: "income" },
  { name: "副業", kind: "income" },
  { name: "その他収入", kind: "income" },
  { name: "食費", kind: "expense" },
  { name: "交通", kind: "expense" },
  { name: "住居", kind: "expense" },
  { name: "光熱費", kind: "expense" },
  { name: "通信", kind: "expense" },
  { name: "日用品", kind: "expense" },
  { name: "娯楽", kind: "expense" },
  { name: "医療", kind: "expense" },
  { name: "その他支出", kind: "expense" },
];

export type AccountRow = {
  id: number;
  name: string;
  kind: AccountKind;
  opening_balance: number;
  archived: boolean;
  balance: number;
};

export type CategoryRow = {
  id: number;
  name: string;
  kind: "income" | "expense";
};

export type TransactionRow = {
  id: number;
  account_id: number;
  account_name: string;
  transfer_account_id: number | null;
  transfer_account_name: string | null;
  category_id: number | null;
  category_name: string | null;
  type: TxType;
  amount: number;
  note: string;
  occurred_on: string;
};

const BALANCE_EXPR = `
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

async function ensureDefaults(userId: string) {
  const sql = await getSql();
  const existing = await sql<{ n: number }>`
    select count(*)::int as n from accounts where user_id = ${userId}
  `;
  if ((existing[0]?.n ?? 0) === 0) {
    await sql`
      insert into accounts (user_id, name, kind, opening_balance)
      values (${userId}, ${"現金"}, ${"cash"}, ${0})
    `;
  }
  for (const c of DEFAULT_CATEGORIES) {
    await sql`
      insert into categories (user_id, name, kind)
      values (${userId}, ${c.name}, ${c.kind})
      on conflict (user_id, name, kind) do nothing
    `;
  }
}

export const bootstrapFinance = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureDefaults(context.userId);
    return { ok: true as const };
  });

export const listAccounts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureDefaults(context.userId);
    const sql = await getSql();
    return sql.query<AccountRow>(
      `select
         a.id,
         a.name,
         a.kind,
         a.opening_balance,
         a.archived,
         (${BALANCE_EXPR})::int as balance
       from accounts a
       where a.user_id = $1
       order by a.archived, a.id`,
      [context.userId],
    );
  });

export const createAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      name: z.string().trim().min(1).max(40),
      kind: z.enum(ACCOUNT_KINDS),
      opening_balance: z.number().int(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      insert into accounts (user_id, name, kind, opening_balance)
      values (${context.userId}, ${data.name}, ${data.kind}, ${data.opening_balance})
      returning id
    `;
    return rows[0];
  });

export const updateAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.number().int(),
      name: z.string().trim().min(1).max(40),
      kind: z.enum(ACCOUNT_KINDS),
      archived: z.boolean(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update accounts
      set name = ${data.name}, kind = ${data.kind}, archived = ${data.archived}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const listCategories = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureDefaults(context.userId);
    const sql = await getSql();
    return sql<CategoryRow>`
      select id, name, kind
      from categories
      where user_id = ${context.userId}
      order by kind, id
    `;
  });

export const listTransactions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      year: z.number().int(),
      month: z.number().int().min(0).max(11),
    }),
  )
  .handler(async ({ context, data }) => {
    const from = monthStartISO(data.year, data.month);
    const to = monthEndISO(data.year, data.month);
    const sql = await getSql();
    return sql<TransactionRow>`
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

export const addTransaction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      account_id: z.number().int(),
      transfer_account_id: z.number().int().nullable(),
      category_id: z.number().int().nullable(),
      type: z.enum(TX_TYPES),
      amount: z.number().int().positive(),
      note: z.string().max(200),
      occurred_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
  )
  .handler(async ({ context, data }) => {
    if (data.type === "transfer") {
      if (!data.transfer_account_id) throw new Error("振替先を選んでください");
      if (data.transfer_account_id === data.account_id) {
        throw new Error("同じ口座へは振替できません");
      }
    }
    const sql = await getSql();
    const owned = await sql<{ id: number }>`
      select id from accounts
      where id = ${data.account_id} and user_id = ${context.userId}
    `;
    if (!owned[0]) throw new Error("口座が見つかりません");
    if (data.transfer_account_id) {
      const dest = await sql<{ id: number }>`
        select id from accounts
        where id = ${data.transfer_account_id} and user_id = ${context.userId}
      `;
      if (!dest[0]) throw new Error("振替先が見つかりません");
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
    return { ok: true as const };
  });

export const deleteTransaction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number().int() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      delete from transactions
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export type MonthSummary = {
  income: number;
  expense: number;
  net: number;
  total_assets: number;
};

export const getMonthSummary = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      year: z.number().int(),
      month: z.number().int().min(0).max(11),
    }),
  )
  .handler(async ({ context, data }) => {
    await ensureDefaults(context.userId);
    const from = monthStartISO(data.year, data.month);
    const to = monthEndISO(data.year, data.month);
    const sql = await getSql();
    const flow = await sql<{ income: number; expense: number }>`
      select
        coalesce(sum(case when type = 'income' then amount else 0 end), 0)::int as income,
        coalesce(sum(case when type = 'expense' then amount else 0 end), 0)::int as expense
      from transactions
      where user_id = ${context.userId}
        and occurred_on >= ${from}
        and occurred_on <= ${to}
    `;
    const assets = await sql.query<{ total: number }>(
      `select coalesce(sum((${BALANCE_EXPR})), 0)::int as total
       from accounts a
       where a.user_id = $1 and a.archived = false`,
      [context.userId],
    );
    const income = flow[0]?.income ?? 0;
    const expense = flow[0]?.expense ?? 0;
    return {
      income,
      expense,
      net: income - expense,
      total_assets: assets[0]?.total ?? 0,
    } satisfies MonthSummary;
  });

export type CategorySlice = { name: string; amount: number };
export type MonthPoint = { label: string; income: number; expense: number };

export const getReport = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      year: z.number().int(),
      month: z.number().int().min(0).max(11),
    }),
  )
  .handler(async ({ context, data }) => {
    const from = monthStartISO(data.year, data.month);
    const to = monthEndISO(data.year, data.month);
    const sql = await getSql();
    const slices = await sql<CategorySlice>`
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
    const rows = await sql<{ ym: string; income: number; expense: number }>`
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
    const points: MonthPoint[] = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(data.year, data.month - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const hit = byYm.get(key);
      points.push({
        label: `${d.getMonth() + 1}月`,
        income: hit?.income ?? 0,
        expense: hit?.expense ?? 0,
      });
    }

    return { slices, points };
  });
