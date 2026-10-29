import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { afterEach, test } from "node:test";
import { ledgerCampaignIds, ledgerConfig, ledgerSourceIds, ledgerEnvelope, ledgerLeadRecord, sendToLedger, type LedgerLeadRecord } from "@/lib/server/lead-ledger";

process.env.LEAD_LEDGER_CAMPAIGN_IDS = "aca_2027, employer_q4,ACA_OE_2027";

const lead = { id: "LD-A7K4P-9Q2RM", createdAt: "2026-11-01T15:00:00.000Z" };
const config = { endpoint: "https://script.google.com/macros/s/test/exec", webhookSecret: "test-webhook-secret" };

/** Every key the ledger may ever receive. */
const allowedKeys = new Set([
  "schema_version", "lead_id", "created_at", "channel_of_entry", "form_type", "product_line", "state", "language",
  "first_source", "first_medium", "first_campaign", "first_landing_page",
  "last_source", "last_medium", "last_campaign", "last_landing_page",
]);

const granted = {
  consent: "granted",
  first: { source: "meta", medium: "paid_social", campaign: "aca_2027", content: "video_a", term: "seguro medico", landing_page: "/" },
  last: { source: "google", medium: "organic", landing_page: "/health" },
  referrer: "www.google.com",
};

test("the record holds only allowlisted, non-PII fields", () => {
  const record = ledgerLeadRecord({ lead, formType: "health", productLine: "health", stateFips: "48", language: "es", attribution: granted });
  assert.deepEqual(record, {
    schema_version: 1,
    lead_id: "LD-A7K4P-9Q2RM",
    created_at: "2026-11-01T15:00:00.000Z",
    channel_of_entry: "web_form",
    form_type: "health",
    product_line: "health",
    state: "TX",
    language: "es",
    first_source: "meta",
    first_medium: "paid_social",
    first_campaign: "aca_2027",
    first_landing_page: "/",
    last_source: "google",
    last_medium: "organic",
    last_landing_page: "/health",
  });
  for (const key of Object.keys(record)) assert.ok(allowedKeys.has(key), key);
});

test("PII smuggled into attribution or extra fields never reaches the record", () => {
  const record = ledgerLeadRecord({
    lead,
    formType: "contact",
    productLine: "maria@example.com",
    language: "en",
    attribution: {
      consent: "granted",
      name: "Maria Lopez",
      email: "maria@example.com",
      first: { source: "maria@example.com", medium: "email", campaign: "call 214-555-0199", landing_page: "/contacto?email=maria@example.com", name: "Maria" },
      last: { source: "email", medium: "email", campaign: "ssn 123-45-6789", landing_page: "/health/1234567890" },
      phone: "2145550199",
    },
  });
  const json = JSON.stringify(record);
  for (const pii of ["maria", "Maria", "@", "555", "0199", "6789", "1234567890", "Lopez"]) assert.ok(!json.includes(pii), `${pii} leaked: ${json}`);
  for (const key of Object.keys(record)) assert.ok(allowedKeys.has(key), key);
  assert.equal(record.product_line, undefined);
  // The first touch had no valid source, so it is dropped as a whole.
  assert.equal(record.first_medium, undefined);
  assert.equal(record.last_source, "email");
  assert.equal(record.last_campaign, undefined);
  assert.equal(record.last_landing_page, undefined);
});

test("AI acquisition reaches the ledger as attribution; the channel stays web_form", () => {
  const record = ledgerLeadRecord({
    lead,
    formType: "health",
    productLine: "health",
    language: "es",
    attribution: {
      consent: "granted",
      first: { source: "chatgpt", medium: "ai_assistant", campaign: "aca_oe_2027", landing_page: "/health" },
      last: { source: "perplexity", medium: "ai_assistant", landing_page: "/health" },
    },
  });
  assert.equal(record.channel_of_entry, "web_form");
  assert.deepEqual(
    [record.first_source, record.first_medium, record.first_campaign, record.last_source, record.last_medium],
    ["chatgpt", "ai_assistant", "aca_oe_2027", "perplexity", "ai_assistant"],
  );
  for (const key of Object.keys(record)) assert.ok(allowedKeys.has(key), key);
  // The website never sends the direct-AI fields.
  assert.equal("ai_platform" in record || "ai_experience" in record, false);
});

