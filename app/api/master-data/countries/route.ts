import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CountryListItem {
    cityid: number;
    cityname: string;
}

export interface CountryListResponse {
    data: CountryListItem[];
    page: number;
    limit: number;
    total: number;
}

interface CountryPayload {
    cityname: string;
}

// ─── GET — List countries with pagination ─────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        // Forward pagination & search params to backend
        const qs = new URLSearchParams();
        if (searchParams.get("page"))   qs.set("page",   searchParams.get("page")!);
        if (searchParams.get("limit"))  qs.set("limit",  searchParams.get("limit")!);
        if (searchParams.get("search")) qs.set("search", searchParams.get("search")!);

        const query = qs.toString() ? `?${qs.toString()}` : "";

        const data = await apiFetch<CountryListResponse>(`/api/v1/countries/${query}`, {
            method: "GET",
        });

        return NextResponse.json({ ok: true, ...data });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[GET /api/master-data/countries]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal memuat daftar negara.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── POST — Create new country ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as CountryPayload;

        const data = await apiFetch<unknown>("/api/v1/countries/", {
            method: "POST",
            body,
        });

        return NextResponse.json({ ok: true, data }, { status: 201 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error("[POST /api/master-data/countries]", err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal menyimpan data negara.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
