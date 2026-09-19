# WMS 資産管理システム

現金・銀行・電子マネー・カードの残高と、日々の収支をまとめて管理する Web アプリです。スマホのブラウザからも使え、ホーム画面に追加できます。

![WMS](public/wms.svg)

手入力の家計・所持金台帳です。銀行 API 連携やレシート OCR はありません。**公式の会計ソフト・税務申告の代替にはしない**でください。

## できること

- **口座管理** — 現金 / 銀行 / 電子マネー / カード。開始残高つきで追加、非表示も可能
- **収支の記録** — 支出・収入・口座間振替。日付・カテゴリ・メモ
- **ホーム** — 総資産と、選択した月の収入・支出・収支
- **明細** — 月ごとの一覧と削除
- **レポート** — 直近 6 か月の棒グラフ、当月支出のカテゴリ内訳
- **アカウント** — Google または X でサインイン。データはユーザーごとに分離

初回ログイン時に「現金」口座と標準カテゴリ（食費・交通・給与など）が自動で用意されます。金額の単位は円（整数）です。

## 画面

| 画面 | パス | 内容 |
| --- | --- | --- |
| ホーム | `/` | 総資産、口座カード、すばやく記録 |
| 明細 | `/ledger` | 月次の取引一覧 |
| 口座 | `/accounts` | 口座の追加・非表示 |
| レポート | `/reports` | グラフと内訳 |
| ログイン | `/login` | Google / X |

PC では左ナビ、スマホでは下部タブです。

---

## 実務上の運用メモ

現場で使うときの約束事です。仕様の「なぜそうなっているか」も含みます。

### 金額・通貨

- 通貨は **JPY のみ**。小数は持ちません。1 円単位の整数です。
- 入力欄のカンマは保存時に無視します。`1,200` も `1200` も同じです。
- マイナス金額の直接入力はできません。支出は「支出」、借入・カード利用は下の口座の使い方を見てください。
- 外貨・暗号資産は対象外です。円換算してメモに残す運用にしてください。

### 開始残高（いちばん間違えやすい）

口座追加時の「開始残高」は、**このアプリを使い始めた日時点の実残高** です。

- 過去の全履歴を入れ直す必要はありません。今日の通帳残高・財布の中身を入れて、その日から記録すれば足ります。
- 開始残高はあとから画面では直せません（DB の `opening_balance` を直接更新する必要あり）。間違えたら口座を非表示にして作り直すか、差額を振替・調整明細で合わせてください。
- 開始残高を 0 のまま使うと、総資産が「このアプリに入れた分だけ」になります。実残高と必ず突き合わせてください。

### 口座の種類と実務上の分け方

| 種類 | 想定 | 実務コメント |
| --- | --- | --- |
| 現金 | 財布・宅内現金 | 週 1 で実査。差額は「その他支出」か調整メモ |
| 銀行 | 普通預金など | 口座は銀行ごと・目的ごとに分ける（生活費 / 貯金） |
| 電子マネー | PayPay 等 | チャージは **銀行 → 電子マネーの振替**。チャージを「支出」にすると二重計上になる |
| カード | クレジットカード | 利用時はカード口座から支出（残高がマイナス＝未払い）。引落日に **銀行 → カードの振替** でゼロに戻す |

カード口座は残高がマイナスになり得ます。総資産は「現金同等 − カード未払い」として見えます。ポイント・分割・リボの内訳は持ちません。

### 収入・支出・振替の使い分け

- **支出** — 資産が減り、生活費として集計したいもの（食費・家賃など）
- **収入** — 給与・ボーナスなど。カテゴリは収入用のみ選べます
- **振替** — 自分の口座同士の移動。チャージ、貯金へ移す、カードの引き落とし

**振替はレポートの収入・支出に入りません。** 総資産も変わりません（片方−、もう片方＋）。「銀行から現金を下ろした」を支出にすると、使ってもいないのに支出が増えます。必ず振替にしてください。

