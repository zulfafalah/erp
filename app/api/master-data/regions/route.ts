import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegionListItem {
    regionid: number;
    regioncode: string;
    regionname: string;
    cityid: number;
    cityname: string;
    coa19: number;
    created: string;
    createdby: string;
    modified: string;
    modifiedby: string;
}

// DRF pagination format from backend
export interface RegionListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: RegionListItem[];
}

interface RegionPayload {
    cityid: number;
    regioncode: string;
    regionname: string;
}

// ─── GET — List regions with pagination & search ──────────────────────────────

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        const pageNum  = Number(searchParams.get("page")  ?? 1);
        const limitNum = Number(searchParams.get("limit") ?? 10);

        const qs = new URLSearchParams();
        qs.set("page",      String(pageNum));
        qs.set("page_size", String(limitNum));
        if (searchParams.get("search")) qs.set("search", searchParams.get("search")!);
        if (searchParams.get("ordering")) qs.set("ordering", searchParams.get("ordering")!);

        const raw = await apiFetch<RegionListResponse>(`/api/v1/regions/?${qs.toString()}`, {
            method: "GET",
        });

        return NextResponse.json({
            ok:    true,
            data:  raw.results ?? [],
            total: raw.count   ?? 0,
            page:  pageNum,
            limit: limitNum,
        });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[GET /api/master-data/regions]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal memuat daftar wilayah.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── POST — Create new region ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as RegionPayload;

        const data = await apiFetch<unknown>("/api/v1/regions/", {
            method: "POST",
            body,
        });

        return NextResponse.json({ ok: true, data }, { status: 201 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[POST /api/master-data/regions]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal menyimpan data wilayah.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
