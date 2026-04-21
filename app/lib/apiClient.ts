import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE, isTokenExpired } from "./auth";

// ─── Config ───────────────────────────────────────────────────────────────────

export const API_BASE_URL = process.env.API_URL ?? "http://localhost:8000";

// ─── Custom Error ─────────────────────────────────────────────────────────────

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public body?: unknown,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

// ─── Token refresh ───────────────────────────────────────────────────────────

/**
 * Call the backend token-refresh endpoint and update the access cookie.
 * Returns the new access token, or null on failure.
 */
async function refreshAccessToken(): Promise<string | null> {
    const jar = await cookies();
    const refresh = jar.get(REFRESH_COOKIE)?.value;
    if (!refresh) return null;

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
        });

        if (!res.ok) return null;

        const data = await res.json() as { access: string };
        // Update the cookie (only works in Route Handlers, not Server Components)
        jar.set(ACCESS_COOKIE, data.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60,
        });

        return data.access;
    } catch {
        return null;
    }
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

type FetchOptions = Omit<RequestInit, "body"> & {
    body?: unknown;
    skipAuth?: boolean;
};

/**
 * Server-side fetch wrapper for the backend API.
 *
 * - Automatically injects `Authorization: Bearer <access_token>` from cookies.
 * - If the first call returns 401, attempts a token refresh and retries once.
 * - Throws `ApiError` on non-2xx responses.
 *
 * Usage (in Route Handlers or Server Components):
 * ```ts
 * const data = await apiFetch<Product[]>("/api/master-data/products/");
 * ```
 */
export async function apiFetch<T = unknown>(
    path: string,
    { skipAuth = false, body, ...init }: FetchOptions = {},
): Promise<T> {
    const jar = await cookies();

    const buildHeaders = (token?: string): HeadersInit => ({
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers as Record<string, string> ?? {}),
    });

    const doFetch = async (token?: string): Promise<Response> =>
        fetch(`${API_BASE_URL}${path}`, {
            ...init,
            headers: buildHeaders(token),
            ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        });

    // ── Get current access token ──────────────────────────────────────────────
    let accessToken: string | undefined = skipAuth
        ? undefined
        : jar.get(ACCESS_COOKIE)?.value;

    // If token exists but expired → proactively refresh
    if (accessToken && isTokenExpired(accessToken)) {
        accessToken = (await refreshAccessToken()) ?? undefined;
    }

    // ── First attempt ─────────────────────────────────────────────────────────
    let res = await doFetch(accessToken);

    // ── 401 → try refresh once, then retry ───────────────────────────────────
    if (res.status === 401 && !skipAuth) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            res = await doFetch(newToken);
        }
    }

    // ── Error handling ────────────────────────────────────────────────────────
    if (!res.ok) {
        let errorBody: unknown;
        try { errorBody = await res.json(); } catch { errorBody = await res.text(); }

        const message =
            (typeof errorBody === "object" && errorBody !== null && "detail" in errorBody)
                ? String((errorBody as Record<string, unknown>).detail)
                : `HTTP ${res.status}: ${res.statusText}`;

        throw new ApiError(res.status, message, errorBody);
    }

    // 204 No Content
    if (res.status === 204) return undefined as T;

    return res.json() as Promise<T>;
}
