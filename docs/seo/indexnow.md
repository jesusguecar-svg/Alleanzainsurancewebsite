# IndexNow: notify Bing of new and changed URLs on each deploy

IndexNow lets the site tell Bing (and the other participating engines: Yandex, Seznam, Naver,
Yep) which URLs are new or changed, instead of waiting for a recrawl. One submission to
`https://api.indexnow.org/indexnow` reaches all of them. Google does not use IndexNow; it keeps
using the sitemap and Search Console.

## How it works

1. **Key file.** `https://alleanzainsurance.org/indexnow-key.txt`
   (`app/indexnow-key.txt/route.ts`) returns the key as plain text. It answers 404 on previews,
   locally, and whenever the key is missing or malformed.
2. **Post-deploy step.** `.github/workflows/indexnow.yml` runs when Vercel reports a successful
   **Production** deployment to GitHub (`deployment_status`). It runs
   `scripts/indexnow-submit.mjs`, which:
   - checks that the live key file serves exactly the key (otherwise it submits nothing);
   - reads the live `sitemap.xml` and compares it with the sitemap saved by the previous run
     (GitHub Actions cache); it submits only URLs that are **new** or whose **lastmod changed**.
     With no saved sitemap (first run), it submits URLs whose lastmod is in the last two days;
   - submits only URLs on alleanzainsurance.org, in batches of up to 10,000;
   - saves the current sitemap for the next run.
3. **Manual run.** In GitHub, run the "IndexNow" workflow from the Actions tab with a list of URLs,
   or leave it empty to compare with the last run. Dry run is on by default.

Pages without a `lastmod` in the sitemap (see `lib/config/content-dates.ts`) are submitted only
when they first appear. To announce a change to one of them, give it a lastmod, or use a manual
run with its URL.

## Where the key lives

The key is **not** in the repository. It is stored in exactly two places, with the same value:

| Where | Name | Scope | Used by |
|---|---|---|---|
| Vercel → Project → Settings → Environment Variables | `INDEXNOW_KEY` | Production only | the key file route |
| GitHub → Repository → Settings → Secrets and variables → Actions | `INDEXNOW_KEY` | repository secret | the workflow |

- **Create it** with `openssl rand -hex 16` (32 hex characters). Use a new value made only for
  IndexNow; never reuse another secret or token.
- **It is public by design.** Anyone can read it at `/indexnow-key.txt`. It only proves to search
  engines that whoever submits URLs controls the site. It grants no access to Vercel, GitHub,
  Search Console or anything else, so it is kept separate from every real secret.
- **To rotate it,** generate a new value, update both places, and redeploy Production (the route
  reads the variable at request time, but Vercel applies environment changes on the next deploy).
- Bing Webmaster Tools needs no extra setup for IndexNow; submitted URLs show under
  *IndexNow* there once the site is verified.

## Turning it on

1. Create the key and add it to Vercel (Production) and to GitHub Actions secrets.
2. Merge this PR. The next Production deployment serves `/indexnow-key.txt`.
3. Run the workflow manually once with **dry run** to see the list, then without dry run.
4. From then on it runs after every Production deployment.