同じ口座への振替はエラーになります。振替先は必須です。

### 日付の基準

- 記録日は `occurred_on`（発生日）です。入力時刻ではありません。
- 明細・レポート・ホームの月切り替えは、この発生日のカレンダー月です。
- カード利用は **利用日** で支出、引落は **引落日** で振替、が実態に近いです。
- 深夜跨ぎ・タイムゾーンはブラウザのローカル日付です。出張先で日付がずれることがあるので、日本時間で入れるなら日付を目視確認してください。

### カテゴリ

初回だけ次が自動作成されます（同名があれば追加しません）。

- 収入: 給与 / ボーナス / 副業 / その他収入
- 支出: 食費 / 交通 / 住居 / 光熱費 / 通信 / 日用品 / 娯楽 / 医療 / その他支出

現状、画面からカテゴリの追加・改名はできません。コードは `src/lib/finance.ts` の `DEFAULT_CATEGORIES`、既存ユーザーへの追加は DB の `categories` です。未分類のまま保存はできます。

支出を収入カテゴリには付けられません（種別でフィルタしています）。

### 口座の「非表示」

- 削除ではありません。過去明細は残ります。
- **総資産から除外**されます。使わなくなった口座・閉じた口座向けです。
- 非表示口座は新規記録の選択肢から消えます。復元できます。
- 口座そのものの物理削除 UI はありません（明細が `ON DELETE CASCADE` のため、SQL で消すと履歴も消えます。本番では使わない）。

### 明細の削除

- 明細画面の「削除」は即時で、確認ダイアログも Undo もありません。
- 消すと残高・レポートが再計算されます。誤削除したら同じ内容を入れ直してください。
- 編集 UI はありません。直し方は「削除して再入力」です。

### 総資産の定義

```
各表示中口座の
  開始残高
  + その口座への収入
  − その口座からの支出
  − その口座からの振替
  + その口座への振替
```

非表示口座は足しません。帳簿と通帳がずれたら、口座単位でこの式と通帳残高を突き合わせてください。ずれの典型原因は「チャージを支出にした」「開始残高の入れ忘れ」「カード引落を支出にした（利用時と二重）」です。

### ログイン・複数端末

- 対応は **Google と X のみ**です。メール＋パスワードはコード上オフです（`src/lib/auth/email-password.ts`）。
- データは認証ユーザー単位です。家族で共有アカウント機能はありません。共同で見るなら同じ Google/X を使うか、各自ログインしてください。
- スマホと PC は同じアカウントなら同じデータです。
- サインアウトはヘッダー右のユーザーボタンです。
- 財務データなので、共有 PC では使い終わったらサインアウトしてください。

### スマホ（PWA）

- ブラウザの「ホーム画面に追加」でアプリアイコン化できます。
- **オフライン専用アプリではありません。** 記録の本体はサーバー側 DB です。通信できないと保存できません。
- 銀行アプリのような生体認証ロックは未実装です。端末の画面ロックに頼ってください。

### いまできないこと（要望になりやすいもの）

予算、繰り返し（家賃の自動計上）、CSV 入出力、複数通貨、レシート画像、銀行同期、承認ワークフロー、監査ログ、明細の編集、カテゴリ CRUD、開始残高の画面編集、口座の本削除、共有家計簿。

必要になったらスキーマを足す前に、既存の `transactions.type` と残高式を壊さないこと。

---

## 保守・デプロイ時のコメント

### データベース

- 本番は PostgreSQL（Neon）。`DATABASE_URL` はプラットフォームが注入する。リポジトリに `.env` を置かない。
- 開発プレビューで URL が無いときは埋め込み Postgres（PGLite）。**プロセス再起動で中身は消える。** 検証データは残る前提にしない。
- スキーマの正は `migrations/*.sql`。適用済みファイルは編集しない（名前で記録されるため再実行されない）。変更は `0003_....sql` を足す。
- 認証スキーマは `migrations/0001_auth.sql`（Better Auth）。中身を手で書き換えない。
- `user_id` は `TEXT`。UUID 列にしない（開発ユーザー id が文字列のため）。
- 金額は `integer`。`numeric` にするとドライバが文字列で返すので、変えるならサーバー側の型もセットで直す。

