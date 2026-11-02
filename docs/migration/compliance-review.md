# Claims review before the alleanzainsurance.org cutover

First reviewed 2026-10-27 on branch `migration/alleanzainsurance-org-prep`. Updated 2026-10-28
with management's decisions on the priority items, then with management's final decisions on the
remaining P1 items (#5, #11, #19). **All P1 items are now resolved;** only P2 items remain open.

Status: **RESOLVED** = decided by management and applied in code. **PARTIAL** = the decision was
applied, but a related question remains. **OPEN** = still needs a decision, with a source, from
management or compliance. Do not replace any open item with invented wording; once a fact is
verified, record it (value and source) in `lib/config/company.ts` or the file listed.

Priority: **P1** = resolve before cutover, **P2** = resolve soon after.

## Management decisions of 2026-10-28

| Topic | Decision | Applied in |
|---|---|---|
| National coverage | Keep nationwide positioning. Alleanza has a network of agents covering all 50 states, but product availability depends on state, licensing and eligibility. Approved wording: "Red de agentes licenciados con capacidad de atención en los 50 estados. La disponibilidad de productos depende del estado, las licencias aplicables y la elegibilidad." / "A network of licensed agents serving clients across all 50 states. Product availability varies by state, applicable licensing, and eligibility." No absolute "every plan in every state" claims. | `components/health/CoverageMap.tsx`, `lib/content/health-credibility.ts`, `app/licencias/page.tsx`, `app/layout.tsx` (meta description) |
| Locations | Keep the city list. Carrollton, Texas is the only confirmed physical office. The other cities are labelled "Áreas de atención" / "Service areas", not offices. | `CoverageMap.tsx`, `AgentSearch.tsx`, `lib/content/health.ts` |
| Licenses (final) | One consumer-facing statement, replacing the earlier shorter one: "Contamos con agentes debidamente licenciados según el estado y el producto. Las solicitudes se asignan de acuerdo con la licencia y disponibilidad aplicables." / "We work with appropriately licensed agents based on the state and product. Requests are assigned according to applicable licensing and availability." No license numbers are invented or published, and individual NPN and state-license details are no longer shown publicly. | `lib/content/health.ts` (`licensingStatement`), `app/licencias/page.tsx`, agent profiles and directory, `AgentSearch.tsx` |
| Property & Casualty | Alleanza is **not** licensed for P&C. P&C is removed as an available product: out of navigation, footers, sitemap and lead forms (the contact API rejects P&C product IDs). `/property-casualty` is a noindex "Property & Casualty — Próximamente" notice with no quote, call or contact CTA. The portal hub card says "Property & Casualty · Próximamente". The former landing page is kept, unused, in `components/PropertyLanding.tsx`. | `lib/config/routes.ts` (`comingSoon`), `lib/content/products.ts` (`offeredLines`), `lib/content/contact.ts`, `app/property-casualty/*`, `components/PortalHub.tsx`, `app/page.tsx`, `app/nosotros/page.tsx` |
| Medicare | Hidden from the public site until a dedicated compliance review. Removed from service cards, the coverage stage, the compare tiles, the journey film, the lead form and the lead API (`service: "medicare"` returns 422). The copy is kept, unused, as `hiddenMedicareService` in `lib/content/health.ts`. Medicare was never in navigation or the sitemap. | `lib/content/health.ts`, `CoverageStage.tsx`, `AlleanzaComparePlaceholder.tsx`, `HealthJourneyFilm.tsx` |
| ACA / Marketplace 2027 | ACA stays active. Agents assigned to ACA enrollments hold the CMS registration and certification for plan year 2027. One shared sentence, used wherever the claim appears: "Los agentes que atienden inscripciones del Marketplace cuentan con el registro y certificación correspondientes para el año de cobertura 2027." | `lib/content/health.ts` (`acaAgentCertification`), `CoverageStage.tsx` (ACA note), `HealthPlatformSections.tsx` (FAQ), `app/licencias/page.tsx` |
| Google reviews | The listing is the Carrollton office team's, published as "Villard Agency", which shares ownership with Alleanza. Reviews are labelled "Reseñas de nuestro equipo en Carrollton" and link to the actual listing; the disclaimer names Villard Agency and the shared ownership. The count and rating come only from the dated public snapshot or the live Places API. | `components/health/ReviewCarousel.tsx`, `HealthCredibility.tsx`, `lib/google-reviews.ts` |
| ACA licensing (final) | ACA requests are routed operationally to an agent licensed for the consumer's state. Public copy pairs the 2027 statement with the licensing statement and never says every agent is licensed in all 50 states. HealthSherpa ONE is the ACA enrollment platform, documented internally only; the site does not name it. | `CoverageStage.tsx` (ACA note), `HealthPlatformSections.tsx` (FAQ), `app/licencias/page.tsx` |
| 24/7 (final) | Keep 24/7 as the ability to send a request at any time, not live staffing: "Contáctanos 24/7. Puedes enviarnos tu solicitud en cualquier momento; nuestro equipo responderá dentro del horario de atención." / "Contact us 24/7. You can send us your request at any time; our team will respond during business hours." | `lib/content/health-credibility.ts` (fact `service`) |
| Social proof | "20,000 subscribers" removed and not replaced with another count. Replaced by "Protegiendo familias desde 2019" (operating since 2019) and the 50-state agent network with its availability limit. | `lib/content/health-credibility.ts` |
| Phones (confirmed) | Public hierarchy: **Teléfono** +1 (786) 451-1599 (the corporate line already configured as the site's primary number) and **WhatsApp** +1 (214) 997-4650. Each is labelled. The (682) and (817) lines are removed from public navigation, footer and contact areas. WhatsApp links now open the 214 line (they previously opened the 786 line). The `/health` structured-data `telephone` is the 786 line. The second 786 line, (786) 757-5553, stays hidden from the general public experience. | `lib/config/contact.ts`, footers, `ContactSection.tsx`, `HealthContact.tsx`, `app/health/page.tsx`, `app/en/health/page.tsx`, `lib/content/agents.ts` |

## Nationwide and state availability

| # | Pri | Status | Where | Claim / resolution |
|---|---|---|---|---|
| 1 | P1 | **RESOLVED** | `CoverageMap.tsx`, `health-credibility.ts`, `licencias` | 50-state language now reads as an agent network with state, licensing and eligibility limits (decision above). `companyFacts.licensedStates` stays unverified, because the state-by-state license list is still not recorded; nothing on the site depends on it. |
| 2 | P1 | **RESOLVED** | `lib/content/health.ts`, map pins and rail | Cities are "Áreas de atención" / "Service areas"; only Carrollton is described as an office ("Oficina principal · Carrollton"). The map disclaimer says so. |
| 3 | P2 | **RESOLVED** | `app/layout.tsx` | The site-wide description no longer says "en Texas" only; it names Carrollton, the 50-state agent network and the availability limit. |

## Agent and agency licensing

| # | Pri | Status | Where | Claim / question |
|---|---|---|---|---|
| 4 | P1 | **RESOLVED** | `app/licencias/page.tsx` | Licenses page uses the final licensing statement, says that not every agent is licensed in every state and that requests are assigned to an agent licensed for the consumer's state and product, and publishes no license numbers. More detailed regulatory information can be added later from a recorded source. |
| 5 | P1 | **RESOLVED** | `/agentes`, `/en/agents`, agent profiles, `AgentSearch.tsx`, `lib/content/agents.ts` | Management decided (2026-10-28) not to publish or verify individual NPN or state-license details on the public site; the operational control is that requests are assigned according to applicable licensing and availability. Removed from public pages: the NPN (page text, meta description, `Person` structured-data `identifier`), resident and non-resident license states (credentials panel, "4 estados" badge, FAQ and FAQ structured data, `areaServed`), and the NIPR link. The profiles now show the licensing statement and link to `/licencias`. The NPN and state fields remain in `lib/content/agents.ts` as an internal record only. |
| 6 | P2 | **OPEN** | `app/employers/page.tsx`, `app/employers/opengraph-image.tsx` | "licensed guidance and hands-on enrollment support". Confirm licensing and appointments for voluntary group/worksite benefits in the states marketed to. |

## Products and insurance lines

| # | Pri | Status | Where | Claim / question |
|---|---|---|---|---|
| 7 | P1 | **RESOLVED** | P&C surfaces listed above | P&C is not offered and is shown only as "Próximamente". Before relaunching it: P&C lines of authority, carrier appointments, and a compliance pass on `components/PropertyLanding.tsx`. |
| 8 | P1 | **RESOLVED** (hidden) | Medicare surfaces listed above | Medicare is hidden. Restoring it needs the dedicated compliance review: CMS TPMO disclaimer, agent Medicare certification for the plan year, and marketing review. |
| 9 | P2 | **OPEN** | `lib/content/health.ts`, `AlleanzaComparePlaceholder.tsx` | "Plan de Descuento": Texas regulates discount health care programs. Confirm the program operator and its required disclosure text. |
| 10 | P2 | **OPEN** | `lib/content/health-carriers.ts`, `AlleanzaComparePlaceholder.tsx` | Carrier logos on /health and the illustrative plan cards (Ambetter, Oscar, UnitedHealthcare, Community Health Choice, Cigna and others). Confirm current appointments and permission to show each logo. |

## ACA / Marketplace enrollment

| # | Pri | Status | Where | Claim / question |
|---|---|---|---|---|
| 11 | P1 | **RESOLVED** (public-facing) | `acaAgentCertification` + `licensingStatement` and their uses | The 2027 CMS registration and certification statement stays approved and is paired with the licensing statement wherever it appears. Internal, not on the site: enrollments use HealthSherpa ONE, and ACA requests are routed to an agent licensed for the consumer's state. |
| 12 | P2 | **OPEN** | `HealthContact.tsx`; `CinematicHealthHero.tsx` | "ASESORÍA GRATUITA" / "Sin costo · Sin compromiso". Confirm the wording and whether a compensation disclosure is wanted. |

## Credibility, reviews and contact details

| # | Pri | Status | Where | Claim / resolution |
|---|---|---|---|---|
| 13 | P1 | **RESOLVED** | `ReviewCarousel.tsx`, `HealthCredibility.tsx`, `google-reviews.ts` | Reviews are attributed to the Carrollton team and the Villard Agency listing (decision above). Follow-up outside this repo: improve the Google Business Profile; when its name changes, update the snapshot in `lib/google-reviews.ts` and the disclaimer. |
| 14 | P1 | **RESOLVED** | `health-credibility.ts` | The 20,000 subscriber claim is removed; no other count was added. |
| 15 | P2 | **OPEN** | `health-credibility.ts` | BBB A+ rating. Re-check the BBB profile at launch. |
| 16 | P1 | **RESOLVED** | `lib/config/contact.ts` and its uses | Phones standardized (decision above). |
| 19 | P1 | **RESOLVED** | `health-credibility.ts` (fact `service`) | "24/7 · servicio, 365 días" is replaced by "Contáctanos 24/7" with the note that requests can be sent at any time and the team responds during business hours. Nothing implies live agents around the clock. |
| 20 | P2 | **RESOLVED** | `lib/config/contact.ts` | Management confirmed that (786) 757-5553 stays hidden from the general public experience. |
| 21 | P2 | **OPEN** | `lib/content/agents.ts` | The agent profile's call button now uses the corporate 786 line instead of the 214 WhatsApp line. Confirm whether the agent should publish a direct line instead. |

## Pages added in this PR

| # | Pri | Status | Where | Note |
|---|---|---|---|---|
| 17 | P2 | **OPEN** | `app/nosotros/page.tsx` | Uses only facts already on the site; P&C was removed from its description and from its list of lines. Management can supply an approved mission or history. |
| 18 | P2 | **OPEN** | `app/contacto/page.tsx` | Shows `info@alleanzainsurance.org`, the Teléfono line and the WhatsApp line. Confirm the inbox is monitored. |

## Privacy and measurement (added 2026-10-28)

Details: `docs/measurement/measurement-plan.md` §10.

| # | Pri | Status | Where | Finding |
|---|---|---|---|---|
| 22 | P1 | **RESOLVED IN MEASUREMENT PR #31** (live until merged) | Whop pixel | On the live site, after a visitor accepts the measurement notice, the Whop pixel sends the name, email and phone typed into any form (including `/health`) to Whop before submission, and any email/phone found in URL parameters. Management decided (2026-10-28) to remove Whop from alleanzainsurance.org entirely; PR #31 removes it and deletes its leftover `_wuid` cookies. Whop may still be used for Alleanza Academy, off this site. |
| 23 | P2 | **RESOLVED IN PR #31** | Whop pixel | Residual Whop exposure (page URLs, `/health` visits, fingerprint) ends with the removal above. |
| 24 | P2 | **OPEN** | `app/privacidad/page.tsx` | The measurement section now describes only the final stack: GTM + GA4 (opt-in), 90-day first-party campaign attribution in internal lead emails, and cookieless Vercel Web Analytics / Speed Insights. There are no Whop references, and visitors can change their measurement preferences. Needs legal/management review before go-live. |
| 25 | P2 | **OPEN** | `lib/server/lead-ledger.ts` | Lead ledger (added 2026-10-29, **not connected**): each insurance lead gets an internal `lead_id` (`LD-XXXXX-XXXXX`). Once `LEAD_ID_SECRET`, `LEAD_LEDGER_ENDPOINT` and `LEAD_LEDGER_WEBHOOK_SECRET` are all configured, a signed record is sent to the canonical lead ledger. The record has no consumer name, email, phone or free text, but includes form, product line, state (health), language and campaign attribution. Because the `lead_id` links the record to the lead email, the ledger is **pseudonymous, not anonymous**. Before connecting it, confirm the ledger's access controls and retention, and decide whether the privacy notice should mention it (see #24). |

## Still open

No P1 items remain open (#22 is resolved in measurement PR #31, live until it is merged). Open P2 items: #6 (employer-benefits licensing), #9 (Discount Plan disclosure),
#10 (carrier logos and appointments), #12 ("asesoría gratuita" wording), #15 (BBB re-check at
launch), #17 (approved mission or history for Nosotros), #18 (confirm the info@ inbox is
monitored), #21 (agent direct line), #24 (privacy text review), #25 (lead ledger before connecting).

## Technical fixes in the same PR

- Homepage hydration error (React #418) for visitors with reduced motion enabled:
  `components/PortalHub.tsx` read `useReducedMotion()` during render (the gallery video's `preload`
  and the liquid surface). It is null on the server and true in the browser, so the HTML did not
  match. Reduced motion now applies only after mount.
- `/life` horizontal overflow on phones (19px at 390px wide): the product cards' corner glow sat
  40px outside each card. `components/sections/ProductsSection.tsx` now clips horizontal overflow
  on the section (`overflow-x-clip`), which keeps the cards' 3D tilt.
