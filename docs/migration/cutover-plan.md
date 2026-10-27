# alleanzainsurance.org → Vercel cutover plan

**Nothing in this document has been done.** It runs only after this PR is reviewed and merged, the
P1 items in `compliance-review.md` are resolved, and management approves a change window. DNS stays
at SiteGround (ns1/ns2.siteground.net): only the website records move. Google Workspace mail is not
touched.

## Current state (verified 2026-10-27, read-only)

| Record | Value | Change at cutover |
|---|---|---|
| NS | ns1.siteground.net, ns2.siteground.net | **No** |
| A `@` | SiteGround (Google Cloud IPs 34.149.120.3, 34.149.36.179, 35.227.194.51, 35.244.153.44) | **Yes** → Vercel |
| `www` | SiteGround (A records, no CNAME) | **Yes** → Vercel |
| MX `@` | `0 smtp.google.com` | No |
| TXT `@` | SPF `v=spf1 +a +mx include:alleanzainsurance.org.spf.auto.dnssmarthost.net ~all`, Google site verification, Workspace recovery verification | No (see SPF note) |
| TXT `google._domainkey` | Google DKIM | No |
| TXT `_dmarc` | `v=DMARC1; p=none; aspf=r; adkim=r;` | No |
| CNAME `licencia` | `jesusguecar-svg.github.io.` (Academy) | No |
| Wildcard `*` | SiteGround | Leave as is |

Vercel project `alleanzainsurancewebsite` (team `jesusguecar-svgs-projects`): the only domain is
`alleanzainsurancewebsite.vercel.app`; latest production deployment READY; **no environment
variables are set**.

## Before the window (no downtime)

1. **Lead delivery (blocker).** Choose the lead destination, then set in Vercel → Project →
   Settings → Environment Variables (Production): `CONTACT_WEBHOOK_URL` (general form),
   `RESEND_API_KEY` and `HEALTH_CONTACT_FROM` (Salud form). Verify the sending domain in Resend
   *without* replacing the existing SPF/DKIM records: add only the records Resend asks for, on a
   subdomain it provides. Optional: `GOOGLE_PLACES_API_KEY`, `GOOGLE_REVIEWS_PLACE_ID`,
   `GOOGLE_REVIEWS_URL` (after compliance item 13). Redeploy and submit one test lead per form.
2. Lower the TTL of the `@` and `www` records at SiteGround to 300 s, at least 24 h before the
   window.
3. Export the current SiteGround DNS zone (Site Tools → Domain → DNS Zone Editor) and keep the
   copy as the rollback reference.
4. Snapshot the WordPress site (SiteGround backup) and keep the hosting plan **active for at least
   90 days**. The DNS zone and the SPF include (`…spf.auto.dnssmarthost.net`) depend on the
   SiteGround account, so canceling hosting would also break DNS and email.
5. Merge this PR. Production on `alleanzainsurancewebsite.vercel.app` then announces
   `https://alleanzainsurance.org` as canonical, which is intended. Open Graph images resolve on the
   official domain, so they only render after step 7. Keep the gap between merge and cutover short.

## In the window

6. **Vercel → Project → Settings → Domains → Add** `alleanzainsurance.org` (production). Add
   `www.alleanzainsurance.org` and set it to **redirect (308) to `alleanzainsurance.org`**. Vercel
   shows the exact records to create; at the time of writing they are typically:
   - `A  @  76.76.21.21` (use the value Vercel displays for this project)
   - `CNAME  www  cname.vercel-dns.com.` (or the project-specific value Vercel displays)
   If Vercel asks for a `_vercel` TXT verification record, add it.
7. **SiteGround → DNS Zone Editor:** replace the `@` A record(s) with the Vercel value; delete the
   `www` A records and add the `www` CNAME. **Do not edit MX, the SPF TXT, `google._domainkey`,
   `_dmarc`, the Google verification TXT records, or `licencia`.** Remove any AAAA record for `@`
   or `www` if one exists (none today).
8. Wait for Vercel to show both domains as **Valid Configuration** and issue the certificate.

## Verify (same window)

9. `BASE_URL=https://alleanzainsurance.org npm run validate:migration` (all checks must pass).
10. Spot-check: `https://www.alleanzainsurance.org/` → 308 to the apex; `http://` → https;
    `/productos/obamacare/` → `/health#coverage-aca`; `/contacto`, `/nosotros` return 200.
11. Email: send to and from a Workspace mailbox, then check MX, SPF, DKIM and DMARC with DNS-over-HTTPS:
    `curl -s "https://dns.google/resolve?name=alleanzainsurance.org&type=MX"` (and `TXT`,
    `google._domainkey…`, `_dmarc…`). They must equal the table above.
12. Submit one test lead per form, and confirm the Academy at `https://licencia.alleanzainsurance.org` still loads.

## After cutover

13. Google Search Console: verify the domain property (the TXT already exists), submit
    `https://alleanzainsurance.org/sitemap.xml`, and inspect the legacy URLs. The old Yoast sitemaps
    redirect to the new sitemap.
14. Watch 404s in Vercel logs (`get_runtime_logs`) for two weeks, and add redirects for any legacy
    URL that still receives traffic.
15. After 90 days of stable operation, plan the SiteGround exit separately. That includes moving
    DNS hosting and replacing the SiteGround SPF include, which needs its own approval.

## Rollback

Restore the `@` A records and the `www` records from the zone export (step 3). With a 300 s TTL,
most resolvers return to WordPress within minutes. Leave the Vercel domains attached, or remove
them; neither affects the WordPress site. Email is unaffected either way.
