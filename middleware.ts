import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE } from "@/app/lib/auth";

// ─── Route configuration ──────────────────────────────────────────────────────

/** Routes accessible without any authentication */
const PUBLIC_ROUTES = ["/login"];

/** Routes that require a valid access token but are part of the auth flow */
const AUTH_FLOW_ROUTES = ["/select-location"];

// ─── JWT expiry check (edge-compatible, no Node crypto) ───────────────────────

function isJWTExpired(token: string): boolean {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return true;
        // atob works in Edge runtime
        const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))) as {
            exp?: number;
        };
        if (!payload.exp) return true;
        // 30 second buffer
        return Date.now() / 1000 >= payload.exp - 30;
    } catch {
        return true;
    }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Always allow Next.js internals and static assets
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/") ||
        pathname.startsWith("/favicon") ||
        pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|otf)$/)
    ) {
        return NextResponse.next();
    }

    const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
    const isLoggedIn = !!accessToken && !isJWTExpired(accessToken);

    // 2. Already logged in → redirect away from /login
    if (isLoggedIn && pathname === "/login") {
        return NextResponse.redirect(new URL("/select-location", request.url));
    }

    // 3. Public routes → allow
    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }

    // 4. Not logged in → redirect to /login
    if (!isLoggedIn) {
        const loginUrl = new URL("/login", request.url);
        // Preserve the intended destination so we can redirect back after login
        if (!AUTH_FLOW_ROUTES.includes(pathname)) {
            loginUrl.searchParams.set("next", pathname);
        }
        return NextResponse.redirect(loginUrl);
    }

    // 5. Logged in → allow
    return NextResponse.next();
}

export const config = {
    // Run on all routes except Next.js internals
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
