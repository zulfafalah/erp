import { cookies } from "next/headers";
import type { JWTPayload, User } from "./types";

// ─── Cookie names ─────────────────────────────────────────────────────────────

export const ACCESS_COOKIE  = "access_token";
export const REFRESH_COOKIE = "refresh_token";

// Cookie max-ages (seconds)
const ACCESS_MAX_AGE  = 60 * 60;           // 1 hour
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ─── JWT helpers ──────────────────────────────────────────────────────────────

/**
 * Decode a JWT payload without verifying the signature.
 * Safe to use on the server for reading claims like `exp` and `user_id`.
 */
export function decodeJWT(token: string): JWTPayload | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = Buffer.from(parts[1], "base64url").toString("utf-8");
        return JSON.parse(payload) as JWTPayload;
    } catch {
        return null;
    }
}

/**
 * Returns true if the token is expired (or within 30s of expiry).
 */
export function isTokenExpired(token: string): boolean {
    const payload = decodeJWT(token);
    if (!payload) return true;
    // Add 30 seconds buffer
    return Date.now() / 1000 >= payload.exp - 30;
}

/**
 * Derive basic User info from a JWT access token.
 */
export function getUserFromToken(accessToken: string): User | null {
    const payload = decodeJWT(accessToken);
    if (!payload) return null;
    return {
        id: payload.user_id,
        username: "",    // username is not in the JWT payload (only user_id)
        full_name: "",
        email: "",
    };
}

// ─── Cookie read helpers (Server Components / Route Handlers) ─────────────────

/**
 * Read both tokens from cookies. Returns null if either is missing.
 */
export async function getTokens(): Promise<{ access: string; refresh: string } | null> {
    const jar = await cookies();
    const access  = jar.get(ACCESS_COOKIE)?.value;
    const refresh = jar.get(REFRESH_COOKIE)?.value;
    if (!access || !refresh) return null;
    return { access, refresh };
}

// ─── Cookie write helpers (Route Handlers only) ────────────────────────────────

/**
 * Set access + refresh tokens as httpOnly cookies on a Response object.
 */
export function buildAuthCookieHeaders(
    access: string,
    refresh: string,
): { name: string; value: string; options: Record<string, unknown> }[] {
    const base = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
    };
    return [
        { name: ACCESS_COOKIE,  value: access,  options: { ...base, maxAge: ACCESS_MAX_AGE  } },
        { name: REFRESH_COOKIE, value: refresh, options: { ...base, maxAge: REFRESH_MAX_AGE } },
    ];
}

/**
 * Cookie deletion config (to clear tokens on logout).
 */
export function buildClearCookieHeaders(): { name: string; options: Record<string, unknown> }[] {
    return [
        { name: ACCESS_COOKIE,  options: { path: "/", maxAge: 0 } },
        { name: REFRESH_COOKIE, options: { path: "/", maxAge: 0 } },
    ];
}
