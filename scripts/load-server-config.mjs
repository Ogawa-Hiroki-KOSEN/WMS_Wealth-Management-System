/**
 * 自前サーバー用の設定ファイル `config/server.json`。
 * シークレットをこのファイルに書いてよい（ブラウザには出ない）。
 * 値が空なら process.env を使う。ファイルに書いた非空の値は env より優先。
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const SERVER_CONFIG_REL = "config/server.json";

const ENV_MAP = {
  databaseUrl: "DATABASE_URL",
  betterAuthUrl: "BETTER_AUTH_URL",
  betterAuthSecret: "BETTER_AUTH_SECRET",
  googleClientId: "GOOGLE_CLIENT_ID",
  googleClientSecret: "GOOGLE_CLIENT_SECRET",
  mydnsMasterId: "MYDNS_MASTER_ID",
  mydnsPassword: "MYDNS_PASSWORD",
};

/** @param {string} text */
export function parseServerConfig(text) {
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

/** @param {string} root */
export function readServerConfig(root) {
  try {
    return parseServerConfig(
      readFileSync(join(root, SERVER_CONFIG_REL), "utf8"),
    );
  } catch {
    return {};
  }
}

/** @param {unknown} v */
function nonEmpty(v) {
  return typeof v === "string" && v.trim() ? v.trim() : "";
}

/**
 * Mutates `env`. File values win when non-empty.
 * @param {Record<string, unknown>} cfg
 * @param {NodeJS.ProcessEnv} env
 */
export function applyServerConfigToEnv(cfg, env) {
  if (!cfg || typeof cfg !== "object") return env;
  for (const [jsonKey, envKey] of Object.entries(ENV_MAP)) {
    const v = nonEmpty(cfg[jsonKey]);
    if (v) env[envKey] = v;
  }
  if (cfg.googleOAuth === true) env.VITE_GOOGLE_OAUTH = "true";
  if (cfg.googleOAuth === false) env.VITE_GOOGLE_OAUTH = "false";
  if (cfg.authEnabled === true) env.VITE_AUTH_ENABLED = "true";
  if (cfg.authEnabled === false) env.VITE_AUTH_ENABLED = "false";
  return env;
}
