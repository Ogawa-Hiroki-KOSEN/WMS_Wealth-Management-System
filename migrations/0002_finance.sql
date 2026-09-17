create table if not exists accounts (
  id serial primary key,
  user_id text not null,
  name text not null,
  kind text not null,
  opening_balance integer not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists accounts_user_id_idx on accounts (user_id);

create table if not exists categories (
  id serial primary key,
  user_id text not null,
  name text not null,
  kind text not null,
  created_at timestamptz not null default now()
);
create unique index if not exists categories_user_name_kind_idx
  on categories (user_id, name, kind);
create index if not exists categories_user_id_idx on categories (user_id);

create table if not exists transactions (
  id serial primary key,
  user_id text not null,
  account_id integer not null references accounts (id) on delete cascade,
  transfer_account_id integer references accounts (id) on delete set null,
  category_id integer references categories (id) on delete set null,
  type text not null,
  amount integer not null,
  note text not null default '',
  occurred_on date not null,
  created_at timestamptz not null default now()
);
create index if not exists transactions_user_id_idx on transactions (user_id);
create index if not exists transactions_user_date_idx on transactions (user_id, occurred_on desc);
create index if not exists transactions_account_idx on transactions (account_id);
