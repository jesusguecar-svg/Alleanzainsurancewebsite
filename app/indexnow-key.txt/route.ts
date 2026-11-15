import { isProductionDeploy } from "@/lib/config/site";
import { indexNowKeyPattern } from "@/lib/seo/indexnow";

/**
 * https://alleanzainsurance.org/indexnow-key.txt — the IndexNow key file (docs/seo/indexnow.md).
 * The key comes from the INDEXNOW_KEY environment variable (Vercel, Production only), never from
 * the repository. IndexNow keys are public by design: this file only proves that whoever submits
 * URLs controls the site. Previews and builds without a valid key answer 404.
 */
export const dynamic = "force-dynamic";

export function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!isProductionDeploy || !key || !indexNowKeyPattern.test(key)) {
    return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" } });
  }
  return new Response(key, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=300", "x-robots-tag": "noindex" } });
}