### 認可

- 口座・明細に触るサーバー関数は必ず `authMiddleware` と `WHERE user_id = context.userId`。クライアントから user id を受け取らない。
- ミドルウェア無しで `getSql()` すると全件見える。個人の残高なので絶対にやらない。
- 認証オフのまま middleware を残すと、本番で全員 401 になる。

### アプリコードで触る場所

| やりたいこと | 場所 |
| --- | --- |
| 初期カテゴリ | `src/lib/finance.ts` の `DEFAULT_CATEGORIES` |
| 残高の計算式 | 同ファイル `BALANCE_EXPR`（振替の符号を壊さない） |
| ロゴ | `public/wms.svg`、`src/components/brand-logo.tsx` |
| 表示名 | `src/routes/__root.tsx` の `APP_NAME` と `src/lib/og/site.json` |

### 開発コマンド

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

`npm run build` のあと本番向けにマイグレーションが走ります。`DATABASE_URL` が無い環境ではスキップされ、埋め込み DB が自分で migrate します。

---

## Windows サーバーで動かす

このアプリは Node.js の Web サーバーです。IIS 単体では動きません。Windows 上で **Node を常駐**し、公開は **HTTPS のリバースプロキシ**（IIS / Caddy など）経由にします。

Google / X ログインは、Grok 上ではブローカー経由で動きます。自宅ドメインで Google を使う手順は「自宅 PC + MyDNS」と「自前ドメインで Google 認証」にあります。

### 1. 前提ソフト

| ソフト | 目安 | メモ |
| --- | --- | --- |
| Node.js | **22 LTS** | https://nodejs.org （「Add to PATH」をオン） |
| PostgreSQL | 16 前後 | https://www.postgresql.org/download/windows/ |
| Git | 任意 | ソースの受け渡し用 |

インストール後、**新しい** PowerShell で確認します。

```powershell
node -v    # v22.x
npm -v
psql --version
```

### 2. ソースを置く

例: `C:\apps\wms`

ZIP を展開するか、このリポジトリ一式をコピーします。`node_modules` はコピーせず、サーバーで入れ直してください。

```powershell
cd C:\apps\wms
npm install
```

### 3. PostgreSQL を用意する

インストール時に superuser（多くは `postgres`）のパスワードを決めています。PowerShell から（パスワードを聞かれたら入力）:

```powershell
# パスはインストール先に合わせて変更
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres
```

```sql
CREATE USER wms WITH PASSWORD 'ここを強いパスワードに';
CREATE DATABASE wms OWNER wms ENCODING 'UTF8';
GRANT ALL PRIVILEGES ON DATABASE wms TO wms;
```

`\q` で抜けます。接続文字列は次の形です（パスワードに `@` や `#` があるときは URL エンコード）。

```
postgresql://wms:パスワード@127.0.0.1:5432/wms
```

ファイアウォールで Postgres の **5432 をインターネットに開けない**でください。アプリと同じマシンなら localhost だけです。

### 4. 設定は `config/server.json` にまとめる

機密（DB パスワード、Google シークレット、セッション鍵）は **このファイルに書いてよい**です。サーバーだけが読み、ブラウザの JS には入りません。Git に上げない（`.gitignore` 済み）。雛形は `config/server.example.json`。

```json
{
  "databaseUrl": "postgresql://wms:パスワード@127.0.0.1:5432/wms",
  "betterAuthUrl": "https://自分.mydns.jp",
  "betterAuthSecret": "32文字以上の乱数",
  "authEnabled": true,
  "googleOAuth": true,
  "googleClientId": "xxxxx.apps.googleusercontent.com",
  "googleClientSecret": "GOCSPX-..."
}
```

