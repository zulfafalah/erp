import { NextRequest, NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/app/lib/apiClient";

export interface UnitListItem {
    unitid: number;
    unit: string;
    unitname: string;
    tipekonversi: string;
    satuan: number;
    isi: number;
}

interface PaginatedResults {
    count: number;
    next: string | null;
    previous: string | null;
    results: UnitListItem[];
}

interface DataWrapper {
    data: UnitListItem[];
    total?: number;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        // Forward semua query params ke backend (isplat, page, limit, dll.)
        const qs = searchParams.toString();
        const query = qs ? `?${qs}` : "";

        const raw = await apiFetch<PaginatedResults | DataWrapper | UnitListItem[]>(
            `/api/v1/units/${query}`,
            { method: "GET" }
        );

        let data: UnitListItem[] = [];

        if (Array.isArray(raw)) {
            data = raw;
        } else if (raw && "results" in raw) {
            data = (raw as PaginatedResults).results;
        } else if (raw && "data" in raw) {
            data = (raw as DataWrapper).data;
        }

        return NextResponse.json({
            ok: true,
            data,
        });
    } catch (error) {
        let status = 500;
        let message = "Internal Server Error";
        if (error instanceof ApiError) {
            status = error.status;
            message = error.message;
        }
        return NextResponse.json({ ok: false, message }, { status });
    }
}
