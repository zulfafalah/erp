import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";
import { PaginatedResponse } from "@/app/lib/types";
import type { PurchaseOrderListItem, PurchaseOrderWrite } from "@/app/purchase/order/types";

// ─── Re-export shared types ─────────────────────────────────────────────────────────────────

export type { PurchaseOrderListItem } from "@/app/purchase/order/types";

// Legacy alias kept for the existing POST handler reference
export type PurchaseOrderPayload = PurchaseOrderWrite;

export interface PurchaseOrderResponse {
    poid?: number;
    pono?: string;
    [key: string]: unknown;
}

// ─── GET — List Purchase Orders ───────────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        // Forward allowed query params to the backend
        const params = new URLSearchParams();
        const allowed = [
            // Pagination & ordering
            "page", "page_size", "ordering",
            // Global search
            "search",
            // Integer filters
            "ispolokal", "statuspo", "statuspo__gte", "statuspo__lte",
            "supplierid", "poid", "potop", "tipebiaya", "bunitid",
            "iscancel", "isclosed",
            // Text filters (string fields)
            "pono", "pono__exact", "pono__icontains", "pono__istartswith", "pono__iendswith",
            "pocurr", "pocurr__exact",
            "poket1", "poket2",
            "pokontrakno",
            "po_inv_no_supplier", "po_sj_no_supplier", "po_fpajaknorcv",
            "createdby", "approvedby",
            // Numeric range filters
            "gtotalpo", "gtotalpo__gte", "gtotalpo__lte",
            "subtotalpo__gte", "subtotalpo__lte",
            "porate",
            // Date filters
            "podate", "podate__gte", "podate__lte",
            "pokontrakdate", "pokontrakdate__gte", "pokontrakdate__lte",
            "deliverydate", "deliverydate__gte", "deliverydate__lte",
        ];
        for (const key of allowed) {
            const val = searchParams.get(key);
            if (val !== null && val !== "") params.set(key, val);
        }

        const qs = params.toString();
        const path = `/api/v1/purchase-orders/${qs ? `?${qs}` : ""}`;

        const data = await apiFetch<PaginatedResponse<PurchaseOrderListItem>>(path);

        return NextResponse.json({ ok: true, data }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[GET /api/purchase/orders]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal mengambil data purchase order.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── POST — Create new Purchase Order ────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as PurchaseOrderPayload;

        const data = await apiFetch<PurchaseOrderResponse>("/api/v1/purchase-orders/", {
            method: "POST",
            body,
        });

        return NextResponse.json({ ok: true, data }, { status: 201 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[POST /api/purchase/orders]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal menyimpan purchase order.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
