# Measurement plan — alleanzainsurance.org

Status: **code ready for review, not live.** GTM container not published, GA4 settings untouched, no custom dimensions, no advertising features. Last updated 28 Oct 2026.

## 1. Goal

Answer, without sending personal or sensitive insurance/health data to any analytics or marketing tool:

```
traffic → engagement → lead → qualified lead → agent contact → quote → enrollment
```

Eventual GA4 lead funnel (website events first, offline/CRM events later):

```
session → generate_lead → working_lead → qualify_lead → quote_start/quote_complete → agent_handoff → close_convert_lead (enrollment)
                                         ↘ disqualify_lead / close_unconvert_lead
```

## 2. Identifiers

| Item | Value | Status |
|---|---|---|
| GA4 Measurement ID | `G-GKHH8TDY77` | Configured inside GTM only (not in code) |
| GTM container | `GTM-PP5RBPJH` (account: Alleanza Insurance Corp) | Loaded by code in production after analytics consent; **not published yet** |
| Search Console | Domain property `alleanzainsurance.org`; sitemap `https://alleanzainsurance.org/sitemap.xml` accepted | Unchanged |
| Vercel Web Analytics / Speed Insights | `@vercel/analytics`, `@vercel/speed-insights` | Installed in code; must be **enabled in the Vercel project** to collect |

## 3. Architecture

```
app/layout.tsx
 ├─ <head> inline script: Consent Mode v2 defaults (all denied) — runs before anything else
 ├─ <AnalyticsRuntime googleTags={VERCEL_ENV === "production"}>
 │    ├─ initConsent()        lib/analytics/consent.ts   stored choice → gtag consent update → load GTM / Whop
 │    ├─ captureAttribution() lib/analytics/attribution.ts first/last touch (stored only with analytics consent)
 │    ├─ installClickTracking() lib/analytics/clicks.ts  tel:/WhatsApp/data-cta clicks
 │    ├─ trackPageView() on every pathname change        the ONLY page_view source
 │    └─ <ConsentBanner>
 └─ <VercelObservability>  Vercel Analytics + Speed Insights (cookieless, URLs cleaned)

lib/analytics/index.ts      the only analytics API: track* functions → window.dataLayer (allowlisted keys)
lib/analytics/useLeadFormTracking.ts  form_start / generate_lead / form_error for lead forms
lib/analytics/sanitize.ts   PII filters shared by browser and server
lib/server/attribution.ts   re-sanitizes attribution and formats the "Atribución" block of the lead email
```

Rules:

- Components never call `gtag`, `dataLayer`, Vercel custom events or `whop` directly. They call `lib/analytics` or add `data-cta` attributes.
- Nothing is pushed to `dataLayer` without analytics consent. With consent, every push carries the same fixed key set (unused keys = `undefined`) so GTM's data model never leaks a value from an earlier event.
- GTM loads only on the production deployment (`VERCEL_ENV=production`) and only after analytics consent ("basic" consent mode: no Google request at all before consent). Previews and local builds still fill `window.dataLayer` for testing but never contact Google.

## 4. Page views

Exactly one `page_view` per real route, from `trackPageView()`:

- initial load: one; client-side navigation (Next `<Link>`): one per route; back/forward: one per route change; same-path re-renders and `#hash` links: none.
- if the visitor accepts analytics mid-page, the current page is counted once at that moment.

**Required GA4/GTM settings (competing automatic page views must be off):**

1. GTM Google Tag: `send_page_view` = `false`.
2. GA4 → Admin → Data streams → web stream → Enhanced measurement → Page views → *Show advanced settings* → **uncheck "Page changes based on browser history events"**.

Without step 2, GA4 double-counts every client-side navigation.

## 5. Event taxonomy

| Event | Fires when | Params | Status |
|---|---|---|---|
| `page_view` | route change (see §4) | `page_path`, `page_location`, `page_referrer`, `language` | live |
| `cta_click` | click on a link marked `data-cta` | `cta_name`, `cta_location`, `product_line` | live |
| `form_start` | first change inside a lead form (once per filled-in form) | `form_type`, `product_line` | live |
| `generate_lead` | **only after the lead API returns success** | `form_type`, `product_line`, `source_group` | live |
| `form_error` | failed submit | `form_type`, `error_category` | live |
| `phone_click` | any `tel:` link | `cta_location` | live |
| `whatsapp_click` | any `wa.me` link | `cta_location` | live |
| `quote_start` / `quote_complete` / `agent_handoff` | — | `product_line` | defined, not wired (no quote tool / hand-off exists) |
| `qualify_lead`, `working_lead`, `disqualify_lead`, `close_convert_lead`, `close_unconvert_lead` | — | — | future, server/offline only; never from the browser |

