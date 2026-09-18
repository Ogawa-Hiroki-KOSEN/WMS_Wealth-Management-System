/**
 * サーバー専用設定。クライアントから import しないこと。
 * 実体は /config/server.json（シークレットを書いてよい）。
 */
import {
  applyServerConfigToEnv,
  readServerConfig,
} from "../../scripts/load-server-config.mjs";

if (typeof window !== "undefined") {
  throw new Error("config.server.ts is server-only");
}

applyServerConfigToEnv(readServerConfig(process.cwd()), process.env);
