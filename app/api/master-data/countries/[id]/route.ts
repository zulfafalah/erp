import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";

// ─── GET — Fetch country detail by ID ─────────────────────────────────────────

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    try {
        const data = await apiFetch<unknown>(`/api/v1/countries/${id}/`, {
            method: "GET",
        });

        return NextResponse.json({ ok: true, data });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[GET /api/master-data/countries/${id}]`, err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Data negara tidak ditemukan.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── PUT — Update country by ID ───────────────────────────────────────────────

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    try {
        const body = await req.json();

        const data = await apiFetch<unknown>(`/api/v1/countries/${id}/`, {
            method: "PUT",
            body,
        });

        return NextResponse.json({ ok: true, data });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[PUT /api/master-data/countries/${id}]`, err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal memperbarui data negara.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── DELETE — Delete country by ID ────────────────────────────────────────────

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    try {
        await apiFetch<unknown>(`/api/v1/countries/${id}/`, {
            method: "DELETE",
        });

        return NextResponse.json({ ok: true });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[DELETE /api/master-data/countries/${id}]`, err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal menghapus data negara.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
