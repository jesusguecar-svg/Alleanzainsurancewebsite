import { NextResponse, type NextRequest } from "next/server";

/**
 * Permanently redirects "/path/" to "/path".
 *
 * next.config.ts turns off Next.js's automatic trailing-slash redirect so that the legacy
 * WordPress URLs (which end in "/") reach their destination in one hop. Middleware runs after
 * those redirects, so it only sees trailing-slash URLs that are not legacy URLs.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/" || !pathname.endsWith("/")) return NextResponse.next();
  // A plain URL: NextURL remembers the original trailing slash and would add it back.
  const url = new URL(request.url);
  url.pathname = pathname.replace(/\/+$/, "") || "/";
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Next.js tests matchers against the path without its trailing slash, so the slash check
  // happens above. Framework assets, API routes and files (anything with an extension) skip it.
  matcher: "/((?!_next/|api/|[^?]*\\.[^/?]+$).*)",
};
