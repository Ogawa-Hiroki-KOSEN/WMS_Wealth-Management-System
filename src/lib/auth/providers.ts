/**
 * Sign-in providers shown in the UI.
 *
 * - **Grok 上 / プレビュー**: `grok-google` — ブローカー経由（このアプリは Google の
 *   クライアントシークレットを持たない）
 * - **自前サーバー**: `VITE_GOOGLE_OAUTH=true` かつ `GOOGLE_CLIENT_ID` /
 *   `GOOGLE_CLIENT_SECRET` を置くと、Better Auth の Google プロバイダ（`google`）
 *
 * X は出さない。
 */
export type GrokProvider = {
  providerId: string;
  idp: string;
  label: string;
};

export const GROK_PROVIDERS: readonly GrokProvider[] = [
  { providerId: "grok-google", idp: "google", label: "Google" },
];

/** ログインボタンが叩く provider id。自前 Google OAuth 時は `google`。 */
export function resolveGoogleProviderId(): string {
  return import.meta.env.VITE_GOOGLE_OAUTH === "true" ? "google" : "grok-google";
}
