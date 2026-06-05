import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";
import type { GoodsReceivingDetail, GoodsReceivingWrite } from "@/app/purchase/receipt/types";

type GoodsReceivingPayload = GoodsReceivingWrite;

type RouteCtx = { params: Promise<{ id: string }> };

// ─── GET — Detail ─────────────────────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: RouteCtx) {
    const { id } = await params;
    try {
        const data = await apiFetch<GoodsReceivingDetail>(
            `/api/v1/goods-receivings/${id}/`,
        );
        return NextResponse.json({ ok: true, data }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[GET /api/purchase/receipts/${id}]`, err);
        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal mengambil data penerimaan barang.",
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
        const body = (await req.json()) as GoodsReceivingPayload;
        const data = await apiFetch<GoodsReceivingDetail>(
            `/api/v1/goods-receivings/${id}/`,
            { method: "PUT", body },
        );
        return NextResponse.json({ ok: true, data }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[PUT /api/purchase/receipts/${id}]`, err);
        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal memperbarui penerimaan barang.",
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
        const body = (await req.json()) as Partial<GoodsReceivingPayload>;
        const data = await apiFetch<GoodsReceivingDetail>(
            `/api/v1/goods-receivings/${id}/`,
            { method: "PATCH", body },
        );
        return NextResponse.json({ ok: true, data }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[PATCH /api/purchase/receipts/${id}]`, err);
        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal memperbarui penerimaan barang.",
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
        await apiFetch(`/api/v1/goods-receivings/${id}/`, { method: "DELETE" });
        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[DELETE /api/purchase/receipts/${id}]`, err);
        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal menghapus penerimaan barang.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
