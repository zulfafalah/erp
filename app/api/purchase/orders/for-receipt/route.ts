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
    treceived_val?: string;
    [key: string]: unknown;
}

// ─── GET — List PO for Receipt Dropdown ──────────────────────────────────────
//
// Query params:
//   mode=initial       → statuspo=3 (PO approved, siap terima)
//   mode=by_supplier   → statuspo 3–6, filter by supplier, masih ada sisa
//   supplier_id=<int>  → filter by supplierid (diperlukan jika mode=by_supplier)

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const mode        = searchParams.get("mode") ?? "initial";
        const supplierId  = searchParams.get("supplier_id");

        const params = new URLSearchParams();

        // Pagination — ambil semua untuk dropdown (max 500)
        params.set("page_size", "500");
        params.set("page", "1");
        params.set("ordering", "pono");
        params.set("ispolokal", "0");

        if (mode === "by_supplier" && supplierId) {
            // Mode: setelah supplier dipilih
            // Filter: statuspo antara 3–6, supplier yang dipilih
            params.set("supplierid", supplierId);
            params.set("statuspo__gte", "3");
            params.set("statuspo__lte", "6");
            // NOTE: Filter gtotalpo > treceived_val tidak bisa dilakukan di query param
            // karena merupakan perbandingan antar field — difilter di server-side di bawah
        } else {
            // Mode: initial load — hanya PO dengan statuspo = 3 (Approved, siap terima)
            params.set("statuspo", "3");
        }

        const qs   = params.toString();
        const path = `/api/v1/purchase-orders/?${qs}`;
        const raw  = await apiFetch<PaginatedResponse<PurchaseOrderRaw>>(path);

        let results: PurchaseOrderRaw[] = [];
        if (raw && "results" in raw && Array.isArray(raw.results)) {
            results = raw.results;
        } else if (Array.isArray(raw)) {
            results = raw as unknown as PurchaseOrderRaw[];
        }

        // Filter sisi server: mode=by_supplier → hanya PO yang masih ada sisa penerimaan
        // Logika: gtotalpo > treceived_val (ada sisa barang yang belum diterima)
        if (mode === "by_supplier") {
            results = results.filter((po) => {
                const gtotal   = parseFloat(String(po.gtotalpo   ?? "0")) || 0;
                const received = parseFloat(String(po.treceived_val ?? "0")) || 0;
                // Threshold 5 — sama seperti legacy PHP: (treceived_val - gtotalpo) < 5
                return (received - gtotal) < 5;
            });
        }

        const data: PoDropdownItem[] = results.map((po) => ({
            poid: po.poid,
            pono: po.pono ?? String(po.poid),
        }));

        return NextResponse.json({ ok: true, data }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[GET /api/purchase/orders/for-receipt]", err);
        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal mengambil daftar PO untuk penerimaan.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
