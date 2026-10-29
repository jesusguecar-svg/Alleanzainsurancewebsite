# Lead ID and lead ledger — website side

Every successful insurance lead from the website gets an internal **`lead_id`**. The ID follows the
lead through contact, quote and ACA enrollment in Alleanza's canonical lead ledger, the Apps Script
receiver. Neither the ID nor the website's ledger record contains consumer PII. GA4 stays aggregate
analytics.

| Where | Gets the `lead_id`? |
|---|---|
| Internal lead email to Alleanza | **Yes**: first line `ID de lead: LD-…` and at the end of the subject |
| Lead ledger (server to server, signed) | **Yes**: the record key |
| Browser / API response | **No**: the response stays `{"ok":true}` |
| GA4, GTM, dataLayer, Vercel Analytics | **No, never.** The same applies to the browser's `submission_id` |

Status: the client is implemented and tested. The production endpoint is **not connected**, and no
production environment variables are set.

## Lead ID

- **Format:** `LD-XXXXX-XXXXX`, e.g. `LD-A7K4P-9Q2RM`.
- **Regex:** `^LD-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{5}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{5}$`
- **Symbols:** 10 from `23456789ABCDEFGHJKMNPQRSTUVWXYZ`, 31 characters with no 0/O or 1/I/L, so
  it reads well over the phone. That gives 31¹⁰ ≈ 8.2 × 10¹⁴ IDs.
- **Encodes nothing:** no date, channel, state, product, agent or consumer information.
  `created_at` is the source of truth for creation time.
- **Generated:** only on the server (`lib/server/lead-id.ts`), and only after the submission passes
  validation, the honeypot and the rate limit. Invalid submissions never get an ID.

### Algorithm

With a valid `submission_id` and `LEAD_ID_SECRET` set:

```
for round = 0, 1, 2, …:
    bytes = HMAC-SHA256(key = LEAD_ID_SECRET as UTF-8, message = "<submission_id>:<round>")
    for each byte in order:
        skip it if byte ≥ 248          (248 = 31 × 8, so every symbol is equally likely)
        otherwise append alphabet[byte mod 31]
    stop when 10 symbols are collected  (almost always in round 0)
lead_id = "LD-" + symbols[0..5] + "-" + symbols[5..10]
```

Without a `submission_id` (an older cached page) or without `LEAD_ID_SECRET`, the same mapping runs
over 32 random bytes. Without `LEAD_ID_SECRET` the lead is emailed but never sent to the ledger.

- **Collisions:** across one million leads in total, the chance that any two share an ID is about
  6 × 10⁻⁴. The receiver enforces uniqueness (`id_conflict`).
- **Secret separation:** `LEAD_ID_SECRET` is used **only** for this mapping. It has nothing to do
  with ledger authentication. Rotating `LEAD_LEDGER_WEBHOOK_SECRET` never changes the ID of a
  submission. Rotating `LEAD_ID_SECRET` changes the ID only for submissions that have not happened
  yet; issued IDs are stored and never recomputed. Avoid rotating it while visitors may be retrying.

## Which forms

| Form | Route | Ledger `form_type` / `product_line` |
|---|---|---|
| Contact (`/contacto`, home, product pages) | `/api/contacto` | `contact` / the product's line (`health`, `life`, `property`), or absent |
| Employer (`/employers`) | `/api/contacto` | `contact` / `employer` |
| Health (`/health`, `/en/health`) | `/api/health/contact` | `health` / `health` |
| `/work` recruiting | `/api/contacto` | **Not an insurance lead:** no ID and no ledger record. The email is unchanged |

`form_type` and `product_line` use the same values as GA4's `generate_lead` (measurement plan §5),
so aggregate GA4 counts and ledger counts can be compared by segment.

## Idempotency

1. **Browser:** each form creates a `submission_id` (a random UUID) on the first submit. It reuses
   that ID for every retry of the same lead and replaces it after a success
   (`lib/forms/useSubmissionId.ts`). The value goes only to the form's own API route.
2. **Identity (any server instance):** the same `submission_id` maps to the same `lead_id` through
   `LEAD_ID_SECRET`. This holds across instances and restarts.
3. **Intra-process optimization:** each server instance remembers recent submissions for 24 hours
   (`lib/server/lead-intake.ts`). On that instance:
   - a retry of a delivered lead gets `{"ok":true}` without a second email or ledger post;
   - a retry after an email failure is sent again under the same ID;
   - concurrent duplicates wait for the first request.

   It is not shared between instances and does not survive a restart.
