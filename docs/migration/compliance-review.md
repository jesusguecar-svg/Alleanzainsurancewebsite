# Claims review before the alleanzainsurance.org cutover

First reviewed 2026-10-27 on branch `migration/alleanzainsurance-org-prep`. Updated 2026-10-28
with management's decisions on the priority items; the site copy now follows those decisions.

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
| Licenses | Consumer-facing statement: "Trabajamos con agentes debidamente licenciados según el estado y el producto." / "We work with appropriately licensed insurance agents based on the state and product." No license numbers are invented or published. | `lib/content/health.ts` (`licensingStatement`), `app/licencias/page.tsx` |
| Property & Casualty | Alleanza is **not** licensed for P&C. P&C is removed as an available product: out of navigation, footers, sitemap and lead forms (the contact API rejects P&C product IDs). `/property-casualty` is a noindex "Property & Casualty — Próximamente" notice with no quote, call or contact CTA. The portal hub card says "Property & Casualty · Próximamente". The former landing page is kept, unused, in `components/PropertyLanding.tsx`. | `lib/config/routes.ts` (`comingSoon`), `lib/content/products.ts` (`offeredLines`), `lib/content/contact.ts`, `app/property-casualty/*`, `components/PortalHub.tsx`, `app/page.tsx`, `app/nosotros/page.tsx` |
| Medicare | Hidden from the public site until a dedicated compliance review. Removed from service cards, the coverage stage, the compare tiles, the journey film, the lead form and the lead API (`service: "medicare"` returns 422). The copy is kept, unused, as `hiddenMedicareService` in `lib/content/health.ts`. Medicare was never in navigation or the sitemap. | `lib/content/health.ts`, `CoverageStage.tsx`, `AlleanzaComparePlaceholder.tsx`, `HealthJourneyFilm.tsx` |
| ACA / Marketplace 2027 | ACA stays active. Agents assigned to ACA enrollments hold the CMS registration and certification for plan year 2027. One shared sentence, used wherever the claim appears: "Los agentes que atienden inscripciones del Marketplace cuentan con el registro y certificación correspondientes para el año de cobertura 2027." | `lib/content/health.ts` (`acaAgentCertification`), `CoverageStage.tsx` (ACA note), `HealthPlatformSections.tsx` (FAQ), `app/licencias/page.tsx` |
| Google reviews | The listing is the Carrollton office team's, published as "Villard Agency", which shares ownership with Alleanza. Reviews are labelled "Reseñas de nuestro equipo en Carrollton" and link to the actual listing; the disclaimer names Villard Agency and the shared ownership. The count and rating come only from the dated public snapshot or the live Places API. | `components/health/ReviewCarousel.tsx`, `HealthCredibility.tsx`, `lib/google-reviews.ts` |
| Social proof | "20,000 subscribers" removed and not replaced with another count. Replaced by "Protegiendo familias desde 2019" (operating since 2019) and the 50-state agent network with its availability limit. | `lib/content/health-credibility.ts` |
| Phones | Public hierarchy: **Teléfono** +1 (786) 451-1599 (the corporate line already configured as the site's primary number) and **WhatsApp** +1 (214) 997-4650. Each is labelled. The (682) and (817) lines are removed from public navigation, footer and contact areas. WhatsApp links now open the 214 line (they previously opened the 786 line). The `/health` structured-data `telephone` is the 786 line. | `lib/config/contact.ts`, footers, `ContactSection.tsx`, `HealthContact.tsx`, `app/health/page.tsx`, `app/en/health/page.tsx`, `lib/content/agents.ts` |

## Nationwide and state availability

| # | Pri | Status | Where | Claim / resolution |
|---|---|---|---|---|
| 1 | P1 | **RESOLVED** | `CoverageMap.tsx`, `health-credibility.ts`, `licencias` | 50-state language now reads as an agent network with state, licensing and eligibility limits (decision above). `companyFacts.licensedStates` stays unverified, because the state-by-state license list is still not recorded; nothing on the site depends on it. |
| 2 | P1 | **RESOLVED** | `lib/content/health.ts`, map pins and rail | Cities are "Áreas de atención" / "Service areas"; only Carrollton is described as an office ("Oficina principal · Carrollton"). The map disclaimer says so. |
| 3 | P2 | **RESOLVED** | `app/layout.tsx` | The site-wide description no longer says "en Texas" only; it names Carrollton, the 50-state agent network and the availability limit. |

## Agent and agency licensing

| # | Pri | Status | Where | Claim / question |
|---|---|---|---|---|
| 4 | P1 | **RESOLVED** | `app/licencias/page.tsx` | Licenses page uses the approved consumer statement, explains how to verify an agent's license, and publishes no license numbers. More detailed regulatory information (agency license number and states) can be added later from a recorded source. |
| 5 | P1 | **OPEN** | `lib/content/agents.ts`, `/agentes/jesus-esteban-guerra` | NPN 22182433; resident TX; non-resident TN, FL, NJ. Confirm against NIPR and record the date checked. Should other agents be published before launch? |
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
| 11 | P1 | **PARTIAL** | `acaAgentCertification` and its uses | 2027 CMS registration and certification for the assigned agents is confirmed and stated consistently. Still open: whether enrollment goes through an EDE platform such as HealthSherpa (affects any future online-enrollment copy), and confirming that each assigned agent is licensed in the consumer's state. |
| 12 | P2 | **OPEN** | `HealthContact.tsx`; `CinematicHealthHero.tsx` | "ASESORÍA GRATUITA" / "Sin costo · Sin compromiso". Confirm the wording and whether a compensation disclosure is wanted. |

## Credibility, reviews and contact details

| # | Pri | Status | Where | Claim / resolution |
|---|---|---|---|---|
| 13 | P1 | **RESOLVED** | `ReviewCarousel.tsx`, `HealthCredibility.tsx`, `google-reviews.ts` | Reviews are attributed to the Carrollton team and the Villard Agency listing (decision above). Follow-up outside this repo: improve the Google Business Profile; when its name changes, update the snapshot in `lib/google-reviews.ts` and the disclaimer. |
| 14 | P1 | **RESOLVED** | `health-credibility.ts` | The 20,000 subscriber claim is removed; no other count was added. |
| 15 | P2 | **OPEN** | `health-credibility.ts` | BBB A+ rating. Re-check the BBB profile at launch. |
| 16 | P1 | **RESOLVED** | `lib/config/contact.ts` and its uses | Phones standardized (decision above). |
| 19 | P1 | **OPEN** (new) | `health-credibility.ts` (fact `service`) | "24/7 · servicio, 365 días" on /health contradicts the published office hours (Mon–Fri 8:00–19:00, Sat 10:00–17:00) and has no source. Remove it, or confirm what is available 24/7 (for example, WhatsApp intake) and reword. Not changed here because it was not part of the 2026-10-28 decisions. |
| 20 | P2 | **OPEN** (new) | `lib/config/contact.ts` | The second 786 line, (786) 757-5553, was also removed from public display so that one "Teléfono" line remains. Confirm that it should stay hidden, or say where it should appear. |
| 21 | P2 | **OPEN** (new) | `lib/content/agents.ts` | The agent profile's call button used the 214 line, which is now the WhatsApp line. It now uses the corporate 786 line. Confirm whether the agent should publish a direct line instead. |

## Pages added in this PR

| # | Pri | Status | Where | Note |
|---|---|---|---|---|
| 17 | P2 | **OPEN** | `app/nosotros/page.tsx` | Uses only facts already on the site; P&C was removed from its description and from its list of lines. Management can supply an approved mission or history. |
| 18 | P2 | **OPEN** | `app/contacto/page.tsx` | Shows `info@alleanzainsurance.org`, the Teléfono line and the WhatsApp line. Confirm the inbox is monitored. |

## Still open before cutover (P1)

- **#5**: verify the published agent's NPN and state licenses against NIPR.
- **#11 (partial)**: name the enrollment platform (EDE), and confirm per-state licensing of the agents assigned to ACA.
- **#19**: decide on the "24/7, 365 días" claim.
