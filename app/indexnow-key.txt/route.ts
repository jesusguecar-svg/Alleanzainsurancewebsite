/**
 * IndexNow key file (https://www.indexnow.org/documentation). Search engines fetch it to confirm
 * that a URL submission came from the site owner. The key lives only in the INDEXNOW_KEY
 * environment variable on Vercel (Production), never in the repository. IndexNow keys are public by
 * design once served here; the variable just keeps them out of git.
 *
 * Without the variable (previews, local builds) this returns 404 and scripts/indexnow-submit.mjs
 * skips the submission.
 */
import { isProductionDeploy } from "@/lib/config/site";

export const dynamic = "force-dynamic";

export function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!isProductionDeploy || !key || !/^[A-Za-z0-9-]{8,128}$/.test(key)) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600", "x-robots-tag": "noindex" } });
}