`close_convert_lead` is reserved for a **confirmed enrollment / customer conversion**.

### Parameters (allowlist, validated at runtime)

| Param | Values |
|---|---|
| `form_type` | `contact` \| `health` |
| `product_line` | `health` \| `life` \| `employer` \| `academy` \| `work` |
| `language` | `es` \| `en` |
| `error_category` | `validation` \| `rate_limited` \| `unavailable` \| `server` \| `network` |
| `cta_name`, `cta_location`, `source_group` | `[a-z0-9_]{1,50}` (fixed values from code) |
| `page_path` | pathname only |
| `page_location` | origin + path + `utm_*` only (every other query parameter and the fragment are dropped) |
| `page_referrer` | previous page, or only the referring site's origin |

Any other key or a value that fails validation is dropped. Values containing `@` or 7+ digits are rejected everywhere.

`source_group` (on `generate_lead`) = coarse channel of the lead's last touch: `direct`, `organic`, `paid`, `social`, `email`, `referral`, `qr`, `agent`, `other`.

### Never sent to GA4, GTM, Vercel or any pixel

Name, email, phone, SSN/ITIN, date of birth, address, ZIP tied to a person, income, immigration/status details, medical information, medications, application answers, the selected state or coverage, free-text messages, validation messages, lead IDs, session IDs, timestamps as dimensions.

### CTA coverage

| Page | `cta_name` (location) |
|---|---|
| Home gallery | `home_health`, `home_life`, `home_employers`, `home_academy`, `home_work` (`home_gallery_card`, `home_gallery_cta`). P&C ("Próximamente") not tracked. Rotating/selecting cards is not tracked. |
| /health, /en/health | `health_header_compare`, `health_hero_compare`, `health_compare_options`, `health_talk_advisor`, `health_path_explore`, `health_path_advisor`, `health_factor_compare`, `health_compare_advisor` + form, phone, WhatsApp |
| /contacto | form, phone, WhatsApp, `header_cta` |
| /life | `life_talk_advisor`, `header_cta`, form |
| /employers | `employers_explore_benefits`, `header_cta`, form (`form_type=contact`, `product_line=employer`) |
| /work | `header_cta`, form (`product_line=work`) |
| Agent pages | `agent_request_guidance` |
| Everywhere | `phone_click` / `whatsapp_click` with location `header`, `footer`, `section_<id>` or an explicit `data-cta-location` |

To track a new CTA: add `data-cta="<snake_case_name>"` (and `data-product-line` when relevant) to the `<a>`. No code changes.

## 6. Key events (GA4)

| Type | Events |
|---|---|
| Primary | `generate_lead`; later `close_convert_lead` |
| Micro-conversion | `whatsapp_click`, `phone_click`; later `quote_start`, `quote_complete`, `agent_handoff` |
| Not key events | `page_view`, `cta_click`, `form_start`, `form_error` |

Mark these in GA4 only after the container is published and data is verified.

## 7. Attribution (first-party)

- Each page load is classified: `utm_*` present → that campaign; external referrer → search engine (`organic`), social network (`social`) or other site (`referral`); otherwise direct/internal.
- **With analytics consent:** stored in `localStorage["alleanza-attribution"]` — first touch (kept) and last non-direct touch (refreshed), each with source, medium, campaign, content, term, landing page. Expires **90 days** after the first touch. No PII; values with `@` or long digit runs are discarded.
- **Without analytics consent:** nothing is stored. The lead request still carries this page load's own touch (UTMs / referrer host) in memory only; first touch is reported as unavailable.
- Withdrawing analytics consent deletes the stored attribution and `_ga` cookies.
- Lead requests send `attribution` to `/api/contacto` and `/api/health/contact`. The server re-sanitizes and length-limits every field and adds to the **internal email only**:

```
Atribución (uso interno)
- Primera fuente / medio / campaña / [contenido] / [término] / página de llegada
- Última fuente / medio / campaña / [contenido] / [término] / página de llegada
- Referente (host only)
```

