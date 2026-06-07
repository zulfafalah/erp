import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";

type RouteCtx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteCtx) {
    const { id } = await params;
    try {
        const body = await req.json();
        const data = await apiFetch(`/api/v1/purchase-orders/${id}/approve/`, {
            method: "POST",
            body,
        });
        return NextResponse.json({ ok: true, data }, { status: 200 });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[POST /api/purchase/orders/${id}/approve]`, err);
        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal melakukan aksi pada purchase order.",
                detail: error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