| キー | 内容 |
| --- | --- |
| `databaseUrl` | Postgres。空だと埋め込み DB（再起動で消える） |
| `betterAuthUrl` | ブラウザの公開 URL。HTTPS。末尾スラッシュなし |
| `betterAuthSecret` | セッション署名。一度決めたら変えない |
| `authEnabled` | 任意。`false` で認証オフ。省略時は変えない |
| `googleOAuth` | 任意。`true` で Google Cloud 直結（**ビルドし直す**） |
| `googleClientId` / `googleClientSecret` | Google Cloud の値 |
| `mydnsMasterId` / `mydnsPassword` | MyDNS の DDNS 更新用。`mydnsIpv6` を `true` にすると IPv6 も更新 |

ファイルに書いた **非空の値は OS の環境変数より優先**されます。空文字は「未設定」で、そのときだけ環境変数を使います（Grok 上のデプロイ注入用）。

乱数:

```powershell
[Convert]::ToHexString((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

コピー:

```powershell
copy C:\apps\wms\config\server.example.json C:\apps\wms\config\server.json
notepad C:\apps\wms\config\server.json
```

変えたら `npm run build`（特に `googleOAuth`）と Node 再起動。

**HTTPS が必須です。** Cookie が `__Host-` のため、`http://` や IP 直打ちではログインが維持できません。`betterAuthUrl` とアドレスバーを一致させてください。

### 5. 初回ビルドとマイグレーション

`config/server.json` を書いた状態で:

```powershell
cd C:\apps\wms
npm run build
```

成功すると本番向け成果物ができ、`DATABASE_URL` 先へ `migrations/*.sql` が当たります（認証テーブル＋口座・明細）。失敗したら Postgres が起動しているか、接続文字列とユーザー権限を見てください。

### 6. 起動確認

開発用（データは Postgres に載る）:

```powershell
npm run dev
```

本番相当（このリポジトリのビルド済み配信）:

```powershell
npm run preview
```

`preview` は **127.0.0.1:8081** で待ち受けます。インターネットには出さず、IIS / Caddy からだけ転送します。

起動ログにエラーが無く、同じマシンで `http://127.0.0.1:8081` が開けば Node 側は生きています。ログインの確認は、次の HTTPS 経由で行ってください。

### 7. 常駐（再起動後も動かす）

PowerShell を閉じると Node は止まります。NSSM などでサービス化します。

`C:\apps\wms\start-prod.cmd` を作る例:

```bat
@echo off
cd /d C:\apps\wms
call "C:\Program Files\nodejs\npm.cmd" run preview
```

