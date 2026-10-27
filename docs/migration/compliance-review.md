# Claims review before the alleanzainsurance.org cutover

Reviewed 2026-10-27 on branch `migration/alleanzainsurance-org-prep`. **No claim copy was changed
in this PR.** Each item below needs a decision from management or compliance, with a source, before
the site goes live on the official domain. Do not replace any of these with invented wording; once a
fact is verified, record it (value and source) in `lib/config/company.ts` or the file listed.

Priority: **P1** = resolve before cutover, **P2** = resolve soon after.

## Nationwide and state availability

| # | Pri | Where | Claim | Question |
|---|---|---|---|---|
| 1 | P1 | `components/health/CoverageMap.tsx:68-69,100` (ES + EN) | "Presencia nacional" / "Nationwide service", "Un país entero" / "A whole country", "En los 50 estados, hablamos tu idioma" / "Across all 50 states", "Atención en 50 estados" / "Service in all 50 states" | Is the agency (or are its agents) licensed in all 50 states for the lines offered? `companyFacts.licensedStates` is still **unverified**, and the only published agent profile lists licenses in TX (resident) and TN, FL and NJ (non-resident). `lib/content/health.ts:8` says the coverage was "supplied by the business on 2026-09-24". Needs the list of states with a source (NIPR / state DOI). |
| 2 | P1 | `lib/content/health.ts:10-26`, map pins and office rail | Offices in Houston, Dallas, El Paso, Atlanta, Miami, Orlando, Columbus and "Utah"; "Personas reales. Cerca de ti." (`CoverageMap.tsx:94`) | Are these Alleanza offices? Only Carrollton (Dallas) has an address. If they are agent locations or partner offices, the wording should say so. |
| 3 | P2 | `app/layout.tsx:21` (site-wide meta description) | "Seguros para familias hispanas en Texas" | Contradicts the 50-state claims. Which is right: Texas-focused or multi-state? |

## Agent and agency licensing

| # | Pri | Where | Claim | Question |
|---|---|---|---|---|
| 4 | P1 | `app/licencias/page.tsx`, `lib/config/company.ts` | Agency license numbers and states are pending ("se publican aquí cuando un revisor registra el valor y su fuente") | Provide the agency license number(s) and states (TX DOI and others), so the Licenses page is complete at launch. |
| 5 | P1 | `lib/content/agents.ts:36-57`, `/agentes/jesus-esteban-guerra` | NPN 22182433; resident TX; non-resident TN, FL, NJ ("indica que cuenta con licencia") | Confirm against NIPR and add the date checked. Should other agents be published before launch? |
| 6 | P2 | `app/employers/page.tsx:7`, `app/employers/opengraph-image.tsx:11` | "licensed guidance and hands-on enrollment support", "licensed enrollment support" | Confirm the agency is licensed and appointed for voluntary group/worksite benefits in the states it markets to. |

## Products and insurance lines

| # | Pri | Where | Claim | Question |
|---|---|---|---|---|
| 7 | P1 | `app/property-casualty/page.tsx`, `lib/content/products.ts` (hogar, auto, inquilinos, responsabilidad) | Property & casualty products "explicados por un agente con licencia" | Does the agency hold P&C lines of authority and carrier appointments? The published agent profile does not mention P&C. |
| 8 | P1 | `lib/content/health.ts:35,44`, `CoverageStage.tsx` plate `medicare`, `AlleanzaComparePlaceholder.tsx:14`, `HealthJourneyFilm.tsx:69` | Medicare as an offered service | Marketing Medicare Advantage / Part D as a third-party marketing organization requires the CMS TPMO disclaimer ("We do not offer every plan available in your area…") and agent certification. Nothing on the site carries it. Keep Medicare, add the required disclaimer, or remove it? |
| 9 | P2 | `lib/content/health.ts:34`, `AlleanzaComparePlaceholder.tsx:13` | "Plan de Descuento" | Texas regulates discount health care programs (registration and required disclosures). The site says it "no es un seguro médico". Confirm the program operator and the exact disclosure text it requires. |
| 10 | P2 | `lib/content/health-carriers.ts` (logo strip on /health) | Logos: Ambetter, Oscar Health, UnitedHealthcare, Community Health Choice, Molina Healthcare, UnitedHealthOne, ManhattanLife, Presidio Healthcare, Globe Life Family Heritage Division | Confirm current appointments with each carrier and permission to show its logo. `companyFacts.carrierRelationships` is unverified. |

## ACA / Marketplace enrollment

| # | Pri | Where | Claim | Question |
|---|---|---|---|---|
| 11 | P1 | `lib/content/health.ts:30` and EN equivalent; `/health` metadata ("Obamacare (ACA)") | "Te acompañamos a comparar planes del Mercado de Seguros Médicos y revisar si calificas para ayuda con el costo" | Agents who help with Marketplace enrollment must be registered with CMS (FFM) for the current plan year, and licensed in the consumer's state. Confirm registration for the 2027 plan year and whether enrollment goes through HealthSherpa (EDE). |
| 12 | P2 | `components/health/HealthContact.tsx:70,77`; `CinematicHealthHero.tsx:125` | "ASESORÍA GRATUITA" / "Free guidance", "Sin costo · Sin compromiso" / "No cost · No obligation" | Commonly acceptable when agents are paid by carriers. Compliance should confirm the wording and whether a compensation disclosure is wanted. |

## Credibility, reviews and contact details

| # | Pri | Where | Claim | Question |
|---|---|---|---|---|
| 13 | P1 | `lib/content/health.ts:18`, `lib/google-reviews.ts:13` | The Dallas office map link and the Google reviews source point to the Google listing **"Globe Life Family Heritage Division: Villard Agency"** | Confirm that this listing belongs to Alleanza. If it is a carrier or another agency's listing, the reviews shown on /health would be attributed to the wrong business. |
| 14 | P1 | `lib/content/health-credibility.ts:12` | Subscriber floor `20000` ("stated by the business on 2026-10-21 for this page only") | A numeric marketing claim published outside the `companyFacts` verification gate (`clientsServed` is unverified). Needs a source, or route it through `companyFacts`. |
| 15 | P2 | `lib/content/health-credibility.ts:14,74-86` | BBB A+ rating, "fundada en Texas" | Re-check the BBB profile at launch (the site correctly says the A+ is not accreditation). |
| 16 | P1 | `lib/config/contact.ts:38-42` vs `lib/content/health.ts:5`, `app/health/page.tsx:41`, `app/en/health/page.tsx:26`, `lib/content/agents.ts:57` | Phones +1 (786) 451-1599, (786) 757-5553, (682) 248-1234, (817) 966-4347 in the footer and Contact page, but +1 (214) 997-4650 on /health and in its structured data | Which numbers are official? Search engines take `telephone` from the structured data. |

## New pages in this PR

| # | Pri | Where | Note |
|---|---|---|---|
| 17 | P2 | `app/nosotros/page.tsx` | Uses only facts already on the site (independent agency, office, hours, phones, product lines). The legacy About page's claims ("Disponibles 24/7", "personal altamente capacitado", mission statement) were **not** carried over. Management can supply an approved mission or history. |
| 18 | P2 | `app/contacto/page.tsx` | Shows `info@alleanzainsurance.org` and the footer phone numbers. Confirm the inbox is monitored. |
