#!/usr/bin/env node
/**
 * Notify MyDNS.jp of the current public address.
 * Credentials come from config/server.json or MYDNS_* environment variables.
 */
import process from "node:process";
import { applyServerConfigToEnv, readServerConfig } from "./load-server-config.mjs";

const config = readServerConfig(process.cwd());
applyServerConfigToEnv(config, process.env);

const masterId = process.env.MYDNS_MASTER_ID?.trim();
const password = process.env.MYDNS_PASSWORD?.trim();
const ipv6Enabled = config.mydnsIpv6 === true || process.env.MYDNS_IPV6 === "true";

export function mydnsEndpoints(includeIpv6 = false) {
    return [
        "https://ipv4.mydns.jp/login.html",
        ...(includeIpv6 ? ["https://ipv6.mydns.jp/login.html"] : []),
    ];
}

export function validateMyDnsConfig({ id = masterId, secret = password } = {}) {
    if (!id || !secret) {
        return "MYDNS_MASTER_ID と MYDNS_PASSWORD を設定してください";
    }
    return null;
}

async function notify(endpoint) {
    const credentials = Buffer.from(`${masterId}:${password}`, "utf8").toString("base64");
    const response = await fetch(endpoint, {
        headers: {
            authorization: `Basic ${credentials}`,
            "user-agent": "WMS-MyDNS-Updater/1.0",
        },
        signal: AbortSignal.timeout(15_000),
    });
    const body = (await response.text()).trim();
    if (!response.ok) {
        throw new Error(`${endpoint} returned HTTP ${response.status}: ${body.slice(0, 160)}`);
    }
    console.log(`${endpoint}: updated${body ? ` (${body.slice(0, 80)})` : ""}`);
}

const error = validateMyDnsConfig();
if (error) {
    console.error(`[mydns] ${error}`);
    process.exitCode = 1;
} else if (process.argv.includes("--check")) {
    console.log(`[mydns] configuration ok; targets: ${mydnsEndpoints(ipv6Enabled).join(", ")}`);
} else {
    try {
        for (const endpoint of mydnsEndpoints(ipv6Enabled)) await notify(endpoint);
    } catch (err) {
        console.error(`[mydns] update failed: ${err instanceof Error ? err.message : String(err)}`);
        process.exitCode = 1;
    }
}
