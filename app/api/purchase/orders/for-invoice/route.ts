import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";
import { PaginatedResponse } from "@/app/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PoDropdownItem {
    poid: number;
    pono: string;
}

interface PurchaseOrderRaw {
    poid: number;
    pono: string | null;
    supplierid?: number | null;
    statuspo?: number | null;
    gtotalpo?: string | null;
    tinvoiced_val?: string | null;
    [key: string]: unknown;
}

// ─── GET — List PO for Invoice Dropdown ──────────────────────────────────────
//
// Query params:
//   supplier_id=<int>  → filter by supplierid (required)
//
// Filter logic (mirrors legacy SQL):
//   supplierid = <supplier_id>
//   statuspo BETWEEN 3 AND 6       (aktif, belum closed)
//   gtotalpo > tinvoiced_val       (masih ada sisa yang belum di-invoice)
//   (tinvoiced_val - gtotalpo) < 5 (toleransi pembulatan 5)

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const supplierId = searchParams.get("supplier_id");

        if (!supplierId) {
            return NextResponse.json(
                { ok: false, message: "Parameter supplier_id wajib diisi." },
                { status: 400 },
            );
        }

        const params = new URLSearchParams();
        params.set("page_size", "500");
        params.set("page", "1");
        params.set("ordering", "pono");
        params.set("supplierid", supplierId);
        params.set("statuspo__gte", "3");
        params.set("statuspo__lte", "6");

        const path = `/api/v1/purchase-orders/?${params.toString()}`;
        const raw  = await apiFetch<PaginatedResponse<PurchaseOrderRaw>>(path);

        let results: PurchaseOrderRaw[] = [];
        if (raw && "results" in raw && Array.isArray(raw.results)) {
            results = raw.results;
        } else if (Array.isArray(raw)) {
            results = raw as unknown as PurchaseOrderRaw[];
        }

        // Filter: hanya PO yang belum fully invoiced
        // gtotalpo > tinvoiced_val DAN (tinvoiced_val - gtotalpo) < 5
        results = results.filter((po) => {
            const gtotal   = parseFloat(String(po.gtotalpo      ?? "0")) || 0;
            const invoiced = parseFloat(String(po.tinvoiced_val ?? "0")) || 0;
            return gtotal > invoiced && (invoiced - gtotal) < 5;
        });

        const data: PoDropdownItem[] = results.map((po) => ({
            poid: po.poid,
            pono: po.pono ?? String(po.poid),
        }));

        return NextResponse.json({ ok: true, data }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[GET /api/purchase/orders/for-invoice]", err);
        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal mengambil daftar PO untuk nota pembelian.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
