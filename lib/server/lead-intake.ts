import { createLeadId, leadIdSecret } from "./lead-id";

export type Lead = { id: string; createdAt: string };

type Entry = { lead: Lead; delivered: boolean; pending?: Promise<boolean>; at: number };

const ttlMs = 24 * 60 * 60_000;
const maxEntries = 5_000;
const entries = new Map<string, Entry>();

/** The browser's per-lead submission key (a UUID kept across retries of the same lead), if valid. */
export function submissionKey(value: unknown) {
  return typeof value === "string" && /^[A-Za-z0-9-]{16,64}$/.test(value) ? value : undefined;
}

function prune(now: number) {
  if (entries.size < maxEntries) return;
  for (const [key, entry] of entries) if (!entry.pending && now - entry.at > ttlMs) entries.delete(key);
  // Still full of fresh entries: drop the oldest settled ones (Map keeps insertion order).
  for (const [key, entry] of entries) {
    if (entries.size < maxEntries) break;
    if (!entry.pending) entries.delete(key);
  }
}

function fresh(key: string, now: number) {
  const entry = entries.get(key);
  if (entry && !entry.pending && now - entry.at > ttlMs) {
    entries.delete(key);
    return undefined;
  }
  return entry;
}

/** True when this submission key's lead already reached the inbox (a retry after a lost response). */
export function alreadyDelivered(key: string | undefined) {
  return Boolean(key && fresh(key, Date.now())?.delivered);
}

/**
 * Assigns one lead ID per submission and delivers the lead at most once per server instance.
 * Identity comes from `LEAD_ID_SECRET`: the same submission key always maps to the same lead ID,
 * on any instance. The in-memory map below (24 hours) is only an intra-process optimization: it
 * keeps a retry on the same instance from emailing a delivered lead again and makes concurrent
 * duplicates wait for the first request. A retry that reaches a different instance while or after
 * the first one delivers can send a second internal email, with the same lead ID; the ledger
 * enforces uniqueness on lead_id. Without a key (an older page) every request is a new lead.
 */
export async function deliverLeadOnce(
  key: string | undefined,
  deliver: (lead: Lead) => Promise<boolean>,
  secret = leadIdSecret(),
): Promise<{ lead: Lead; delivered: boolean; replayed: boolean }> {
  const now = Date.now();
  const newLead = (): Lead => ({ id: createLeadId({ key, secret }), createdAt: new Date(now).toISOString() });
  if (!key) {
    const lead = newLead();
    return { lead, delivered: await deliver(lead).catch(() => false), replayed: false };
  }

  let entry = fresh(key, now);
  if (entry?.delivered) return { lead: entry.lead, delivered: true, replayed: true };
  if (entry?.pending) return { lead: entry.lead, delivered: await entry.pending, replayed: true };
  if (!entry) {
    prune(now);
    entry = { lead: newLead(), delivered: false, at: now };
    entries.set(key, entry);
  }

  const pending = deliver(entry.lead).catch(() => false);
  entry.pending = pending;
  entry.delivered = await pending;
  entry.pending = undefined;
  entry.at = Date.now();
  return { lead: entry.lead, delivered: entry.delivered, replayed: false };
}
