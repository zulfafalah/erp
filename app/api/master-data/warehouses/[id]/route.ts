import { NextRequest, NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/app/lib/apiClient";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const data = await apiFetch<unknown>(`/api/v1/warehouses/${id}/`, {
            method: "GET",
        });

        return NextResponse.json({ ok: true, data });
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

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const body = await req.json();

        const data = await apiFetch<unknown>(`/api/v1/warehouses/${id}/`, {
            method: "PUT",
            body,
        });

        return NextResponse.json({ ok: true, data });
    } catch (error) {
        let status = 500;
        let message = "Internal Server Error";
        let errors = undefined;
        if (error instanceof ApiError) {
            status = error.status;
            message = error.message;
            errors = error.body;
        }
        return NextResponse.json({ ok: false, message, errors }, { status });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        await apiFetch<unknown>(`/api/v1/warehouses/${id}/`, {
            method: "DELETE",
        });

        return NextResponse.json({ ok: true });
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
