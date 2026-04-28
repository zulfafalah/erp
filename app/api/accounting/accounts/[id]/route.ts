import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";
import type { AccountListItem, AccountPayload } from "../route";

// ─── GET — Fetch account detail by primary key ────────────────────────────────

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    try {
        const data = await apiFetch<AccountListItem>(`/api/v1/accounts/${id}/`, {
            method: "GET",
        });

        return NextResponse.json({ ok: true, data });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[GET /api/accounting/accounts/${id}]`, err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Data akun tidak ditemukan.",
                detail:  error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── PUT — Full update account ────────────────────────────────────────────────

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    try {
        const body = await req.json() as AccountPayload;

        const data = await apiFetch<AccountListItem>(`/api/v1/accounts/${id}/`, {
            method: "PUT",
            body,
        });

        return NextResponse.json({ ok: true, data });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[PUT /api/accounting/accounts/${id}]`, err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal memperbarui data akun.",
                detail:  error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── PATCH — Partial update account ──────────────────────────────────────────

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    try {
        const body = await req.json() as Partial<AccountPayload>;

        const data = await apiFetch<AccountListItem>(`/api/v1/accounts/${id}/`, {
            method: "PATCH",
            body,
        });

        return NextResponse.json({ ok: true, data });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[PATCH /api/accounting/accounts/${id}]`, err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal memperbarui data akun.",
                detail:  error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}

// ─── DELETE — Soft-delete account (sets coa0 = 1) ────────────────────────────

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    try {
        await apiFetch<void>(`/api/v1/accounts/${id}/`, {
            method: "DELETE",
        });

        return NextResponse.json({ ok: true, message: "Akun berhasil dinonaktifkan." });
    } catch (err: unknown) {
        const error = err as { status?: number; message?: string; body?: unknown };
        console.error(`[DELETE /api/accounting/accounts/${id}]`, err);

        return NextResponse.json(
            {
                ok: false,
                message: error?.message ?? "Gagal menonaktifkan akun.",
                detail:  error?.body,
            },
            { status: error?.status ?? 500 },
        );
    }
}
