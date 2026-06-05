import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";
import { PaginatedResponse } from "@/app/lib/types";
import type { GoodsReceivingListItem, GoodsReceivingDetail, GoodsReceivingWrite } from "@/app/purchase/receipt/types";

// ─── Re-export shared types ───────────────────────────────────────────────────

export type { GoodsReceivingListItem } from "@/app/purchase/receipt/types";

export type GoodsReceivingPayload = GoodsReceivingWrite;

// ─── GET — List Goods Receivings ──────────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        const params = new URLSearchParams();
        const allowed = [
            // Pagination & ordering
            "page", "page_size", "ordering",
            // Global search
            "search",
            // Integer filters
            "paramst_pch", "poidh", "statusrcv", "supplierid",
            // Date filters
            "rcvdate", "rcvdate__gte", "rcvdate__lte",
        ];
        for (const key of allowed) {
            const val = searchParams.get(key);
            if (val !== null && val !== "") params.set(key, val);
        }

        const qs = params.toString();
        const path = `/api/v1/goods-receivings/${qs ? `?${qs}` : ""}`;

        const data = await apiFetch<PaginatedResponse<GoodsReceivingListItem>>(path);

        return NextResponse.json({ ok: true, data }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[GET /api/purchase/receipts]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal mengambil data penerimaan barang.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── POST — Create new Goods Receiving ────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as GoodsReceivingPayload;

        const data = await apiFetch<GoodsReceivingDetail>("/api/v1/goods-receivings/", {
            method: "POST",
            body,
        });

        return NextResponse.json({ ok: true, data }, { status: 201 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[POST /api/purchase/receipts]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal menyimpan penerimaan barang.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