It is never returned to the browser, shown publicly, or sent to GA4.

## 8. UTM naming convention

All lowercase, `snake_case`, no spaces, no personal data, no long numbers (they are rejected as possible phone/ID numbers).

| Parameter | Allowed values |
|---|---|
| `utm_source` | `google`, `meta`, `instagram`, `youtube`, `email`, `agent`, `partner`, `direct` |
| `utm_medium` | `organic`, `cpc`, `paid_social`, `social`, `email`, `referral`, `qr`, `agent_link` |
| `utm_campaign` | `<period>_<market>_<line>` e.g. `oe2027_texas_aca`, `oe2027_florida_aca` |
| `utm_content` | creative/placement, e.g. `reel_family_v1` |
| `utm_term` | paid keyword theme only, never a person's name |

Agent links: `utm_source=agent&utm_medium=agent_link&utm_campaign=<campaign>`; never put the agent's NPN or phone in a UTM. Do not invent campaign values in production until a campaign is approved.

## 9. Consent (Google Consent Mode v2)

Defaults, set inline in `<head>` before anything else:

| Signal | Default | After "Analytics" | After "Marketing" |
|---|---|---|---|
| `analytics_storage` | denied | granted | — |
| `ad_storage` | denied | denied | denied (phase 1) |
| `ad_user_data` | denied | denied | denied (phase 1) |
| `ad_personalization` | denied | denied | denied (phase 1) |

Also set: `ads_data_redaction=true`, `url_passthrough=false`, `allow_google_signals=false`, `allow_ad_personalization_signals=false`.

Banner: *Rechazar* / *Elegir* (Analítica, Marketing) / *Aceptar todo*. Choice stored in `localStorage["alleanza-consent"]` (`v: 2`). The old single-checkbox key is discarded, so returning visitors are asked again (the scope now includes Google Analytics). Reopen from /privacidad → "Cambiar mis preferencias de medición".

- Analytics → GTM + GA4, first-party attribution storage.
- Marketing → Whop pixel (see §10). Future advertising tags would also require marketing consent **and** a new decision to grant `ad_*` signals.
- Phase 1 exclusions: no Google Signals, remarketing, personalized ads, enhanced conversions with visitor PII, or session replay.

## 10. Whop pixel audit (28 Oct 2026)

Verified on production with fake data and all Whop requests blocked.

| Question | Before this change | After this change |
|---|---|---|
| Where it loads | `t.whop.tw/s.js`, injected by the consent component after "Aceptar" | Same script, now loaded by `lib/analytics/consent.ts` on **marketing** consent |
| Routes | Every route, including `/health`, `/en/health`, `/contacto`; tracks SPA navigations itself (patches `history`) and page "leave" with time on page | Unchanged |
| Data per event | Full page URL **including query string**, referrer, title, user agent, screen size, language, timezone, anonymous id cookie (`_wuid`), reads `_fbp`/`_fbc`/`_ga`/`_ttp` cookies; loads `fingerprint.js` and `sc.js` | Unchanged |
| Form fields | **Sends name, email and phone to Whop as the visitor types them** in any form (on `change`, before submit) as `identify` events | **Off** (`forms: false`) — verified no `identify` and no typed values |
| URL identity | **Sends email/phone/name found in URL parameters** (`?email=` etc.) as `identify` | **Off** (`urlIdentity: false`) |

**Flagged for management review:**

1. The form-capture leak is live on the current production site for visitors who clicked "Aceptar". This PR stops it; consider shipping that part promptly.
2. Whop still receives every page URL with its full query string, the fact that a visitor viewed `/health`, a device fingerprint, and, once GA4 runs, the `_ga` client id. Decide whether Whop should run on health routes at all, and whether it is needed.
3. Classification: treated as **marketing** (it performs identity resolution and conversion tracking). Confirm.

## 11. Vercel Web Analytics / Speed Insights

Use for traffic sanity checks, Core Web Vitals and runtime performance — not as the business source of truth (no custom events). Both are cookieless; reported URLs keep only `utm_*` parameters. They load on every visit, independent of the consent banner. Their scripts are already served on Vercel deployments (verified on the PR preview). **Confirm both are enabled in the Vercel project (Analytics and Speed Insights tabs)** so that data is collected and reported. Locally the scripts are not served, which is expected.