test("AI prompt, conversation or free-text fields can never enter the record", () => {
  const record = ledgerLeadRecord({
    lead,
    formType: "health",
    language: "en",
    channel_of_entry: "ai_assistant",
    ai_platform: "chatgpt",
    ai_experience: "alleanza_health_ai",
    prompt: "I have diabetes and need insulin coverage",
    transcript: [{ role: "user", content: "my income is 30000" }],
    attribution: {
      consent: "granted",
      prompt: "find me cheap insurance",
      conversation: "user: I take metformin",
      model_response: "Here are plans…",
      first: { source: "chatgpt", medium: "ai_assistant", landing_page: "/health", prompt: "diabetes", context: "metformin" },
      last: { source: "chatgpt", medium: "ai_assistant", campaign: "I take metformin for diabetes daily", landing_page: "/health" },
    },
  } as Parameters<typeof ledgerLeadRecord>[0]);
  const json = JSON.stringify(record);
  for (const leak of ["diabetes", "insulin", "income", "metformin", "cheap", "Here are", "prompt", "transcript", "conversation", "alleanza_health_ai"]) {
    assert.ok(!json.includes(leak), `${leak} leaked: ${json}`);
  }
  for (const key of Object.keys(record)) assert.ok(allowedKeys.has(key), key);
  assert.equal(record.channel_of_entry, "web_form");
  assert.equal(record.last_source, "chatgpt");
  // A sentence in a UTM is not a token: dropped from the ledger.
  assert.equal(record.last_campaign, undefined);
});

test("campaigns enter the ledger only when they are approved campaign IDs", () => {
  const withCampaign = (campaign: string) =>
    ledgerLeadRecord({ lead, formType: "health", language: "es", attribution: { consent: "denied", last: { source: "chatgpt", medium: "ai_assistant", campaign, landing_page: "/health" } } });
  assert.deepEqual(ledgerCampaignIds({ LEAD_LEDGER_CAMPAIGN_IDS: " aca_oe_2027,OE2027_Texas_ACA,, bad id ,x@y" }), new Set(["aca_oe_2027", "oe2027_texas_aca"]));
  assert.deepEqual(ledgerCampaignIds({}), new Set());
  // Approved (case-insensitive; stored as the canonical lowercase ID).
  assert.equal(withCampaign("aca_oe_2027").last_campaign, "aca_oe_2027");
  assert.equal(withCampaign("ACA_OE_2027").last_campaign, "aca_oe_2027");
  // Unknown campaigns, including sensitive single tokens, are left out; the rest of the record stays.
  for (const campaign of ["diabetes", "insulin", "metformin", "aca_oe_2028", "spring_test"]) {
    const record = withCampaign(campaign);
    assert.equal(record.last_campaign, undefined, campaign);
    assert.equal(record.last_source, "chatgpt");
    assert.equal(record.lead_id, lead.id);
  }
  // No approved list configured: no campaign reaches the ledger at all.
  const saved = process.env.LEAD_LEDGER_CAMPAIGN_IDS;
  delete process.env.LEAD_LEDGER_CAMPAIGN_IDS;
  try {
    assert.equal(withCampaign("aca_oe_2027").last_campaign, undefined);
  } finally {
    process.env.LEAD_LEDGER_CAMPAIGN_IDS = saved;
  }
});

test("source and medium are controlled: arbitrary UTM words never enter the ledger", () => {
  const touch = (source: string, medium: string) =>
    ledgerLeadRecord({ lead, formType: "contact", language: "es", attribution: { consent: "denied", last: { source, medium, landing_page: "/" } } });
  assert.deepEqual([touch("ChatGPT", "AI_Assistant").last_source, touch("ChatGPT", "AI_Assistant").last_medium], ["chatgpt", "ai_assistant"]);
  const builtIn = ["google", "bing", "yahoo", "duckduckgo", "facebook", "instagram", "linkedin", "youtube", "tiktok", "x", "whatsapp",
    "meta", "email", "agent", "partner", "direct", "(direct)", "chatgpt", "perplexity", "gemini", "grok", "copilot", "claude"];
  for (const source of builtIn) assert.equal(touch(source, "referral").last_source, source);
  for (const bad of ["diabetes", "insulin", "my_prompt", "newsletter", "localhost", "a.b"]) assert.equal(touch(bad, "referral").last_source, undefined, bad);
  for (const bad of ["diabetes", "insulin", "prompt", "chatgpt"]) assert.equal(touch("google", bad).last_medium, undefined, bad);
});

