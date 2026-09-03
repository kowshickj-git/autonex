import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

/**
 * Route protection for the admin area.
 *
 * Runs on the Edge runtime, which is why the session verification in
 * `lib/auth/session.ts` uses Web Crypto instead of `node:crypto`.
 *
 * - /admin/**            -> requires a valid session, else redirect to login
 * - /admin/login         -> if already signed in, bounce to the dashboard
 * - /api/admin/**        -> handled by `requireAdmin()` inside each route so
 *                           they can return 401 JSON rather than a redirect
 */
/** No admin response - login page included - may be cached or indexed. */
function harden(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-store, must-revalidate");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "same-origin");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (pathname === "/admin/login") {
    if (session) {
      const target = request.nextUrl.clone();
      target.pathname = "/admin";
      target.search = "";
      return harden(NextResponse.redirect(target));
    }
    // Statically prerendered, so without this it would inherit a long
    // s-maxage from the CDN - not a leak, but not a login page's business.
    return harden(NextResponse.next());
  }

  if (!session) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    login.search = `?next=${encodeURIComponent(pathname + search)}`;
    return harden(NextResponse.redirect(login));
  }

  return harden(NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*"],
};