## 12. Search Console ↔ GA4

Link the existing Search Console **Domain** property `alleanzainsurance.org` to the GA4 web stream for `G-GKHH8TDY77` (GA4 Admin → Product links → Search Console links) once the account has the needed permissions on both. Do not create a new Search Console property. No DNS change is required.

## 13. GTM configuration to create after merge (then Preview, then publish)

**Container settings:** enable *Consent Overview* (Admin → Container settings → Additional settings → Enable consent overview).

**Consent Initialization:** no CMP tag is needed. Consent defaults are set in code before GTM loads (equivalent, correctly ordered). Do **not** add a second consent-default tag.

**Variables (Data Layer Variable, version 2):** `page_path`, `page_location`, `page_referrer`, `language`, `form_type`, `cta_name`, `cta_location`, `product_line`, `source_group`, `error_category`.

**Triggers (Custom Event, exact match):** `page_view`, `cta_click`, `form_start`, `generate_lead`, `form_error`, `phone_click`, `whatsapp_click`.

**Tags:**

| Tag | Type | Settings | Trigger |
|---|---|---|---|
| Google Tag – GA4 | Google Tag, ID `G-GKHH8TDY77` | Config params: `send_page_view=false`, `allow_google_signals=false`, `allow_ad_personalization_signals=false`; Consent: require `analytics_storage` | Initialization – All Pages |
| GA4 – page_view | GA4 Event `page_view` | params `page_location`, `page_referrer`, `page_path`, `language` | CE `page_view` |
| GA4 – cta_click | GA4 Event | `cta_name`, `cta_location`, `product_line`, `language` | CE `cta_click` |
| GA4 – form_start | GA4 Event | `form_type`, `product_line`, `language` | CE `form_start` |
| GA4 – generate_lead | GA4 Event | `form_type`, `product_line`, `source_group`, `language` | CE `generate_lead` |
| GA4 – form_error | GA4 Event | `form_type`, `error_category`, `language` | CE `form_error` |
| GA4 – phone_click | GA4 Event | `cta_location`, `language` | CE `phone_click` |
| GA4 – whatsapp_click | GA4 Event | `cta_location`, `language` | CE `whatsapp_click` |

Every GA4 Event tag: Measurement ID `G-GKHH8TDY77`, *Additional consent checks → Require `analytics_storage`*, and also send `page_location` = `{{DLV page_location}}` so GA4 never uses the raw URL.

No advertising tags (Google Ads, Floodlight, Meta, conversion linker) in this phase.

**GA4 settings (outside GTM, at go-live):** turn off history-based page views (§4); keep Google Signals off; data retention per policy. Optional later: register `form_type`, `product_line`, `cta_name`, `cta_location`, `source_group`, `error_category` as event-scoped custom dimensions. All are low-cardinality. Never register page_location variants, IDs or timestamps.

**Verify in GTM Preview before publishing:** one `page_view` per route, `generate_lead` only after a successful submit, no tag fires before consent, Consent tab shows `ad_*` denied.

## 14. Future: offline ACA enrollment measurement

Enrollment happens off-site (HealthSherpa / carrier), so it can only be measured server-side:

1. Keep a lead reference **in the CRM/agency system only** (never in GA4).
2. As the agent works the lead, record `working_lead` → `qualify_lead` / `disqualify_lead` → `close_convert_lead` (confirmed enrollment) / `close_unconvert_lead`.
3. Send these to GA4 via the Measurement Protocol (server) or a GA4 data import, joined on the GA4 `client_id` captured with consent at lead time. This requires a separate privacy review: consent wording for linking, no health or plan details in parameters, and only aggregate value.
4. Mark `close_convert_lead` as a primary key event at that point.

## 15. Testing

For the PR, the end-to-end checks ran with Playwright against a local production build (`VERCEL_ENV=production`), with Resend replaced by a local recorder and Google/Whop requests aborted. Covered: consent defaults, banner, reject/accept/choose, withdrawal, one page_view per route (initial, Link, back, forward, hash), CTA/phone/WhatsApp events, gallery rotation not tracked, form_start once, form_error categories, exactly one generate_lead after success (double-click and retry), dataLayer key allowlist, no PII-like values, attribution stored/not stored by consent, attribution in both lead emails, employer form, and Whop with form capture off.