test("a host name is not a source unless registered in LEAD_LEDGER_SOURCE_IDS", () => {
  const record = (last: Record<string, string>) =>
    ledgerLeadRecord({ lead, formType: "health", language: "es", attribution: { consent: "denied", last: { landing_page: "/health", ...last } } });
  const saved = process.env.LEAD_LEDGER_SOURCE_IDS;
  try {
    delete process.env.LEAD_LEDGER_SOURCE_IDS;
    for (const source of ["diabetes.info", "www.example.org", "openai.com", "healthsherpa", "my_prompt"]) {
      const r = record({ source, medium: "referral", campaign: "aca_oe_2027" });
      // Untrusted touch: no source, and its medium and campaign are not kept either. Landing page stays.
      assert.deepEqual([r.last_source, r.last_medium, r.last_campaign, r.last_landing_page], [undefined, undefined, undefined, "/health"], source);
      assert.ok(!JSON.stringify(r).includes(source));
    }
    process.env.LEAD_LEDGER_SOURCE_IDS = " HealthSherpa,partner_xyz, examplepartner.com ,bad value,x@y.com,";
    assert.deepEqual(ledgerSourceIds(), new Set(["healthsherpa", "partner_xyz", "examplepartner.com"]));
    for (const source of ["healthsherpa", "partner_xyz", "examplepartner.com", "ExamplePartner.com"]) {
      const r = record({ source, medium: "referral", campaign: "aca_oe_2027" });
      assert.deepEqual([r.last_source, r.last_medium, r.last_campaign], [source.toLowerCase(), "referral", "aca_oe_2027"], source);
    }
    // Registering one host does not open up others.
    assert.equal(record({ source: "diabetes.info", medium: "referral" }).last_source, undefined);
    assert.equal(record({ source: "evil.examplepartner.com", medium: "referral" }).last_source, undefined);
  } finally {
    if (saved === undefined) delete process.env.LEAD_LEDGER_SOURCE_IDS;
    else process.env.LEAD_LEDGER_SOURCE_IDS = saved;
  }
});

test("without analytics consent there is no first touch, only this visit's", () => {
  const record = ledgerLeadRecord({
    lead,
    formType: "contact",
    productLine: "employer",
    language: "en",
    attribution: { consent: "denied", first: granted.first, last: { source: "linkedin", medium: "paid_social", campaign: "employer_q4", landing_page: "/employers" } },
  });
  assert.equal(record.first_source, undefined);
  assert.equal(record.first_landing_page, undefined);
  assert.deepEqual(
    [record.product_line, record.last_source, record.last_medium, record.last_campaign, record.last_landing_page],
    ["employer", "linkedin", "paid_social", "employer_q4", "/employers"],
  );
});

test("missing or broken attribution still produces a valid record", () => {
  for (const attribution of [undefined, null, "x", [], { consent: "granted", first: 5 }]) {
    const record = ledgerLeadRecord({ lead, formType: "contact", language: "es", attribution });
    assert.deepEqual(Object.keys(record), ["schema_version", "lead_id", "created_at", "channel_of_entry", "form_type", "language"]);
  }
});

test("the ledger is off unless all three env variables are set", () => {
  const endpoint = config.endpoint;
  const idSecret = { LEAD_ID_SECRET: "test-lead-id-secret" };
  assert.equal(ledgerConfig({}), undefined);
  assert.equal(ledgerConfig({ LEAD_LEDGER_ENDPOINT: endpoint }), undefined);
  assert.equal(ledgerConfig({ LEAD_LEDGER_WEBHOOK_SECRET: "s" }), undefined);
  // The retired token variable does not enable anything.
  assert.equal(ledgerConfig({ ...idSecret, LEAD_LEDGER_ENDPOINT: endpoint, LEAD_LEDGER_TOKEN: "t" }), undefined);
  assert.equal(ledgerConfig({ ...idSecret, LEAD_LEDGER_ENDPOINT: "http://ledger.example.test/leads", LEAD_LEDGER_WEBHOOK_SECRET: "s" }), undefined);
  assert.equal(ledgerConfig({ ...idSecret, LEAD_LEDGER_ENDPOINT: "not a url", LEAD_LEDGER_WEBHOOK_SECRET: "s" }), undefined);
  assert.deepEqual(ledgerConfig({ ...idSecret, LEAD_LEDGER_ENDPOINT: endpoint, LEAD_LEDGER_WEBHOOK_SECRET: config.webhookSecret }), config);
  // Without LEAD_ID_SECRET, IDs would be random per instance: nothing is sent to the ledger.
  assert.equal(ledgerConfig({ LEAD_LEDGER_ENDPOINT: endpoint, LEAD_LEDGER_WEBHOOK_SECRET: config.webhookSecret }), undefined);
  assert.equal(ledgerConfig({ LEAD_ID_SECRET: " ", LEAD_LEDGER_ENDPOINT: endpoint, LEAD_LEDGER_WEBHOOK_SECRET: config.webhookSecret }), undefined);
  assert.ok(ledgerConfig({ ...idSecret, LEAD_LEDGER_ENDPOINT: "http://127.0.0.1:3200/leads", LEAD_LEDGER_WEBHOOK_SECRET: "s" }));
});

