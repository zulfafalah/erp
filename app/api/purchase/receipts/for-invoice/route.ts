import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";
import { PaginatedResponse } from "@/app/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BpbDropdownItem {
    rcvid: number;
    rcvno: string;
}

interface GoodsReceivingRaw {
    rcvid: number;
    rcvno: string | null;
    [key: string]: unknown;
}

// ─── GET — List BPBs for Invoice creation dropdown ───────────────────────────
//
// Query params:
//   poidh=<int>   → filter BPBs by PO ID (required)

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const poidh = searchParams.get("poidh");

        const params = new URLSearchParams();
        params.set("page_size", "200");
        params.set("page", "1");
        params.set("ordering", "-rcvno");
        params.set("paramst_pch", "0"); // BPB only (not PIV)

        if (poidh) params.set("poidh", poidh);

        const qs   = params.toString();
        const path = `/api/v1/goods-receivings/?${qs}`;
        const raw  = await apiFetch<PaginatedResponse<GoodsReceivingRaw>>(path);

        let results: GoodsReceivingRaw[] = [];
        if (raw && "results" in raw && Array.isArray(raw.results)) {
            results = raw.results;
        } else if (Array.isArray(raw)) {
            results = raw as unknown as GoodsReceivingRaw[];
        }

        const data: BpbDropdownItem[] = results.map((r) => ({
            rcvid: r.rcvid,
            rcvno: r.rcvno ?? String(r.rcvid),
        }));

        return NextResponse.json({ ok: true, data }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[GET /api/purchase/receipts/for-invoice]", err);
        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal mengambil daftar BPB.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
