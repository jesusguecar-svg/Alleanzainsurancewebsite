import { createHmac, randomBytes } from "node:crypto";

/**
 * Internal lead IDs: "LD-XXXXX-XXXXX", e.g. LD-A7K4P-9Q2RM. Ten symbols from 31 unambiguous
 * characters (no 0/O or 1/I/L): ~8.2 × 10¹⁴ IDs. The ID encodes nothing: no date, channel, state,
 * product, agent or consumer information. `created_at` is the source of truth for creation time.
 */
const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const leadIdPattern = /^LD-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{5}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{5}$/;

/** Ten symbols from a byte stream. Bytes ≥ 248 (= 31 × 8) are skipped so every symbol is equally likely. */
function symbolsFrom(bytes: Uint8Array) {
  let symbols = "";
  for (const byte of bytes) {
    if (byte >= 248) continue;
    symbols += alphabet[byte % alphabet.length];
    if (symbols.length === 10) return symbols;
  }
  return undefined;
}

/**
 * A lead ID. With a submission key and `LEAD_ID_SECRET` the symbols come from
 * HMAC-SHA256(secret, "<submission key>:<round>"), so the same submission gets the same ID on
 * every server instance; otherwise they are random. The browser never sees the secret, so it
 * cannot compute or choose an ID.
 */
export function createLeadId({ key, secret }: { key?: string; secret?: string } = {}) {
  let symbols: string | undefined;
  for (let round = 0; !symbols; round++) {
    symbols = symbolsFrom(key && secret ? createHmac("sha256", secret).update(`${key}:${round}`).digest() : randomBytes(32));
  }
  return `LD-${symbols.slice(0, 5)}-${symbols.slice(5)}`;
}

let warnedMissingSecret = false;

/** One generic line per server instance; never includes consumer data or secret values. */
export function warnMissingLeadIdSecret() {
  if (warnedMissingSecret) return;
  warnedMissingSecret = true;
  console.error("LEAD_ID_SECRET is not set; lead IDs are not stable across server instances and leads are not sent to the lead ledger.");
}

/**
 * `LEAD_ID_SECRET`: used only to map submission keys to lead IDs, never for authentication.
 * Required in production; without it IDs are random, a retry that reaches another server
 * instance gets a new ID, and the ledger client sends nothing (see `ledgerConfig`).
 */
export function leadIdSecret(env: Record<string, string | undefined> = process.env) {
  const secret = env.LEAD_ID_SECRET?.trim();
  if (!secret && env.VERCEL_ENV === "production") warnMissingLeadIdSecret();
  return secret || undefined;
}
