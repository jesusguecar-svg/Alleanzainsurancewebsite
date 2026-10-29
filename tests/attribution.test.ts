import assert from "node:assert/strict";
import { test } from "node:test";
import { sanitizeLeadAttribution, sourceGroup, touchFrom } from "@/lib/analytics/attribution";

const site = "https://alleanzainsurance.org";

test("ChatGPT UTM links Alleanza controls keep platform, medium and campaign", () => {
  assert.deepEqual(touchFrom(`${site}/health?utm_source=chatgpt&utm_medium=ai_assistant&utm_campaign=aca_oe_2027`, ""), {
    source: "chatgpt", medium: "ai_assistant", campaign: "aca_oe_2027", content: undefined, term: undefined, landing_page: "/health",
  });
});

test("generic utm_medium=ai_assistant works for any platform and campaign", () => {
  for (const platform of ["perplexity", "gemini", "grok", "copilot", "claude", "some_new_ai"]) {
    const touch = touchFrom(`${site}/?utm_source=${platform}&utm_medium=ai_assistant&utm_campaign=spring_test`, "");
    assert.equal(touch?.source, platform);
    assert.equal(touch?.medium, "ai_assistant");
    assert.equal(touch?.campaign, "spring_test");
  }
});

test("ChatGPT's own utm_source=chatgpt.com is normalized; an explicit medium is kept", () => {
  const auto = touchFrom(`${site}/health?utm_source=chatgpt.com`, "https://chatgpt.com/");
  assert.deepEqual([auto?.source, auto?.medium], ["chatgpt", "ai_assistant"]);
  const tagged = touchFrom(`${site}/?utm_source=ChatGPT&utm_medium=referral`, "");
  assert.deepEqual([tagged?.source, tagged?.medium], ["chatgpt", "referral"]);
  // Unrelated sources are not touched.
  assert.deepEqual(touchFrom(`${site}/?utm_source=meta&utm_medium=paid_social`, "")?.source, "meta");
  assert.equal(touchFrom(`${site}/?utm_source=newsletter`, "")?.medium, "(not set)");
});

test("known AI referrer hosts normalize to stable sources with medium ai_assistant", () => {
  const cases: Record<string, string> = {
    "https://chatgpt.com/": "chatgpt",
    "https://chat.openai.com/": "chatgpt",
    "https://www.perplexity.ai/": "perplexity",
    "https://gemini.google.com/": "gemini",
    "https://grok.com/": "grok",
    "https://copilot.microsoft.com/": "copilot",
    "https://m365.copilot.cloud.microsoft/": "copilot",
    "https://claude.ai/": "claude",
  };
  for (const [referrer, source] of Object.entries(cases)) {
    const touch = touchFrom(`${site}/health`, referrer);
    assert.deepEqual(touch, { source, medium: "ai_assistant", landing_page: "/health" }, referrer);
  }
});

test("generic openai.com is a normal referral, not ChatGPT, unless a UTM says otherwise", () => {
  for (const referrer of ["https://openai.com/", "https://platform.openai.com/", "https://help.openai.com/"]) {
    const host = new URL(referrer).hostname;
    assert.deepEqual(touchFrom(`${site}/health`, referrer), { source: host, medium: "referral", landing_page: "/health" }, referrer);
  }
  const tagged = touchFrom(`${site}/health?utm_source=chatgpt&utm_medium=ai_assistant&utm_campaign=aca_oe_2027`, "https://openai.com/");
  assert.deepEqual([tagged?.source, tagged?.medium], ["chatgpt", "ai_assistant"]);
});

test("search engines, social networks and other sites are not mistaken for AI", () => {
  assert.deepEqual(touchFrom(`${site}/`, "https://www.google.com/"), { source: "google", medium: "organic", landing_page: "/" });
  assert.deepEqual(touchFrom(`${site}/`, "https://www.bing.com/"), { source: "bing", medium: "organic", landing_page: "/" });
  assert.deepEqual(touchFrom(`${site}/`, "https://x.com/"), { source: "x", medium: "social", landing_page: "/" });
  assert.deepEqual(touchFrom(`${site}/`, "https://notchatgpt.com/"), { source: "notchatgpt.com", medium: "referral", landing_page: "/" });
  assert.deepEqual(touchFrom(`${site}/`, "https://chatgpt.com.evil.example/"), { source: "chatgpt.com.evil.example", medium: "referral", landing_page: "/" });
});

test("sourceGroup (internal helper) returns ai_assistant for the AI medium; values stay low-cardinality tokens", () => {
  assert.equal(sourceGroup({ source: "chatgpt", medium: "ai_assistant" }), "ai_assistant");
  assert.equal(sourceGroup(touchFrom(`${site}/`, "https://claude.ai/")!), "ai_assistant");
  assert.equal(sourceGroup({ source: "google", medium: "organic" }), "organic");
  assert.equal(sourceGroup({ source: "meta", medium: "paid_social" }), "paid");
  assert.equal(sourceGroup({ source: "x", medium: "weird" }), "other");
  const documented = ["direct", "organic", "paid", "social", "email", "referral", "qr", "agent", "ai_assistant", "other"];
  for (const medium of ["(none)", "cpc", "social", "email", "referral", "qr", "agent_link", "ai_assistant", "anything"]) {
    const group = sourceGroup({ source: "s", medium });
    assert.ok(documented.includes(group), group);
    assert.match(group, /^[a-z0-9_]{1,50}$/); // the dataLayer token rule, unchanged
  }
});

test("no referrer, or a same-site referrer, is not classified as AI (stays direct/unknown)", () => {
  assert.equal(touchFrom(`${site}/health`, ""), null);
  assert.equal(touchFrom(`${site}/health`, `${site}/`), null);
  assert.equal(sourceGroup(undefined), "direct");
});

test("only the host is used: referrer paths and queries (e.g. a shared conversation URL) are dropped", () => {
  const touch = touchFrom(`${site}/health`, "https://chatgpt.com/share/abc123?prompt=I+have+diabetes");
  assert.deepEqual(touch, { source: "chatgpt", medium: "ai_assistant", landing_page: "/health" });
  assert.equal(sanitizeLeadAttribution({ consent: "denied", referrer: "https://chatgpt.com/c/123?q=my+medications" })?.referrer, "chatgpt.com");
});