// --- Signed envelope -----------------------------------------------------------------------

const record: LedgerLeadRecord = ledgerLeadRecord({ lead, formType: "contact", language: "es", attribution: granted });

test("envelope: version 1, base64url payload of the record's UTF-8 JSON, HMAC over the exact payload string", () => {
  const envelope = ledgerEnvelope(record, config.webhookSecret);
  assert.deepEqual(Object.keys(envelope), ["version", "payload", "signature"]);
  assert.equal(envelope.version, 1);
  assert.match(envelope.payload, /^[A-Za-z0-9_-]+$/);
  assert.match(envelope.signature, /^[A-Za-z0-9_-]{43}$/);
  assert.deepEqual(JSON.parse(Buffer.from(envelope.payload, "base64url").toString("utf8")), record);
  assert.equal(envelope.signature, createHmac("sha256", config.webhookSecret).update(envelope.payload, "utf8").digest("base64url"));
  assert.ok(!JSON.stringify(envelope).includes(config.webhookSecret));
});

test("envelope: non-ASCII values survive UTF-8 encoding", () => {
  const withAccent = { ...record, last_campaign: "inscripción_otoño" };
  const envelope = ledgerEnvelope(withAccent, config.webhookSecret);
  assert.equal(JSON.parse(Buffer.from(envelope.payload, "base64url").toString("utf8")).last_campaign, "inscripción_otoño");
});

test("envelope: published test vector (docs/measurement/lead-ledger.md)", () => {
  const vector = ledgerEnvelope(
    { schema_version: 1, lead_id: "LD-A7K4P-9Q2RM", created_at: "2026-11-01T15:00:00.000Z", channel_of_entry: "web_form", form_type: "health", product_line: "health", state: "TX", language: "es", last_source: "google", last_medium: "organic", last_landing_page: "/health" },
    "example-webhook-secret",
  );
  assert.equal(vector.payload, "eyJzY2hlbWFfdmVyc2lvbiI6MSwibGVhZF9pZCI6IkxELUE3SzRQLTlRMlJNIiwiY3JlYXRlZF9hdCI6IjIwMjYtMTEtMDFUMTU6MDA6MDAuMDAwWiIsImNoYW5uZWxfb2ZfZW50cnkiOiJ3ZWJfZm9ybSIsImZvcm1fdHlwZSI6ImhlYWx0aCIsInByb2R1Y3RfbGluZSI6ImhlYWx0aCIsInN0YXRlIjoiVFgiLCJsYW5ndWFnZSI6ImVzIiwibGFzdF9zb3VyY2UiOiJnb29nbGUiLCJsYXN0X21lZGl1bSI6Im9yZ2FuaWMiLCJsYXN0X2xhbmRpbmdfcGFnZSI6Ii9oZWFsdGgifQ");
  assert.equal(vector.signature, "XylcWyGC2rhzx9snAh-t_jmDQWIj7lp66GlsKoFT150");
});

// --- Receiver responses --------------------------------------------------------------------

type Call = { url: string; init: RequestInit };
const errors: string[] = [];
const originalError = console.error;
console.error = (...args: unknown[]) => void errors.push(args.join(" "));
afterEach(() => void (errors.length = 0));
process.on("exit", () => (console.error = originalError));

