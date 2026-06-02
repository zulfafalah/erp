import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PurchaseOrderItemPayload {
    productid: number;
    uomid: number;
    qtypod: string;
    pricepod: string;
    ketbarang: string;
    kettambahan: string;
    discpctpod: string;
    pod_disc_pct_2: string;
    pod_disc_pct_3: string;
    pod_disc_pct_4: string;
    pod_disc_pct_5: string;
    pod_disc_pct_6: string;
    pod_ppn_pct: string;
    estpod: string;
}

export interface PurchaseOrderPayload {
    podate: string;
    supplierid: number;
    ispolokal: number;
    pocurr: string;
    porate: string;
    potop: number;
    tipebiaya: number;
    poket1: string;
    poket2: string;
    pokontrakno: string;
    po_inv_no_supplier: string;
    po_sj_no_supplier: string;
    po_fpajaknorcv: string;
    po_fpajaktglrcv: string;
    items: PurchaseOrderItemPayload[];
}

export interface PurchaseOrderResponse {
    poid?: number;
    pono?: string;
    [key: string]: unknown;
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
