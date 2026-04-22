import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SupplierListItem {
    supplierid: number;
    suppcode: string;
    companyname: string;
    address: string;
    phone: string;
    tempobyr: number | null;
    contactname: string;
    islocal: number;
}

export interface SupplierListResponse {
    data: SupplierListItem[];
    page: number;
    limit: number;
    total: number;
}

interface SupplierPayload {
    companyname: string;
    contacttitle: string;
    contactname: string;
    address: string;
    phone: string;
    islocal: number;
    region: number;
    coa21: number;
}

// ─── GET — List suppliers with pagination ─────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        // Forward pagination & search params to backend
        const qs = new URLSearchParams();
        if (searchParams.get("page"))   qs.set("page",   searchParams.get("page")!);
        if (searchParams.get("limit"))  qs.set("limit",  searchParams.get("limit")!);
        if (searchParams.get("search")) qs.set("search", searchParams.get("search")!);

        const query = qs.toString() ? `?${qs.toString()}` : "";

        const data = await apiFetch<SupplierListResponse>(`/api/v1/suppliers/${query}`, {
            method: "GET",
        });

        return NextResponse.json({ ok: true, ...data });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[GET /api/master-data/suppliers]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal memuat daftar pemasok.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── POST — Create new supplier ───────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as SupplierPayload;

        const data = await apiFetch<unknown>("/api/v1/suppliers/", {
            method: "POST",
            body,
        });

        return NextResponse.json({ ok: true, data }, { status: 201 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[POST /api/master-data/suppliers]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal menyimpan data pemasok.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
