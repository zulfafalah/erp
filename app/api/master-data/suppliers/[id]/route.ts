import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";

// ─── GET — Fetch supplier detail by ID ───────────────────────────────────────

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    try {
        const data = await apiFetch<unknown>(`/api/v1/suppliers/${id}/`, {
            method: "GET",
        });

        return NextResponse.json({ ok: true, data });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[GET /api/master-data/suppliers/${id}]`, err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Data pemasok tidak ditemukan.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
