import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";
import type { ReturnPODetail, ReturnPOWrite } from "@/app/purchase/return/types";

type ReturnPOPayload = ReturnPOWrite;

type RouteCtx = { params: Promise<{ id: string }> };

// ─── GET — Detail ─────────────────────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: RouteCtx) {
    const { id } = await params;
    try {
        const data = await apiFetch<ReturnPODetail>(
            `/api/v1/return-purchase-orders/${id}/`,
        );
        return NextResponse.json({ ok: true, data }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[GET /api/purchase/returns/${id}]`, err);
        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal mengambil data retur pembelian.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── PUT — Full update ────────────────────────────────────────────────────────

export async function PUT(req: NextRequest, { params }: RouteCtx) {
    const { id } = await params;
    try {
        const body = (await req.json()) as ReturnPOPayload;
        const data = await apiFetch<ReturnPODetail>(
            `/api/v1/return-purchase-orders/${id}/`,
            { method: "PUT", body },
        );
        return NextResponse.json({ ok: true, data }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[PUT /api/purchase/returns/${id}]`, err);
        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal memperbarui retur pembelian.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── PATCH — Partial update ───────────────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: RouteCtx) {
    const { id } = await params;
    try {
        const body = (await req.json()) as Partial<ReturnPOPayload>;
        const data = await apiFetch<ReturnPODetail>(
            `/api/v1/return-purchase-orders/${id}/`,
            { method: "PATCH", body },
        );
        return NextResponse.json({ ok: true, data }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[PATCH /api/purchase/returns/${id}]`, err);
        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal memperbarui retur pembelian.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: RouteCtx) {
    const { id } = await params;
    try {
        await apiFetch(`/api/v1/return-purchase-orders/${id}/`, { method: "DELETE" });
        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[DELETE /api/purchase/returns/${id}]`, err);
        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal menghapus retur pembelian.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