[NSSM](https://nssm.cc) （管理者）:

```text
nssm install WMS C:\apps\wms\start-prod.cmd
nssm set WMS AppDirectory C:\apps\wms
nssm set WMS Start SERVICE_AUTO_START
nssm start WMS
```

環境変数をシステムに入れておけば、サービスにも継承されます。通常は `config/server.json` だけで足ります。

### 8. IIS で HTTPS 公開する（推奨構成）

```
ブラウザ --HTTPS:443--> IIS --HTTP--> 127.0.0.1:8081 (Node)
```

1. IIS と「URL 書き換え」、Application Request Routing (ARR) を入れる
2. サイトを追加し、ホスト名 `wms.example.com`、証明書を 443 にバインド
3. サーバーノード → Application Request Routing → Server Proxy Settings → **Enable proxy**
4. URL Rewrite の Allowed Server Variables に `HTTP_X_FORWARDED_PROTO` と `HTTP_X_FORWARDED_HOST` を追加
5. サイトの `web.config`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="WMS" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://127.0.0.1:8081/{R:1}" />
          <serverVariables>
            <set name="HTTP_X_FORWARDED_PROTO" value="https" />
            <set name="HTTP_X_FORWARDED_HOST" value="{HTTP_HOST}" />
          </serverVariables>
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

Caddy の方が短い例:

```
wms.example.com {
  reverse_proxy 127.0.0.1:8081
}
```

5432 と 8081 はファイアウォールで外部に開けないでください。開けるのは 443 だけです。

### 9. 認証について（自前ホストでつまずく点）

このアプリのログインボタンは、Grok の認証ブローカー（`auth.grok.me`）経由で Google / X に飛ばします。**Grok 上にデプロイしたとき用**で、自宅サーバーの独自ドメインにはコールバックが登録されていません。

自宅 PC ＋ MyDNS で公開し、**Google クラウドの OAuth を自分のドメインに直結する**手順は、下の「自宅PC + MyDNS」と「自前ドメインで Google 認証」を見てください。メール＋パスワードだけなら `src/lib/auth/email-password.ts` を `true` にしてログイン画面にフォームを足します（現状その UI はありません）。

### 10. 更新手順

```powershell
nssm stop WMS
cd C:\apps\wms
# ソースを入れ替え（口座データは Postgres 側。node_modules は残してよい）
npm install
npm run build
nssm start WMS
```

適用済みの `migrations/0001_*.sql` や `0002_*.sql` は編集しない。変更は新しい番号の SQL を足す。

### 11. バックアップ（財務データ）

中身は全部 Postgres です。アプリフォルダをコピーしても明細は残りません。

```powershell
$stamp = Get-Date -Format "yyyyMMdd-HHmm"
New-Item -ItemType Directory -Force -Path C:\backup | Out-Null
$out = "C:\backup\wms-$stamp.dump"
& "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" -U wms -Fc -f $out wms
```

復元:

```powershell
& "C:\Program Files\PostgreSQL\16\bin\pg_restore.exe" -U wms -d wms --clean C:\backup\wms-YYYYMMDD.dump
```

タスクスケジューラで毎日 `pg_dump` を回し、保存先は別ディスクか NAS にしてください。

### 12. 運用チェックリスト

- [ ] Node 22 と Postgres が OS 起動時に自動起動
- [ ] `DATABASE_URL` が入っており、再起動後も口座が残る
- [ ] 公開 URL が HTTPS で、`BETTER_AUTH_URL` と一致
- [ ] 5432 と 8081 をインターネットに公開していない
- [ ] `BETTER_AUTH_SECRET` をリポジトリやチャットに貼っていない
- [ ] `pg_dump` が定期実行されている
- [ ] Windows Update 後に Node サービスが起きているか確認

### うまくいかないとき

| 症状 | 見ること |
| --- | --- |
| ビルドは成功するが真っ白 | リバースプロキシが `/assets` を HTML に落としている。静的ファイルも Node へ全部転送 |
| ログインできない / すぐログアウト | HTTP で開いている。`__Host-` Cookie は HTTPS 必須 |
| Invalid origin | `BETTER_AUTH_URL` と実際の origin が違う。www の有無、http/https |
| 再起動でデータ消失 | `DATABASE_URL` 未設定で埋め込み DB になっている |
| マイグレーション失敗 | Postgres 未起動、パスワード、DB 名、ユーザー権限 |
| ポート使用中 | 別プロセスが 8081 を掴んでいる。`netstat -ano | findstr 8081` |

社内サーバーでメールログイン画面まで欲しければ、その改修を先に入れるのが安全です。

---

## 自宅 PC + MyDNS で公開する

光回線の自宅 Windows PC をサーバーにし、[MyDNS.jp](https://www.mydns.jp/) で名前を付けて外から HTTPS で開く手順です。固定 IP は不要です（グローバル IP が時々変わる前提）。

全体の流れ:

```
スマホ / PC
  → https://自分.mydns.jp （または独自ドメイン）
  → 自宅ルータ（ポート 443）
  → この Windows（IIS または Caddy）
  → 127.0.0.1:8081 の Node（WMS）
```

財務アプリなので、可能なら VPN の内側だけにするか、Google のテストユーザーを自分の Gmail だけに限定してください。

### A. 先に確認すること（ここで詰む人が多い）

1. **グローバル IPv4 があるか**  
   ブラウザで [https://ifconfig.me](https://ifconfig.me) を開き、その数字がルータの WAN IP と同じなら、外から 443 を開けます。  
   違う、または `100.64.x.x` 〜 `100.127.x.x` なら **CGNAT** です。IPv4 では自宅に届きません。IPv6（MyDNS の AAAA）か、Cloudflare Tunnel など別手段に切り替えます。
2. **ISP が 80 / 443 を塞いでいないか**  
   一部の回線は着信を禁止しています。塞がれていると証明書発行も HTTPS 公開もできません。
3. **PC のスリープを切る**  
   コントロールパネル → 電源 → スリープしない。NAS より落ちやすいので注意。
4. **自宅のグローバル IP をチャットや Git に貼らない**

### B. MyDNS.jp の登録

1. [https://www.mydns.jp/](https://www.mydns.jp/) でアカウント作成（Master ID が発行される）
2. ログイン → ドメイン情報の登録
3. ホスト名を決める  
   - 簡単: `なにか.mydns.jp`（MyDNS がくれるサブドメイン）  
   - 独自ドメイン: お名前.com 等で買ったドメインの **NS を MyDNS のネームサーバーにする**か、`wms.example.com` の CNAME を `なにか.mydns.jp` に向ける
4. IPv4 / IPv6 の通知を有効にする（最初は今の IP が空でも、次の更新で入る）

独自ドメインを NS 委譲する場合、レジストラのネームサーバーを MyDNS の案内どおりにします（サイト内の「ネームサーバー」表記を正とする）。浸透に数時間かかることがあります。

### C. グローバル IP が変わったら MyDNS に知らせる

MyDNS は「今の自宅 IP はこれ」と定期的に教えないと、名前が古い IP のままになります。

**いちばん簡単: ルータのダイナミック DNS**  
バッファロー・NEC などは「MyDNS」項目があることが多いです。Master ID とパスワードを入れて IPv4 更新をオン。ルータが代わりに通知します。

**公式の HTTP 更新**（タスクスケジューラで 10 分ごと。短すぎる連打は規約違反になり得ます）:

```powershell
# パスワードはスクリプトに直書きせず、環境変数や資格情報マネージャ推奨
$pair = "マスターID:パスワード"
$b64  = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($pair))
Invoke-WebRequest -Uri "https://ipv4.mydns.jp/login.html" -Headers @{ Authorization = "Basic $b64" }
```

IPv6 も使うなら同様に `https://ipv6.mydns.jp/login.html`。

このリポジトリには同じ処理を Node.js から実行するコマンドもあります。`config/server.json` に次を追加し、資格情報を Git に登録しないでください。

```json
{
  "mydnsMasterId": "発行されたMasterID",
  "mydnsPassword": "MyDNSのパスワード",
  "mydnsIpv6": false
}
```

```powershell
cd C:\apps\wms
npm run mydns:update -- --check
npm run mydns:update
```

Windows ではタスクスケジューラで `npm run mydns:update` を 10 分ごとに実行します。Linux では `deploy/wms-mydns-update.service.example` と `deploy/wms-mydns-update.timer.example` を systemd に登録できます。ルータが MyDNS 更新に対応している場合は、ルータ側で更新し、このコマンドとの二重登録は避けてください。

確認:

```powershell
nslookup 自分.mydns.jp
```

返ってきた A レコードが、今のグローバル IP と一致すれば成功です。

### D. ルータのポート開放

管理画面（多くは `192.168.0.1` や `192.168.1.1`）で **ポート変換 / 仮想サーバー**:

| 外部ポート | プロトコル | 転送先 | 用途 |
| --- | --- | --- | --- |
| 443 | TCP | WMS を動かす PC の LAN IP : 443 | HTTPS |
| 80 | TCP | 同じ PC : 80 | Let's Encrypt の証明書発行（HTTP-01）。発行後も更新に使う |

- 転送先は PC の **プライベート IP**（`192.168.x.x`）。可能なら DHCP 予約で固定する
- **5432（Postgres）と 8081（Node）は開放しない**
- IPv6 で公開するならファイアウォールで 443 だけ許可

Windows ファイアウォール（管理者 PowerShell）:

```powershell
New-NetFirewallRule -DisplayName "WMS HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
New-NetFirewallRule -DisplayName "WMS HTTP-ACME" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
```

### E. HTTPS と Node への転送

Cookie が `__Host-` のため **必ず https://自分のホスト名** で開きます。IP 直打ちや http ではログインが維持できません。

Caddy を使う例（証明書を自動取得するので自宅向き）:

1. [Caddy for Windows](https://caddyserver.com/docs/install#windows) を入れる
2. `C:\apps\Caddyfile`:

```
自分.mydns.jp {
  reverse_proxy 127.0.0.1:8081
}
```

独自ドメインならその名前に置き換え。80 と 443 が届いていれば、初回起動で Let's Encrypt が発行されます。

3. Node はこれまでどおり `npm run preview`（127.0.0.1:8081）
4. Caddy も NSSM で常駐

IIS を使う場合は、サイトのホスト名を MyDNS の名前にし、win-acme 等で証明書を付けたうえで、前述の ARR リバースプロキシを使います。

### F. アプリ側の URL

MyDNS の名前が `wms.example.mydns.jp` なら `config/server.json` の `betterAuthUrl` を `https://wms.example.mydns.jp` にします。変えたら `npm run build` と Node 再起動。ホスト名のスペルをアドレスバーと一字一句合わせます。

### G. 外から見えるか確認

1. **スマホは Wi-Fi を切って回線で**（自宅 LAN から自分のグローバル IP に戻ると、ルータによってはループできず失敗する）
2. `https://自分.mydns.jp` が開く
3. 鍵マークが付いている（証明書エラーならホスト名不一致か、発行失敗）

証明書エラーのまま Google 認証には進めません。

---

## 自前ドメインで Google 認証する

やりたいことは「Google アカウントで WMS に入る」です。経路は 2 種類あります。**X ログインはありません。**

| | A. Grok 上（プレビュー含む） | B. 自宅 / 自前ドメイン |
| --- | --- | --- |
| ボタン | Google で続ける | 同じ |
| 飛び先 | Grok ブローカー → Google | Google Cloud の OAuth（このサーバー直） |
| 必要な秘密 | なし（Grok 側） | 自分が Console で発行 |
| スイッチ | 何もしない（既定） | `VITE_GOOGLE_OAUTH=true` で **ビルド**し、実行時に `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` |

### 1. Google Cloud で OAuth クライアントを作る

1. [Google Cloud Console](https://console.cloud.google.com/) に、ログインに使う Google アカウントで入る
2. 新しいプロジェクト（例: `wms-home`）
3. **API とサービス → OAuth 同意画面**
   - User Type: **外部**
   - アプリ名: `WMS 資産管理システム`
   - ユーザーサポートメール・デベロッパー連絡先: 自分の Gmail
   - スコープ: あとで `email` / `profile` / `openid`（所定の「…userinfo.email」等）
   - **テストユーザー**に、実際にログインする Gmail を追加  
     公開ステータスを「本番」にしなくても、テストユーザーならすぐ使えます。少人数の自宅サーバーは **テストのまま**が安全です（本番公開は Google の審査対象）
4. **API とサービス → 認証情報 → 認証情報を作成 → OAuth クライアント ID**
   - アプリケーションの種類: **ウェブアプリケーション**
   - 名前: `WMS Web`
   - **承認済みの JavaScript 生成元**:
     - `https://自分.mydns.jp`  
     - 独自ドメインなら `https://wms.example.com` も（www を使うならそれも別行）
   - **承認済みのリダイレクト URI**（**一字一句一致。末尾スラッシュなし**）:

```
https://自分.mydns.jp/api/auth/callback/google
```

Better Auth が Google を **直接**使うときの既定パスがこれです。ホスト名は `BETTER_AUTH_URL` と同じです。

5. 発行された **クライアント ID** と **クライアント シークレット** を控える。シークレットはパスワードと同じ扱いで、Git に入れない。

補足:

- `http://` は Google がほぼ拒否します（localhost 以外）
- IP アドレス (`https://203.0.113.10/...`) もウェブクライアントでは使えません。必ず MyDNS か独自ドメインの名前
- テストモードのまま、許可してない Gmail で入ると Google が拒否します
- クライアントを作り直すと ID が変わるので、アプリの環境変数も更新

### 2. アプリに ID を渡してビルドする

値はすべて `config/server.json` に書きます（実装済み）。

```json
{
  "betterAuthUrl": "https://自分.mydns.jp",
  "betterAuthSecret": "乱数",
  "databaseUrl": "postgresql://wms:...@127.0.0.1:5432/wms",
  "googleOAuth": true,
  "googleClientId": "xxxxx.apps.googleusercontent.com",
  "googleClientSecret": "GOCSPX-..."
}
```

`googleOAuth` はビルド時にボタンの行き先へ効くので、保存したあと **必ず `npm run build`**。クライアント ID / シークレットだけ直したなら Node の再起動で足ります。

このフラグを付けない（`googleOAuth: false` または省略）ビルドは、Grok プレビュー用のブローカー Google です。

### 3. 動作確認の順番

1. スマホ回線で `https://自分.mydns.jp` が証明書エラーなく開く
2. ログイン → Google → アカウント選択 → 同意
3. `https://自分.mydns.jp` に戻り、口座画面が出る
4. サーバーを再起動してもログイン状態か、少なくともデータが Postgres に残っている

Google のエラー画面が出たら:

| Google の文言 | 原因 |
| --- | --- |
| redirect_uri_mismatch | Console の URI と実際のコールバックが違う。http/https、ホスト名、パス `/api/auth/callback/google` |
| access_denied / 403 | テストユーザーにその Gmail が入っていない |
| このアプリは Google で確認されていません | テストユーザー以外、または同意画面の公開範囲 |
| Cookie / セッションが残らない | まだ http で開いている。MyDNS の https で開き直す |

### 4. やってはいけないこと

- クライアントシークレットを README のコピー先や Discord に貼る
- 同意画面を「本番・外部全員」にして審査前に世界公開する（財務アプリ）
- ルータで 5432 を開ける
- Google ログインできたあと HTTP のブックマークで使い続ける（Cookie が付かない）

MyDNS のホストが変わったら（ホスト名の変更）、Google Console の生成元とリダイレクト URI と `BETTER_AUTH_URL` の **3 点をセットで**直します。

---

## 技術構成

| 層 | 採用 |
| --- | --- |
| UI | React 19, TanStack Router / Query, Tailwind CSS |
| サーバー | Node.js, TanStack Start |
| DB | PostgreSQL（本番は Neon。開発は埋め込み Postgres） |
| 認証 | Better Auth（Google。自前サーバーは Google Cloud 直結可） |
| グラフ | Recharts |
| 配布 | PWA 対応の Web アプリ |

## データ

主なテーブルは `migrations/0002_finance.sql` にあります。

- `accounts` — 口座（種類・開始残高）
- `categories` — 収入 / 支出カテゴリ
- `transactions` — 明細（`income` / `expense` / `transfer`）

## ブランド

ロゴは `public/wms.svg` です。ヘッダーとログイン画面、ファビコンに使っています。
