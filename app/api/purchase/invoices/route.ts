import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";
import { PaginatedResponse } from "@/app/lib/types";
import type { PurchaseInvoiceListItem, PurchaseInvoiceDetail, PurchaseInvoiceWrite } from "@/app/purchase/invoice/types";

export type { PurchaseInvoiceListItem } from "@/app/purchase/invoice/types";

// ─── GET — List Purchase Invoices ─────────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        const params = new URLSearchParams();
        const allowed = [
            "page", "page_size", "ordering",
            "search",
            "rcvno", "rcvno__exact", "rcvno__istartswith", "rcvno__iendswith",
            "inv_no_supplier", "inv_no_supplier__exact", "inv_no_supplier__istartswith",
            "statusrcv", "supplierid", "poidh",
            "rcvdate", "rcvdate__gte", "rcvdate__lte",
        ];
        for (const key of allowed) {
            const val = searchParams.get(key);
            if (val !== null && val !== "") params.set(key, val);
        }

        const qs   = params.toString();
        const path = `/api/v1/purchase-invoices/${qs ? `?${qs}` : ""}`;

        const data = await apiFetch<PaginatedResponse<PurchaseInvoiceListItem>>(path);

        return NextResponse.json({ ok: true, data }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[GET /api/purchase/invoices]", err);
        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal mengambil data nota pembelian.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── POST — Create new Purchase Invoice ───────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as PurchaseInvoiceWrite;

        const data = await apiFetch<PurchaseInvoiceDetail>("/api/v1/purchase-invoices/", {
            method: "POST",
            body,
        });

        return NextResponse.json({ ok: true, data }, { status: 201 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[POST /api/purchase/invoices]", err);
        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal menyimpan nota pembelian.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
