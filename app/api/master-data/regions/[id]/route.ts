import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";

// ─── GET — Fetch region detail by ID ─────────────────────────────────────────

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    try {
        const data = await apiFetch<unknown>(`/api/v1/regions/${id}/`, {
            method: "GET",
        });

        return NextResponse.json({ ok: true, data });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[GET /api/master-data/regions/${id}]`, err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Data wilayah tidak ditemukan.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── PUT — Update region by ID ────────────────────────────────────────────────

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    try {
        const body = await req.json();

        const data = await apiFetch<unknown>(`/api/v1/regions/${id}/`, {
            method: "PUT",
            body,
        });

        return NextResponse.json({ ok: true, data });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[PUT /api/master-data/regions/${id}]`, err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal memperbarui data wilayah.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── DELETE — Delete region by ID ─────────────────────────────────────────────

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    try {
        await apiFetch<unknown>(`/api/v1/regions/${id}/`, {
            method: "DELETE",
        });

        return NextResponse.json({ ok: true });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[DELETE /api/master-data/regions/${id}]`, err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal menghapus data wilayah.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
