import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CityListItem {
    cityid: number;
    cityname: string;
    bunitid: number;
    created: string;
    createdby: string;
    modified: string;
    modifiedby: string;
}

// DRF pagination format from backend
export interface CityListResponse {
    ok?: boolean;
    count: number;
    next: string | null;
    previous: string | null;
    results: CityListItem[];
}

interface CityPayload {
    cityname: string;
    bunitid: number;
}

// ─── GET — List cities with pagination ────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        const pageNum  = Number(searchParams.get("page")  ?? 1);
        const limitNum = Number(searchParams.get("limit") ?? 10);

        const qs = new URLSearchParams();
        qs.set("page",  String(pageNum));
        qs.set("limit", String(limitNum));
        if (searchParams.get("search")) qs.set("search", searchParams.get("search")!);

        const raw = await apiFetch<CityListResponse>(`/api/v1/cities/?${qs.toString()}`, {
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
        console.error("[GET /api/master-data/cities]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal memuat daftar kota.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── POST — Create new city ───────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as CityPayload;

        const data = await apiFetch<unknown>("/api/v1/cities/", {
            method: "POST",
            body,
        });

        return NextResponse.json({ ok: true, data }, { status: 201 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[POST /api/master-data/cities]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal menyimpan data kota.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
