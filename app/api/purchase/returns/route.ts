import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";
import { PaginatedResponse } from "@/app/lib/types";
import type { ReturnPOListItem, ReturnPODetail, ReturnPOWrite } from "@/app/purchase/return/types";

// ─── Re-export shared types ───────────────────────────────────────────────────

export type { ReturnPOListItem } from "@/app/purchase/return/types";

export type ReturnPOPayload = ReturnPOWrite;

// ─── GET — List Return Purchase Orders ────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        const params = new URLSearchParams();
        const allowed = [
            // Pagination & ordering
            "page", "page_size", "ordering",
            // Global search
            "search",
            // Text filters
            "rcvno", "createdby",
            // Integer filters
            "statusrcv", "supplierid", "rcvwhs",
            // Date filters
            "rcvdate", "rcvdate__gte", "rcvdate__lte",
            // Numeric range filters
            "grandtotalrcv__gte", "grandtotalrcv__lte",
        ];
        for (const key of allowed) {
            const val = searchParams.get(key);
            if (val !== null && val !== "") params.set(key, val);
        }

        const qs   = params.toString();
        const path = `/api/v1/return-purchase-orders/${qs ? `?${qs}` : ""}`;

        const data = await apiFetch<PaginatedResponse<ReturnPOListItem>>(path);

        return NextResponse.json({ ok: true, data }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[GET /api/purchase/returns]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal mengambil data retur pembelian.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── POST — Create Return Purchase Order ──────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as ReturnPOPayload;

        const data = await apiFetch<ReturnPODetail>("/api/v1/return-purchase-orders/", {
            method: "POST",
            body,
        });

        return NextResponse.json({ ok: true, data }, { status: 201 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[POST /api/purchase/returns]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal menyimpan retur pembelian.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