type Reply = { status?: number; body: unknown } | "network" | "timeout";
const created = { body: { ok: true, result: "created", lead_id: lead.id } };
const duplicate = { body: { ok: true, result: "duplicate", lead_id: lead.id } };
const conflict = { body: { ok: false, code: "id_conflict", lead_id: lead.id } };
const unauthorized = { body: { ok: false, code: "unauthorized" } };

function fakeFetch(replies: Reply[]) {
  const calls: Call[] = [];
  const fetchImpl = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    const reply = replies[Math.min(calls.length - 1, replies.length - 1)];
    if (reply === "network") throw new TypeError("fetch failed");
    if (reply === "timeout") throw new DOMException("The operation timed out.", "TimeoutError");
    const text = typeof reply.body === "string" ? reply.body : JSON.stringify(reply.body);
    return new Response(text, { status: reply.status ?? 200 });
  }) as unknown as typeof fetch;
  return { calls, fetchImpl };
}

const fast = { retryDelaysMs: [1, 1] };
const send = (replies: Reply[]) => {
  const fake = fakeFetch(replies);
  return sendToLedger(record, config, { ...fast, fetchImpl: fake.fetchImpl }).then((result) => ({ result, calls: fake.calls }));
};

test("posts only the signed envelope: Content-Type is the only header, no secret", async () => {
  const { result, calls } = await send([created]);
  assert.equal(result, "created");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, config.endpoint);
  assert.equal(calls[0].init.method, "POST");
  assert.deepEqual(calls[0].init.headers, { "Content-Type": "application/json" });
  assert.deepEqual(JSON.parse(calls[0].init.body as string), ledgerEnvelope(record, config.webhookSecret));
  assert.ok(!(calls[0].init.body as string).includes(config.webhookSecret));
});

test("created and duplicate both count as delivered, without retries", async () => {
  assert.deepEqual((await send([duplicate])).result, "duplicate");
  assert.equal((await send([duplicate])).calls.length, 1);
  assert.equal(errors.length, 0);
});

test("the JSON body is authoritative over the HTTP status", async () => {
  assert.equal((await send([{ status: 500, body: created.body }])).result, "created");
  const { result, calls } = await send([{ status: 200, body: { ok: false, code: "something_else" } }, created]);
  assert.equal(result, "created");
  assert.equal(calls.length, 2);
});

test("id_conflict is final and logged with only the lead ID and the code", async () => {
  const { result, calls } = await send([conflict]);
  assert.equal(result, "id_conflict");
  assert.equal(calls.length, 1);
  assert.deepEqual(errors, ["Lead ledger: id_conflict for LD-A7K4P-9Q2RM."]);
});

test("unauthorized (receiver rejected the HMAC) is final and logged without the secret", async () => {
  const { result, calls } = await send([unauthorized]);
  assert.equal(result, "unauthorized");
  assert.equal(calls.length, 1);
  assert.equal(errors.length, 1);
  assert.ok(errors[0].includes("unauthorized") && !errors[0].includes(config.webhookSecret));
});

test("a receipt for a different lead_id is not accepted", async () => {
  const { result, calls } = await send([{ body: { ok: true, result: "created", lead_id: "LD-ZZZZZ-ZZZZZ" } }]);
  assert.equal(result, "failed");
  assert.equal(calls.length, 3);
});

test("network failures, timeouts and invalid responses are retried with the identical body", async () => {
  const { result, calls } = await send(["network", "timeout", { body: "<html>Apps Script error</html>" }, created]);
  assert.equal(result, "failed"); // three attempts in total
  assert.equal(calls.length, 3);
  assert.equal(new Set(calls.map((c) => c.init.body)).size, 1);
  const recovered = await send(["network", { body: "not json" }, duplicate]);
  assert.equal(recovered.result, "duplicate");
});

test("ledger unavailable: gives up quietly, logs only the lead ID and a generic code", async () => {
  const { result, calls } = await send(["network"]);
  assert.equal(result, "failed");
  assert.equal(calls.length, 3);
  assert.deepEqual(errors, ["Lead ledger did not record LD-A7K4P-9Q2RM (network_error); the lead email was sent."]);
  errors.length = 0;
  await send([{ status: 503, body: "Service Unavailable" }]);
  assert.deepEqual(errors, ["Lead ledger did not record LD-A7K4P-9Q2RM (invalid_response, status 503); the lead email was sent."]);
});
