import { NextRequest, NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/app/lib/apiClient";

export interface ProductCategoryListItem {
    familyid: number;
    famno: string | null;
    productfamily: string;
}

interface PaginatedResults {
    count: number;
    next: string | null;
    previous: string | null;
    results: ProductCategoryListItem[];
}

interface DataWrapper {
    data: ProductCategoryListItem[];
    total?: number;
    page?: number;
    limit?: number;
}

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const page = url.searchParams.get("page") ?? "1";
        const limit = url.searchParams.get("limit") ?? "10";
        const search = url.searchParams.get("search") ?? "";

        const qs = new URLSearchParams({
            page,
            limit,
        });
        if (search) qs.append("search", search);

        // Fetch using apiFetch
        const raw = await apiFetch<PaginatedResults | DataWrapper | ProductCategoryListItem[]>(
            `/api/v1/product-category/?${qs.toString()}`,
            { method: "GET" }
        );

        let data: ProductCategoryListItem[] = [];
        let total = 0;

        if (Array.isArray(raw)) {
            data = raw;
            total = raw.length;
        } else if (raw && "results" in raw) {
            data = (raw as PaginatedResults).results;
            total = (raw as PaginatedResults).count;
        } else if (raw && "data" in raw) {
            data = (raw as DataWrapper).data;
            total = (raw as DataWrapper).total ?? data.length;
        }

        return NextResponse.json({
            ok: true,
            data,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
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

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const data = await apiFetch<unknown>("/api/v1/product-category/", {
            method: "POST",
            body,
        });

        return NextResponse.json({ ok: true, data }, { status: 201 });
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
