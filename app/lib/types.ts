// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface JWTPayload {
    token_type: "access" | "refresh";
    exp: number;        // Unix timestamp
    iat: number;
    jti: string;
    user_id: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
    id: string;
    username: string;
    full_name?: string;
    email?: string;
    is_staff?: boolean;
}

// ─── API Response shapes ──────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
    ok: true;
    data: T;
    message?: string;
}

export interface ApiErrorResponse {
    ok: false;
    message: string;
    status: number;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
