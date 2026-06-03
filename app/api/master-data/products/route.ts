import { NextRequest, NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/app/lib/apiClient";

export interface ProductListItem {
    productid: number;
    productcode: string;
    productname: string;
    productname2: string;
    productname3: string;
    ketprod: string | null;
    prodtype: string | null;
    ikatan: string | null;
    familyid: number;
    familyname: string | null;
    produnit: string | null;
    uom_id_prod: number;
    barcodeno: string | null;
    barcodeno2: string | null;
    isusebarcode: number;
    qty_outer: string;
    qty_inner: string;
    uom_inner_outer: number;
    uom_inner_outer_name: string | null;
    qty_gram: string;
    uom_berat: number;
    uom_berat_name: string | null;
    uom_plt: number;
    uom_plt_name: string | null;
    prod_gw: string;
    prod_nw: string;
    hpp: string | null;
    maxprice: string | null;
    minprice: string | null;
    minorder: string;
    limitstok: number | null;
    sizeprod: number | null;
    iscontinue: number | null;
    prodcur: string;
    supplierid: number | null;
    suppliername: string | null;
    created: string | null;
    createdby: string | null;
    modified: string | null;
    modifiedby: string | null;
}

export interface ProductListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ProductListItem[];
}

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const page = url.searchParams.get("page") ?? "1";
        const limit = url.searchParams.get("limit") ?? "10";
        const search = url.searchParams.get("search") ?? "";

        const qs = new URLSearchParams({
            page,
            page_size: limit,
        });
        if (search) qs.append("search", search);

        // Fetch using apiFetch
        const raw = await apiFetch<ProductListResponse | ProductListItem[]>(
            `/api/v1/products/?${qs.toString()}`,
            { method: "GET" }
        );

        let data: ProductListItem[] = [];
        let total = 0;

        if (Array.isArray(raw)) {
            data = raw;
            total = raw.length;
        } else if (raw && "results" in raw) {
            data = raw.results;
            total = raw.count;
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

        const data = await apiFetch<unknown>("/api/v1/products/", {
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