4. **Across instances:** a retry that reaches another instance (for example, after a lost response)
   produces the **same `lead_id`**. It can send a **second internal email** carrying that same ID,
   which staff can recognize as a duplicate. That instance also posts the record again, with its
   own `created_at` (the time it handled the submission); every other field is the same, so the
   receiver answers `duplicate` (see [Receiver responses](#receiver-responses)).
5. **The receiving ledger is responsible for uniqueness and idempotency on `lead_id`.** The website
   has no database.

## Environment variables

| Variable | Purpose |
|---|---|
| `LEAD_ID_SECRET` | **Required for ledger delivery.** Long random string. Deterministic `submission_id` → `lead_id` mapping only |
| `LEAD_LEDGER_ENDPOINT` | The receiver's https URL (the Apps Script web-app `/exec` URL) |
| `LEAD_LEDGER_WEBHOOK_SECRET` | Shared HMAC key for signing ledger requests. Never sent and never logged |
| `LEAD_LEDGER_CAMPAIGN_IDS` | Not a secret. Comma-separated approved campaign IDs, e.g. `aca_oe_2027,oe2027_texas_aca` (lowercase letters, digits, `_`, `-`). Only these may appear as `first_campaign` / `last_campaign`. Optional: without it no campaign is sent |
| `LEAD_LEDGER_SOURCE_IDS` | Not a secret. Comma-separated approved custom sources: IDs (lowercase letters, digits, `_`, `-`) or referral host names, e.g. `healthsherpa,partner_xyz,examplepartner.com`. Added to the built-in sources below. Optional. Kept separate from campaigns |

The ledger client sends only when **all three** are set. Otherwise the forms behave exactly as
before and the email still carries a `lead_id`:

- `LEAD_LEDGER_ENDPOINT` or `LEAD_LEDGER_WEBHOOK_SECRET` missing: the server logs
  `Lead ledger is not configured; leads are emailed only.` once per instance.
- `LEAD_ID_SECRET` missing: lead IDs are random per request, so a retry on another instance would
  get a new ID. Those unstable identities must not enter the ledger, so **nothing is sent**. The
  server logs, once per instance (in production even when the ledger is not configured):
  `LEAD_ID_SECRET is not set; lead IDs are not stable across server instances and leads are not sent to the lead ledger.`

No log line ever contains consumer data or a secret value.

## Website → ledger request

```
POST {LEAD_LEDGER_ENDPOINT}
Content-Type: application/json

{"version":1,"payload":"<base64url>","signature":"<base64url>"}
```

`Content-Type` is the only header: authentication and idempotency live in the body, not in headers.

- `payload` = base64url( UTF-8 bytes of `JSON.stringify(record)` ). The JSON is compact, with keys
  in schema order and no padding.
- `signature` = base64url( HMAC-SHA256( key = `LEAD_LEDGER_WEBHOOK_SECRET` as UTF-8, message = the
  exact `payload` string ) ), with no padding.
- The signature covers the **exact `payload` string**, not parsed or re-serialized JSON. The
  receiver verifies it before decoding.
- base64url uses the RFC 4648 §5 alphabet (`-` and `_`) **without `=` padding**. Apps Script's
  `Utilities.base64EncodeWebSafe` adds padding, so the receiver must strip trailing `=` (or pad
  ours) before comparing. A signature is always 43 characters.

Test vector, also asserted in `tests/lead-ledger.test.ts`:

```
secret:    example-webhook-secret
record:    {"schema_version":1,"lead_id":"LD-A7K4P-9Q2RM","created_at":"2026-11-01T15:00:00.000Z","channel_of_entry":"web_form","form_type":"health","product_line":"health","state":"TX","language":"es","last_source":"google","last_medium":"organic","last_landing_page":"/health"}
payload:   eyJzY2hlbWFfdmVyc2lvbiI6MSwibGVhZF9pZCI6IkxELUE3SzRQLTlRMlJNIiwiY3JlYXRlZF9hdCI6IjIwMjYtMTEtMDFUMTU6MDA6MDAuMDAwWiIsImNoYW5uZWxfb2ZfZW50cnkiOiJ3ZWJfZm9ybSIsImZvcm1fdHlwZSI6ImhlYWx0aCIsInByb2R1Y3RfbGluZSI6ImhlYWx0aCIsInN0YXRlIjoiVFgiLCJsYW5ndWFnZSI6ImVzIiwibGFzdF9zb3VyY2UiOiJnb29nbGUiLCJsYXN0X21lZGl1bSI6Im9yZ2FuaWMiLCJsYXN0X2xhbmRpbmdfcGFnZSI6Ii9oZWFsdGgifQ
signature: XylcWyGC2rhzx9snAh-t_jmDQWIj7lp66GlsKoFT150
```

## Receiver responses

The JSON body is authoritative, whatever the HTTP status. Apps Script answers POSTs through a 302
redirect, which the server-side fetch follows.

| Body | Website treats it as | Retried? | Logged |
|---|---|---|---|
| `{"ok":true,"result":"created","lead_id":"LD-…"}` | delivered | no | nothing |
| `{"ok":true,"result":"duplicate","lead_id":"LD-…"}` | delivered (the same lead already recorded) | no | nothing |
| `{"ok":false,"code":"id_conflict","lead_id":"LD-…"}` | conflict | no | `Lead ledger: id_conflict for LD-….` |
| `{"ok":false,"code":"unauthorized"}` | rejected signature | no: the identical signed body cannot succeed | `Lead ledger: unauthorized for LD-…; check LEAD_LEDGER_WEBHOOK_SECRET.` |
| Not JSON, an unknown shape, or a receipt naming another `lead_id` | invalid response | yes | after the last attempt: `… (invalid_response, status N) …` |
| Network error / timeout (10 s) | failed | yes | after the last attempt: `… (network_error \| timeout) …` |

### Canonical duplicate rule (receiver)

For a `lead_id` it already holds, the receiver decodes the incoming allowlisted record and compares
it with the stored record **field by field, excluding only `created_at`**. A field present in one
record and absent from the other counts as a difference.

- Every other field equal: `{"ok":true,"result":"duplicate","lead_id":"…"}`. The stored
  `created_at` stays authoritative and is **never overwritten**.
- Any other field different: `{"ok":false,"code":"id_conflict","lead_id":"…"}`.

`created_at` is excluded because a legitimate retry handled by another server instance has the
same `lead_id` and the same content but its own `created_at`. Nothing else is relaxed.

- **Retries:** three attempts in total, 0.5 s and then 2 s apart, each with the identical body.
- **Never blocks the visitor:** the POST runs after the visitor's response is sent (Next `after()`),
  so the ledger never delays or fails a submission. The visitor always gets `{"ok":true}` once the
  email is sent.
- **Logs:** they contain only the lead ID and a generic code, never PII, the payload or the secret.
- **No back-fill:** a record that fails is not re-sent later. The lead emails carry the same ID and
  can be used to reconcile.

## Record schema (`schema_version` 1)

Fields that do not apply are **omitted**, never sent as `null` or `""`.

| Field | Type | Always? | Values |
|---|---|---|---|
| `schema_version` | integer | yes | `1` |
| `lead_id` | string | yes | `LD-XXXXX-XXXXX` |
| `created_at` | string | yes | ISO 8601 UTC with milliseconds (when the website instance first handled the submission); the same as `Fecha` in the email. On a duplicate, the ledger keeps the first stored value |
| `channel_of_entry` | string | yes | `web_form` |
| `form_type` | string | yes | `contact` \| `health` |
| `product_line` | string | no | `health` \| `life` \| `property` \| `employer` \| `academy` |
| `state` | string | no | USPS code, e.g. `TX` (health form only) |
| `language` | string | yes | `es` \| `en` |
| `first_source`, `first_medium`, `first_campaign`, `first_landing_page` | string | no | First touch within 90 days. Present **only if the visitor accepted analytics** |
| `last_source`, `last_medium`, `last_campaign`, `last_landing_page` | string | no | Last non-direct touch, or this visit's own touch |

### AI acquisition

- **Website form after an AI assistant** (e.g. ChatGPT → `/health` → form): `channel_of_entry`
  stays `web_form`. The AI origin is in the attribution fields, normalized to `chatgpt`,
  `perplexity`, `gemini`, `grok`, `copilot` or `claude` with medium `ai_assistant` (measurement plan
  §7–§8). ChatGPT is recognized only from chatgpt.com and chat.openai.com; other openai.com hosts
  are a normal referral. No reliable referrer or UTM means direct, never a guessed AI source. Links Alleanza controls use `utm_source=<platform>&utm_medium=ai_assistant&utm_campaign=<campaign>`.
- **Direct AI leads** (future, not built by the website): the Alleanza Health AI / ChatGPT
  integration will create leads directly in the canonical ledger with `channel_of_entry =
  ai_assistant` and controlled fields such as `ai_platform = chatgpt` and `ai_experience =
  alleanza_health_ai`. The website never sends these fields. Canonical `ai_platform` values:
  `chatgpt`, `grok`, `gemini`, `perplexity`, `copilot`, `claude`, `other`.
- **Never in the ledger:** prompt text, conversation transcripts, model responses, health answers
  from an AI conversation, or free-text AI context. The website has no access to any of it.

These canonical-ledger fields are **validly absent** for website leads: `self_reported_source`,
`created_by_agent_id`, `assigned_agent_id`, `submitter_email`.

Attribution values come from UTM parameters or the referrer host and are re-sanitized on the server.
Values that look like an email address or contain 7 or more digits are dropped. The ledger never copies a
raw UTM; each attribution field is checked against a controlled list, and a value that fails is
simply left out of the record (the lead is never blocked, and the email still shows the raw value):

- **`*_source`:** valid only when it is
  - a **built-in** source: `google`, `bing`, `yahoo`, `duckduckgo`, `ecosia`, `baidu`, `yandex`,
    `facebook`, `instagram`, `linkedin`, `youtube`, `tiktok`, `x`, `whatsapp`, `meta`, `email`,
    `agent`, `partner`, `direct`, `(direct)`, `chatgpt`, `perplexity`, `gemini`, `grok`, `copilot`,
    `claude`; or
  - **registered** in `LEAD_LEDGER_SOURCE_IDS` (exact match, lowercased).

  Looking like a domain is not enough: `utm_source=diabetes.info` or an unregistered referrer host
  never becomes `first_source` / `last_source`. When a touch's source is not approved, the whole
  touch is untrusted: its source, medium and campaign are all omitted and only its landing page
  stays. **New partner or referral source values used for lead-level business attribution must be
  registered** in `LEAD_LEDGER_SOURCE_IDS` before launch.
- **`*_medium`:** one of `organic`, `cpc`, `ppc`, `paid_social`, `display`, `social`, `email`,
  `referral`, `qr`, `agent_link`, `ai_assistant`, `(none)`, `(not set)`. Lowercased.
- **`*_campaign`:** only an **approved campaign ID** listed in `LEAD_LEDGER_CAMPAIGN_IDS`
  (case-insensitive, stored lowercase). A pattern check cannot tell `aca_oe_2027` from `diabetes`,
  so any unregistered campaign is omitted. **Campaigns used for lead-level business attribution must
  be registered/approved** before launch. Landing pages are
paths without query strings. `utm_content`, `utm_term` and the referrer appear in the email but are
**not** sent to the ledger.

**Never sent:** the consumer's name, email, phone, message or any free text, date of birth, address,
income, health, medical or immigration information, company name or workforce size, the
`submission_id`, IP address, user agent, or GA4 client ID.

## Tests

`npm test` runs `tests/*.test.ts` with Node's built-in test runner; no extra dependencies.

| File | Covers |
|---|---|
| `tests/lead-id.test.ts` | Format, no date, uniform symbols, determinism, secret separation, retry/idempotency, concurrency |
| `tests/lead-instances.test.ts` | Separate Node processes posting over HTTP to the receiver model: a cross-instance retry gets the same ID, a different `created_at`, and `duplicate` (not `id_conflict`); a real difference is still `id_conflict`; webhook-secret rotation keeps the ID; a different ID secret changes it; without `LEAD_ID_SECRET` nothing reaches the ledger |
| `tests/lead-ledger.test.ts` | Payload allowlist and PII rejection, config (all three variables), envelope plus test vector, every receiver response, retries, logging |
| `tests/lead-routes.test.ts` | Contact, employer and health routes end to end against the receiver model: missing config, production without `LEAD_ID_SECRET`, ledger down, wrong secret, `/work`, invalid submissions |
| `tests/fake-receiver.ts` | Not a test: the model of the canonical receiver (HMAC check, duplicate rule above) used by the two files above |
