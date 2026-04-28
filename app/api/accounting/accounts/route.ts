import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AccountListItem {
    primarykey: number;
    code: string;
    name: string;
    accounttype: string;
    accounttypekey: number;
    groupkey: number;
    groupname: string;
    parentkey: number | null;
    parentname: string | null;
    currac_idf: number | null;
    currencyname: string | null;
    isbank: number;
    coa0: number;
    limit_saldo_val: string | null;
    created: string;
    createdby: string;
    modified: string;
    modifiedby: string;
}

/** Backend returns a DRF paginated response: { count, results } */
interface BackendListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: AccountListItem[];
}

export interface AccountListResponse {
    data: AccountListItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface AccountPayload {
    coa0?: number;
    code: string;
    currac_idf?: number | null;
    limit_saldo_val?: string | null;
    name: string;
    groupkey?: number | null;
    parentkey?: number | null;
    accounttypekey?: number | null;
    isbank?: number;
}

// ─── GET — List accounts with pagination & search ─────────────────────────────

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        const qs = new URLSearchParams();
        if (searchParams.get("page"))      qs.set("page",      searchParams.get("page")!);
        if (searchParams.get("page_size")) qs.set("page_size", searchParams.get("page_size")!);
        if (searchParams.get("search"))    qs.set("search",    searchParams.get("search")!);
        if (searchParams.get("ordering"))  qs.set("ordering",  searchParams.get("ordering")!);

        const query = qs.toString() ? `?${qs.toString()}` : "";

        const raw = await apiFetch<BackendListResponse | AccountListItem[]>(
            `/api/v1/accounts/${query}`,
            { method: "GET" },
        );

        // Handle both paginated {count, results} and plain array responses
        let data: AccountListItem[];
        let total: number;
        if (Array.isArray(raw)) {
            data  = raw;
            total = raw.length;
        } else {
            data  = raw.results ?? [];
            total = raw.count   ?? 0;
        }

        return NextResponse.json({
            ok: true,
            data,
            total,
            page:      Number(searchParams.get("page")      ?? 1),
            page_size: Number(searchParams.get("page_size") ?? 20),
        } satisfies { ok: boolean } & AccountListResponse);
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[GET /api/accounting/accounts]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal memuat daftar akun.",
                detail:  error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── POST — Create new account ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as AccountPayload;

        const data = await apiFetch<AccountListItem>("/api/v1/accounts/", {
            method: "POST",
            body,
        });

        return NextResponse.json({ ok: true, data }, { status: 201 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[POST /api/accounting/accounts]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal menyimpan data akun.",
                detail:  error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
